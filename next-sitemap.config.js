/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || process.env.VERCEL_URL || 'https://klutr.app',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: [
    '/app/*',
    '/api/*',
    '/login',
    '/debug/*',
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/app/', '/api/', '/debug/'],
      },
    ],
  },
}

