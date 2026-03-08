import { db } from "@/lib/db";
import {
  NotificationEvent,
  NotificationStatus,
  type Alert,
  type NotificationLog,
} from "@prisma/client";
import { getMailerStatus, sendMail } from "@/lib/integrations/mailer";

function buildAlertSubject(event: NotificationEvent) {
  const map: Record<NotificationEvent, string> = {
    DAILY_SUMMARY: "[Blogger Ops] Daily summary",
    INDEXING_DELAY: "[Blogger Ops] Indexing delay detected",
    PUBLISH_FAILURE: "[Blogger Ops] Publish failure detected",
    WEEKLY_APPROVAL_SHORTFALL: "[Blogger Ops] Weekly review target is behind",
    WEEKLY_DRAFT_SHORTFALL: "[Blogger Ops] Weekly draft target is behind",
    WEEKLY_PUBLISH_SHORTFALL: "[Blogger Ops] Weekly publish target is behind",
    WEEKLY_SUMMARY: "[Blogger Ops] Weekly summary",
  };

  return map[event];
}

function buildAlertBody(alert: Alert) {
  return [
    `Alert type: ${alert.type}`,
    `Severity: ${alert.severity}`,
    `Created: ${alert.createdAt.toISOString()}`,
    "",
    alert.message,
  ].join("\n");
}

export async function getPrimaryNotificationChannel() {
  return db.notificationChannel.findFirst({
    where: {
      type: "EMAIL",
      isEnabled: true,
    },
    include: {
      logs: {
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
      },
      rules: true,
    },
  });
}

export async function getNotificationSummary() {
  const channel = await getPrimaryNotificationChannel();
  const mailer = getMailerStatus();

  return {
    target: channel?.target ?? process.env.ALERT_EMAIL_TO ?? "kimcomplete8888@gmail.com",
    latestLog: channel?.logs[0] ?? null,
    rulesEnabled: channel?.rules.filter((rule) => rule.isEnabled).length ?? 0,
    mailerConfigured: mailer.configured,
  };
}

export async function queueNotificationForAlert(
  alertId: string,
  event: NotificationEvent,
) {
  const alert = await db.alert.findUnique({
    where: { id: alertId },
  });

  if (!alert) {
    return null;
  }

  const channels = await db.notificationChannel.findMany({
    where: {
      type: "EMAIL",
      isEnabled: true,
      rules: {
        some: {
          event,
          isEnabled: true,
        },
      },
    },
    include: {
      rules: true,
    },
  });

  const logs: NotificationLog[] = [];

  for (const channel of channels) {
    const existing = await db.notificationLog.findFirst({
      where: {
        channelId: channel.id,
        alertId,
        event,
      },
    });

    if (existing) {
      logs.push(existing);
      continue;
    }

    const log = await db.notificationLog.create({
      data: {
        channelId: channel.id,
        alertId,
        event,
        subject: buildAlertSubject(event),
        body: buildAlertBody(alert),
        status: NotificationStatus.PENDING,
      },
    });

    logs.push(log);
  }

  return logs;
}

export async function queueWeeklySummary(isoWeek?: string) {
  const quota = isoWeek
    ? await db.weeklyQuota.findUnique({
        where: { isoWeek },
        include: { stats: true },
      })
    : await db.weeklyQuota.findFirst({
        orderBy: { startDate: "desc" },
        include: { stats: true },
      });

  if (!quota) {
    return [];
  }

  const channels = await db.notificationChannel.findMany({
    where: {
      type: "EMAIL",
      isEnabled: true,
      rules: {
        some: {
          event: NotificationEvent.WEEKLY_SUMMARY,
          isEnabled: true,
        },
      },
    },
  });

  const body = [
    `Week: ${quota.isoWeek}`,
    `Drafts: ${quota.stats?.draftCount ?? 0}/${quota.targetDrafts}`,
    `Reviews: ${quota.stats?.reviewCount ?? 0}/${quota.targetReviews}`,
    `Publishes: ${quota.stats?.publishedCount ?? 0}/${quota.targetPublishes}`,
    `Missing drafts: ${quota.stats?.missingDrafts ?? 0}`,
    `Missing publishes: ${quota.stats?.missingPublishes ?? 0}`,
  ].join("\n");

  const logs = [];

  for (const channel of channels) {
    const log = await db.notificationLog.create({
      data: {
        channelId: channel.id,
        event: NotificationEvent.WEEKLY_SUMMARY,
        subject: buildAlertSubject(NotificationEvent.WEEKLY_SUMMARY),
        body,
        status: NotificationStatus.PENDING,
      },
    });

    logs.push(log);
  }

  return logs;
}

export async function processPendingNotifications(limit = 20) {
  const pendingLogs = await db.notificationLog.findMany({
    where: {
      status: NotificationStatus.PENDING,
    },
    include: {
      channel: true,
    },
    orderBy: {
      createdAt: "asc",
    },
    take: limit,
  });

  const results = [];

  for (const log of pendingLogs) {
    try {
      const result = await sendMail({
        to: log.channel.target,
        subject: log.subject,
        text: log.body,
      });

      const status = result.sent
        ? NotificationStatus.SENT
        : result.skipped
          ? NotificationStatus.SKIPPED
          : NotificationStatus.FAILED;

      const updated = await db.notificationLog.update({
        where: { id: log.id },
        data: {
          status,
          sentAt: result.sent ? new Date() : null,
          errorMessage: result.reason,
        },
      });

      results.push(updated);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown mail send error.";

      const updated = await db.notificationLog.update({
        where: { id: log.id },
        data: {
          status: NotificationStatus.FAILED,
          errorMessage: message,
        },
      });

      results.push(updated);
    }
  }

  return {
    mailer: getMailerStatus(),
    processed: results.length,
    logs: results,
  };
}
