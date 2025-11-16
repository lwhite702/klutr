/** @type {import('next').NextConfig} */
/** @typedef {import('./types/next-config').Redirect} Redirect */

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  /**
   * @returns {Promise<Redirect[]>}
   */
  async redirects() {
    return [
      { source: "/app", destination: "/app/stream", permanent: false },
      { source: "/app/mindstorm", destination: "/app/orbit", permanent: false },
      { source: "/app/insights", destination: "/app/pulse", permanent: false },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
    ];
  },
  // This is required to support PostHog trailing slash API requests
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
