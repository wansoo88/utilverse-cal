import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import conversions from '@/data/unit-conversions.json'
import { UnitConverterWidget } from './converter-widget'

interface UnitConversion {
  slug: string; from: string; to: string; fromUnit: string; toUnit: string
  factor: number; category: string
  formula?: string; multiply?: number; add?: number; subtract?: number; divide?: number
}

const allConversions = conversions as UnitConversion[]

export function generateStaticParams() {
  return allConversions.map((c) => ({ slug: c.slug }))
}

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const safeConv = allConversions.find((c) => c.slug === slug)
  if (!safeConv) return {}
  return {
    title: `${safeConv.from} to ${safeConv.to} Converter — ${safeConv.fromUnit} to ${safeConv.toUnit}`,
    description: `Convert ${safeConv.from} to ${safeConv.to} instantly. Free ${safeConv.fromUnit} to ${safeConv.toUnit} calculator with conversion formula and reference table.`,
    alternates: { canonical: `/unit-converter/${slug}` },
    openGraph: {
      title: `${safeConv.from} to ${safeConv.to} Converter`,
      description: `Free ${safeConv.fromUnit} to ${safeConv.toUnit} converter with formula and reference table.`,
    },
  }
}

export default async function UnitConverterPage({ params }: Props) {
  const { slug } = await params
  const conv = allConversions.find((c) => c.slug === slug)
  if (!conv) notFound()

  const safeConv = conv!

  const related = allConversions
    .filter((c) => c.slug !== slug && c.category === safeConv.category)
    .slice(0, 6)

  const allCategories = Array.from(new Set(allConversions.map((c) => c.category)))

  // Generate reference table values
  const refValues = [1, 5, 10, 25, 50, 100, 250, 500, 1000]

  function doConvert(val: number): number {
    if (safeConv.formula === 'multiply_add') return val * (safeConv.multiply ?? 1) + (safeConv.add ?? 0)
    if (safeConv.formula === 'subtract_divide') return (val - (safeConv.subtract ?? 0)) / (safeConv.divide ?? 1)
    return val * safeConv.factor
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://cal.utilverse.info'
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: `${safeConv.from} to ${safeConv.to} Converter`,
    url: `${siteUrl}/unit-converter/${slug}`,
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Web Browser',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description: `Convert ${safeConv.fromUnit} to ${safeConv.toUnit} with formula and reference table.`,
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Unit Converter', item: `${siteUrl}/unit-converter` },
      { '@type': 'ListItem', position: 3, name: `${safeConv.from} to ${safeConv.to}`, item: `${siteUrl}/unit-converter/${slug}` },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <nav className="mb-6 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/unit-converter" className="hover:text-foreground">Unit Converter</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{safeConv.from} to {safeConv.to}</span>
      </nav>

      <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
        {safeConv.from} to {safeConv.to} Converter
      </h1>
      <p className="mt-3 text-base text-muted-foreground">
        Convert {safeConv.fromUnit} to {safeConv.toUnit} instantly. Enter a value below.
      </p>

      {/* Interactive converter */}
      <div className="mt-8">
        <UnitConverterWidget conversion={safeConv} />
      </div>

      {/* Formula */}
      <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-foreground mb-3">Formula</h2>
        <div className="rounded-lg bg-muted/50 p-4 font-mono text-sm text-foreground">
          {safeConv.formula === 'multiply_add' && (
            <>{safeConv.toUnit} = ({safeConv.fromUnit} × {safeConv.multiply}) + {safeConv.add}</>
          )}
          {safeConv.formula === 'subtract_divide' && (
            <>{safeConv.toUnit} = ({safeConv.fromUnit} - {safeConv.subtract}) ÷ {safeConv.divide}</>
          )}
          {!safeConv.formula && (
            <>{safeConv.toUnit} = {safeConv.fromUnit} × {safeConv.factor}</>
          )}
        </div>
      </div>

      {/* Reference table */}
      <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          {safeConv.from} to {safeConv.to} table
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="py-2 pr-4 text-left text-xs font-medium text-muted-foreground">{safeConv.from} ({safeConv.fromUnit})</th>
                <th className="py-2 pl-4 text-left text-xs font-medium text-muted-foreground">{safeConv.to} ({safeConv.toUnit})</th>
              </tr>
            </thead>
            <tbody>
              {refValues.map((v) => (
                <tr key={v} className="border-b border-border/50">
                  <td className="py-2 pr-4 font-medium">{v} {safeConv.fromUnit}</td>
                  <td className="py-2 pl-4 text-muted-foreground">
                    {doConvert(v).toLocaleString('en-US', { maximumFractionDigits: 4 })} {safeConv.toUnit}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Related conversions */}
      {related.length > 0 && (
        <section className="mt-10 border-t border-border pt-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            More {safeConv.category} conversions
          </h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {related.map((r) => (
              <Link
                key={r.slug}
                href={`/unit-converter/${r.slug}`}
                className="rounded-lg border border-border bg-card p-3 text-sm transition-colors hover:bg-muted"
              >
                <span className="font-medium text-foreground">{r.from}</span>
                <span className="text-muted-foreground"> → </span>
                <span className="font-medium text-foreground">{r.to}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* All categories */}
      <section className="mt-10 border-t border-border pt-8">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          All unit converters
        </h2>
        {allCategories.map((cat) => (
          <div key={cat} className="mb-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">{cat}</h3>
            <div className="flex flex-wrap gap-2">
              {allConversions.filter((c) => c.category === cat).map((c) => (
                <Link
                  key={c.slug}
                  href={`/unit-converter/${c.slug}`}
                  className={`rounded-md border px-2.5 py-1 text-xs transition-colors ${
                    c.slug === slug
                      ? 'border-primary bg-primary/10 text-primary font-medium'
                      : 'border-border text-muted-foreground hover:border-primary/50'
                  }`}
                >
                  {c.fromUnit} → {c.toUnit}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
    </>
  )
}
