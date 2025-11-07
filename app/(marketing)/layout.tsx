import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Klutr | Free Beta",
  description:
    "Capture notes, links, and lists — let AI organize your thoughts. Free beta now available.",
  openGraph: {
    title: "Klutr | Free Beta",
    description: "Capture notes, links, and lists — let AI organize your thoughts. Free beta now available.",
    url: "https://notesornope.com",
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

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <>{children}</>
}

