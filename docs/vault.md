---
title: "Vault Security Documentation"
author: cursor-agent
updated: 2025-10-29
---

# Vault Security Documentation

## Overview

The Vault feature provides client-side encryption for sensitive notes, ensuring that only the user can read their encrypted content. The server never sees plaintext vault contents, providing true zero-knowledge encryption.

## Current Implementation

### Encryption Algorithm

- **AES-GCM (Advanced Encryption Standard - Galois/Counter Mode)**
- **Key Size:** 256-bit
- **IV (Initialization Vector):** Random 96-bit IV for each encryption operation
- **Authentication:** Built-in authentication prevents tampering

### Key Management

- **Key Derivation:** PBKDF2 (Password-Based Key Derivation Function 2)
- **Salt:** Random salt generated for each user
- **Iterations:** 100,000 iterations (industry standard)
- **Hash Function:** SHA-256

### Storage Strategy

- **Client-Side:** Encryption/decryption happens in browser
- **Server-Side:** Only ciphertext and IV stored in database
- **Key Storage:** Currently localStorage (temporary solution)
- **Password:** User-provided vault password

## Encryption Flow

### Vault Creation

1. **User Input:** User creates vault password
2. **Key Derivation:** PBKDF2 derives encryption key from password + salt
3. **Salt Storage:** Salt stored in database (not sensitive)
4. **Key Storage:** Derived key stored in localStorage (temporary)

### Note Encryption

1. **Plaintext Note:** User creates note content
2. **IV Generation:** Random 96-bit IV generated
3. **Encryption:** AES-GCM encrypts note with derived key + IV
4. **Storage:** Ciphertext + IV sent to server
5. **Server Storage:** Only ciphertext + IV stored in database

### Note Decryption

1. **Vault Unlock:** User enters vault password
2. **Key Derivation:** PBKDF2 derives key from password + stored salt
3. **Retrieval:** Ciphertext + IV retrieved from server
4. **Decryption:** AES-GCM decrypts with derived key + IV
5. **Display:** Plaintext note shown to user

## API Contract

### POST `/api/vault/create`

**Purpose:** Create encrypted vault note

**Request Body:**

```typescript
{
  ciphertext: string; // Base64-encoded encrypted content
  iv: string; // Base64-encoded initialization vector
  salt: string; // Base64-encoded salt for key derivation
}
```

**Response:**

```typescript
{
  success: boolean;
  data?: {
    id: string;
    createdAt: string;
  };
  error?: string;
}
```

**Security Notes:**

- No plaintext content ever transmitted
- Server validates ciphertext format but cannot decrypt
- Salt is stored for key derivation on subsequent unlocks

### GET `/api/vault/list`

**Purpose:** Retrieve all encrypted vault notes for user

**Response:**

```typescript
{
  success: boolean;
  data?: Array<{
    id: string;
    ciphertext: string;
    iv: string;
    salt: string;
    createdAt: string;
  }>;
  error?: string;
}
```

**Security Notes:**

- Returns only ciphertext, never plaintext
- User must decrypt client-side using their password
- No server-side decryption capability

## Known Risks

### Current Limitations

1. **localStorage Key Storage**

   - **Risk:** Keys lost on browser refresh or clear data
   - **Impact:** User must re-enter password to access vault
   - **Mitigation:** Temporary solution, will migrate to WebCrypto API

2. **No Key Recovery**

   - **Risk:** Forgotten password = permanently lost notes
   - **Impact:** No way to recover encrypted content
   - **Mitigation:** User education, consider recovery options

3. **Single Password Model**

   - **Risk:** One password protects all vault notes
   - **Impact:** Compromise affects entire vault
   - **Mitigation:** Strong password requirements, consider per-note passwords

4. **Client-Side Key Exposure**
   - **Risk:** Keys visible in browser memory during session
   - **Impact:** Potential key extraction via browser exploits
   - **Mitigation:** WebCrypto API with ephemeral keys

### Security Considerations

- **Browser Security:** Relies on browser's security model
- **XSS Vulnerabilities:** Could expose keys if XSS occurs
- **Memory Dumps:** Keys may persist in memory
- **Browser Extensions:** Malicious extensions could access keys

## Future Improvements

### WebCrypto API Migration

- **Ephemeral Keys:** Keys not stored persistently
- **Hardware Security:** Use hardware security modules if available
- **Memory Protection:** Better key management in memory
- **Timeline:** Planned for Phase 5

### Key Recovery Options

- **Recovery Questions:** Security questions for password reset
- **Hardware Keys:** FIDO2/WebAuthn integration
- **Backup Codes:** One-time recovery codes
- **Social Recovery:** Trusted contacts for recovery

### Enhanced Security

- **Per-Note Passwords:** Individual passwords for each note
- **Key Rotation:** Regular key rotation for long-term notes
- **Audit Logging:** Track vault access attempts
- **Rate Limiting:** Prevent brute force attacks

## Security Guarantees

### What We Guarantee

1. **Zero-Knowledge:** Server never sees plaintext vault contents
2. **Client-Side Encryption:** All encryption happens in browser
3. **No Backdoors:** No server-side decryption capability
4. **User Control:** User owns their encryption keys

### What We Don't Guarantee

1. **Browser Security:** Cannot protect against browser vulnerabilities
2. **User Behavior:** Cannot prevent user from sharing passwords
3. **Device Security:** Cannot protect against compromised devices
4. **Network Security:** Cannot protect against network-level attacks

## Implementation Details

### Encryption Function

```typescript
// Reference implementation in lib/encryption.ts
export async function encryptVaultNote(
  plaintext: string,
  password: string,
  salt: Uint8Array
): Promise<{ ciphertext: string; iv: string }> {
  // 1. Derive key from password + salt using PBKDF2
  const key = await crypto.subtle.importKey(
    "raw",
    await crypto.subtle.digest("SHA-256", new TextEncoder().encode(password)),
    { name: "PBKDF2" },
    false,
    ["deriveBits", "deriveKey"]
  );

  const derivedKey = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    key,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );

  // 2. Generate random IV
  const iv = crypto.getRandomValues(new Uint8Array(12));

  // 3. Encrypt plaintext
  const ciphertext = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    derivedKey,
    new TextEncoder().encode(plaintext)
  );

  return {
    ciphertext: btoa(String.fromCharCode(...new Uint8Array(ciphertext))),
    iv: btoa(String.fromCharCode(...iv)),
  };
}
```

### Database Schema

```prisma
model VaultNote {
  id        String   @id @default(cuid())
  ciphertext String  // Base64-encoded encrypted content
  iv        String   // Base64-encoded initialization vector
  salt      String   // Base64-encoded salt for key derivation
  userId    String
  createdAt DateTime @default(now())

  user      User     @relation(fields: [userId], references: [id])
}
```

## Testing Strategy

### Unit Tests

- **Encryption/Decryption:** Verify round-trip encryption works
- **Key Derivation:** Test PBKDF2 key derivation consistency
- **Error Handling:** Test invalid passwords, corrupted data
- **Edge Cases:** Empty notes, very long notes, special characters

### Integration Tests

- **API Endpoints:** Test vault create/list endpoints
- **Database Storage:** Verify ciphertext storage and retrieval
- **Client-Side Flow:** Test complete encrypt/decrypt flow
- **Error Scenarios:** Test network failures, invalid data

### Security Tests

- **Key Isolation:** Verify keys don't leak between users
- **Memory Safety:** Test key cleanup after operations
- **Input Validation:** Test malicious input handling
- **Performance:** Test encryption performance with large notes

## Compliance Considerations

### Data Protection

- **GDPR:** Vault provides data minimization and user control
- **CCPA:** Users can delete their encrypted data
- **HIPAA:** Client-side encryption may help with healthcare data
- **SOX:** Audit trail of vault access (future enhancement)

### Security Standards

- **NIST Guidelines:** PBKDF2 and AES-GCM are NIST-approved
- **OWASP:** Follows OWASP cryptographic storage guidelines
- **FIPS 140-2:** WebCrypto API provides FIPS-compliant algorithms
- **Common Criteria:** Meets requirements for data protection

## References

- **Implementation:** `/lib/encryption.ts`
- **API Routes:** `/app/api/vault/`
- **Database Schema:** `/prisma/schema.prisma`
- **Architecture:** `/docs/architecture.md`
- **Security Best Practices:** OWASP Cryptographic Storage Cheat Sheet
