/** @type {import('next-sitemap').IConfig} */
// Google only uses <loc> and (optionally) <lastmod>. priority/changefreq are ignored.
// We omit lastmod entirely since our build-time timestamp is identical across all pages,
// which provides no useful signal. See: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://cal.utilverse.info',
  generateRobotsTxt: false,
  autoLastmod: false,
  sitemapSize: 5000,

  transform: async (_config, path) => ({ loc: path }),

  outDir: 'public',
  generateIndexSitemap: false,

  // Exclude internal Next.js paths & OG/twitter image endpoints
  exclude: ['/_not-found', '/404', '/opengraph-image', '/twitter-image'],
}
