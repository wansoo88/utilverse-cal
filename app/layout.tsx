import type { Metadata } from 'next'
import { ThemeProvider } from '@/components/layout/theme-provider'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { GA4 } from '@/components/analytics/ga4'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'utilverse — Free Online Calculators & Tools',
    template: '%s | utilverse',
  },
  description:
    'Free, accurate online calculators for EV charging costs, air fryer conversions, 3D printing costs, and more. Built with real data.',
  metadataBase: new URL('https://utilverse.info'),
  openGraph: {
    type: 'website',
    siteName: 'utilverse',
    images: ['/og-default.png'],
  },
  twitter: {
    card: 'summary_large_image',
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
        <GA4 />
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
