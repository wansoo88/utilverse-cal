import { db } from "@/lib/db";
import { AlertSeverity, AlertType, NotificationEvent } from "@prisma/client";
import { queueNotificationForAlert } from "@/lib/services/notification-service";

export async function getCurrentWeeklyQuota() {
  return db.weeklyQuota.findFirst({
    orderBy: {
      startDate: "desc",
    },
    include: {
      stats: true,
      alerts: {
        where: {
          status: "OPEN",
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
}

function getShortfallSeverity(missing: number) {
  if (missing >= 3) {
    return AlertSeverity.CRITICAL;
  }

  return AlertSeverity.WARNING;
}

async function upsertShortfallAlert(args: {
  weeklyQuotaId: string;
  type: AlertType;
  message: string;
  severity: AlertSeverity;
}) {
  const existing = await db.alert.findFirst({
    where: {
      weeklyQuotaId: args.weeklyQuotaId,
      type: args.type,
      status: "OPEN",
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (existing) {
    return db.alert.update({
      where: { id: existing.id },
      data: {
        message: args.message,
        severity: args.severity,
      },
    });
  }

  return db.alert.create({
    data: {
      weeklyQuotaId: args.weeklyQuotaId,
      type: args.type,
      severity: args.severity,
      message: args.message,
      status: "OPEN",
    },
  });
}

async function resolveShortfallAlert(weeklyQuotaId: string, type: AlertType) {
  const openAlerts = await db.alert.findMany({
    where: {
      weeklyQuotaId,
      type,
      status: "OPEN",
    },
  });

  if (!openAlerts.length) {
    return;
  }

  await db.alert.updateMany({
    where: {
      id: {
        in: openAlerts.map((alert) => alert.id),
      },
    },
    data: {
      status: "RESOLVED",
      resolvedAt: new Date(),
    },
  });
}

export async function evaluateWeeklyQuota(isoWeek?: string) {
  const quota = isoWeek
    ? await db.weeklyQuota.findUnique({
        where: { isoWeek },
        include: { stats: true },
      })
    : await getCurrentWeeklyQuota();

  if (!quota) {
    return {
      quota: null,
      alerts: [],
    };
  }

  const stats = quota.stats;
  const alerts = [];

  const draftMissing = Math.max(
    0,
    quota.targetDrafts - (stats?.draftCount ?? 0),
  );
  const reviewMissing = Math.max(
    0,
    quota.targetReviews - (stats?.reviewCount ?? 0),
  );
  const publishMissing = Math.max(
    0,
    quota.targetPublishes - (stats?.publishedCount ?? 0),
  );

  await db.weeklyStat.upsert({
    where: {
      weeklyQuotaId: quota.id,
    },
    update: {
      missingDrafts: draftMissing,
      missingPublishes: publishMissing,
      lastCalculatedAt: new Date(),
    },
    create: {
      weeklyQuotaId: quota.id,
      draftCount: stats?.draftCount ?? 0,
      reviewCount: stats?.reviewCount ?? 0,
      approvedCount: stats?.approvedCount ?? 0,
      publishedCount: stats?.publishedCount ?? 0,
      pageCount: stats?.pageCount ?? 0,
      missingDrafts: draftMissing,
      missingPublishes: publishMissing,
      lastCalculatedAt: new Date(),
    },
  });

  if (draftMissing > 0) {
    const alert = await upsertShortfallAlert({
      weeklyQuotaId: quota.id,
      type: AlertType.WEEKLY_DRAFT_SHORTFALL,
      severity: getShortfallSeverity(draftMissing),
      message: `Draft target is behind by ${draftMissing} item(s) for ${quota.isoWeek}.`,
    });

    alerts.push(alert);
    await queueNotificationForAlert(alert.id, NotificationEvent.WEEKLY_DRAFT_SHORTFALL);
  } else {
    await resolveShortfallAlert(quota.id, AlertType.WEEKLY_DRAFT_SHORTFALL);
  }

  if (reviewMissing > 0) {
    const alert = await upsertShortfallAlert({
      weeklyQuotaId: quota.id,
      type: AlertType.WEEKLY_APPROVAL_SHORTFALL,
      severity: getShortfallSeverity(reviewMissing),
      message: `Review target is behind by ${reviewMissing} item(s) for ${quota.isoWeek}.`,
    });

    alerts.push(alert);
    await queueNotificationForAlert(alert.id, NotificationEvent.WEEKLY_APPROVAL_SHORTFALL);
  } else {
    await resolveShortfallAlert(quota.id, AlertType.WEEKLY_APPROVAL_SHORTFALL);
  }

  if (publishMissing > 0) {
    const alert = await upsertShortfallAlert({
      weeklyQuotaId: quota.id,
      type: AlertType.WEEKLY_PUBLISH_SHORTFALL,
      severity: getShortfallSeverity(publishMissing),
      message: `Publish target is behind by ${publishMissing} item(s) for ${quota.isoWeek}.`,
    });

    alerts.push(alert);
    await queueNotificationForAlert(alert.id, NotificationEvent.WEEKLY_PUBLISH_SHORTFALL);
  } else {
    await resolveShortfallAlert(quota.id, AlertType.WEEKLY_PUBLISH_SHORTFALL);
  }

  return {
    quota,
    alerts,
  };
}

export async function getWeeklyAssignments(isoWeek: string) {
  return db.weeklyQuota.findUnique({
    where: { isoWeek },
    include: {
      assignments: {
        include: {
          post: true,
          keyword: true,
        },
        orderBy: {
          dueDate: "asc",
        },
      },
    },
  });
}
