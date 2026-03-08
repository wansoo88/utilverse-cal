import Link from "next/link";

const setupSteps = [
  "Run the app and open the dashboard.",
  "Check the weekly quota card to confirm the active week and current shortage.",
  "Fill in SMTP settings in .env.local if you want real email delivery.",
  "Use the quota and notification APIs to recalculate shortages and process pending mail.",
];

const weeklyRoutine = [
  "Monday: queue keywords and start draft generation.",
  "Wednesday: recalculate quota and review draft shortage alerts.",
  "Friday: approve posts, schedule publication, and re-run notification processing.",
  "Sunday: verify published count, queue weekly summary, and check skipped or failed mail logs.",
];

const apiSteps = [
  {
    title: "Recalculate weekly quota",
    path: "POST /api/quotas/evaluate",
    note: "Creates or resolves shortfall alerts for drafts, reviews, and publishes.",
  },
  {
    title: "Process pending notifications",
    path: "POST /api/notifications/process",
    note: "Queues optional weekly summary and attempts SMTP delivery for pending logs.",
  },
  {
    title: "Read notification status",
    path: "GET /api/notifications",
    note: "Returns channel info, recent logs, and mailer configuration summary.",
  },
];

export default function GuidePage() {
  return (
    <main className="page-shell">
      <div className="container section-stack">
        <section className="hero">
          <p className="label">How To Use</p>
          <h1>Blogger Ops quick guide</h1>
          <p>
            This page explains the minimum setup, weekly operating routine, and
            alert flow for the Blogger admin app.
          </p>
          <div className="actions">
            <Link className="button-link primary" href="/dashboard">
              Open dashboard
            </Link>
            <Link className="button-link" href="/">
              Back home
            </Link>
          </div>
        </section>

        <section className="grid grid-2">
          <article className="panel">
            <p className="label">1. First setup</p>
            <ul className="list">
              {setupSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ul>
          </article>

          <article className="panel">
            <p className="label">2. SMTP requirements</p>
            <ul className="list">
              <li>
                Set <span className="code-inline">ALERT_EMAIL_TO</span> to{" "}
                <span className="code-inline">kimcomplete8888@gmail.com</span>
                .
              </li>
              <li>
                Set <span className="code-inline">ALERT_EMAIL_FROM</span>,{" "}
                <span className="code-inline">SMTP_HOST</span>,{" "}
                <span className="code-inline">SMTP_PORT</span>,{" "}
                <span className="code-inline">SMTP_USER</span>, and{" "}
                <span className="code-inline">SMTP_PASS</span>.
              </li>
              <li>
                If SMTP is missing, notification processing still runs but logs
                are marked as <span className="code-inline">SKIPPED</span>.
              </li>
              <li>
                For AI drafts, also set{" "}
                <span className="code-inline">GEMINI_API_KEY</span> and
                optionally <span className="code-inline">GEMINI_MODEL</span>.
              </li>
            </ul>
          </article>
        </section>

        <section className="grid grid-2">
          <article className="panel">
            <p className="label">3. Weekly routine</p>
            <ul className="list">
              {weeklyRoutine.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ul>
          </article>

          <article className="panel">
            <p className="label">4. Quota targets</p>
            <ul className="list">
              <li>Drafts: 8 per week</li>
              <li>Reviews: 6 per week</li>
              <li>Publishes: 5 to 7 per week</li>
              <li>Shortfalls create alerts and queue email notifications</li>
              <li>Queued posts can be drafted directly from the Keywords or Pipeline pages</li>
            </ul>
          </article>
        </section>

        <section className="panel">
          <p className="label">5. API runbook</p>
          <ul className="list">
            {apiSteps.map((item) => (
              <li key={item.path}>
                <strong>{item.title}</strong>:{" "}
                <span className="code-inline">{item.path}</span>. {item.note}
              </li>
            ))}
          </ul>
        </section>

        <section className="panel">
          <p className="label">6. What to check when something is wrong</p>
          <ul className="list">
            <li>
              If the weekly quota is red, run{" "}
              <span className="code-inline">POST /api/quotas/evaluate</span>.
            </li>
            <li>
              If mail is not going out, confirm SMTP settings and then run{" "}
              <span className="code-inline">
                POST /api/notifications/process
              </span>
              .
            </li>
            <li>
              If logs show <span className="code-inline">FAILED</span>, inspect
              the recent notification entries in the dashboard.
            </li>
            <li>
              If logs show <span className="code-inline">SKIPPED</span>, SMTP is
              not configured yet.
            </li>
          </ul>
        </section>
      </div>
    </main>
  );
}
