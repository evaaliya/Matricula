import { ViemLocalEip712Signer } from '@farcaster/hub-nodejs';
import { mnemonicToAccount } from 'viem/accounts';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const mnemonic = "task vague parrot warm siren tank lava grunt object manage region either";
const account = mnemonicToAccount(mnemonic);
const fid = process.env.FARCASTER_FID;
const apiKey = process.env.NEYNAR_API_KEY;

async function main() {
  console.log("🤖 Initiating programmatic Neynar Signer creation for @matricula...");

  // 1. Create a new signer via Neynar API
  console.log("1️⃣ Requesting new signer from Neynar...");
  const createRes = await fetch('https://api.neynar.com/v2/farcaster/signer', {
    method: 'POST',
    headers: {
      'api_key': apiKey,
      'Content-Type': 'application/json'
    }
  });
  const createData = await createRes.json();
  
  if (!createData.signer_uuid) {
    throw new Error(`Failed to create signer: ${JSON.stringify(createData)}`);
  }
  
  const signer_uuid = createData.signer_uuid;
  const public_key = createData.public_key;
  
  console.log(`✅ Created Signer UUID: ${signer_uuid}`);
  console.log(`🔑 Neynar Public Key to sign: ${public_key}`);

  // 2. Sign the public key using the agent's mnemonic
  console.log("2️⃣ Signing the key with the agent's custody wallet...");
  const deadline = Math.floor(Date.now() / 1000) + 86400; // 24 hours
  const eip712Signer = new ViemLocalEip712Signer(account);
  
  const publicKeyBytes = Buffer.from(public_key.replace('0x', ''), 'hex');

  const signatureResult = await eip712Signer.signKeyRequest({
    requestFid: BigInt(1370130), // Developer's app_fid
    key: publicKeyBytes,
    deadline: BigInt(deadline),
  });

  if (signatureResult.isErr()) {
      throw new Error(`Failed to sign key request: ${signatureResult.error}`);
  }
  const signature = Buffer.from(signatureResult.value).toString('hex');
  console.log(`✅ Generated EIP-712 Signature`);

  // 3. Register the signed key with Neynar
  console.log("3️⃣ Registering the signed key back to Neynar...");
  const registerRes = await fetch('https://api.neynar.com/v2/farcaster/signer/signed_key', {
    method: 'POST',
    headers: {
      'api_key': apiKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      signer_uuid: signer_uuid,
      app_fid: 1370130,
      signature: '0x' + signature,
      deadline: deadline,
      fid: parseInt(fid)
    })
  });

  const registerData = await registerRes.json();
  console.log("✅ Final result from Neynar:", JSON.stringify(registerData, null, 2));
  
  console.log("\n========================================================");
  console.log("🎉 SUCCESS! Please update your .env file with this:");
  console.log(`FARCASTER_SIGNER_UUID=${signer_uuid}`);
  console.log("========================================================");
}

main().catch(console.error);
