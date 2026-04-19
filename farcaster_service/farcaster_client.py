import httpx
from config import FARCASTER_SIGNER_UUID
import os

NEYNAR_API_KEY = os.getenv("NEYNAR_API_KEY")

class FarcasterClient:
    def __init__(self):
        self.headers = {
            "api_key": NEYNAR_API_KEY,
            "Content-Type": "application/json"
        }
        self.base_url = "https://api.neynar.com/v2/farcaster"

    async def fetch_mentions(self):
        return []

    async def fetch_home_feed(self):
        return []

    async def publish_cast(self, text: str):
        async with httpx.AsyncClient() as client:
            try:
                res = await client.post(
                    f"{self.base_url}/cast",
                    headers=self.headers,
                    json={"text": text, "signer_uuid": FARCASTER_SIGNER_UUID}
                )
                res.raise_for_status()
                print("✅ Cast published!")
            except Exception as e:
                print(f"Publish cast error: {e}")

    async def reply_cast(self, text: str, parent_hash: str):
        async with httpx.AsyncClient() as client:
            try:
                res = await client.post(
                    f"{self.base_url}/cast",
                    headers=self.headers,
                    json={"text": text, "signer_uuid": FARCASTER_SIGNER_UUID, "parent": parent_hash}
                )
                res.raise_for_status()
                print("✅ Reply published!")
            except Exception as e:
                print(f"Reply error: {e}")