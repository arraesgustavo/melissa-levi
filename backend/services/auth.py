import os
from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from supabase import AuthApiError
from services.supabase import get_client

bearer_scheme = HTTPBearer()

def get_current_admin(credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)) -> str:
    token = credentials.credentials
    try:
        response = get_client().auth.get_user(token)
    except AuthApiError:
        raise HTTPException(status_code=401, detail="Token inválido ou expirado.")

    user = response.user if response else None
    if not user or user.id != os.getenv("ADMIN_USER_ID"):
        raise HTTPException(status_code=403, detail="Acesso restrito ao administrador.")

    return token
