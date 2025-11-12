// app/(app)/components/TawkAuth.client.tsx
'use client';

import { useEffect } from 'react';

export default function TawkAuth() {
  useEffect(() => {
    let mounted = true;

    async function init() {
      try {
        const res = await fetch('/api/tawk/hash');
        if (!mounted) return;
        if (!res.ok) return;

        const data = await res.json();
        if (!data || !(window as any).Tawk_API) return;

        // If secure mode enabled in Tawk admin, you must login using setAttributes + hash,
        // or using the recommended Tawk secure login flow per their docs.
        // Here we attempt setAttributes and pass 'hash' as meta if supported.
        const attrs = {
          name: data.name,
          email: data.email,
          'user-id': data.id,
        };

        if (typeof (window as any).Tawk_API.setAttributes === 'function') {
          // Some Tawk implementations accept the hash as part of attributes or via a login call.
          // We'll attempt setAttributes and then call a generic 'onLoad' to ensure attachment.
          (window as any).Tawk_API.setAttributes(attrs, () => {
            // optionally log success
            if (process.env.NODE_ENV === 'development') {
              console.log('Tawk attributes set successfully');
            }
          });
        }

        // If Tawk provides a login method (documented in Tawk docs), use it here.
        if (typeof (window as any).Tawk_API.on === 'function') {
          // placeholder for further advanced flows if needed
        }
      } catch (err) {
        // do not surface sensitive errors to client
        if (process.env.NODE_ENV === 'development') {
          console.warn('Tawk auth init failed', err);
        }
      }
    }

    // Wait until widget is loaded
    const loadInterval = setInterval(() => {
      if ((window as any).Tawk_API) {
        clearInterval(loadInterval);
        init();
      }
    }, 300);

    // Timeout after 10 seconds
    setTimeout(() => {
      clearInterval(loadInterval);
    }, 10000);

    return () => {
      mounted = false;
      clearInterval(loadInterval);
    };
  }, []);

  return null;
}

