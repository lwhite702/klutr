'use client';

import { useEffect } from 'react';

type Props = {
  propertyId: string; // e.g. 'YOUR_PROPERTY_ID'
  widgetUrl?: string; // optional override for the widget URL
};

export default function TawkWidget({ propertyId, widgetUrl }: Props) {
  useEffect(() => {
    if (!propertyId) return;

    // avoid injecting twice
    if ((window as any).Tawk_LoadStart) return;

    (window as any).Tawk_API = (window as any).Tawk_API || {};
    (window as any).Tawk_LoadStart = new Date();

    const s1 = document.createElement('script');
    const s0 = document.getElementsByTagName('script')[0];

    s1.async = true;
    s1.src = widgetUrl || `https://embed.tawk.to/${propertyId}/default`;
    s1.charset = 'UTF-8';
    s1.setAttribute('crossorigin', '*');

    s0.parentNode?.insertBefore(s1, s0);

    return () => {
      // no removal - keep lifecycle simple for marketing pages
    };
  }, [propertyId, widgetUrl]);

  return null;
}

