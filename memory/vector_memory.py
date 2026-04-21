from .memory_ingest import store_memory
from .memory_retrieval import search_memory
from .memory_types import MemoryType


class VectorMemory:

    def remember_post(self, post_text, metrics):
        store_memory(
            text=post_text,
            memory_type=MemoryType.CONTENT,
            metadata=metrics,
        )
    
    def remember_reflection(self, reflection):
        store_memory(
            text=reflection,
            memory_type=MemoryType.SELF
        )
    
    def remember_for_post_creation(self, topic):
        return search_memory(topic, MemoryType.CONTENT)

    def recall_audience_preferences(self, topic):
        return search_memory(topic, MemoryType.AUDIENCE)