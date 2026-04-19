import asyncio
import random
import sys
import os

# Ensure the parent directory is loaded in path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from farcaster_service.farcaster_client import FarcasterClient
from wallet.privy_wallet import PrivyWallet
from memory.vector_memory import VectorMemory
from brain.decision_engine import make_decision

class AutonomousAgent:
    def __init__(self):
        self.fc = FarcasterClient()
        self.wallet = PrivyWallet()
        self.mem = VectorMemory()

    async def execute_actions(self, actions: list):
        for action in actions:
            a_type = action.get("type")
            content = action.get("content", "")
            target = action.get("target_user", "")
            amt = action.get("amount_usdc", 0)

            if a_type == "publish_cast":
                await self.fc.publish_cast(content)
            elif a_type == "reply_cast":
                await self.fc.reply_cast(content, target)
            elif a_type == "tip_user":
                await self.wallet.send_tip(target, amt)
            elif a_type == "none":
                pass

    async def cycle(self):
        print("\n--- 🤖 Starting Agent Cycle ---")
        mentions = await self.fc.fetch_mentions()
        feed = await self.fc.fetch_home_feed()
        
        memories = await self.mem.semantic_search(str(mentions[-1:]) if mentions else "")
        
        decision = make_decision(mentions, feed, memories)
        print(f"🧠 Thoughts: {decision.get('thoughts')}")
        print(f"✅ Validation: {decision.get('validation')}")
        
        await self.execute_actions(decision.get("actions", []))
        
        if any(a.get("type") in ["publish_cast", "reply_cast"] for a in decision.get("actions", [])):
            await self.mem.store_memory("self", str(decision.get("actions")))

    async def start(self):
        print("🚀 Agent sequence initiated.")
        while True:
            try:
                await self.cycle()
            except Exception as e:
                print(f"⚠️ Loop Error: {e}")

            jitter_seconds = random.randint(480, 720) # 8-12 mins
            print(f"💤 Sleeping for {jitter_seconds} seconds...\n")
            await asyncio.sleep(jitter_seconds)
