from .embeddings import embed 
from .supabase_client import supabase 

def store_memory(text: str, memory_type: str, metadata: dict = None):
    vector = embed(text) 
    supabase.table('memories').insert({
        "type": memory_type,
        "content": text,
        "embedding": vector,
        "metadata": metadata
    }).execute() 
