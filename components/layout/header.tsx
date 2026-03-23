'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, Zap, ChefHat, Printer, Calculator, Ruler, Car } from 'lucide-react'
import { ThemeToggle } from './theme-toggle'

const tools = [
  {
    href: '/ev-charging-cost-calculator',
    icon: Zap,
    label: 'EV Charging Calculator',
    desc: 'Calculate your monthly EV charging cost',
  },
  {
    href: '/ev-vs-gas-calculator',
    icon: Car,
    label: 'EV vs Gas Calculator',
    desc: 'Compare 5–10 year total cost of ownership',
  },
  {
    href: '/air-fryer-calculator',
    icon: ChefHat,
    label: 'Air Fryer Calculator',
    desc: 'Convert oven recipes for air fryer',
  },
  {
    href: '/3d-printing-cost-calculator',
    icon: Printer,
    label: '3D Printing Calculator',
    desc: 'Estimate your 3D print costs',
  },
  {
    href: '/unit-converter',
    icon: Ruler,
    label: 'Unit Converter',
    desc: 'Convert weight, length, temperature & more',
  },
]

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [toolsOpen, setToolsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold tracking-tight"
          onClick={() => setMobileOpen(false)}
        >
          <span className="gradient-text">utilverse</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          <div className="relative">
            <button
              onMouseEnter={() => setToolsOpen(true)}
              onMouseLeave={() => setToolsOpen(false)}
              className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Calculator className="h-4 w-4" />
              Tools
              <svg className="h-3 w-3 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {toolsOpen && (
              <div
                onMouseEnter={() => setToolsOpen(true)}
                onMouseLeave={() => setToolsOpen(false)}
                className="absolute left-0 top-full mt-1 w-72 rounded-xl border border-border bg-card p-2 shadow-lg"
              >
                {tools.map((tool) => (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    className="flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-muted"
                    onClick={() => setToolsOpen(false)}
                  >
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <tool.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-foreground">{tool.label}</div>
                      <div className="text-xs text-muted-foreground">{tool.desc}</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/about"
            className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            Contact
          </Link>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border bg-background md:hidden">
          <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
            <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Tools
            </div>
            {tools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="flex items-center gap-3 rounded-lg px-3 py-3 transition-colors hover:bg-muted"
                onClick={() => setMobileOpen(false)}
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <tool.icon className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium">{tool.label}</span>
              </Link>
            ))}
            <div className="mt-3 border-t border-border pt-3">
              <Link
                href="/about"
                className="block rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                onClick={() => setMobileOpen(false)}
              >
                About
              </Link>
              <Link
                href="/contact"
                className="block rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                onClick={() => setMobileOpen(false)}
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
