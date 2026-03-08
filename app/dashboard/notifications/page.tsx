import { evaluateQuotaAction, processNotificationsAction } from "@/app/actions";
import { getMailerStatus } from "@/lib/integrations/mailer";
import { getPrimaryNotificationChannel } from "@/lib/services/notification-service";

export default async function NotificationsPage() {
  const channel = await getPrimaryNotificationChannel();
  const mailer = getMailerStatus();

  return (
    <div className="section-stack">
      <section className="grid grid-2">
        <article className="panel">
          <p className="label">Notification channel</p>
          <h2>{channel?.target ?? "kimcomplete8888@gmail.com"}</h2>
          <p>Mailer configured: {mailer.configured ? "yes" : "no"}</p>
          <p className="small-note">
            Host: {mailer.host ?? "not set"} · From: {mailer.from ?? "not set"}
          </p>
        </article>
        <article className="panel">
          <p className="label">Run automation</p>
          <div className="actions">
            <form action={evaluateQuotaAction}>
              <button className="button-link" type="submit">
                Recalculate quota alerts
              </button>
            </form>
            <form action={processNotificationsAction}>
              <label className="checkbox-row">
                <input type="checkbox" name="includeWeeklySummary" />
                Include weekly summary
              </label>
              <button className="button-link primary" type="submit">
                Process pending notifications
              </button>
            </form>
          </div>
        </article>
      </section>

      <section className="panel">
        <p className="label">Recent notification logs</p>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Event</th>
                <th>Status</th>
                <th>Subject</th>
                <th>Created</th>
                <th>Error</th>
              </tr>
            </thead>
            <tbody>
              {channel?.logs.map((log) => (
                <tr key={log.id}>
                  <td>{log.event}</td>
                  <td>{log.status}</td>
                  <td>{log.subject}</td>
                  <td>{new Date(log.createdAt).toLocaleString()}</td>
                  <td>{log.errorMessage ?? "-"}</td>
                </tr>
              )) ?? null}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
