import Link from "next/link";

export default function HomePage() {
  return (
    <main className="page-shell">
      <div className="container">
        <section className="hero">
          <p className="label">Blogger Local Admin</p>
          <h1>Content pipeline, weekly quotas, and alert monitoring.</h1>
          <p>
            This app manages Gemini draft generation, human review, publish
            scheduling, weekly quotas, and email alerts for the Blogger
            operation.
          </p>
          <div className="actions">
            <Link className="button-link primary" href="/dashboard">
              Open dashboard
            </Link>
            <Link className="button-link" href="/guide">
              How to use
            </Link>
          </div>
        </section>
        <section className="grid grid-2" style={{ marginTop: 24 }}>
          <article className="panel accent-panel">
            <p className="label">Automation</p>
            <h2>Web-driven content workflow</h2>
            <p>
              Queue keywords, create post records, generate drafts with Gemini,
              review content, and push posts toward publication inside the same
              app.
            </p>
          </article>
          <article className="panel">
            <p className="label">Required setup</p>
            <ul className="list">
              <li>Set `GEMINI_API_KEY` for AI draft generation.</li>
              <li>Set SMTP credentials for real email delivery.</li>
              <li>Use the dashboard sections to drive weekly production.</li>
            </ul>
          </article>
        </section>
      </div>
    </main>
  );
}
