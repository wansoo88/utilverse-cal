import nodemailer from "nodemailer";

type MailPayload = {
  to: string;
  subject: string;
  text: string;
};

function getMailConfig() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? "587");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.ALERT_EMAIL_FROM;

  return {
    host,
    port,
    user,
    pass,
    from,
    isConfigured: Boolean(host && port && user && pass && from),
  };
}

export function getMailerStatus() {
  const config = getMailConfig();

  return {
    configured: config.isConfigured,
    from: config.from ?? null,
    host: config.host ?? null,
    port: Number.isNaN(config.port) ? null : config.port,
  };
}

export async function sendMail(payload: MailPayload) {
  const config = getMailConfig();

  if (!config.isConfigured) {
    return {
      sent: false,
      skipped: true,
      reason: "SMTP configuration is incomplete.",
    };
  }

  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.port === 465,
    auth: {
      user: config.user,
      pass: config.pass,
    },
  });

  await transporter.sendMail({
    from: config.from,
    to: payload.to,
    subject: payload.subject,
    text: payload.text,
  });

  return {
    sent: true,
    skipped: false,
    reason: null,
  };
}
