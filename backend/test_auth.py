"""Test the admin authorization branch (get_current_admin) without hitting Supabase."""
import sys
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).parent))

from fastapi import HTTPException
from fastapi.security import HTTPAuthorizationCredentials
from supabase import AuthApiError

import services.auth as auth_module


def _fake_client(user_id):
    fake_response = SimpleNamespace(user=SimpleNamespace(id=user_id))
    return SimpleNamespace(auth=SimpleNamespace(get_user=lambda token: fake_response))


def _creds(token="fake-token"):
    return HTTPAuthorizationCredentials(scheme="Bearer", credentials=token)


def test_admin_token_is_allowed():
    with patch.object(auth_module, "get_client", return_value=_fake_client("admin-uuid")), \
         patch.dict("os.environ", {"ADMIN_USER_ID": "admin-uuid"}):
        assert auth_module.get_current_admin(_creds()) == "fake-token"
    print("✅ matching admin id is allowed")


def test_non_admin_token_is_rejected():
    with patch.object(auth_module, "get_client", return_value=_fake_client("someone-else")), \
         patch.dict("os.environ", {"ADMIN_USER_ID": "admin-uuid"}):
        try:
            auth_module.get_current_admin(_creds())
            raise AssertionError("expected HTTPException(403)")
        except HTTPException as e:
            assert e.status_code == 403
    print("✅ non-admin id is rejected with 403")


def test_invalid_token_is_rejected():
    def raise_auth_error(token):
        raise AuthApiError("invalid token", status=401, code="invalid_token")

    fake_client = SimpleNamespace(auth=SimpleNamespace(get_user=raise_auth_error))
    with patch.object(auth_module, "get_client", return_value=fake_client):
        try:
            auth_module.get_current_admin(_creds())
            raise AssertionError("expected HTTPException(401)")
        except HTTPException as e:
            assert e.status_code == 401
    print("✅ invalid/expired token is rejected with 401")


if __name__ == "__main__":
    test_admin_token_is_allowed()
    test_non_admin_token_is_rejected()
    test_invalid_token_is_rejected()
    print("\n✨ All auth tests passed!")
