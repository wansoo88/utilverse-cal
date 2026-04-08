import type { Metadata } from 'next'
import Link from 'next/link'
import { PrintingCalculator } from './printing-calculator'
import { AffiliateSection, FILAMENT_PRODUCTS } from '@/components/affiliate/affiliate-links'
import { AdSlot } from '@/components/analytics/adsense'

export const metadata: Metadata = {
  title: '3D Printing Cost Calculator — Estimate the Real Cost of Any Print',
  description:
    'Calculate the true cost of any 3D print including filament, electricity, printer depreciation, and failure margin. Get a suggested selling price with profit margins.',
  alternates: { canonical: '/3d-printing-cost-calculator' },
  openGraph: {
    title: '3D Printing Cost Calculator',
    description:
      'Free 3D printing cost calculator with filament, electricity, depreciation, and failure margin.',
  },
}

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://cal.utilverse.info' },
    { '@type': 'ListItem', position: 2, name: '3D Printing Cost Calculator', item: 'https://cal.utilverse.info/3d-printing-cost-calculator' },
  ],
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: '3D Printing Cost Calculator',
  url: 'https://cal.utilverse.info/3d-printing-cost-calculator',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Web Browser',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Calculate the real cost of any 3D print with detailed breakdown.',
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How much does it cost to 3D print something?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A typical small 3D print (20-50g) costs $0.50-$2.00 in materials alone. When you factor in electricity, printer depreciation, and failure margin, the real cost is usually 2-3x the material cost. A 50g PLA print on a $300 printer typically costs around $2-4 total.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much electricity does a 3D printer use?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Most FDM 3D printers use 100-250 watts during printing. A typical 5-hour print on a 200W printer at $0.16/kWh costs about $0.16 in electricity. Resin printers use less power (50-100W) but have higher material costs.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the cheapest filament to 3D print with?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'PLA is the cheapest and most popular filament at $18-25/kg. PLA+ offers slightly better properties for $22-28/kg. ABS is similar in price but harder to print. For the lowest cost per print, PLA with a well-tuned printer gives the best value.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I price my 3D prints for selling?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Calculate your total cost (material + electricity + depreciation + failure margin), then add your desired profit margin. Most sellers use 50-100% markup for simple prints and 200-400% for complex or custom work. Factor in your time for design, setup, and post-processing.',
      },
    },
    {
      '@type': 'Question',
      name: 'What failure rate should I expect for 3D printing?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Beginners should expect a 15-20% failure rate. Experienced users with well-tuned printers typically see 5-10%. Complex prints with overhangs or thin walls may fail more often. Always include a failure margin in your cost calculations.',
      },
    },
  ],
}

export default function PrintingCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <nav className="mb-6 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">3D Printing Cost Calculator</span>
        </nav>

        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            3D Printing Cost Calculator
          </h1>
          <p className="mt-3 text-base text-muted-foreground max-w-2xl">
            Estimate the real cost of any 3D print — filament, electricity,
            printer wear, and failure margin. Get a suggested selling price too.
          </p>
        </div>

        <PrintingCalculator />

        {/* Guide text */}
        <section className="mt-16 border-t border-border pt-12">
          <h2 className="text-2xl font-semibold text-foreground">
            The real cost of 3D printing
          </h2>
          <div className="mt-6 space-y-5 text-base text-muted-foreground leading-relaxed max-w-3xl">
            <p>
              Most people only think about filament cost when pricing a 3D
              print. But the real cost includes four components: material,
              electricity, printer depreciation, and a margin for failed prints.
              Ignoring any of these means you are underpricing your work.
            </p>
            <p>
              <strong className="text-foreground">
                Material is usually 40-60% of total cost.
              </strong>{' '}
              A 50g PLA print uses about $1.10 worth of filament at $22/kg.
              Specialty filaments like carbon fiber PLA or flexible TPU can
              double or triple that number.
            </p>
            <p>
              <strong className="text-foreground">
                Electricity is cheap but adds up.
              </strong>{' '}
              A 200W printer running for 5 hours at $0.16/kWh costs $0.16. For
              a single print that is negligible, but if you are running a print
              farm with multiple printers going 12+ hours a day, electricity
              becomes a real line item.
            </p>
            <p>
              <strong className="text-foreground">
                Printer depreciation is the hidden cost.
              </strong>{' '}
              A $300 printer with a 2,000-hour lifespan costs $0.15/hour to
              operate. A 5-hour print adds $0.75 in wear. Higher-end printers
              cost more per hour but often have longer lifespans and lower
              failure rates.
            </p>
            <p>
              <strong className="text-foreground">
                Failure margin protects your bottom line.
              </strong>{' '}
              Even experienced users see 5-10% of prints fail. Adding a 10%
              failure margin to your pricing ensures you do not lose money on
              bad prints. For complex or experimental prints, 15-20% is safer.
            </p>
          </div>
        </section>

        <AdSlot slot="4567890123" format="horizontal" className="my-8" />

        {/* FAQ */}
        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-foreground mb-6">
            Frequently asked questions
          </h2>
          <div className="space-y-4 max-w-3xl">
            {faqJsonLd.mainEntity.map((faq, i) => (
              <details
                key={i}
                className="group rounded-xl border border-border bg-card px-5 py-4"
              >
                <summary className="cursor-pointer list-none flex items-center justify-between gap-4 font-medium text-foreground">
                  {faq.name}
                  <span className="shrink-0 text-muted-foreground transition-transform group-open:rotate-180">
                    ▾
                  </span>
                </summary>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  {faq.acceptedAnswer.text}
                </p>
              </details>
            ))}
          </div>
        </section>

        <section className="mt-12 border-t border-border pt-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">Related tools</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/ev-charging-cost-calculator" className="rounded-lg border border-border bg-card px-4 py-2 text-sm transition-colors hover:bg-muted">⚡ EV Charging Calculator</Link>
            <Link href="/air-fryer-calculator" className="rounded-lg border border-border bg-card px-4 py-2 text-sm transition-colors hover:bg-muted">🍳 Air Fryer Calculator</Link>
            <Link href="/unit-converter" className="rounded-lg border border-border bg-card px-4 py-2 text-sm transition-colors hover:bg-muted">📏 Unit Converter</Link>
          </div>
        </section>

        <AffiliateSection
          heading="Popular Filaments on Amazon"
          products={FILAMENT_PRODUCTS}
        />
      </div>
    </>
  )
}
