// lib/helpers/tawkHash.ts
import crypto from 'crypto';

/**
 * computeTawkHash
 * - Inputs:
 *   - visitorId: string - unique id you use for user (e.g. user.id)
 *   - secret: string - your Tawk secret (store in Doppler / Vercel)
 * - Output: hex HMAC-SHA256 string suitable for Tawk secure login usage
 *
 * Security: keep secret only server-side. Do not commit secret.
 */
export function computeTawkHash(visitorId: string, secret: string) {
  if (!visitorId) throw new Error('visitorId required');
  if (!secret) throw new Error('Tawk secret required');
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(visitorId);
  return hmac.digest('hex');
}

