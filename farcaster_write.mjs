import { 
  NobleEd25519Signer, 
  makeCastAdd, 
  makeReactionAdd, 
  makeLinkAdd,
  FarcasterNetwork,
  ReactionType,
  Message
} from '@farcaster/hub-nodejs';
import fetch from 'node-fetch';
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

const privateKeyHex = process.env.FARCASTER_SIGNER_PRIVATE_KEY;
const fid = parseInt(process.env.FARCASTER_FID);

if (!privateKeyHex || !fid) {
  console.error(JSON.stringify({ error: "Missing FARCASTER_SIGNER_PRIVATE_KEY or FARCASTER_FID in .env" }));
  process.exit(1);
}

const privateKeyBytes = Uint8Array.from(Buffer.from(privateKeyHex.replace('0x', ''), 'hex'));
const signer = new NobleEd25519Signer(privateKeyBytes);

const arg = process.argv[2];
if (!arg) {
  console.error(JSON.stringify({ error: "No payload provided" }));
  process.exit(1);
}

let payload;
try {
  payload = JSON.parse(arg);
} catch (e) {
  console.error(JSON.stringify({ error: "Invalid JSON payload" }));
  process.exit(1);
}

const dataOptions = { fid, network: FarcasterNetwork.MAINNET };

async function submitMessage(messageBytes) {
  // Use Neynar Hub API since it is much more reliable and we have the API key
  const response = await fetch('https://hub-api.neynar.com/v1/submitMessage', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/octet-stream',
      'api_key': process.env.NEYNAR_API_KEY
    },
    body: messageBytes
  });
  if (response.status === 200) {
    const data = await response.json();
    return { success: true, hash: Buffer.from(data.hash).toString('hex') };
  } else {
    const err = await response.text();
    return { success: false, error: err };
  }
}

async function main() {
  let messageResult;

  if (payload.action === 'publish_cast') {
    messageResult = await makeCastAdd(
      { text: payload.text, embeds: [], embedsDeprecated: [], mentions: [], mentionsPositions: [] },
      dataOptions,
      signer
    );
  } 
  else if (payload.action === 'reply_cast') {
    messageResult = await makeCastAdd(
      { 
        text: payload.text, 
        embeds: [], 
        embedsDeprecated: [], 
        mentions: [], 
        mentionsPositions: [],
        parentCastId: {
          fid: payload.parent_fid || 0,
          hash: Uint8Array.from(Buffer.from(payload.parent_hash.replace('0x', ''), 'hex'))
        }
      },
      dataOptions,
      signer
    );
  }
  else if (payload.action === 'like_cast') {
    messageResult = await makeReactionAdd(
      {
        type: ReactionType.LIKE,
        targetCastId: {
          fid: payload.target_fid || 0,
          hash: Uint8Array.from(Buffer.from(payload.target_hash.replace('0x', ''), 'hex'))
        }
      },
      dataOptions,
      signer
    );
  }
  else if (payload.action === 'recast') {
    messageResult = await makeReactionAdd(
      {
        type: ReactionType.RECAST,
        targetCastId: {
          fid: payload.target_fid || 0,
          hash: Uint8Array.from(Buffer.from(payload.target_hash.replace('0x', ''), 'hex'))
        }
      },
      dataOptions,
      signer
    );
  }
  else if (payload.action === 'follow_user') {
    messageResult = await makeLinkAdd(
      {
        type: 'follow',
        targetFid: payload.target_fid
      },
      dataOptions,
      signer
    );
  }
  else {
    console.error(JSON.stringify({ error: "Unknown action" }));
    process.exit(1);
  }

  if (messageResult.isErr()) {
    console.error(JSON.stringify({ error: messageResult.error.message }));
    process.exit(1);
  }

  const messageBytes = Message.encode(messageResult.value).finish();
  const res = await submitMessage(messageBytes);
  
  if (res.success) {
    console.log(JSON.stringify({ success: true, hash: res.hash }));
  } else {
    console.error(JSON.stringify({ success: false, error: res.error }));
    process.exit(1);
  }
}

main().catch(e => {
  console.error(JSON.stringify({ error: e.message }));
  process.exit(1);
});
