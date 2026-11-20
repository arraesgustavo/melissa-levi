import uuid
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, Path
from services.auth import get_current_admin
from services.supabase import get_client_for_token

router = APIRouter(prefix="/api/admin", tags=["admin"])

AdminTokenDep = Annotated[str, Depends(get_current_admin)]


def _validate_uuid(value: str, label: str) -> str:
    try:
        return str(uuid.UUID(value))
    except ValueError:
        raise HTTPException(status_code=404, detail=f"{label} inválido.")


@router.get("/rsvps")
def list_rsvps(token: AdminTokenDep) -> list[dict]:
    try:
        supabase = get_client_for_token(token)
        result = (
            supabase.table("rsvps")
            .select("*, rsvp_guests(*)")
            .order("created_at", desc=True)
            .execute()
        )
        return result.data or []
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@router.delete("/rsvps/{rsvp_id}/guests/{guest_id}")
def admin_remove_guest(
    rsvp_id: Annotated[str, Path(description="ID do RSVP")],
    guest_id: Annotated[str, Path(description="ID do convidado")],
    token: AdminTokenDep,
) -> dict:
    rsvp_uuid = _validate_uuid(rsvp_id, "RSVP")
    guest_uuid = _validate_uuid(guest_id, "Convidado")

    try:
        supabase = get_client_for_token(token)
        rsvp_res = (
            supabase.table("rsvps")
            .select("*, rsvp_guests(*)")
            .eq("id", rsvp_uuid)
            .limit(1)
            .execute()
        )
        if not rsvp_res.data:
            raise HTTPException(status_code=404, detail="Confirmação não encontrada.")

        rsvp_row = rsvp_res.data[0]
        existing_guests = rsvp_row.get("rsvp_guests") or []
        target = next((g for g in existing_guests if str(g["id"]) == guest_uuid), None)
        if not target:
            raise HTTPException(status_code=404, detail="Convidado não encontrado nesta confirmação.")

        supabase.table("rsvp_guests").delete().eq("id", guest_uuid).eq("rsvp_id", rsvp_uuid).execute()

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
            .eq("id", rsvp_uuid)
            .execute()
        )
        updated_rsvp = updated_res.data[0] if updated_res.data else {
            **rsvp_row,
            "guests": new_adults,
            "children_count": new_children,
            "attending": new_attending,
        }
        updated_rsvp["rsvp_guests"] = remaining

        return {
            "status": "ok",
            "removed_guest_name": target["full_name"],
            "rsvp": updated_rsvp,
        }
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))
