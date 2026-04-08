import type { Metadata } from 'next'
import { ContactForm } from './contact-form'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with the utilverse team. Questions, feedback, data corrections, or partnership inquiries welcome.',
  alternates: { canonical: '/contact' },
}

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight">Contact Us</h1>
      <p className="mt-3 text-base text-muted-foreground">
        Questions, feedback, or spotted a data error? We&apos;d love to hear from you.
        We typically respond within 48 hours.
      </p>

      <div className="mt-10">
        <ContactForm />
      </div>

      <div className="mt-16 space-y-10 border-t border-border pt-12">
        <div>
          <h2 className="text-lg font-semibold text-foreground">What to contact us about</h2>
          <div className="mt-4 space-y-4 text-sm text-muted-foreground leading-relaxed">
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="font-medium text-foreground mb-1">Data errors or outdated rates</p>
              <p>
                Our calculators are built on public data from EIA.gov, fueleconomy.gov, and EPA
                eGRID. If you notice an electricity rate, EV spec, or conversion value that looks
                wrong, please let us know. Include the specific value and a source if you have one.
                We review and update data regularly.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="font-medium text-foreground mb-1">Feature requests</p>
              <p>
                Missing a vehicle model in the EV calculator? Want support for a different region?
                We genuinely read every request and add popular ones to the roadmap. The more
                specific you are, the easier it is to implement.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="font-medium text-foreground mb-1">General feedback</p>
              <p>
                If something is confusing, broken, or just not useful in practice, tell us. We
                would rather know than have you leave frustrated. Screenshots or a description of
                what you expected vs what happened are always helpful.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="font-medium text-foreground mb-1">Partnership or press inquiries</p>
              <p>
                If you are writing about EVs, air fryers, 3D printing, or related topics and want
                to reference our data or embed a calculator, reach out. We are open to reasonable
                partnerships and content collaborations.
              </p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-foreground">Response time</h2>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            We aim to respond within 48 hours on weekdays. For data correction requests, we
            will acknowledge receipt and update the relevant calculator as soon as we can verify
            the information. Complex feature requests may take longer to evaluate.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-foreground">Before you reach out</h2>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            For common questions about how our calculators work, check the FAQ sections on each
            calculator page — most &quot;why is this number different from what I expected&quot;
            questions are answered there. For privacy-related requests (data access, deletion),
            please reference our{' '}
            <a href="/privacy-policy" className="text-primary underline underline-offset-2">
              privacy policy
            </a>{' '}
            first.
          </p>
        </div>
      </div>
    </div>
  )
}
