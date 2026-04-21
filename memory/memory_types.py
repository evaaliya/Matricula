from enum import Enum

class MemoryType(str, Enum):
    CONTENT = "content"
    AUDIENCE = "audience"
    SELF = "self"