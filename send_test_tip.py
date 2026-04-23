import asyncio
import sys
import os

sys.path.append(os.path.abspath(os.path.dirname(__file__)))
from wallet.privy_wallet import PrivyWallet

async def main():
    wallet = PrivyWallet()
    
    recipient = "0x9c6be285c5aA6e3506Ddb3F36E99d9Cd5c54e91f"
    amount = 0.0001 # about $0.30

    print("=== 💸 Test micro-tip ===")
    success = await wallet.send_tip(
        recipient_address=recipient,
        amount=amount
    )
    print(f"\nResult: {'✅ SUCCESS' if success else '❌ FAILED'}")

asyncio.run(main())
