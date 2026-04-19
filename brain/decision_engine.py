import os
import json
from .llm_client import generate_agent_decision

def get_system_prompt() -> str:
    path = os.path.join(os.path.dirname(__file__), "prompt.txt")
    with open(path, "r", encoding="utf-8") as f:
        return f.read()

def build_context(mentions: list, feed: list, memories: list) -> str:
    return json.dumps({
        "recent_mentions": mentions[:5],
        "home_feed": feed[:10],
        "relevant_memories": memories
    }, indent=2)

def make_decision(mentions: list, feed: list, memories: list) -> dict:
    context = build_context(mentions, feed, memories)
    prompt = get_system_prompt()
    return generate_agent_decision(context, prompt)
