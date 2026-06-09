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
            attending_text = "Sim" if payload.attending == "yes" else "Não"
            msg = f"💌 Novo RSVP!\n👤 {payload.name}\n✉️ {payload.email}\n🎉 Comparece: {attending_text}"
            asyncio.create_task(dispatch_telegram_alert(msg))
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
