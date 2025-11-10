/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://www.voiceofthevoiceless.co.in',
  generateRobotsTxt: true,
  sitemapSize: 7000,
  exclude: ['/404'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
  },
};
