from fastapi import APIRouter, Depends, HTTPException
from services.auth import get_current_admin
from services.supabase import get_client_for_token

router = APIRouter(prefix="/api/admin", tags=["admin"])

@router.get("/rsvps")
def list_rsvps(token: str = Depends(get_current_admin)) -> list[dict]:
    try:
        supabase = get_client_for_token(token)
        result = supabase.table("rsvps").select("*").order("created_at", desc=True).execute()
        return result.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
