import { createPublicClient, http } from 'viem';
import { arbitrum } from 'viem/chains';
const address = '0x78049a5B8DF9A5d94E041cD9d54Ea8890D9D3Bd2';
const client = createPublicClient({ chain: arbitrum, transport: http() });
client.getBalance({ address }).then(bal => console.log('Balance:', Number(bal) / 1e18));
