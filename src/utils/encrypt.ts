import CryptoJS from 'crypto-js';

const SECRET_KEY = process.env.ENCRYPTION_KEY || '0123456789abcdef0123456789abcdef'; // 32 karakter
const IV_LENGTH = 16; // 16 bytes

export function encrypt(text: string): string {
  const key = CryptoJS.enc.Utf8.parse(SECRET_KEY);
  const iv = CryptoJS.lib.WordArray.random(IV_LENGTH); // generate IV

  const encrypted = CryptoJS.AES.encrypt(text, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return `${iv.toString(CryptoJS.enc.Hex)}:${encrypted.toString()}`;
}

export function decrypt(encryptedData: string): string {
  const [ivHex, encryptedText] = encryptedData.split(':');
  const key = CryptoJS.enc.Utf8.parse(SECRET_KEY);
  const iv = CryptoJS.enc.Hex.parse(ivHex);

  const decrypted = CryptoJS.AES.decrypt(encryptedText, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return decrypted.toString(CryptoJS.enc.Utf8);
}
