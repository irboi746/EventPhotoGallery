import { EncryptJWT, jwtDecrypt, SignJWT, jwtVerify  } from 'jose';

const ENC_ALG = 'dir'; // Direct symmetric encryption
const ENC_ENC = 'A256GCM'; // AES 256 GCM
const SIGN_ALG = 'HS256'; // HMAC SHA-256 for signing
const EXPIRATION_TIME = '2h';

const encoder = new TextEncoder();

// Ensures the secret is a 32-byte Uint8Array, truncate if key is too long, pad if too short
const toKey = (secret: string): Uint8Array => {
  const encoded = encoder.encode(secret);
  const key = new Uint8Array(32);
  key.set(encoded.subarray(0, 32)); // truncate or zero-pad
  return key;
};

const signJWT = async (
  payload: Record<string, unknown>,
  secret: string
): Promise<string> => {
  const signedJWT = await new SignJWT(payload)
    .setProtectedHeader({ alg: SIGN_ALG })  // Using HMAC SHA-256 for signing
    .setIssuedAt()
    .setExpirationTime(EXPIRATION_TIME)
    .sign(toKey(secret)); // Signing with the secret

  return signedJWT;
};

export const encryptJWT = async (
  payload: Record<string, unknown>,
  secret: string,  // Signing secret
  enckey: string  // Encryption key
): Promise<string> => {
  const signedJWT = await signJWT(payload, secret);  // First sign the JWT

  const key = toKey(enckey);  // Encryption key (separate from signing secret)
  
  const encryptedJWT = await new EncryptJWT({ payload: signedJWT })
    .setProtectedHeader({ alg: ENC_ALG, enc: ENC_ENC })  // AES GCM encryption
    .encrypt(key);  // Encrypt with the encryption key (separate key)
  return encryptedJWT;
};

// Decrypt the JWT and verify the signature
export const decryptJWT = async (
  token: string,
  secret: string,  // Signing secret
  enckey: string  // Encryption key
): Promise<Record<string, unknown>> => {
  const key = toKey(enckey);  // Convert encryption key to Uint8Array

  // Step 1: Decrypt the token to get the payload, which contains the signed JWT string
  const { payload: decryptedPayload } = await jwtDecrypt(token, key);

  // The decrypted payload should contain the signed JWT string
  const signedJWT = decryptedPayload?.payload as string;  // Treat it as a string
  
  // Step 2: Verify the signature of the signed JWT
  const verifiedPayload = await jwtVerify(signedJWT, toKey(secret));  // Convert secret to Uint8Array

  return verifiedPayload.payload as Record<string, unknown>;
};