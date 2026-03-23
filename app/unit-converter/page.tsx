import type { Metadata } from 'next'
import Link from 'next/link'
import conversions from '@/data/unit-conversions.json'

export const metadata: Metadata = {
  title: 'Unit Converter — Free Online Conversion Calculator',
  description: 'Convert between 30+ units of measurement including weight, length, temperature, volume, speed, and area. Fast, free, and accurate.',
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

export default function UnitConverterIndex() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
        Unit Converter
      </h1>
      <p className="mt-3 text-base text-muted-foreground max-w-2xl">
        Free online unit conversion calculators. Pick a conversion below.
      </p>

      <div className="mt-10 space-y-8">
        {categories.map((cat) => (
          <section key={cat}>
            <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
              <span>{categoryIcons[cat] ?? '🔢'}</span> {cat}
            </h2>
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
