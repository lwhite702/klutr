// Client-side encryption utilities using WebCrypto API

export async function encryptText(plaintext: string, password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(plaintext)

  // Derive key from password
  const passwordKey = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, [
    "deriveBits",
    "deriveKey",
  ])

  const salt = crypto.getRandomValues(new Uint8Array(16))
  const key = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    passwordKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt"],
  )

  // Encrypt
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, data)

  // Combine salt + iv + ciphertext
  const combined = new Uint8Array(salt.length + iv.length + encrypted.byteLength)
  combined.set(salt, 0)
  combined.set(iv, salt.length)
  combined.set(new Uint8Array(encrypted), salt.length + iv.length)

  // Return as base64
  return btoa(String.fromCharCode(...combined))
}

export async function decryptText(ciphertext: string, password: string): Promise<string> {
  const encoder = new TextEncoder()
  const decoder = new TextDecoder()

  // Decode base64
  const combined = Uint8Array.from(atob(ciphertext), (c) => c.charCodeAt(0))

  // Extract salt, iv, encrypted data
  const salt = combined.slice(0, 16)
  const iv = combined.slice(16, 28)
  const encrypted = combined.slice(28)

  // Derive key from password
  const passwordKey = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, [
    "deriveBits",
    "deriveKey",
  ])

  const key = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    passwordKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["decrypt"],
  )

  // Decrypt
  const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, encrypted)

  return decoder.decode(decrypted)
}
