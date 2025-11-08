import type { Metadata } from 'next'
import { getPageMetadata } from '@/lib/queries/metadata'
import BaseHubVisualProvider from '@/components/providers/BaseHubVisualProvider'

export async function generateMetadata(): Promise<Metadata> {
  const meta = await getPageMetadata('home')

  return {
    title: meta?.seoTitle ?? "Klutr | Free Beta",
    description:
      meta?.metaDescription ??
      "Capture notes, links, and lists — let AI organize your thoughts. Free beta now available.",
    openGraph: {
      title: meta?.seoTitle ?? "Klutr | Free Beta",
      description:
        meta?.metaDescription ??
        "Capture notes, links, and lists — let AI organize your thoughts. Free beta now available.",
      url: "https://klutr.app",
      siteName: "Klutr",
      images: ["/og-image.png"],
    },
    icons: {
      icon: [
        { url: '/brand/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
        { url: '/brand/favicon-192x192.png', sizes: '192x192', type: 'image/png' },
      ],
      apple: [
        { url: '/brand/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      ],
    },
  }
}

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <BaseHubVisualProvider>
      {children}
    </BaseHubVisualProvider>
  )
}

