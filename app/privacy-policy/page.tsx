import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for cal.utilverse.info — how we collect and use data.',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: March 2026</p>

      <div className="mt-8 space-y-6 text-base text-muted-foreground leading-relaxed">
        <p>
          This privacy policy explains how cal.utilverse.info collects, uses, and protects information
          when you use our website. We keep it simple because we don&apos;t collect much.
        </p>

        <h2 className="text-xl font-semibold text-foreground pt-2">What we collect</h2>
        <p>
          We use Google Analytics 4 to understand how people use the site — which pages are visited,
          how long people stay, and what devices they use. This data is aggregated and anonymous.
          We do not collect names, email addresses, or any personally identifiable information
          unless you voluntarily submit them through our contact form.
        </p>
        <p>
          When you use our contact form (powered by Formspree), your name, email address, and
          message are transmitted to Formspree and forwarded to us. We use this information only
          to respond to your inquiry.
        </p>

        <h2 className="text-xl font-semibold text-foreground pt-2">Cookies</h2>
        <p>
          We use cookies for analytics (Google Analytics 4) and, once approved, for advertising
          (Google AdSense). Analytics cookies help us understand site usage. Advertising cookies
          may be used to show relevant ads. You can opt out of Google Analytics tracking by using
          the{' '}
          <a
            href="https://tools.google.com/dlpage/gaoptout"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline underline-offset-2"
          >
            Google Analytics Opt-out Browser Add-on
          </a>
          .
        </p>

        <h2 className="text-xl font-semibold text-foreground pt-2">Third-party services</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Google Analytics 4 — usage analytics</li>
          <li>Google AdSense — advertising (pending approval)</li>
          <li>Formspree — contact form processing</li>
          <li>Open Charge Map API — EV charging station data</li>
          <li>OpenStreetMap — map tiles</li>
          <li>Vercel — website hosting</li>
        </ul>
        <p>Each of these services has its own privacy policy governing their data practices.</p>

        <h2 className="text-xl font-semibold text-foreground pt-2">GDPR (EU users)</h2>
        <p>
          If you are located in the European Union, you have the right to access, correct, or
          delete any personal data we hold about you. Since we collect minimal personal data,
          this primarily applies to contact form submissions. To exercise these rights, contact
          us using the form on our{' '}
          <a href="/contact" className="text-primary underline underline-offset-2">contact page</a>.
        </p>

        <h2 className="text-xl font-semibold text-foreground pt-2">CCPA (California users)</h2>
        <p>
          California residents have the right to know what personal information is collected,
          to request deletion, and to opt out of the sale of personal information. We do not
          sell personal information. For any requests, use our contact form.
        </p>

        <h2 className="text-xl font-semibold text-foreground pt-2">Changes to this policy</h2>
        <p>
          We may update this policy occasionally. The date at the top of this page reflects
          the most recent revision. Continued use of the site after changes constitutes
          acceptance of the updated policy.
        </p>

        <h2 className="text-xl font-semibold text-foreground pt-2">Contact</h2>
        <p>
          Questions about this privacy policy? Use our{' '}
          <a href="/contact" className="text-primary underline underline-offset-2">contact form</a>.
        </p>
      </div>
    </div>
  )
}
