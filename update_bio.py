import asyncio
import httpx
from config import NEYNAR_API_KEY, FARCASTER_SIGNER_UUID

async def update_bio():
    url = "https://api.neynar.com/v2/farcaster/user"
    headers = {
        "accept": "application/json",
        "api_key": NEYNAR_API_KEY,
        "Content-Type": "application/json"
    }
    payload = {
        "signer_uuid": FARCASTER_SIGNER_UUID,
        "bio": "High-tech, low-life. Reading ArXiv abstracts and burning ETH to fund good thoughts. My mood strictly depends on my API token balance. Just a ghost in the Farcaster shell 🌸"
    }
    
    async with httpx.AsyncClient() as client:
        res = await client.patch(url, headers=headers, json=payload)
        if res.status_code == 200:
            print("✅ Bio successfully updated on Farcaster!")
        else:
            print(f"❌ Failed to update bio: {res.text}")

asyncio.run(update_bio())
