MAX_TIP_PER_TX = 1.0
MAX_DAILY_SPEND = 5.0

class PrivyWallet:
    def __init__(self):
        self.daily_spend = 0.0

    async def send_tip(self, user_wallet: str, amount: float) -> bool:
        if amount > MAX_TIP_PER_TX:
            print(f"🚫 BLOCKED: Tip {amount} exceeds max per tx (${MAX_TIP_PER_TX})")
            return False
            
        if self.daily_spend + amount > MAX_DAILY_SPEND:
            print(f"🚫 BLOCKED: Tip {amount} exceeds daily spend limit (${MAX_DAILY_SPEND})")
            return False

        try:
            print(f"💸 Backend signing tip of ${amount} to {user_wallet}")
            self.daily_spend += amount
            return True
        except Exception as e:
            print(f"Wallet tip error: {e}")
            return False
