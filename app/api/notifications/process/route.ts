import { NextResponse } from "next/server";
import { processPendingNotifications, queueWeeklySummary } from "@/lib/services/notification-service";
import { evaluateWeeklyQuota } from "@/lib/services/quota-service";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    limit?: number;
    includeWeeklySummary?: boolean;
    isoWeek?: string;
  };

  await evaluateWeeklyQuota(body.isoWeek);

  if (body.includeWeeklySummary) {
    await queueWeeklySummary(body.isoWeek);
  }

  const result = await processPendingNotifications(body.limit ?? 20);

  return NextResponse.json({
    data: result,
    error: null,
    meta: {
      processedAt: new Date().toISOString(),
    },
  });
}
