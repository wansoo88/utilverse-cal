import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of service for cal.utilverse.info.',
  alternates: { canonical: '/terms' },
}

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight">Terms of Service</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: May 2026</p>

      <div className="mt-8 space-y-6 text-base text-muted-foreground leading-relaxed">
        <p>
          By using cal.utilverse.info, you agree to these terms. If you don&apos;t agree, please don&apos;t
          use the site.
        </p>

        <h2 className="text-xl font-semibold text-foreground pt-2">Accuracy disclaimer</h2>
        <p>
          All calculators on cal.utilverse.info provide estimates based on publicly available data.
          Results are for informational purposes only and should not be used as the sole basis
          for financial, purchasing, or engineering decisions. Actual costs may vary based on
          your specific vehicle, local utility rates, driving habits, and other factors.
        </p>
        <p>
          We make reasonable efforts to keep data current, but we cannot guarantee that all
          information is accurate, complete, or up to date. Always verify important figures
          with your utility provider, vehicle manufacturer, or other authoritative sources.
        </p>

        <h2 className="text-xl font-semibold text-foreground pt-2">Permitted use</h2>
        <p>
          You may use cal.utilverse.info for personal, non-commercial purposes. You may share
          links to our tools freely. You may not:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Scrape or systematically download content from the site</li>
          <li>Reproduce or redistribute our tools or content without permission</li>
          <li>Use the site in any way that could damage, disable, or impair it</li>
          <li>Attempt to gain unauthorized access to any part of the site</li>
        </ul>

        <h2 className="text-xl font-semibold text-foreground pt-2">Intellectual property</h2>
        <p>
          The content, design, and code of cal.utilverse.info are owned by utilverse. Data sourced
          from government agencies (EIA.gov, EPA, fueleconomy.gov) is in the public domain.
          Third-party data (Open Charge Map, OpenStreetMap) is used under their respective
          open licenses.
        </p>

        <h2 className="text-xl font-semibold text-foreground pt-2">Limitation of liability</h2>
        <p>
          cal.utilverse.info is provided &quot;as is&quot; without warranties of any kind. We are not liable
          for any damages arising from your use of the site or reliance on its calculations.
          This includes but is not limited to financial losses, vehicle purchase decisions,
          or energy contract decisions.
        </p>

        <h2 className="text-xl font-semibold text-foreground pt-2">External links</h2>
        <p>
          Our site may link to external websites. We are not responsible for the content or
          privacy practices of those sites.
        </p>

        <h2 className="text-xl font-semibold text-foreground pt-2">Changes to these terms</h2>
        <p>
          We may update these terms at any time. The date at the top reflects the most recent
          revision. Continued use of the site constitutes acceptance of updated terms.
        </p>

        <h2 className="text-xl font-semibold text-foreground pt-2">Contact</h2>
        <p>
          Questions about these terms? Use our{' '}
          <a href="/contact" className="text-primary underline underline-offset-2">contact form</a>.
        </p>
      </div>
    </div>
  )
}
