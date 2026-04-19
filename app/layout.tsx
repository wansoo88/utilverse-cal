import type { Metadata } from 'next'
import Script from 'next/script'
import { ThemeProvider } from '@/components/layout/theme-provider'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { GA4 } from '@/components/analytics/ga4'
import './globals.css'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://cal.utilverse.info'

export const metadata: Metadata = {
  title: {
    default: 'utilverse — Free Online Calculators & Tools',
    template: '%s | utilverse',
  },
  description:
    'Free, accurate online calculators for EV charging costs, air fryer conversions, 3D printing costs, and more. Built with real data.',
  keywords: [
    'online calculator',
    'ev charging cost calculator',
    'ev vs gas calculator',
    'air fryer conversion',
    '3d printing cost',
    'unit converter',
    'free calculator',
  ],
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    siteName: 'utilverse',
    url: SITE_URL,
    locale: 'en_US',
    // images: app/opengraph-image.tsx가 자동으로 /opengraph-image 엔드포인트 제공
  },
  twitter: {
    card: 'summary_large_image',
    // images: app/twitter-image.tsx가 자동 제공
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'utilverse',
  url: SITE_URL,
  logo: `${SITE_URL}/opengraph-image`,
  description:
    'Free online calculators and conversion tools built with real public data.',
  sameAs: [],
}

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'utilverse',
  url: SITE_URL,
  description:
    'Free online calculators for EV charging, air fryer conversion, 3D printing costs, and unit conversion.',
  publisher: {
    '@type': 'Organization',
    name: 'utilverse',
    url: SITE_URL,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <GA4 />
        {process.env.NEXT_PUBLIC_ADSENSE_CLIENT && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
        <ThemeProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
