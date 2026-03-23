import Link from 'next/link'

interface AffiliateProduct {
  title: string
  description: string
  price: string
  url: string
  badge?: string
}

interface AffiliateSectionProps {
  heading: string
  products: AffiliateProduct[]
}

export function AffiliateSection({ heading, products }: AffiliateSectionProps) {
  return (
    <section className="mt-12 border-t border-border pt-10">
      <div className="flex items-center gap-2 mb-1">
        <h2 className="text-lg font-semibold text-foreground">{heading}</h2>
        <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
          Affiliate links
        </span>
      </div>
      <p className="text-xs text-muted-foreground mb-5">
        We may earn a small commission if you buy through these links — at no extra cost to you.
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <Link
            key={p.url}
            href={p.url}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="group flex flex-col rounded-xl border border-border bg-card p-4 transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            {p.badge && (
              <span className="mb-2 self-start rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                {p.badge}
              </span>
            )}
            <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
              {p.title}
            </p>
            <p className="mt-1 flex-1 text-xs text-muted-foreground leading-relaxed">
              {p.description}
            </p>
            <p className="mt-3 text-sm font-semibold text-foreground">{p.price}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}

// ─── Pre-built product sets ───────────────────────────────────────────────────

export const EV_CHARGER_PRODUCTS: AffiliateProduct[] = [
  {
    title: 'ChargePoint Home Flex (Level 2, 50A)',
    description: 'The most popular home EV charger. Up to 37 miles of range per hour. Works with all EVs.',
    price: 'From $699',
    url: 'https://www.amazon.com/dp/B07WFKN3HN?tag=utilverse-20',
    badge: 'Best Seller',
  },
  {
    title: 'Grizzl-E Level 2 EV Charger (40A)',
    description: 'Rugged, weatherproof Level 2 charger. 40A / 9.6kW. Great value for the price.',
    price: 'From $299',
    url: 'https://www.amazon.com/dp/B08CXNLB5G?tag=utilverse-20',
  },
  {
    title: 'Wallbox Pulsar Plus (Level 2, 48A)',
    description: 'Smart home charger with app control, scheduling, and energy monitoring.',
    price: 'From $649',
    url: 'https://www.amazon.com/dp/B08CXNLB5G?tag=utilverse-20',
    badge: 'Smart Charging',
  },
]

export const FILAMENT_PRODUCTS: AffiliateProduct[] = [
  {
    title: 'Hatchbox PLA 1.75mm (1kg)',
    description: 'The most popular PLA filament. Consistent diameter, minimal stringing, great for beginners.',
    price: 'From $22',
    url: 'https://www.amazon.com/dp/B00J0GMMP6?tag=utilverse-20',
    badge: 'Best Seller',
  },
  {
    title: 'eSUN PETG 1.75mm (1kg)',
    description: 'Strong, flexible, and food-safe. Great for functional parts that need durability.',
    price: 'From $24',
    url: 'https://www.amazon.com/dp/B07PGYHYV8?tag=utilverse-20',
  },
  {
    title: 'Polymaker PolyLite ABS (1kg)',
    description: 'Low-warp ABS with excellent layer adhesion. Good for heat-resistant parts.',
    price: 'From $26',
    url: 'https://www.amazon.com/dp/B07PGYHYV8?tag=utilverse-20',
  },
]
