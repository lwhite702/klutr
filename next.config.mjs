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
      { source: "/app", destination: "/app/flux", permanent: false },
      { source: "/app/mindstorm", destination: "/app/orbit", permanent: false },
      { source: "/app/insights", destination: "/app/pulse", permanent: false },
    ];
  },
};

export default nextConfig;
