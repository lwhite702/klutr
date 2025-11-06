import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Notes or Nope | Organize your mind with AI",
  description:
    "An AI note app for thinkers. Capture anything and let MindStorm organize it — free beta now available.",
  openGraph: {
    title: "Notes or Nope | Free Beta",
    description: "AI that organizes your ideas — try it free today.",
    url: "https://notesornope.com",
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

