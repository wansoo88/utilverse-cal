import type { Metadata } from 'next'
import Link from 'next/link'
import { AirFryerCalculator } from './airfryer-calculator'

export const metadata: Metadata = {
  title:
    'Air Fryer Conversion Calculator — Oven to Air Fryer Time & Temperature',
  description:
    'Convert any oven recipe for your air fryer in seconds. Supports 5-way conversion between oven, air fryer, convection oven, Instant Pot, and slow cooker. 20 popular food presets included.',
  openGraph: {
    title: 'Air Fryer Conversion Calculator',
    description:
      'Free air fryer conversion calculator with 20 food presets and 5-way cooking method conversion.',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Air Fryer Conversion Calculator',
  url: 'https://cal.utilverse.info/air-fryer-calculator',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Web Browser',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description:
    'Convert oven recipes for air fryer, convection oven, Instant Pot, and slow cooker.',
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How do I convert oven temperature to air fryer?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Reduce the oven temperature by 25°F (about 15°C) and reduce the cooking time by about 20%. For example, if a recipe calls for 400°F for 30 minutes in the oven, set your air fryer to 375°F for about 24 minutes.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I need to preheat my air fryer?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, preheating your air fryer for 3-5 minutes helps achieve better results, especially for foods that need a crispy exterior. Some newer models preheat automatically.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I convert slow cooker recipes to air fryer?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Some slow cooker recipes can be adapted for the air fryer, but not all. Braised meats and stews are better suited for slow cooking. Foods that benefit from dry heat and crispiness — like chicken, vegetables, and frozen foods — convert well to air fryer.',
      },
    },
    {
      '@type': 'Question',
      name: 'Why does my air fryer cook faster than an oven?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Air fryers use rapid air circulation (convection) in a compact space, which transfers heat more efficiently than a full-size oven. The smaller cooking chamber means less air to heat and faster cooking times — typically 20-25% faster.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the difference between air fryer and convection oven?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Both use fans to circulate hot air, but air fryers have a more compact chamber and stronger airflow, making them slightly faster and crispier. Convection ovens offer more space for larger batches. Temperature and time settings are very similar between the two.',
      },
    },
  ],
}

export default function AirFryerCalculatorPage() {
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Air Fryer Conversion Calculator
          </h1>
          <p className="mt-3 text-base text-muted-foreground max-w-2xl">
            Convert any recipe between oven, air fryer, convection oven,
            Instant Pot, and slow cooker. Pick a food preset or enter your own
            settings.
          </p>
        </div>

        <AirFryerCalculator />

        {/* Guide text */}
        <section className="mt-16 border-t border-border pt-12">
          <h2 className="text-2xl font-semibold text-foreground">
            How air fryer conversion works
          </h2>
          <div className="mt-6 space-y-5 text-base text-muted-foreground leading-relaxed max-w-3xl">
            <p>
              Air fryers cook food by rapidly circulating hot air around it in a
              compact chamber. This concentrated convection effect means food
              cooks faster and crisps up better than in a traditional oven —
              without needing as much oil.
            </p>
            <p>
              <strong className="text-foreground">
                The basic rule: reduce temperature by 25°F and time by 20%.
              </strong>{' '}
              If your oven recipe says 400°F for 30 minutes, set your air fryer
              to 375°F for about 24 minutes. This works for most recipes, but
              always check food a few minutes early until you know your specific
              air fryer.
            </p>
            <p>
              <strong className="text-foreground">
                Every air fryer is slightly different.
              </strong>{' '}
              Basket-style air fryers tend to cook faster than oven-style ones.
              Wattage matters too — a 1700W air fryer will cook faster than a
              1400W model. Use these conversions as a starting point and adjust
              based on your results.
            </p>
            <p>
              <strong className="text-foreground">
                The golden rule: do not overcrowd.
              </strong>{' '}
              Air fryers need space for air to circulate. A single layer with
              gaps between pieces gives you the best crispiness. If you need to
              cook a large batch, do it in rounds.
            </p>
            <p>
              This calculator also supports conversions to and from Instant Pot
              (pressure cooker) and slow cooker. These are approximate — pressure
              cooking and slow cooking use fundamentally different methods than
              dry heat, so not all recipes translate perfectly.
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
            <Link href="/ev-charging-cost-calculator" className="rounded-lg border border-border bg-card px-4 py-2 text-sm transition-colors hover:bg-muted">⚡ EV Charging Calculator</Link>
            <Link href="/ev-vs-gas-calculator" className="rounded-lg border border-border bg-card px-4 py-2 text-sm transition-colors hover:bg-muted">🚗 EV vs Gas Calculator</Link>
            <Link href="/3d-printing-cost-calculator" className="rounded-lg border border-border bg-card px-4 py-2 text-sm transition-colors hover:bg-muted">🖨️ 3D Printing Calculator</Link>
            <Link href="/unit-converter/fahrenheit-to-celsius" className="rounded-lg border border-border bg-card px-4 py-2 text-sm transition-colors hover:bg-muted">🌡️ °F to °C Converter</Link>
          </div>
        </section>
      </div>
    </>
  )
}
