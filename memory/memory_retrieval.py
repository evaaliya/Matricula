from .embeddings import embed 
from .supabase_client import supabase 

def search_memory(query: str, memory_type: str, limit=5):
    query_vector = embed(query)

    result = supabase.rpc(
        "match_memories",
        {
            "query_embedding": query_vector,
            "match_type": memory_type,
            "match_count": limit,
        }
    ) .execute()

    return result.data
