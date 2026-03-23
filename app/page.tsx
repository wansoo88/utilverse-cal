import Link from 'next/link'
import { Zap, ChefHat, Printer, Ruler, Car, ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'utilverse — Free Online Calculators & Tools',
  description:
    'Free, accurate online calculators for EV charging costs, air fryer conversions, 3D printing costs, and more. Built with real data from EIA.gov, EPA, and fueleconomy.gov.',
}

const tools = [
  {
    href: '/ev-charging-cost-calculator',
    icon: Zap,
    label: 'EV Charging Cost Calculator',
    desc: 'Find out exactly how much it costs to charge your electric car — by vehicle, location, and charging habits. Includes a live map of nearby charging stations.',
    badge: 'Popular',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
  },
  {
    href: '/ev-vs-gas-calculator',
    icon: Car,
    label: 'EV vs Gas Cost Calculator',
    desc: 'Compare the true 5 or 10-year total cost of owning an EV vs a gas car. Includes purchase price, fuel, maintenance, insurance, and tax credits.',
    badge: 'New',
    color: 'text-sky-500',
    bg: 'bg-sky-500/10',
  },
  {
    href: '/air-fryer-calculator',
    icon: ChefHat,
    label: 'Air Fryer Conversion Calculator',
    desc: 'Convert any oven recipe for your air fryer in seconds. Supports 5-way conversion between oven, air fryer, convection oven, Instant Pot, and slow cooker.',
    badge: null,
    color: 'text-orange-500',
    bg: 'bg-orange-500/10',
  },
  {
    href: '/3d-printing-cost-calculator',
    icon: Printer,
    label: '3D Printing Cost Calculator',
    desc: 'Estimate the real cost of any 3D print — filament, electricity, printer depreciation, and failure margin. Get a suggested selling price too.',
    badge: null,
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
  },
  {
    href: '/unit-converter',
    icon: Ruler,
    label: 'Unit Converter',
    desc: 'Convert weight, length, temperature, volume, speed, and area units instantly. 60+ conversions with formulas and reference tables.',
    badge: null,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
  },
]

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-background via-background to-primary/5 py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
              Free forever. No sign-up required.
            </div>
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              Free Online{' '}
              <span className="gradient-text">Calculators</span>{' '}
              & Tools
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              Accurate, fast, and beautifully simple. Built with real data from
              government sources — no ads until we earn them.
            </p>
          </div>
        </div>
      </section>

      {/* Tools grid */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="group relative flex flex-col rounded-xl border border-border bg-card p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
              >
                {tool.badge && (
                  <span className="absolute right-4 top-4 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                    {tool.badge}
                  </span>
                )}
                <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${tool.bg} ${tool.color}`}>
                  <tool.icon className="h-6 w-6" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">{tool.label}</h2>
                <p className="mt-2 flex-1 text-sm text-muted-foreground leading-relaxed">
                  {tool.desc}
                </p>
                <div className={`mt-4 flex items-center gap-1 text-sm font-medium ${tool.color}`}>
                  Try it free
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trust section */}
      <section className="border-t border-border bg-muted/30 py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-muted-foreground">
            Data sourced from{' '}
            <a href="https://www.eia.gov" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-foreground">
              EIA.gov
            </a>
            ,{' '}
            <a href="https://www.fueleconomy.gov" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-foreground">
              fueleconomy.gov
            </a>
            , and{' '}
            <a href="https://www.epa.gov" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-foreground">
              EPA.gov
            </a>
            . Updated regularly.
          </p>
        </div>
      </section>
    </>
  )
}
