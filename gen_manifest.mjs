import { mnemonicToAccount } from 'viem/accounts';
import fs from 'fs';

const domain = 'matricula-sand.vercel.app';
const fid = 3319769;

// We use the custody mnemonic from previous scripts
const account = mnemonicToAccount('task vague parrot warm siren tank lava grunt object manage region either');

async function main() {
  const signature = await account.signTypedData({
    domain: {
      name: 'Farcaster Verify Domain',
      version: '1',
      chainId: 10, // OP Mainnet
    },
    types: {
      VerifyDomain: [
        { name: 'domain', type: 'string' }
      ]
    },
    primaryType: 'VerifyDomain',
    message: { domain }
  });

  const headerObj = { fid, type: 'custody', key: account.address.toLowerCase() };
  const payloadObj = { domain };

  const header = Buffer.from(JSON.stringify(headerObj)).toString('base64url');
  const payload = Buffer.from(JSON.stringify(payloadObj)).toString('base64url');
  
  const sigBuffer = Buffer.from(signature.slice(2), 'hex');
  const sigBase64 = sigBuffer.toString('base64url');

  const manifest = {
    accountAssociation: {
      header,
      payload,
      signature: sigBase64
    },
    frame: {
      version: "1",
      name: "Matricula",
      iconUrl: "https://matricula-sand.vercel.app/icon.png",
      homeUrl: "https://matricula-sand.vercel.app",
      splashImageUrl: "https://matricula-sand.vercel.app/splash.png",
      splashBackgroundColor: "#000000",
      webhookUrl: "https://matricula-sand.vercel.app/api/index"
    }
  };

  fs.writeFileSync('.well-known/farcaster.json', JSON.stringify(manifest, null, 2));
  console.log('✅ Created .well-known/farcaster.json');
}

main().catch(console.error);
