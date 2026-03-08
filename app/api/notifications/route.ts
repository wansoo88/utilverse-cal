import { NextResponse } from "next/server";
import { getPrimaryNotificationChannel, getNotificationSummary } from "@/lib/services/notification-service";

export async function GET() {
  const channel = await getPrimaryNotificationChannel();
  const summary = await getNotificationSummary();

  return NextResponse.json({
    data: {
      channel,
      summary,
    },
    error: null,
    meta: {
      recipient: channel?.target ?? process.env.ALERT_EMAIL_TO ?? "kimcomplete8888@gmail.com",
    },
  });
}
