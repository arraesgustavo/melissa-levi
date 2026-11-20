import asyncio
import html
import uuid
from typing import Annotated
from fastapi import APIRouter, HTTPException, Path
from models.rsvp import (
    GuestItem,
    RSVPCreateResponse,
    RSVPManageResponse,
    RSVPSubmission,
    RemoveGuestResponse,
)
from services.email import send_confirmation_email
from services.supabase import get_service_client
from services.telegram import dispatch_telegram_alert

router = APIRouter(prefix="/api", tags=["rsvp"])

DUPLICATE_EMAIL_DETAIL = (
    "Este e-mail já possui uma confirmação cadastrada. "
    "Utilize o link enviado para o seu e-mail para gerenciar os convidados."
)


def _validate_uuid(value: str, label: str) -> str:
    try:
        return str(uuid.UUID(value))
    except ValueError:
        raise HTTPException(status_code=404, detail=f"{label} inválido ou não encontrado.")


def _is_unique_email_violation(exc: Exception) -> bool:
    text = str(exc).lower()
    return "23505" in text or "duplicate key" in text or "uq_rsvps_email_lower" in text


def _sort_guests(rows: list[dict]) -> list[GuestItem]:
    ordered = sorted(
        rows or [],
        key=lambda g: (
            0 if g.get("guest_type") == "adult" else 1,
            0 if g.get("is_primary") else 1,
            g.get("created_at") or "",
        ),
    )
    return [
        GuestItem(
            id=str(g["id"]),
            full_name=g["full_name"],
            guest_type=g.get("guest_type", "adult"),
            is_primary=bool(g.get("is_primary", False)),
        )
        for g in ordered
    ]


def _build_manage_response(rsvp_row: dict, guest_rows: list[dict]) -> RSVPManageResponse:
    return RSVPManageResponse(
        id=str(rsvp_row["id"]),
        name=rsvp_row["name"],
        email=rsvp_row["email"],
        phone=rsvp_row.get("phone"),
        attending=rsvp_row["attending"],
        guests=int(rsvp_row.get("guests") or 0),
        children_count=int(rsvp_row.get("children_count") or 0),
        note=rsvp_row.get("note"),
        created_at=rsvp_row.get("created_at"),
        guests_list=_sort_guests(guest_rows),
    )


@router.post("/rsvp", status_code=201, response_model=RSVPCreateResponse)
async def submit_rsvp(payload: RSVPSubmission) -> RSVPCreateResponse:
    supabase = get_service_client()
    normalized_email = payload.email.strip().lower()

    try:
        existing = (
            supabase.table("rsvps")
            .select("id")
            .ilike("email", normalized_email)
            .limit(1)
            .execute()
        )
        if existing.data:
            raise HTTPException(status_code=409, detail=DUPLICATE_EMAIL_DETAIL)

        rsvp_record = {
            "name": payload.name,
            "email": normalized_email,
            "phone": payload.phone,
            "attending": payload.attending,
            "guests": payload.guests if payload.attending == "yes" else 0,
            "children_count": payload.children_count if payload.attending == "yes" else 0,
            "note": payload.note,
        }

        try:
            result = supabase.table("rsvps").insert(rsvp_record).execute()
        except Exception as insert_exc:
            if _is_unique_email_violation(insert_exc):
                raise HTTPException(status_code=409, detail=DUPLICATE_EMAIL_DETAIL)
            raise

        if not result.data:
            raise HTTPException(status_code=500, detail="Falha ao salvar RSVP.")

        created_rsvp = result.data[0]
        rsvp_id = str(created_rsvp["id"])
        manage_token = str(created_rsvp["manage_token"])

        inserted_guests: list[dict] = []
        if payload.attending == "yes":
            guest_rows = [
                {
                    "rsvp_id": rsvp_id,
                    "full_name": guest_name,
                    "guest_type": "adult",
                    "is_primary": idx == 0,
                }
                for idx, guest_name in enumerate(payload.guest_names)
            ] + [
                {
                    "rsvp_id": rsvp_id,
                    "full_name": child_name,
                    "guest_type": "child",
                    "is_primary": False,
                }
                for child_name in payload.children_names
            ]

            if guest_rows:
                try:
                    guest_result = supabase.table("rsvp_guests").insert(guest_rows).execute()
                    inserted_guests = guest_result.data or []
                except Exception:
                    # Roll back the parent RSVP so partial data is never left behind
                    supabase.table("rsvps").delete().eq("id", rsvp_id).execute()
                    raise

        attending_text = "✅ Sim" if payload.attending == "yes" else "❌ Não"
        msg = (
            f"💌 <b>Novo RSVP!</b>\n"
            f"━━━━━━━━━━━━━━━\n"
            f"👤 <b>Responsável:</b> {html.escape(payload.name)}\n"
            f"✉️ <b>E-mail:</b> {html.escape(normalized_email)}\n"
            f"📞 <b>Telefone:</b> {html.escape(payload.phone)}\n"
            f"🎉 <b>Comparece:</b> {attending_text}"
        )

        if payload.attending == "yes":
            adult_list = ", ".join(html.escape(n) for n in payload.guest_names)
            msg += f"\n👥 <b>Convidados (&gt;7 anos) ({payload.guests}):</b> {adult_list}"
            if payload.children_count > 0:
                child_list = ", ".join(html.escape(n) for n in payload.children_names)
                msg += f"\n🧒 <b>Crianças (≤7 anos) ({payload.children_count}):</b> {child_list}"

        if payload.note:
            msg += f"\n💬 <b>Mensagem:</b> {html.escape(payload.note)}"

        asyncio.create_task(dispatch_telegram_alert(msg, parse_mode="HTML"))

        email_sent = await send_confirmation_email(
            name=payload.name,
            email=normalized_email,
            phone=payload.phone,
            attending=payload.attending,
            guest_names=payload.guest_names,
            children_names=payload.children_names,
            manage_token=manage_token,
        )

        return RSVPCreateResponse(
            status="ok",
            id=rsvp_id,
            manage_token=manage_token,
            email_sent=email_sent,
            guests_list=_sort_guests(inserted_guests),
        )
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@router.get("/rsvp/manage/{manage_token}", response_model=RSVPManageResponse)
def get_rsvp_by_token(
    manage_token: Annotated[str, Path(description="Token seguro de gerenciamento do RSVP")],
) -> RSVPManageResponse:
    token_uuid = _validate_uuid(manage_token, "Link de gerenciamento")
    supabase = get_service_client()

    try:
        result = (
            supabase.table("rsvps")
            .select("*, rsvp_guests(*)")
            .eq("manage_token", token_uuid)
            .limit(1)
            .execute()
        )
        if not result.data:
            raise HTTPException(status_code=404, detail="Confirmação não encontrada.")

        row = result.data[0]
        return _build_manage_response(row, row.get("rsvp_guests") or [])
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@router.delete(
    "/rsvp/manage/{manage_token}/guests/{guest_id}",
    response_model=RemoveGuestResponse,
)
async def remove_guest_by_token(
    manage_token: Annotated[str, Path(description="Token seguro de gerenciamento do RSVP")],
    guest_id: Annotated[str, Path(description="ID do convidado a remover")],
) -> RemoveGuestResponse:
    token_uuid = _validate_uuid(manage_token, "Link de gerenciamento")
    guest_uuid = _validate_uuid(guest_id, "Convidado")
    supabase = get_service_client()

    try:
        rsvp_res = (
            supabase.table("rsvps")
            .select("*, rsvp_guests(*)")
            .eq("manage_token", token_uuid)
            .limit(1)
            .execute()
        )
        if not rsvp_res.data:
            raise HTTPException(status_code=404, detail="Confirmação não encontrada.")

        rsvp_row = rsvp_res.data[0]
        rsvp_id = str(rsvp_row["id"])
        existing_guests = rsvp_row.get("rsvp_guests") or []
        target = next((g for g in existing_guests if str(g["id"]) == guest_uuid), None)
        if not target:
            raise HTTPException(status_code=404, detail="Convidado não encontrado nesta confirmação.")

        supabase.table("rsvp_guests").delete().eq("id", guest_uuid).eq("rsvp_id", rsvp_id).execute()

        remaining = [g for g in existing_guests if str(g["id"]) != guest_uuid]
        new_adults = sum(1 for g in remaining if g.get("guest_type", "adult") == "adult")
        new_children = sum(1 for g in remaining if g.get("guest_type") == "child")
        new_attending = "no" if (new_adults == 0 and new_children == 0) else rsvp_row["attending"]

        updated_res = (
            supabase.table("rsvps")
            .update(
                {
                    "guests": new_adults,
                    "children_count": new_children,
                    "attending": new_attending,
                }
            )
            .eq("id", rsvp_id)
            .execute()
        )
        updated_rsvp = updated_res.data[0] if updated_res.data else {
            **rsvp_row,
            "guests": new_adults,
            "children_count": new_children,
            "attending": new_attending,
        }

        removed_name = target["full_name"]
        removed_kind = "criança" if target.get("guest_type") == "child" else "convidado"
        alert_msg = (
            f"✏️ <b>Atualização de RSVP</b>\n"
            f"━━━━━━━━━━━━━━━\n"
            f"👤 <b>Responsável:</b> {html.escape(rsvp_row['name'])}\n"
            f"🗑️ <b>Removido ({removed_kind}):</b> {html.escape(removed_name)}\n"
            f"👥 <b>Restantes (&gt;7 anos):</b> {new_adults}\n"
            f"🧒 <b>Crianças restantes:</b> {new_children}"
        )
        asyncio.create_task(dispatch_telegram_alert(alert_msg, parse_mode="HTML"))

        return RemoveGuestResponse(
            status="ok",
            removed_guest_name=removed_name,
            rsvp=_build_manage_response(updated_rsvp, remaining),
        )
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))
