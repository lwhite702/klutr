import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeProvider } from "@/components/theme-provider";
import { PostHogProvider } from "@/components/providers/PostHogProvider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});
const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://klutr.app"),
  title: {
    default: "Klutr – Organize Your Chaos",
    template: "%s | Klutr",
  },
  description:
    "Chat-style AI note app that turns your mess of ideas into structured clarity. Capture everything, organize it effortlessly, and discover insights with AI.",
  keywords: [
    "AI note app",
    "smart tagging",
    "organize thoughts",
    "productivity AI",
    "note taking",
    "knowledge management",
    "second brain",
  ],
  authors: [{ name: "Wrelik" }],
  creator: "Wrelik",
  publisher: "Wrelik",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://klutr.app",
    siteName: "Klutr",
    title: "Klutr – Organize Your Chaos",
    description:
      "Chat-style AI note app that turns your mess of ideas into structured clarity. Capture everything, organize it effortlessly, and discover insights with AI.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Klutr – Organize Your Chaos",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Klutr – Organize Your Chaos",
    description:
      "Chat-style AI note app that turns your mess of ideas into structured clarity.",
    images: ["/og-image.png"],
    creator: "@klutr",
  },
  icons: {
    icon: [
      { url: "/brand/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      {
        url: "/brand/favicon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/brand/favicon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/brand/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    shortcut: "/brand/favicon-32x32.png",
  },
  manifest: "/site.webmanifest",
  other: {
    "theme-color": "#FF6B6B",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "Klutr",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="icon" href="/brand/favicon-32x32.png" sizes="32x32" />
        <link rel="icon" href="/brand/favicon-192x192.png" sizes="192x192" />
        <link rel="apple-touch-icon" href="/brand/apple-touch-icon.png" />
        <meta
          name="theme-color"
          content="#FF6B6B"
          media="(prefers-color-scheme: light)"
          key="theme-color-light"
        />
        <meta
          name="theme-color"
          content="#2B2E3F"
          media="(prefers-color-scheme: dark)"
          key="theme-color-dark"
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <PostHogProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange={false}
            storageKey="klutr-theme"
          >
            {children}
          </ThemeProvider>
        </PostHogProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
