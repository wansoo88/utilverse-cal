import Link from 'next/link'
import { Zap, ChefHat, Printer } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6 lg:px-8">
      <div className="text-6xl font-bold gradient-text">404</div>
      <h1 className="mt-4 text-2xl font-semibold text-foreground">Page not found</h1>
      <p className="mt-3 text-muted-foreground">
        This page doesn&apos;t exist. Maybe try one of our calculators?
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {[
          { href: '/ev-charging-cost-calculator', icon: Zap, label: 'EV Charging' },
          { href: '/air-fryer-calculator', icon: ChefHat, label: 'Air Fryer' },
          { href: '/3d-printing-cost-calculator', icon: Printer, label: '3D Printing' },
        ].map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-4 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            <tool.icon className="h-4 w-4 text-primary" />
            {tool.label}
          </Link>
        ))}
      </div>

      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 text-sm text-primary underline underline-offset-2"
      >
        ← Back to home
      </Link>
    </div>
  )
}
