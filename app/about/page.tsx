import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About utilverse',
  description:
    'Free, accurate online calculators built with real public data from EIA.gov, EPA, and fueleconomy.gov.',
  alternates: { canonical: '/about' },
}

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'utilverse',
  url: 'https://cal.utilverse.info',
  description: 'Free, accurate online calculators built with real public data from EIA.gov, EPA, and fueleconomy.gov.',
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer support',
    url: 'https://cal.utilverse.info/contact',
  },
}

export default function AboutPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight">About utilverse</h1>
      <div className="mt-8 space-y-6 text-base text-muted-foreground leading-relaxed">
        <p>
          utilverse started with a simple frustration: most online calculators
          are either buried inside corporate websites with an agenda, or so
          basic they are barely useful. We wanted something different - tools
          that are genuinely helpful, built with real data, and free to use
          without signing up or sitting through ads.
        </p>
        <p>
          Every calculator on utilverse is built around a specific question
          people actually search for. How much does it cost to charge my EV?
          What temperature should I set my air fryer? How much will this 3D
          print actually cost me? We take those questions seriously and give you
          a real answer, not a ballpark.
        </p>

        <h2 className="text-xl font-semibold text-foreground pt-2">
          Where the data comes from
        </h2>
        <p>
          All data comes from publicly available government and research
          sources:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            Electricity rates - U.S. Energy Information Administration
            (EIA.gov), Eurostat, and national energy regulators
          </li>
          <li>
            EV vehicle specs - U.S. Department of Energy (fueleconomy.gov) and
            WLTP official data
          </li>
          <li>CO2 emissions - EPA eGRID regional grid emission factors</li>
          <li>
            EV charging station locations - Open Charge Map
            (openchargemap.org)
          </li>
        </ul>
        <p>
          We update data regularly. If you spot something that looks off,
          please{' '}
          <a
            href="/contact"
            className="text-primary underline underline-offset-2"
          >
            let us know
          </a>
          .
        </p>

        <h2 className="text-xl font-semibold text-foreground pt-2">
          Who runs this
        </h2>
        <p>
          utilverse is a one-person project. No VC funding, no team of 50, no
          corporate agenda. Just someone who wanted better tools and decided to
          build them. The site is free to use and supported by non-intrusive
          advertising once we qualify for it.
        </p>

        <h2 className="text-xl font-semibold text-foreground pt-2">
          Get in touch
        </h2>
        <p>
          Questions, feedback, or data corrections? Use the{' '}
          <a
            href="/contact"
            className="text-primary underline underline-offset-2"
          >
            contact form
          </a>
          . We typically respond within 48 hours.
        </p>
      </div>
    </div>
    </>
  )
}
