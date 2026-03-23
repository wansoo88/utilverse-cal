/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://utilverse.info',
  generateRobotsTxt: false,
  sitemapSize: 5000,

  // Split into multiple sitemaps by URL pattern
  additionalPaths: async () => [],

  transform: async (config, path) => {
    // Core pages — high priority, weekly
    if (path === '/') {
      return { loc: path, changefreq: 'weekly', priority: 1.0, lastmod: new Date().toISOString() }
    }

    // Calculator main pages — high priority
    const calculatorRoots = [
      '/ev-charging-cost-calculator',
      '/ev-vs-gas-calculator',
      '/air-fryer-calculator',
      '/3d-printing-cost-calculator',
      '/unit-converter',
    ]
    if (calculatorRoots.includes(path)) {
      return { loc: path, changefreq: 'weekly', priority: 0.9, lastmod: new Date().toISOString() }
    }

    // Air fryer food pages
    if (path.startsWith('/air-fryer-calculator/')) {
      return { loc: path, changefreq: 'monthly', priority: 0.7, lastmod: new Date().toISOString() }
    }

    // Unit converter pages
    if (path.startsWith('/unit-converter/')) {
      return { loc: path, changefreq: 'monthly', priority: 0.6, lastmod: new Date().toISOString() }
    }

    // Company/legal pages — low priority
    const staticPages = ['/about', '/contact', '/privacy-policy', '/terms']
    if (staticPages.includes(path)) {
      return { loc: path, changefreq: 'yearly', priority: 0.3, lastmod: new Date().toISOString() }
    }

    // Default
    return { loc: path, changefreq: 'monthly', priority: 0.5, lastmod: new Date().toISOString() }
  },

  // Generate separate sitemaps per section
  outDir: 'public',
  generateIndexSitemap: true,

  // Exclude internal Next.js paths
  exclude: ['/_not-found', '/404'],
}
