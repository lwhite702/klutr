# Vault Encryption Implementation

**Last Updated:** 2025-01-27

## Overview

Vault notes are encrypted client-side using AES-GCM before being sent to the server. The server never sees plaintext content, ensuring maximum privacy.

## Encryption Design

### Algorithm
- **Encryption:** AES-GCM (256-bit key)
- **Key Derivation:** PBKDF2 with SHA-256
- **Iterations:** 100,000
- **IV Length:** 12 bytes (96 bits)
- **Salt Length:** 16 bytes (128 bits)
- **Auth Tag Length:** 16 bytes (128 bits)

### Encryption Flow

1. **Client-side:**
   - User enters vault password
   - Password is used to derive encryption key via PBKDF2
   - Note content is encrypted with AES-GCM
   - Encrypted blob (ciphertext + IV + salt + auth tag) is sent to server

2. **Server-side:**
   - Server validates encrypted blob structure
   - Server stores encrypted blob as JSON string
   - Server never sees plaintext

3. **Decryption:**
   - User enters vault password
   - Encrypted blob is retrieved from server
   - Password is used to derive same encryption key
   - Note content is decrypted and verified (auth tag)

## Implementation

### Client-Side Encryption

```typescript
import { encryptText } from '@/lib/encryption/secure';

const encryptedBlob = await encryptText(noteContent, vaultPassword);
// encryptedBlob contains: { encryptedData, iv, salt, authTag }
```

### Server-Side Storage

```typescript
// Server validates and stores
const vaultNote = await prisma.vaultNote.create({
  data: {
    userId: user.id,
    encryptedBlob: JSON.stringify(encryptedBlob),
  },
});
```

### Client-Side Decryption

```typescript
import { decryptText } from '@/lib/encryption/secure';

const { decryptedData } = await decryptText(encryptedBlob, vaultPassword);
```

## Security Properties

### Confidentiality
- Server never sees plaintext
- Encryption key never leaves client
- Each encryption uses unique IV and salt

### Integrity
- AES-GCM provides authentication tag
- Tampering is detected on decryption
- Auth tag verified automatically

### Key Derivation
- PBKDF2 with 100,000 iterations prevents brute force
- Unique salt per encryption prevents rainbow tables
- Key derivation happens client-side only

## Password Recovery

**Important:** Vault passwords cannot be recovered if forgotten.

### Why No Recovery?
- Encryption key is derived from password
- Server never sees password or key
- No way to decrypt without password

### User Education
- Warn users during vault setup
- Suggest password managers
- Provide export functionality (encrypted backup)

## Key Storage

### Current Implementation
- Vault password stored in user's memory only
- No server-side storage of password or key
- No localStorage/sessionStorage of password

### Future Considerations
- Optional key derivation from master password + user-specific salt
- Biometric unlock (device-level)
- Hardware security keys

## Threat Model

### Protected Against
- Server compromise (encrypted data useless without password)
- Database leaks (encrypted blobs are encrypted)
- Man-in-the-middle (HTTPS + encrypted payload)
- Malicious server code (encryption happens client-side)

### Not Protected Against
- Client-side malware (keylogger, memory dump)
- Physical device access (if unlocked)
- User error (forgotten password, weak password)

## Best Practices

1. **Strong Passwords:** Encourage users to use strong, unique passwords
2. **Password Managers:** Recommend password managers for vault password
3. **Export:** Provide encrypted export for backup
4. **Session Timeout:** Lock vault after inactivity
5. **No Password Hints:** Don't store password hints server-side

## Implementation Files

- `lib/encryption/secure.ts` - Core encryption functions
- `app/api/vault/create/route.ts` - Vault note creation
- `app/api/vault/list/route.ts` - Vault note listing
- Client components handle encryption/decryption

## Testing

### Unit Tests
- Test encryption/decryption roundtrip
- Test with various content lengths
- Test with special characters
- Test error handling (wrong password, corrupted data)

### Integration Tests
- Test vault creation flow
- Test vault decryption flow
- Test vault listing (encrypted)
- Test password validation

## Future Enhancements

1. **Key Derivation Options:**
   - Argon2 instead of PBKDF2 (better resistance to GPU attacks)
   - Configurable iteration count

2. **Multi-Device Sync:**
   - Encrypted keychain sync
   - Device-specific unlock

3. **Recovery Options:**
   - Encrypted backup key (user-controlled)
   - Trusted contact recovery

4. **Performance:**
   - Web Workers for encryption (non-blocking)
   - Streaming encryption for large files
