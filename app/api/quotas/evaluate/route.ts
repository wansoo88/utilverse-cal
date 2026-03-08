import { NextResponse } from "next/server";
import { evaluateWeeklyQuota } from "@/lib/services/quota-service";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    isoWeek?: string;
  };

  const result = await evaluateWeeklyQuota(body.isoWeek);

  return NextResponse.json({
    data: result,
    error: null,
    meta: {
      evaluatedAt: new Date().toISOString(),
    },
  });
}
