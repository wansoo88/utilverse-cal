import { getDashboardSummary } from "@/lib/services/dashboard-service";
import { getPrimaryNotificationChannel } from "@/lib/services/notification-service";

function StatusBadge({ value }: { value: string }) {
  const className =
    value === "FAILED" || value === "CRITICAL"
      ? "badge badge-danger"
      : "badge badge-warn";

  return <span className={className}>{value}</span>;
}

export default async function DashboardPage() {
  const summary = await getDashboardSummary();
  const channel = await getPrimaryNotificationChannel();

  return (
    <main className="page-shell">
      <div className="container grid" style={{ gap: 24 }}>
        <section className="hero">
          <p className="label">Blogger Ops Dashboard</p>
          <h1>Weekly quota and alert center</h1>
          <p>
            Track draft quota, review backlog, publish output, and the latest
            email alert status from one screen.
          </p>
        </section>

        <section className="grid grid-2">
          <article className="panel">
            <p className="label">Week</p>
            <div className="metric">{summary.week}</div>
            <p>Open alerts: {summary.alertsOpen}</p>
          </article>

          <article className="panel">
            <p className="label">Draft quota</p>
            <div className="metric">
              {summary.draftActual} / {summary.draftTarget}
            </div>
            <p>Missing drafts: {summary.missingDrafts}</p>
          </article>

          <article className="panel">
            <p className="label">Review quota</p>
            <div className="metric">
              {summary.reviewActual} / {summary.reviewTarget}
            </div>
            <p>Human review remains the release gate.</p>
          </article>

          <article className="panel">
            <p className="label">Publish quota</p>
            <div className="metric">
              {summary.publishActual} / {summary.publishTarget}
            </div>
            <p>Missing publishes: {summary.missingPublishes}</p>
          </article>
        </section>

        <section className="grid grid-2">
          <article className="panel">
            <p className="label">Alert email</p>
            <div className="metric" style={{ fontSize: 20 }}>
              {channel?.target ?? "kimcomplete8888@gmail.com"}
            </div>
            <p>
              Last notification status:{" "}
              <StatusBadge value={summary.lastNotificationStatus} />
            </p>
            <p>Mailer configured: {process.env.SMTP_HOST ? "yes" : "no"}</p>
          </article>

          <article className="panel">
            <p className="label">Enabled notification rules</p>
            <ul className="list">
              {channel?.rules.map((rule) => (
                <li key={rule.id}>{rule.event}</li>
              )) ?? <li>No rules configured</li>}
            </ul>
          </article>
        </section>

        <section className="panel">
          <p className="label">Notification runbook</p>
          <ul className="list">
            <li>`POST /api/quotas/evaluate` recalculates weekly shortfalls.</li>
            <li>
              `POST /api/notifications/process` queues and sends pending emails.
            </li>
            <li>
              Set `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, and
              `ALERT_EMAIL_FROM` to enable delivery.
            </li>
          </ul>
        </section>
      </div>
    </main>
  );
}
