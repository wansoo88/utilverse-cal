import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import presets from '@/data/food-presets.json'
import { fToC, formatTime } from '@/lib/airfryer/conversions'
import type { FoodPreset } from '@/lib/airfryer/types'

const allPresets = presets as FoodPreset[]

// ── Category guide content ────────────────────────────────────────────────────
const CATEGORY_GUIDES: Record<string, string> = {
  Poultry: 'Poultry is one of the best foods to cook in an air fryer. The circulating hot air crisps the skin beautifully without added oil, while keeping the inside juicy — something that is surprisingly hard to achieve in a conventional oven without drying out the meat. The key is not overcrowding the basket: chicken pieces need space around them for the hot air to circulate on all sides. Always check that the thickest part reaches an internal temperature of 165°F (74°C) before serving. If the exterior is browning faster than the inside is cooking through, lower the temperature by 10–15°F and add a few minutes.',
  Meat: 'Meat cooks faster in an air fryer than in a conventional oven because the compact chamber delivers heat from all directions simultaneously. Thin cuts — like hamburgers, pork chops, or steak strips — are ideal for air frying. Thicker cuts benefit from a lower temperature to ensure even cooking without burning the outside before the center is done. For best results, bring the meat to room temperature before cooking, pat it dry so the surface browns instead of steams, and flip halfway through. Ground meat dishes like meatballs cook particularly well since the air crisps all sides evenly.',
  Seafood: 'Seafood is delicate and cooks quickly, making the air fryer an excellent choice for fish fillets, shrimp, and scallops. The high heat seals the exterior fast, locking in moisture and producing a light crust without deep frying. Most fish fillets are done in 8–12 minutes at 375–400°F — significantly faster than oven baking. The most common mistake with air-fried seafood is overcooking: fish is done when it flakes easily with a fork and reaches 145°F (63°C) internally. Shrimp are cooked when they turn pink and curl into a C shape. Avoid marinating seafood in acidic liquids (lemon juice, vinegar) for more than 15 minutes before air frying — it starts to chemically cook the protein.',
  Vegetables: 'Vegetables transform in an air fryer: the rapid airflow removes surface moisture and caramelizes natural sugars, producing edges that are crispy and slightly charred while the interior stays tender. This is the same Maillard reaction you get on a grill or in a very hot oven, but faster and with less oil — typically 1–2 teaspoons per portion is enough. Dense vegetables like carrots, broccoli, and Brussels sprouts need more time than thin or leafy ones. Cut vegetables into similar sizes for even cooking, and toss them with a light coating of oil and seasoning before cooking. Shake the basket halfway through to prevent sticking and ensure even browning.',
  Sides: 'Side dishes — from crispy fries to stuffed mushrooms to roasted corn — are where the air fryer really earns its place on the counter. The appliance excels at anything that benefits from a crispy exterior: french fries use up to 75% less oil than deep-frying while achieving comparable crunch. Frozen sides like onion rings, tater tots, and mozzarella sticks cook faster and crispier in an air fryer than in a conventional oven. For best results with starchy sides, do not crowd the basket — a single layer is critical. If you are cooking in batches, keep the first batch warm in a 200°F oven while the second batch cooks.',
  Frozen: 'Frozen foods are arguably the air fryer\'s strongest use case. The intense dry heat from all directions defrosts and cooks simultaneously, producing a crispy result that a microwave cannot match and matching — or exceeding — a conventional oven in a fraction of the time. Most frozen foods cook 25–40% faster in an air fryer. Do not thaw frozen items before air frying unless the recipe specifically calls for it — cooking from frozen gives better texture. There is no need to preheat for most frozen items, though preheating for 3 minutes can improve crispiness on items like frozen fries and nuggets. Always cook from frozen in a single layer for even results.',
}

export function generateStaticParams() {
  return allPresets
    .filter((p) => p.airFryer !== null)
    .map((p) => ({ slug: p.id }))
}

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const preset = allPresets.find((p) => p.id === slug)
  if (!preset) return {}
  return {
    title: `Air Fryer ${preset.name} — Time and Temperature`,
    description: `How to cook ${preset.name} in an air fryer: ${preset.airFryer?.tempF ?? 375}°F for ${formatTime(preset.airFryer?.timeMin ?? 15)}. Plus oven, convection, Instant Pot, and slow cooker settings.`,
    alternates: { canonical: `/air-fryer-calculator/${slug}` },
    openGraph: {
      title: `Air Fryer ${preset.name} — Time and Temperature`,
      description: `Cook ${preset.name} at ${preset.airFryer?.tempF ?? 375}°F for ${formatTime(preset.airFryer?.timeMin ?? 15)} in your air fryer.`,
    },
  }
}

export default async function FoodPage({ params }: Props) {
  const { slug } = await params
  const preset = allPresets.find((p) => p.id === slug)
  if (!preset || !preset.airFryer) notFound()

  const categoryGuide = CATEGORY_GUIDES[preset.category] ?? null

  const related = allPresets
    .filter((p) => p.id !== slug && p.category === preset.category && p.airFryer)
    .slice(0, 4)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What temperature do you cook ${preset.name} in an air fryer?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Cook ${preset.name} in an air fryer at ${preset.airFryer.tempF}°F (${fToC(preset.airFryer.tempF)}°C) for ${formatTime(preset.airFryer.timeMin)}.`,
        },
      },
      {
        '@type': 'Question',
        name: `How long to cook ${preset.name} in an air fryer?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${preset.name} takes about ${formatTime(preset.airFryer.timeMin)} in an air fryer at ${preset.airFryer.tempF}°F. This is about ${Math.round((1 - preset.airFryer.timeMin / preset.conventionalOven.timeMin) * 100)}% faster than a conventional oven.`,
        },
      },
      {
        '@type': 'Question',
        name: `What is the oven equivalent for air fryer ${preset.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `In a conventional oven, cook ${preset.name} at ${preset.conventionalOven.tempF}°F for ${formatTime(preset.conventionalOven.timeMin)}.`,
        },
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <nav className="mb-6 text-sm text-muted-foreground">
          <Link href="/air-fryer-calculator" className="hover:text-foreground">
            Air Fryer Calculator
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{preset.name}</span>
        </nav>

        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          {preset.icon} Air Fryer {preset.name}
        </h1>
        <p className="mt-3 text-base text-muted-foreground">
          The quick answer: set your air fryer to{' '}
          <strong className="text-foreground">{preset.airFryer.tempF}°F</strong>{' '}
          ({fToC(preset.airFryer.tempF)}°C) for{' '}
          <strong className="text-foreground">
            {formatTime(preset.airFryer.timeMin)}
          </strong>
          .
        </p>

        {/* Hero result card */}
        <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">Temperature</p>
              <p className="text-4xl font-bold gradient-text">
                {preset.airFryer.tempF}°F
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {fToC(preset.airFryer.tempF)}°C
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Time</p>
              <p className="text-4xl font-bold text-foreground">
                {formatTime(preset.airFryer.timeMin)}
              </p>
              <p className="text-sm text-secondary mt-1">
                {Math.round(
                  (1 - preset.airFryer.timeMin / preset.conventionalOven.timeMin) * 100
                )}
                % faster than oven
              </p>
            </div>
          </div>
        </div>

        {/* All methods table */}
        <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            All cooking methods for {preset.name}
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-2 pr-4 text-left text-xs font-medium text-muted-foreground">Method</th>
                  <th className="py-2 px-4 text-left text-xs font-medium text-muted-foreground">Temp</th>
                  <th className="py-2 px-4 text-left text-xs font-medium text-muted-foreground">Time</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/50 bg-primary/5">
                  <td className="py-2.5 pr-4 font-medium">💨 Air Fryer</td>
                  <td className="py-2.5 px-4">{preset.airFryer.tempF}°F / {fToC(preset.airFryer.tempF)}°C</td>
                  <td className="py-2.5 px-4">{formatTime(preset.airFryer.timeMin)}</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2.5 pr-4 font-medium">🔥 Oven</td>
                  <td className="py-2.5 px-4">{preset.conventionalOven.tempF}°F / {fToC(preset.conventionalOven.tempF)}°C</td>
                  <td className="py-2.5 px-4">{formatTime(preset.conventionalOven.timeMin)}</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2.5 pr-4 font-medium">🌀 Convection</td>
                  <td className="py-2.5 px-4">{preset.convectionOven.tempF}°F / {fToC(preset.convectionOven.tempF)}°C</td>
                  <td className="py-2.5 px-4">{formatTime(preset.convectionOven.timeMin)}</td>
                </tr>
                {preset.instantPot && (
                  <tr className="border-b border-border/50">
                    <td className="py-2.5 pr-4 font-medium">⚡ Instant Pot</td>
                    <td className="py-2.5 px-4 text-muted-foreground">{preset.instantPot.mode}</td>
                    <td className="py-2.5 px-4">{formatTime(preset.instantPot.timeMin)}</td>
                  </tr>
                )}
                {preset.slowCooker && (
                  <tr>
                    <td className="py-2.5 pr-4 font-medium">🍲 Slow Cooker</td>
                    <td className="py-2.5 px-4 text-muted-foreground">On {preset.slowCooker.setting}</td>
                    <td className="py-2.5 px-4">{formatTime(preset.slowCooker.timeMin)}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tips */}
        {preset.tips.length > 0 && (
          <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-foreground mb-3">
              Tips for air frying {preset.name}
            </h2>
            <ul className="space-y-2">
              {preset.tips.map((tip, i) => (
                <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                  <span className="shrink-0 text-primary">•</span> {tip}
                </li>
              ))}
              <li className="flex gap-2 text-sm text-muted-foreground">
                <span className="shrink-0 text-primary">•</span> Preheat your air fryer for 3-5 minutes before cooking.
              </li>
              <li className="flex gap-2 text-sm text-muted-foreground">
                <span className="shrink-0 text-primary">•</span> Do not overcrowd the basket — leave space for air circulation.
              </li>
            </ul>
          </div>
        )}

        {/* FAQ */}
        <section className="mt-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">FAQ</h2>
          <div className="space-y-3">
            {jsonLd.mainEntity.map((faq, i) => (
              <details key={i} className="group rounded-xl border border-border bg-card px-5 py-4">
                <summary className="cursor-pointer list-none flex items-center justify-between gap-4 font-medium text-foreground text-sm">
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

        {/* Category guide */}
        {categoryGuide && (
          <section className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-foreground mb-3">
              Air frying {preset.category.toLowerCase()}: what you need to know
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{categoryGuide}</p>
          </section>
        )}

        {/* Related foods */}
        {related.length > 0 && (
          <section className="mt-10 border-t border-border pt-8">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              More {preset.category} recipes
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {related.map((r) => (
                <Link
                  key={r.id}
                  href={`/air-fryer-calculator/${r.id}`}
                  className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-muted"
                >
                  <span className="text-2xl">{r.icon}</span>
                  <div>
                    <p className="text-sm font-medium text-foreground">{r.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {r.airFryer!.tempF}°F · {formatTime(r.airFryer!.timeMin)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <div className="mt-10 text-center">
          <Link
            href="/air-fryer-calculator"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            ← Back to Air Fryer Calculator
          </Link>
        </div>
      </div>
    </>
  )
}
