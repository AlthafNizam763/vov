/** @type {import('next-sitemap').IConfig} */
const SITE_URL = "https://www.voiceofthevoiceless.co.in";

module.exports = {
  siteUrl: SITE_URL,
  generateRobotsTxt: true,
  sitemapSize: 5000,
  changefreq: "weekly",
  priority: 0.7,
  autoLastmod: true,
  // Keep private/admin/API routes out of the sitemap.
  exclude: [
    "/dashboard",
    "/dashboard/*",
    "/LoginPage",
    "/api/*",
    "/server-sitemap.xml",
  ],
  transform: async (config, path) => {
    // Give the homepage top priority.
    const priority = path === "/" ? 1.0 : config.priority;
    return {
      loc: path,
      changefreq: config.changefreq,
      priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    };
  },
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard", "/api", "/LoginPage"],
      },
    ],
    additionalSitemaps: [`${SITE_URL}/sitemap.xml`],
  },
};
