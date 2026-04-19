import { NobleEd25519Signer, makeCastAdd, FarcasterNetwork } from '@farcaster/hub-nodejs';
import * as dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const text = process.argv[2];
if (!text) {
  console.error('No text provided');
  process.exit(1);
}

const privateKeyHex = process.env.FARCASTER_PRIVATE_KEY;
const fid = parseInt(process.env.FARCASTER_FID);

const privateKeyBytes = Uint8Array.from(Buffer.from(privateKeyHex, 'hex'));
const signer = new NobleEd25519Signer(privateKeyBytes);

const castResult = await makeCastAdd(
  { text, embeds: [], embedsDeprecated: [], mentions: [], mentionsPositions: [] },
  { fid, network: FarcasterNetwork.MAINNET },
  signer
);

if (castResult.isErr()) {
  console.error('Failed to create cast:', castResult.error);
  process.exit(1);
}

import { Message } from '@farcaster/hub-nodejs';
const messageBytes = Message.encode(castResult.value).finish();

const response = await fetch('https://hub.pinata.cloud/v1/submitMessage', {
  method: 'POST',
  headers: { 'Content-Type': 'application/octet-stream' },
  body: messageBytes
});

const result = await response.text();
console.log(response.status === 200 ? '✅ Cast published' : `❌ Error: ${result}`);