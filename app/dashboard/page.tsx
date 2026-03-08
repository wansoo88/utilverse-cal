import Link from "next/link";
import { getDashboardSummary } from "@/lib/services/dashboard-service";
import { getPrimaryNotificationChannel } from "@/lib/services/notification-service";
import { listPostsByStatus } from "@/lib/services/post-service";

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
  const posts = await listPostsByStatus();
  const reviewCount = posts.filter((post) => post.status === "REVIEW").length;
  const queuedCount = posts.filter((post) => post.status === "QUEUED").length;
  const approvedCount = posts.filter((post) => post.status === "APPROVED").length;
  const scheduledCount = posts.filter((post) => post.status === "SCHEDULED").length;

  return (
    <div className="grid" style={{ gap: 24 }}>
      <section className="grid grid-2 grid-4">
        <article className="panel accent-panel">
          <p className="label">Review queue</p>
          <div className="metric">{reviewCount}</div>
          <p>Posts waiting for final human review.</p>
        </article>
        <article className="panel">
          <p className="label">Queued drafts</p>
          <div className="metric">{queuedCount}</div>
          <p>Posts ready for Gemini draft generation.</p>
        </article>
        <article className="panel">
          <p className="label">Approved posts</p>
          <div className="metric">{approvedCount}</div>
          <p>Ready to schedule for Blogger publishing.</p>
        </article>
        <article className="panel">
          <p className="label">Scheduled posts</p>
          <div className="metric">{scheduledCount}</div>
          <p>Tracked publish jobs in the local pipeline.</p>
        </article>
      </section>

      <section className="grid grid-2">
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
      </section>

      <section className="grid grid-2">
        <article className="panel">
          <p className="label">Workflow links</p>
          <div className="actions">
            <Link className="button-link primary" href="/dashboard/keywords">
              Manage keywords
            </Link>
            <Link className="button-link" href="/dashboard/pipeline">
              Open pipeline
            </Link>
            <Link className="button-link" href="/dashboard/review">
              Review drafts
            </Link>
            <Link className="button-link" href="/dashboard/publish">
              Publish queue
            </Link>
            <Link className="button-link" href="/dashboard/settings">
              Settings
            </Link>
          </div>
        </article>

        <article className="panel">
          <p className="label">Notification runbook</p>
          <ul className="list">
            <li>`POST /api/quotas/evaluate` recalculates weekly shortfalls.</li>
            <li>`POST /api/notifications/process` sends pending emails.</li>
            <li>Gemini draft generation requires `GEMINI_API_KEY`.</li>
            <li>SMTP delivery requires all SMTP variables in `.env.local`.</li>
          </ul>
        </article>
      </section>
    </div>
  );
}
