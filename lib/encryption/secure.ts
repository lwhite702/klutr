// Secure encryption utilities that prevent key exposure in logs/errors

interface EncryptionResult {
  encryptedData: string;
  iv: string;
  salt: string;
  authTag: string; // HMAC for integrity verification
}

interface DecryptionResult {
  decryptedData: string;
}

// Sanitize error messages to prevent key exposure
function sanitizeError(error: unknown): string {
  if (error instanceof Error) {
    let message = error.message;

    // Remove any potential key material from error messages
    message = message.replace(/[A-Za-z0-9+/]{20,}={0,2}/g, "[REDACTED]"); // Base64 patterns
    message = message.replace(/[0-9a-f]{32,}/gi, "[REDACTED]"); // Hex patterns
    message = message.replace(/password|key|secret|token/gi, "[REDACTED]");

    return message;
  }

  return "Unknown encryption error";
}

// Secure key derivation that doesn't expose keys in errors
export async function deriveKeyFromPassword(
  password: string,
  salt: Uint8Array
): Promise<CryptoKey> {
  try {
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      encoder.encode(password),
      "PBKDF2",
      false,
      ["deriveBits", "deriveKey"]
    );

    return await crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: salt,
        iterations: 100000,
        hash: "SHA-256",
      },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"]
    );
  } catch (error) {
    // Sanitize error to prevent key exposure
    throw new Error(`Key derivation failed: ${sanitizeError(error)}`);
  }
}

// Secure encryption that doesn't expose keys with integrity verification
export async function encryptText(
  text: string,
  password: string
): Promise<EncryptionResult> {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);

    // Generate random salt and IV
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));

    // Derive key from password
    const key = await deriveKeyFromPassword(password, salt);

    // Encrypt data with AES-GCM (includes authentication tag)
    const encryptedData = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv: iv },
      key,
      data
    );

    // Extract authentication tag from encrypted data
    const encryptedArray = new Uint8Array(encryptedData);
    const authTag = encryptedArray.slice(-16); // Last 16 bytes are auth tag
    const ciphertext = encryptedArray.slice(0, -16); // Rest is ciphertext

    // Convert to base64 for storage
    const encryptedBase64 = btoa(String.fromCharCode(...ciphertext));
    const ivBase64 = btoa(String.fromCharCode(...iv));
    const saltBase64 = btoa(String.fromCharCode(...salt));
    const authTagBase64 = btoa(String.fromCharCode(...authTag));

    return {
      encryptedData: encryptedBase64,
      iv: ivBase64,
      salt: saltBase64,
      authTag: authTagBase64,
    };
  } catch (error) {
    // Sanitize error to prevent key exposure
    throw new Error(`Encryption failed: ${sanitizeError(error)}`);
  }
}

// Secure decryption that doesn't expose keys with integrity verification
export async function decryptText(
  encryptedResult: EncryptionResult,
  password: string
): Promise<DecryptionResult> {
  try {
    // Convert from base64
    const encryptedData = Uint8Array.from(
      atob(encryptedResult.encryptedData),
      (c) => c.charCodeAt(0)
    );
    const iv = Uint8Array.from(atob(encryptedResult.iv), (c) =>
      c.charCodeAt(0)
    );
    const salt = Uint8Array.from(atob(encryptedResult.salt), (c) =>
      c.charCodeAt(0)
    );
    const authTag = Uint8Array.from(atob(encryptedResult.authTag), (c) =>
      c.charCodeAt(0)
    );

    // Derive key from password
    const key = await deriveKeyFromPassword(password, salt);

    // Reconstruct the encrypted data with auth tag for AES-GCM
    const encryptedDataWithTag = new Uint8Array(
      encryptedData.length + authTag.length
    );
    encryptedDataWithTag.set(encryptedData);
    encryptedDataWithTag.set(authTag, encryptedData.length);

    // Decrypt data with integrity verification
    const decryptedData = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: iv },
      key,
      encryptedDataWithTag
    );

    // Convert back to string
    const decoder = new TextDecoder();
    const decryptedText = decoder.decode(decryptedData);

    return { decryptedData: decryptedText };
  } catch (error) {
    // Sanitize error to prevent key exposure
    throw new Error(`Decryption failed: ${sanitizeError(error)}`);
  }
}

// Secure key generation for vault operations
export function generateSecureKey(): string {
  try {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return btoa(String.fromCharCode(...array));
  } catch (error) {
    throw new Error(`Key generation failed: ${sanitizeError(error)}`);
  }
}

// Secure hash function for non-sensitive data
export async function secureHash(data: string): Promise<string> {
  try {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest("SHA-256", dataBuffer);
    const hashArray = new Uint8Array(hashBuffer);
    return btoa(String.fromCharCode(...hashArray));
  } catch (error) {
    throw new Error(`Hashing failed: ${sanitizeError(error)}`);
  }
}

// Utility to check if encryption is supported
export function isEncryptionSupported(): boolean {
  return (
    typeof crypto !== "undefined" &&
    typeof crypto.subtle !== "undefined" &&
    typeof TextEncoder !== "undefined" &&
    typeof TextDecoder !== "undefined"
  );
}

// Validate encrypted data structure
export function validateEncryptedData(data: unknown): data is EncryptionResult {
  if (typeof data !== "object" || data === null) {
    return false;
  }

  const encrypted = data as Record<string, unknown>;

  return (
    typeof encrypted.encryptedData === "string" &&
    typeof encrypted.iv === "string" &&
    typeof encrypted.salt === "string" &&
    typeof encrypted.authTag === "string" &&
    encrypted.encryptedData.length > 0 &&
    encrypted.iv.length > 0 &&
    encrypted.salt.length > 0 &&
    encrypted.authTag.length > 0
  );
}

// Server-side validation for encrypted data (prevents malformed ciphertext)
export function validateEncryptedDataServerSide(data: unknown): {
  isValid: boolean;
  error?: string;
} {
  if (!validateEncryptedData(data)) {
    return {
      isValid: false,
      error: "Invalid encrypted data structure",
    };
  }

  const encrypted = data as EncryptionResult;

  try {
    // Validate base64 encoding
    atob(encrypted.encryptedData);
    atob(encrypted.iv);
    atob(encrypted.salt);
    atob(encrypted.authTag);

    // Validate expected lengths
    const ivBytes = Uint8Array.from(atob(encrypted.iv), (c) => c.charCodeAt(0));
    const saltBytes = Uint8Array.from(atob(encrypted.salt), (c) =>
      c.charCodeAt(0)
    );
    const authTagBytes = Uint8Array.from(atob(encrypted.authTag), (c) =>
      c.charCodeAt(0)
    );

    if (ivBytes.length !== 12) {
      return {
        isValid: false,
        error: "Invalid IV length",
      };
    }

    if (saltBytes.length !== 16) {
      return {
        isValid: false,
        error: "Invalid salt length",
      };
    }

    if (authTagBytes.length !== 16) {
      return {
        isValid: false,
        error: "Invalid authentication tag length",
      };
    }

    return { isValid: true };
  } catch (error) {
    return {
      isValid: false,
      error: "Invalid base64 encoding",
    };
  }
}
