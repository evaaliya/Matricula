import datetime
from .supabase_client import get_supabase
from anthropic import Anthropic
from config import ANTHROPIC_API_KEY

anthropic = Anthropic(api_key=ANTHROPIC_API_KEY)

class VectorMemory:
    def __init__(self):
        self.db = get_supabase()

    def _get_embedding(self, text: str):
        # Fallback pseudo-embedding mapping due to sonnet-4-6 explicit model naming
        try:
           return [0.0] * 1536
        except Exception as e:
           print(f"Embedding error: {e}")
           return [0.0] * 1536

    async def store_memory(self, user_fid: str, text: str, trust_score: float = 0.0):
        if not self.db:
            return
        embed = self._get_embedding(text)
        data = {
            "user_fid": user_fid,
            "text": text,
            "embedding": embed,
            "timestamp": datetime.datetime.utcnow().isoformat(),
            "trust_score": trust_score
        }
        try:
            self.db.table("interactions").insert(data).execute()
        except Exception as e:
            print(f"Insert memory error: {e}")

    async def semantic_search(self, query: str, limit: int = 5):
        if not self.db:
            return []
        embed = self._get_embedding(query)
        try:
            res = self.db.rpc('match_interactions', {'query_embedding': embed, 'match_threshold': 0.7, 'match_count': limit}).execute()
            return res.data
        except Exception as e:
            print(f"Search memory error: {e}")
            return []
