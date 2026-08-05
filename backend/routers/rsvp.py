import asyncio
from fastapi import APIRouter, HTTPException
from models.rsvp import RSVPSubmission
from services.supabase import get_client
from services.telegram import dispatch_telegram_alert

router = APIRouter(prefix="/api", tags=["rsvp"])

@router.post("/rsvp", status_code=201)
async def submit_rsvp(payload: RSVPSubmission):
    try:
        supabase = get_client()
        result = supabase.table("rsvps").insert(payload.model_dump()).execute()

        if result.data:
            attending_text = "✅ Sim" if payload.attending == "yes" else "❌ Não"

            msg = (
                f"💌 <b>Novo RSVP!</b>\n"
                f"━━━━━━━━━━━━━━━\n"
                f"👤 <b>Nome:</b> {payload.name}\n"
                f"✉️ <b>Email:</b> {payload.email}\n"
                f"🎉 <b>Comparece:</b> {attending_text}"
            )

            if payload.attending == "yes":
                msg += (
                    f"\n👥 <b>Convidados:</b> {payload.guests}"
                    f"\n🍽️ <b>Prato:</b> {payload.meal or '—'}"
                    f"\n⚠️ <b>Restrições:</b> {payload.dietary or 'Nenhuma'}"
                    f"\n🎵 <b>Música:</b> {payload.song or '—'}"
                )

            if payload.note:
                msg += f"\n💬 <b>Mensagem:</b> {payload.note}"

            asyncio.create_task(dispatch_telegram_alert(msg, parse_mode="HTML"))
            return {"status": "ok"}

        raise HTTPException(status_code=500, detail="Falha ao salvar RSVP.")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
