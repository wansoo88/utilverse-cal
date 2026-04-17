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

// ── Category guide content ────────────────────────────────────────────────────
const CATEGORY_CONTENT: Record<string, {
  guide: string[]
  faqs: { q: string; a: string }[]
}> = {
  Weight: {
    guide: [
      'Weight conversions are essential in cooking, shipping, medicine, and international commerce. The metric system uses kilograms and grams as its base units, while the US customary system uses pounds and ounces. Most of the world — including all scientific fields — uses the metric system, so familiarity with both is a practical skill.',
      'In the kitchen, European and Australian recipes list ingredients in grams while American recipes use ounces and cups. When shipping packages internationally, weight limits are stated in kilograms even if domestic carriers use pounds. Medical dosages and nutrition labels worldwide use metric units. For fitness, international weightlifting standards use kilograms, while most US gym equipment is labeled in pounds.',
      'The key conversion to memorize: 1 kilogram = 2.2046 pounds. For smaller amounts, 1 gram = 0.03527 ounces. When precision matters — such as in baking or pharmacy — the metric system is more practical because it uses simple multiples of 10 rather than fractional ounces.',
    ],
    faqs: [
      {
        q: 'How many pounds is 1 kilogram?',
        a: '1 kilogram equals 2.2046 pounds. A quick approximation: multiply kilograms by 2.2 to get pounds. For example, a 70 kg person weighs approximately 154 pounds.',
      },
      {
        q: 'What is the difference between mass and weight?',
        a: 'Mass is the amount of matter in an object (measured in kg or lb) and stays constant everywhere. Weight is the force of gravity on that mass, which varies slightly by location. In everyday use, the terms are used interchangeably since we all live where gravity is nearly constant.',
      },
      {
        q: 'How do I convert grams to ounces for cooking?',
        a: 'Multiply grams by 0.03527 to get ounces. For quick kitchen math: 28 grams ≈ 1 ounce, 100 grams ≈ 3.5 ounces, 250 grams ≈ 8.8 ounces. Most digital kitchen scales let you switch between grams and ounces with a single button.',
      },
    ],
  },
  Length: {
    guide: [
      'Length conversions bridge the metric system (meters, centimeters, kilometers) used by most of the world and the US customary system (feet, inches, miles). While the US remains one of the few countries using the imperial system in daily life, metric measurements dominate science, medicine, and international trade.',
      'In everyday life, length conversions come up when following foreign assembly instructions, checking your height for a visa application, or reading international product dimensions. A 15.6-inch laptop screen is 39.6 cm. A standard US interior door (80 inches tall) is 203 cm. Athletes often train with both systems — a 100-meter sprint is about 109 yards.',
      'For travel, road signs switch from miles to kilometers (or vice versa) at international borders. The key relationship: 1 mile = 1.60934 kilometers. For shorter distances, 1 inch = 2.54 centimeters exactly — this is the legally defined conversion that all other length conversions derive from.',
    ],
    faqs: [
      {
        q: 'How many centimeters are in an inch?',
        a: 'Exactly 2.54 centimeters equal 1 inch. This is a defined value, not an approximation. So 1 foot (12 inches) = 30.48 cm, and 1 yard (36 inches) = 91.44 cm.',
      },
      {
        q: 'How do I convert my height from feet and inches to centimeters?',
        a: 'Multiply total inches by 2.54. First convert feet to inches (multiply feet by 12), add the remaining inches, then multiply the total by 2.54. Example: 5 feet 10 inches = 70 inches × 2.54 = 177.8 cm.',
      },
      {
        q: 'What is the difference between a mile and a kilometer?',
        a: '1 mile equals 1.60934 kilometers. A quick approximation: divide miles by 0.62 to get kilometers, or multiply kilometers by 0.62 to get miles. A 5K race is 3.1 miles. A 10K is 6.2 miles.',
      },
    ],
  },
  Temperature: {
    guide: [
      'Temperature conversions are critical for cooking, travel, and understanding weather forecasts. The Fahrenheit scale is used primarily in the United States, while Celsius (the metric standard) is used by nearly every other country and all scientific fields. The Kelvin scale, starting at absolute zero (−273.15°C), is used in physics and chemistry.',
      'In cooking, the difference matters enormously. A European recipe calling for 180°C translates to 356°F — not 180°F, which would barely warm food. When traveling internationally, a weather forecast of 30°C sounds extreme but is just 86°F — a warm summer day. Body temperature is 37°C (98.6°F); a fever starts around 38°C (100.4°F).',
      'The conversion formulas: to convert Fahrenheit to Celsius, subtract 32 then multiply by 5/9. To go the other way, multiply Celsius by 9/5 then add 32. A useful anchor point: water freezes at 0°C (32°F) and boils at 100°C (212°F) at sea level.',
    ],
    faqs: [
      {
        q: 'What is the formula to convert Fahrenheit to Celsius?',
        a: 'Subtract 32 from the Fahrenheit temperature, then multiply by 5/9. Formula: °C = (°F − 32) × 5/9. Example: 72°F → (72 − 32) × 5/9 = 40 × 0.556 = 22.2°C.',
      },
      {
        q: 'What temperature is the same in both Fahrenheit and Celsius?',
        a: '−40 degrees is the same in both Fahrenheit and Celsius. This is the point where the two scales intersect. Below −40, Celsius is numerically lower; above −40, Fahrenheit is numerically higher.',
      },
      {
        q: 'What is a normal oven temperature in Celsius?',
        a: 'Most baking is done between 150°C and 230°C (300°F to 450°F). Common settings: low heat = 150°C (300°F), moderate = 180°C (356°F), moderately hot = 200°C (392°F), hot oven = 220°C (428°F).',
      },
    ],
  },
  Volume: {
    guide: [
      'Volume conversions are used daily in cooking, chemistry, medicine, and fuel measurement. The US system uses fluid ounces, cups, pints, quarts, and gallons — while the metric system works with milliliters and liters. Mixing up these systems in a recipe can produce seriously wrong results.',
      'In cooking, US recipes use cups and tablespoons while European and Australian recipes use milliliters and grams. Key cooking conversions: 1 cup = 236.6 mL, 1 tablespoon = 14.79 mL, 1 teaspoon = 4.93 mL. When buying beverages internationally, a standard 1-liter bottle holds 33.8 fluid ounces — slightly more than a US quart (32 oz). Medicines are always measured metrically: liquid doses in mL, IV bags in liters.',
      'For fuel economy comparisons between US and international cars, volume conversion is essential. 1 US gallon = 3.785 liters. Note that the US gallon and UK imperial gallon are different — the UK gallon is about 20% larger at 4.546 liters, so fuel prices per gallon cannot be directly compared.',
    ],
    faqs: [
      {
        q: 'How many milliliters are in a cup?',
        a: 'One US cup equals 236.588 milliliters (approximately 237 mL). There are 8 fluid ounces in a cup, and 1 fluid ounce = 29.574 mL. Note: an Australian or Canadian "metric cup" is exactly 250 mL, slightly larger than the US cup.',
      },
      {
        q: 'How many liters is a gallon?',
        a: 'One US liquid gallon equals 3.785 liters. The UK imperial gallon is larger at 4.546 liters. To convert US gallons to liters, multiply by 3.785. A 5-gallon water jug = 18.9 liters.',
      },
      {
        q: 'How do I convert fluid ounces to milliliters?',
        a: 'Multiply fluid ounces by 29.574 to get milliliters. Quick reference: 1 oz ≈ 30 mL, 8 oz = 237 mL (1 cup), 16 oz = 473 mL (1 pint), 32 oz = 946 mL (1 quart). Reverse: multiply mL by 0.0338 to get fluid ounces.',
      },
    ],
  },
  Speed: {
    guide: [
      'Speed conversions are essential for international driving, sports performance, and weather reporting. The US measures speed in miles per hour (mph), while virtually all other countries use kilometers per hour (km/h). This creates real practical issues when renting a car abroad, reading foreign vehicle specifications, or checking wind speeds.',
      'On the road, a speed limit sign of 100 km/h in Canada, Europe, or Australia means roughly 62 mph — comparable to a US interstate. In motorsport, Formula 1 cars reach over 350 km/h (217 mph). Commercial aircraft cruise at around 900 km/h (560 mph) or approximately 485 knots. In meteorology, wind speeds may be reported in knots, km/h, or mph depending on the country.',
      '1 knot = 1 nautical mile per hour = 1.852 km/h = 1.151 mph. For quick estimation: multiply km/h by 0.621 to get mph, or multiply mph by 1.609 to get km/h. In scientific contexts, speed is often expressed in meters per second (m/s): 1 m/s = 3.6 km/h = 2.237 mph.',
    ],
    faqs: [
      {
        q: 'How do I convert km/h to mph?',
        a: 'Multiply km/h by 0.6214 to get mph. Quick approximation: multiply by 0.62. Example: 100 km/h × 0.6214 = 62.14 mph. Alternatively, divide km/h by 1.609 for the same result.',
      },
      {
        q: 'What is 60 mph in kilometers per hour?',
        a: '60 mph equals 96.56 km/h. To convert mph to km/h, multiply by 1.60934. Common references: 65 mph = 105 km/h, 70 mph = 113 km/h, 80 mph = 129 km/h.',
      },
      {
        q: 'What is a knot in terms of mph?',
        a: '1 knot = 1.151 mph = 1.852 km/h. Knots measure nautical miles per hour and are the standard in aviation and maritime navigation. A commercial aircraft at 500 knots is traveling about 575 mph or 926 km/h.',
      },
    ],
  },
  Area: {
    guide: [
      'Area conversions matter in real estate, agriculture, construction, and mapping. Square footage (sq ft) dominates US real estate listings, while the rest of the world uses square meters (m²). This trips up international buyers comparing property sizes: 100 m² equals 1,076 sq ft — so a "1,000 sq ft apartment" in the US is just 92.9 m², which sounds small in European terms.',
      'In agriculture, US farmers use acres while international farming uses hectares. 1 hectare = 2.471 acres = 10,000 square meters. A standard American football field including end zones is about 0.537 hectares (1.32 acres). For very large areas like national parks or countries, the units switch to square miles or square kilometers — 1 square mile = 2.59 km².',
      'For home improvement, knowing area conversions helps estimate paint, flooring, and tile coverage. Paint typically covers 350–400 sq ft per gallon (33–37 m² per 3.79 L). Flooring specs may list coverage in either system depending on where the product is manufactured.',
    ],
    faqs: [
      {
        q: 'How many square feet are in a square meter?',
        a: '1 square meter equals 10.764 square feet. To convert m² to sq ft, multiply by 10.764. To convert sq ft to m², divide by 10.764 (or multiply by 0.0929). Example: a 500 sq ft studio apartment = 46.5 m².',
      },
      {
        q: 'How many acres is a hectare?',
        a: '1 hectare equals 2.471 acres. A hectare is 10,000 square meters (a 100 m × 100 m square). To convert hectares to acres, multiply by 2.471. To go from acres to hectares, multiply by 0.4047. A 10-acre property = 4.05 hectares.',
      },
      {
        q: 'How do I calculate a room\'s area in both square feet and square meters?',
        a: 'Measure length and width in feet, multiply to get square feet, then divide by 10.764 for square meters. Example: a 12 ft × 15 ft room = 180 sq ft = 16.7 m². Or measure in meters, multiply for m², then multiply by 10.764 for sq ft.',
      },
    ],
  },
}

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
    description: `Convert ${safeConv.from} to ${safeConv.to} instantly. Free ${safeConv.fromUnit} to ${safeConv.toUnit} calculator with formula, reference table, and real-world context.`,
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
  const categoryContent = CATEGORY_CONTENT[safeConv.category]

  const related = allConversions
    .filter((c) => c.slug !== slug && c.category === safeConv.category)
    .slice(0, 6)

  const allCategories = Array.from(new Set(allConversions.map((c) => c.category)))

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

  const faqJsonLd = categoryContent ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: categoryContent.faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  } : null

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {faqJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      )}
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
              <>{safeConv.toUnit} = ({safeConv.fromUnit} − {safeConv.subtract}) ÷ {safeConv.divide}</>
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

        {/* Category guide */}
        {categoryContent && (
          <section className="mt-10 border-t border-border pt-8">
            <h2 className="text-xl font-semibold text-foreground mb-5">
              About {safeConv.category} conversions
            </h2>
            <div className="space-y-4 text-base text-muted-foreground leading-relaxed">
              {categoryContent.guide.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </section>
        )}

        {/* FAQ */}
        {categoryContent && (
          <section className="mt-10">
            <h2 className="text-xl font-semibold text-foreground mb-5">
              Frequently asked questions
            </h2>
            <div className="space-y-3">
              {categoryContent.faqs.map((faq, i) => (
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
        )}

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
