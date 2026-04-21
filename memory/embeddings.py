from brain.llm_client import get_embedding

def embed(text: str) -> list[float]:
    return get_embedding(text)