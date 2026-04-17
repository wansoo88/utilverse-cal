import type { Metadata } from 'next'
import Link from 'next/link'
import conversions from '@/data/unit-conversions.json'

export const metadata: Metadata = {
  title: 'Unit Converter — Free Online Conversion Calculator',
  description: 'Convert between units of weight, length, temperature, volume, speed, and area. Free, accurate, and instant — with formulas and reference tables.',
  alternates: { canonical: '/unit-converter' },
}

interface UnitConversion {
  slug: string; from: string; to: string; fromUnit: string; toUnit: string
  factor: number; category: string
}

const allConversions = conversions as UnitConversion[]
const categories = Array.from(new Set(allConversions.map((c) => c.category)))

const categoryIcons: Record<string, string> = {
  Weight: '⚖️', Length: '📏', Temperature: '🌡️',
  Volume: '🧪', Speed: '🏎️', Area: '📐',
}

const categoryDescriptions: Record<string, string> = {
  Weight: 'Convert kilograms, pounds, grams, ounces, and more. Essential for cooking, shipping, and fitness.',
  Length: 'Convert meters, feet, inches, miles, and kilometers. Covers everything from screen sizes to road distances.',
  Temperature: 'Convert Fahrenheit, Celsius, and Kelvin. Indispensable for cooking, travel, and science.',
  Volume: 'Convert liters, gallons, cups, fluid ounces, and milliliters. Covers cooking, chemistry, and fuel.',
  Speed: 'Convert mph, km/h, knots, and m/s. Covers driving, aviation, and sports.',
  Area: 'Convert square feet, square meters, acres, and hectares. Covers real estate, agriculture, and construction.',
}

export default function UnitConverterIndex() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
        Unit Converter
      </h1>
      <p className="mt-3 text-base text-muted-foreground max-w-2xl">
        Free online unit conversion calculators for weight, length, temperature, volume, speed, and area. Each converter includes the exact formula, a reference table, and real-world context so the numbers actually mean something.
      </p>

      <div className="mt-10 space-y-8">
        {categories.map((cat) => (
          <section key={cat}>
            <div className="mb-3">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <span>{categoryIcons[cat] ?? '🔢'}</span> {cat}
              </h2>
              {categoryDescriptions[cat] && (
                <p className="mt-1 text-sm text-muted-foreground">{categoryDescriptions[cat]}</p>
              )}
            </div>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {allConversions.filter((c) => c.category === cat).map((c) => (
                <Link
                  key={c.slug}
                  href={`/unit-converter/${c.slug}`}
                  className="flex items-center justify-between rounded-lg border border-border bg-card p-3 text-sm transition-colors hover:bg-muted"
                >
                  <span>
                    <span className="font-medium text-foreground">{c.from}</span>
                    <span className="text-muted-foreground"> → </span>
                    <span className="font-medium text-foreground">{c.to}</span>
                  </span>
                  <span className="text-xs text-muted-foreground">{c.fromUnit} → {c.toUnit}</span>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Guide section */}
      <section className="mt-14 border-t border-border pt-10">
        <h2 className="text-xl font-semibold text-foreground mb-5">
          Why unit conversions matter
        </h2>
        <div className="space-y-4 text-base text-muted-foreground leading-relaxed max-w-3xl">
          <p>
            The world uses two major measurement systems: the metric system (used by most countries and all of science) and the US customary system (used primarily in the United States for everyday life). Navigating between these systems is a daily reality for millions of people — whether you&apos;re cooking with a European recipe, buying a car with specs in km/h, comparing real estate listings abroad, or following a medication dosage.
          </p>
          <p>
            Getting conversions wrong has real consequences. A recipe that calls for 200°C (392°F) is ruined if you set the oven to 200°F. A package that weighs 5 kg will be rejected if you fill out a customs form declaring 5 lbs. Knowing the exact conversion — and understanding why it matters — prevents those errors.
          </p>
          <p>
            Each converter on this page shows the exact mathematical formula alongside an interactive calculator and a reference table. The reference tables let you scan common values at a glance without doing any math. The guide sections explain where and why each measurement system is used, so you build real intuition rather than just copying numbers.
          </p>
          <p>
            All conversions are based on internationally defined exact values where they exist (such as the exact definition of 1 inch = 2.54 cm), or the best available scientific constants for the rest.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold text-foreground mb-5">Common questions</h2>
        <div className="space-y-3 max-w-3xl">
          {[
            {
              q: 'Which countries use the metric system?',
              a: 'All countries except the United States, Liberia, and Myanmar officially use the metric system. The US uses metric in science, medicine, and military contexts, but US customary units dominate everyday life. The UK officially uses metric but retains miles for road signs and pints for draught beer.',
            },
            {
              q: 'How accurate are these conversions?',
              a: 'All conversions use exact or scientifically precise values. For example, 1 inch = 2.54 cm exactly (an internationally defined standard). Temperature conversions use the exact formulas defined by international standards bodies. Rounding only occurs in the display, not in the calculation.',
            },
            {
              q: 'What is the easiest way to convert Celsius to Fahrenheit quickly?',
              a: 'Double the Celsius temperature and add 30 for a fast estimate. Example: 20°C → 40 + 30 = 70°F (actual: 68°F). For a more accurate result, multiply by 1.8 and add 32.',
            },
          ].map((faq, i) => (
            <details key={i} className="group rounded-xl border border-border bg-card px-5 py-4">
              <summary className="cursor-pointer list-none flex items-center justify-between gap-4 font-medium text-foreground text-sm">
                {faq.q}
                <span className="shrink-0 text-muted-foreground transition-transform group-open:rotate-180">▾</span>
              </summary>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mt-12 border-t border-border pt-8">
        <h2 className="text-lg font-semibold text-foreground mb-4">Related tools</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/ev-charging-cost-calculator" className="rounded-lg border border-border bg-card px-4 py-2 text-sm transition-colors hover:bg-muted">⚡ EV Charging Calculator</Link>
          <Link href="/ev-vs-gas-calculator" className="rounded-lg border border-border bg-card px-4 py-2 text-sm transition-colors hover:bg-muted">🚗 EV vs Gas Calculator</Link>
          <Link href="/air-fryer-calculator" className="rounded-lg border border-border bg-card px-4 py-2 text-sm transition-colors hover:bg-muted">🍳 Air Fryer Calculator</Link>
          <Link href="/3d-printing-cost-calculator" className="rounded-lg border border-border bg-card px-4 py-2 text-sm transition-colors hover:bg-muted">🖨️ 3D Printing Calculator</Link>
        </div>
      </section>
    </div>
  )
}
