from .memory_ingest import store_memory
from .memory_retrieval import search_memory
from .memory_types import MemoryType


class VectorMemory:

    def remember_post(self, post_text, metrics):
        """Store an observed post (from others)."""
        store_memory(
            text=post_text,
            memory_type=MemoryType.CONTENT,
            metadata=metrics,
        )

    def remember_my_cast(self, cast_text, cast_hash, metrics=None):
        """Store agent's OWN post for learning what works."""
        store_memory(
            text=f"MY POST: {cast_text}",
            memory_type=MemoryType.SELF,
            metadata={"hash": cast_hash, "metrics": metrics or {}, "source": "own_cast"}
        )

    def remember_reflection(self, reflection):
        """Store a reflection insight in vector DB for future retrieval."""
        store_memory(
            text=f"REFLECTION: {reflection}",
            memory_type=MemoryType.SELF,
            metadata={"source": "reflection"}
        )

    def recall_what_worked(self, topic="engagement"):
        """Retrieve past successful own posts for learning."""
        return search_memory(f"MY POST that worked well about {topic}", MemoryType.SELF, limit=3)

    def remember_for_post_creation(self, topic):
        return search_memory(topic, MemoryType.CONTENT)

    def recall_audience_preferences(self, topic):
        return search_memory(topic, MemoryType.AUDIENCE)