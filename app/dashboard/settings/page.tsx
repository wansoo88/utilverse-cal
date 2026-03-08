import { getMailerStatus } from "@/lib/integrations/mailer";

function settingRow(label: string, configured: boolean, value?: string | null) {
  return (
    <tr key={label}>
      <td>{label}</td>
      <td>{configured ? "configured" : "missing"}</td>
      <td>{value ?? "-"}</td>
    </tr>
  );
}

export default function SettingsPage() {
  const mailer = getMailerStatus();
  const geminiConfigured = Boolean(process.env.GEMINI_API_KEY);
  const bloggerTokenConfigured = Boolean(process.env.BLOGGER_ACCESS_TOKEN);
  const bloggerBlogConfigured = Boolean(process.env.BLOGGER_BLOG_ID);

  return (
    <section className="panel">
      <p className="label">Integration settings</p>
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Setting</th>
              <th>Status</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {settingRow("GEMINI_API_KEY", geminiConfigured, geminiConfigured ? "configured" : null)}
            {settingRow("GEMINI_MODEL", true, process.env.GEMINI_MODEL ?? "gemini-2.5-flash")}
            {settingRow("SMTP_HOST", mailer.configured, mailer.host)}
            {settingRow("ALERT_EMAIL_FROM", mailer.configured, mailer.from)}
            {settingRow("BLOGGER_ACCESS_TOKEN", bloggerTokenConfigured, bloggerTokenConfigured ? "configured" : null)}
            {settingRow("BLOGGER_BLOG_ID", bloggerBlogConfigured, process.env.BLOGGER_BLOG_ID ?? null)}
          </tbody>
        </table>
      </div>
      <p className="small-note">
        This screen is read-only. Set real values in `.env.local` before using
        Gemini generation or Blogger publishing.
      </p>
    </section>
  );
}
