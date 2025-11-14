'use client';

import dynamic from 'next/dynamic';

const TawkWidget = dynamic(() => import('./TawkWidget.client'), { ssr: false });

type Props = {
  propertyId: string;
};

export default function TawkWidgetWrapper({ propertyId }: Props) {
  if (!propertyId) return null;
  return <TawkWidget propertyId={propertyId} />;
}

