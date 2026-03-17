import type { Metadata } from 'next'
import { ContactForm } from './contact-form'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with the utilverse team.',
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
    </div>
  )
}
