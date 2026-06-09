from supabase import create_client
import os

_client = None

def get_client():
    global _client
    if _client is None:
        url = os.getenv("SUPABASE_URL")
        key = os.getenv("SUPABASE_ANON_KEY")
        _client = create_client(url, key)
    return _client
