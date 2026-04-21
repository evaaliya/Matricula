from supabase import create_client, Client
from config import SUPABASE_URL, SUPABASE_KEY

def get_supabase() -> Client:
    if SUPABASE_URL and SUPABASE_KEY:
        return create_client(SUPABASE_URL, SUPABASE_KEY)
    return None

# Module-level instance for direct import
supabase = get_supabase()
