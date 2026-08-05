from supabase import create_client, ClientOptions
import os

_client = None

def get_client():
    global _client
    if _client is None:
        url = os.getenv("SUPABASE_URL")
        key = os.getenv("SUPABASE_ANON_KEY")
        _client = create_client(url, key)
    return _client

def get_client_for_token(token: str):
    # ponytail: fresh client per call so the Authorization header never leaks
    # across concurrent requests (the shared singleton's headers are mutable state)
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_ANON_KEY")
    return create_client(url, key, options=ClientOptions(headers={"Authorization": f"Bearer {token}"}))
