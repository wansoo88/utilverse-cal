import type { Metadata } from 'next'
import Link from 'next/link'
import { EVCalculator } from './ev-calculator'
import { ChargerFinderMap } from './charger-map'
import { AffiliateSection, EV_CHARGER_PRODUCTS } from '@/components/affiliate/affiliate-links'

export const metadata: Metadata = {
  title: 'EV Charging Cost Calculator — How Much Does It Cost to Charge Your Electric Car?',
  description:
    'Calculate exactly how much it costs to charge your electric car at home, at public stations, or DC fast chargers. Covers US, UK, Germany, Norway, France, Australia, Canada, and China.',
  openGraph: {
    title: 'EV Charging Cost Calculator',
    description: 'Free, accurate EV charging cost calculator with real electricity rate data.',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'EV Charging Cost Calculator',
  url: 'https://cal.utilverse.info/ev-charging-cost-calculator',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Web Browser',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Calculate EV charging costs by vehicle, region, and charging habits.',
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How much does it cost to charge a Tesla at home?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Charging a Tesla Model 3 at home costs roughly $10–$20/month for average US drivers (1,000 miles/month), depending on your state electricity rate. California drivers pay around $18, while Washington state drivers pay closer to $8.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is it cheaper to charge an EV at home or at a public station?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Home charging is almost always cheaper — typically 2–3× less than public Level 2 stations and 3–5× less than DC fast chargers. Public stations charge a markup for convenience and infrastructure costs.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much electricity does an EV use per month?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A typical EV driving 1,000 miles/month uses roughly 250–350 kWh, depending on the vehicle efficiency. That\'s about 25–35% of an average US household\'s monthly electricity usage.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the average cost per kWh in the US?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The US national average residential electricity rate is around $0.16/kWh as of 2025, but it varies widely — from $0.10/kWh in Louisiana to $0.39/kWh in Hawaii.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do EV charging costs compare to gas?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Most EV drivers save $800–$1,500/year compared to a similar gas vehicle. At $0.16/kWh and $3.50/gallon, driving 1,000 miles in an EV costs about $40 vs $117 in a 30 MPG gas car.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much does it cost to use a public EV charger?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Public Level 2 chargers typically cost $0.20–$0.40/kWh in the US. DC fast chargers run $0.30–$0.60/kWh. Some networks charge per minute instead of per kWh.',
      },
    },
    {
      '@type': 'Question',
      name: 'Which EV is the cheapest to charge?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The most efficient EVs — like the Tesla Model 3 RWD, Hyundai IONIQ 6, and Lucid Air — use the least electricity per mile, making them cheapest to charge. Efficiency matters more than battery size.',
      },
    },
  ],
}

export default function EVCalculatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            EV Charging Cost Calculator
          </h1>
          <p className="mt-3 text-base text-muted-foreground max-w-2xl">
            Find out exactly how much it costs to charge your electric car — by vehicle, location,
            and charging habits. Real data, no guesswork.
          </p>
        </div>

        <EVCalculator />

        {/* Charger finder map */}
        <ChargerFinderMap />

        {/* Guide text */}
        <section className="mt-16 border-t border-border pt-12">
          <h2 className="text-2xl font-semibold text-foreground">
            What affects your EV charging cost?
          </h2>
          <div className="mt-6 space-y-5 text-base text-muted-foreground leading-relaxed max-w-3xl">
            <p>
              Three things drive your monthly EV charging bill more than anything else: where you
              live, how you charge, and which car you drive. Get those right and you can cut your
              energy costs dramatically compared to gas.
            </p>
            <p>
              <strong className="text-foreground">Electricity rates vary wildly by location.</strong>{' '}
              A driver in Louisiana pays around $0.10/kWh while someone in California pays $0.27/kWh
              — nearly 3× more. That same 1,000-mile month costs $25 in Louisiana and $68 in
              California. Where you plug in matters.
            </p>
            <p>
              <strong className="text-foreground">Home charging is almost always the cheapest option.</strong>{' '}
              Public Level 2 stations typically charge 2–3× your home rate. DC fast chargers can
              run 4–5× more. If you can charge at home overnight, you&apos;ll spend a fraction of
              what apartment dwellers pay. The &quot;Apartment Dweller&quot; preset above shows
              what that scenario looks like.
            </p>
            <p>
              <strong className="text-foreground">Vehicle efficiency is the multiplier.</strong>{' '}
              A Tesla Model 3 gets about 4 miles per kWh. A large truck like the F-150 Lightning
              gets closer to 2.3 miles per kWh. Same electricity rate, nearly double the cost.
              Efficiency matters more than battery size.
            </p>
            <p>
              The good news: even in high-cost scenarios, EVs almost always beat gas on fuel costs.
              The average US driver saves $800–$1,500/year just on fuel — before factoring in lower
              maintenance costs.
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
            <Link href="/ev-vs-gas-calculator" className="rounded-lg border border-border bg-card px-4 py-2 text-sm transition-colors hover:bg-muted">🚗 EV vs Gas Calculator</Link>
            <Link href="/air-fryer-calculator" className="rounded-lg border border-border bg-card px-4 py-2 text-sm transition-colors hover:bg-muted">🍳 Air Fryer Calculator</Link>
            <Link href="/3d-printing-cost-calculator" className="rounded-lg border border-border bg-card px-4 py-2 text-sm transition-colors hover:bg-muted">🖨️ 3D Printing Calculator</Link>
            <Link href="/unit-converter" className="rounded-lg border border-border bg-card px-4 py-2 text-sm transition-colors hover:bg-muted">📏 Unit Converter</Link>
          </div>
        </section>

        <AffiliateSection
          heading="Recommended Home EV Chargers"
          products={EV_CHARGER_PRODUCTS}
        />
      </div>
    </>
  )
}
