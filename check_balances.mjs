import { createPublicClient, http } from 'viem';
import { mainnet, base, arbitrum, optimism, polygon } from 'viem/chains';

const address = '0x78049a5B8DF9A5d94E041cD9d54Ea8890D9D3Bd2';

async function check() {
  const chains = [mainnet, base, arbitrum, optimism, polygon];
  for (const chain of chains) {
    const client = createPublicClient({ chain, transport: http() });
    const balance = await client.getBalance({ address });
    console.log(`${chain.name}: ${Number(balance) / 1e18} ETH`);
  }
}
check();
