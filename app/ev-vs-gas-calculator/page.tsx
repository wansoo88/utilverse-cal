import type { Metadata } from 'next'
import Link from 'next/link'
import { TCOCalculator } from './tco-calculator'

export const metadata: Metadata = {
  title: 'EV vs Gas Cost Calculator — Total Cost of Ownership Comparison',
  description:
    'Compare the true 5-year and 10-year cost of owning an electric vehicle vs a gas car. Includes purchase price, fuel, maintenance, insurance, and tax credits. Find your breakeven point.',
  openGraph: {
    title: 'EV vs Gas Cost Calculator',
    description: 'See exactly when an EV pays off vs a gas car with our TCO calculator.',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'EV vs Gas Cost Calculator',
  url: 'https://utilverse.info/ev-vs-gas-calculator',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Web Browser',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Compare total cost of ownership between electric vehicles and gas cars over 5 or 10 years.',
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Is it cheaper to own an EV or a gas car?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Over 5 years, most EVs are cheaper to own than comparable gas cars when you factor in lower fuel and maintenance costs. The upfront price is higher, but fuel savings of $1,000–$1,500/year typically offset this within 3–6 years.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long does it take for an EV to pay for itself?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The breakeven point depends on the price difference, fuel costs, and how much you drive. For a typical US driver doing 12,000 miles/year, breakeven is usually 3–6 years. High-mileage drivers break even faster.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much cheaper is EV maintenance vs gas?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'EV owners typically spend $400–$800/year on maintenance vs $1,200–$1,800 for gas cars. EVs have no oil changes, fewer brake replacements (regenerative braking), and simpler drivetrains.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does the $7,500 federal EV tax credit make a big difference?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes — the $7,500 federal tax credit (for qualifying vehicles) directly reduces your net purchase price, which can cut the breakeven point by 1–2 years. Some states add additional credits on top.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is total cost of ownership (TCO)?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'TCO includes everything you pay to own and operate a vehicle: purchase price, fuel, maintenance, insurance, and taxes. It gives a more accurate picture than just comparing sticker prices.',
      },
    },
  ],
}

export default function EVvsGasPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <nav className="mb-6 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">EV vs Gas Calculator</span>
        </nav>

        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            EV vs Gas Cost Calculator
          </h1>
          <p className="mt-3 text-base text-muted-foreground max-w-2xl">
            Compare the true 5 or 10-year cost of owning an electric vehicle vs a gas car.
            Includes purchase price, fuel, maintenance, insurance, and tax credits.
          </p>
        </div>

        <TCOCalculator />

        {/* Guide */}
        <section className="mt-16 border-t border-border pt-12">
          <h2 className="text-2xl font-semibold text-foreground">
            How to compare EV vs gas total cost of ownership
          </h2>
          <div className="mt-6 space-y-5 text-base text-muted-foreground leading-relaxed max-w-3xl">
            <p>
              The sticker price of an EV is almost always higher than a comparable gas car. But
              sticker price is only part of the story. When you add up fuel, maintenance, and
              insurance over 5–10 years, EVs frequently come out ahead — sometimes by thousands
              of dollars.
            </p>
            <p>
              <strong className="text-foreground">Fuel is the biggest lever.</strong> The average
              US driver spends $2,000–$3,000/year on gasoline. An EV doing the same miles costs
              $500–$800 in electricity. That $1,500/year difference adds up to $7,500 over 5 years
              — often enough to close the purchase price gap entirely.
            </p>
            <p>
              <strong className="text-foreground">Maintenance costs are genuinely lower for EVs.</strong>{' '}
              No oil changes, no transmission fluid, fewer brake jobs (regenerative braking does
              most of the work). Consumer Reports data shows EV owners spend about half what gas
              car owners spend on maintenance annually.
            </p>
            <p>
              <strong className="text-foreground">The federal tax credit changes the math significantly.</strong>{' '}
              A $7,500 credit on a $40,000 EV effectively makes it a $32,500 car. Combined with
              fuel and maintenance savings, many EVs break even within 3–4 years for average drivers.
            </p>
            <p>
              High-mileage drivers benefit most — every extra mile driven is a mile where the EV
              saves money on fuel. If you drive 20,000+ miles/year, the breakeven point can drop
              to under 2 years.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-foreground mb-6">
            Frequently asked questions
          </h2>
          <div className="space-y-4 max-w-3xl">
            {faqJsonLd.mainEntity.map((faq, i) => (
              <details key={i} className="group rounded-xl border border-border bg-card px-5 py-4">
                <summary className="cursor-pointer list-none flex items-center justify-between gap-4 font-medium text-foreground">
                  {faq.name}
                  <span className="shrink-0 text-muted-foreground transition-transform group-open:rotate-180">▾</span>
                </summary>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  {faq.acceptedAnswer.text}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* Related tools */}
        <section className="mt-12 border-t border-border pt-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">Related tools</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/ev-charging-cost-calculator"
              className="rounded-lg border border-border bg-card px-4 py-2 text-sm transition-colors hover:bg-muted">
              ⚡ EV Charging Cost Calculator
            </Link>
            <Link href="/unit-converter/miles-to-km"
              className="rounded-lg border border-border bg-card px-4 py-2 text-sm transition-colors hover:bg-muted">
              📏 Miles to km Converter
            </Link>
          </div>
        </section>
      </div>
    </>
  )
}
