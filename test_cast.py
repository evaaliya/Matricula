import asyncio
from farcaster_service.farcaster_client import FarcasterClient

async def test():
    fc = FarcasterClient()
    res = await fc.publish_cast('testing my internal systems...')
    print(res)

asyncio.run(test())
