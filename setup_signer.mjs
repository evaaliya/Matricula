import * as ed from '@noble/ed25519';
import { mnemonicToAccount } from 'viem/accounts';
import axios from 'axios';
import qrcode from 'qrcode-terminal';

const APP_MNEMONIC = "narrow project alone pond mansion easily planet mammal sister finger mercy bachelor ordinary grid gauge merit mandate matter among wealth void wool flower laugh";
const APP_FID = "1370130";

const privateKey = ed.utils.randomPrivateKey();
const publicKeyBytes = await ed.getPublicKey(privateKey);
const key = '0x' + Buffer.from(publicKeyBytes).toString('hex');
const privateKeyHex = Buffer.from(privateKey).toString('hex');

const account = mnemonicToAccount(APP_MNEMONIC);
const deadline = Math.floor(Date.now() / 1000) + 86400;

const signature = await account.signTypedData({
  domain: { name: 'Farcaster SignedKeyRequestValidator', version: '1', chainId: 10, verifyingContract: '0x00000000fc700472606ed4fa22623acf62c60553' },
  types: { SignedKeyRequest: [{ name: 'requestFid', type: 'uint256' }, { name: 'key', type: 'bytes' }, { name: 'deadline', type: 'uint256' }] },
  primaryType: 'SignedKeyRequest',
  message: { requestFid: BigInt(APP_FID), key, deadline: BigInt(deadline) },
});

const { token, deeplinkUrl } = await axios.post('https://api.farcaster.xyz/v2/signed-key-requests', {
  key, requestFid: APP_FID, signature, deadline
}).then(r => r.data.result.signedKeyRequest);

console.log('\n🔑 СОХРАНИ ЭТОТ КЛЮЧ (это твой FARCASTER_PRIVATE_KEY):');
console.log(privateKeyHex);
console.log('\nСканируй QR код телефоном:\n');
qrcode.generate(deeplinkUrl, { small: true }, console.log);

// Ждём подтверждения
while (true) {
  await new Promise(r => setTimeout(r, 2000));
  const req = await axios.get('https://api.farcaster.xyz/v2/signed-key-request', { params: { token } }).then(r => r.data.result.signedKeyRequest);
  if (req.state === 'completed') {
    console.log('\n✅ Готово! Signer подключён.');
    console.log('Добавь в .env файл:');
    console.log(`FARCASTER_PRIVATE_KEY=${privateKeyHex}`);
    break;
  }
  process.stdout.write('.');
}