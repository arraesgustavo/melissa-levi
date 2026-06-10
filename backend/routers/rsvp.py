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
            msg = f"💌 <b>Novo RSVP!</b>\n👤 <b>Nome:</b> {payload.name}\n✉️ <b>Email:</b> {payload.email}\n🎉 <b>Comparece:</b> {attending_text}"
            asyncio.create_task(dispatch_telegram_alert(msg, parse_mode="HTML"))
            return {"status": "ok"}

        raise HTTPException(status_code=500, detail="Falha ao salvar RSVP.")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/rsvps")
async def list_rsvps():
    try:
        supabase = get_client()
        result = supabase.table("rsvps").select("*").order("created_at", desc=True).execute()
        return result.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
