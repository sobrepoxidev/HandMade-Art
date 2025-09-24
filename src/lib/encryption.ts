import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default-key-32-chars-long-12345';
const ALGORITHM = 'aes-256-cbc';

// Asegurar que la clave tenga exactamente 32 bytes para AES-256
function getKey(): Buffer {
  const key = ENCRYPTION_KEY.padEnd(32, '0').slice(0, 32);
  return Buffer.from(key, 'utf8');
}

export function encryptAmount(amount: number): string {
  const iv = crypto.randomBytes(16);
  const key = getKey();
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(amount.toString(), 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return `${iv.toString('hex')}:${encrypted}`;
}

export function decryptAmount(encryptedAmount: string): number | null {
  try {
    const [ivHex, encrypted] = encryptedAmount.split(':');
    if (!ivHex || !encrypted) return null;
    
    const iv = Buffer.from(ivHex, 'hex');
    const key = getKey();
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    const amount = parseFloat(decrypted);
    return isNaN(amount) ? null : amount;
  } catch (error) {
    console.error('Error decrypting amount:', error);
    return null;
  }
}