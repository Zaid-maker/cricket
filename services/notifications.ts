import { LiveScoreSummary } from "@/types";

// In-memory state to track sent notifications (prevents spam)
// We use globalThis to persist across hot reloads in dev
declare global {
    var _notificationState: Set<string> | undefined;
}

if (!globalThis._notificationState) {
    globalThis._notificationState = new Set<string>();
}

const NOTIFIED_MATCHES = globalThis._notificationState!;
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

interface DiscordEmbed {
    title: string;
    description: string;
    color: number;
    fields?: { name: string; value: string; inline?: boolean }[];
    footer?: { text: string };
    timestamp?: string;
}

export async function sendDiscordWebhook(embed: DiscordEmbed) {
    if (!DISCORD_WEBHOOK_URL) {
        console.warn("DISCORD_WEBHOOK_URL is not set. Notification skipped.");
        return;
    }

    try {
        await fetch(DISCORD_WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                embeds: [embed],
            }),
        });
        console.log("Discord notification sent:", embed.title);
    } catch (error) {
        console.error("Failed to send Discord webhook:", error);
    }
}

export async function checkAndNotify(matches: LiveScoreSummary[]) {
    for (const match of matches) {
        const matchId = match.matchId;
        const status = match.status.toLowerCase();

        // Notify on Match Start
        if (status === "live" || status === "in progress") {
            const notificationKey = `start-${matchId}`;

            if (!NOTIFIED_MATCHES.has(notificationKey)) {
                await sendDiscordWebhook({
                    title: "🏏 Match Started!",
                    description: `**${match.team1.name}** vs **${match.team2.name}** is now live!`,
                    color: 0x4ade80, // Green
                    fields: [
                        { name: "Series", value: match.seriesName || "Unknown Series", inline: true },
                        { name: "Format", value: match.format.toUpperCase(), inline: true },
                        { name: "Venue", value: match.venue, inline: false }
                    ],
                    timestamp: new Date().toISOString()
                });
                NOTIFIED_MATCHES.add(notificationKey);
            }
        }

        // Notify on Match Complete
        if (status === "completed" || status === "result") {
            const notificationKey = `end - ${matchId} `;

            if (!NOTIFIED_MATCHES.has(notificationKey)) {
                // Only send completion if we haven't already
                await sendDiscordWebhook({
                    title: "🏁 Match Ended",
                    description: `** ${match.team1.name}** vs ** ${match.team2.name}** has finished.`,
                    color: 0xf87171, // Red
                    fields: [
                        { name: "Status", value: match.statusText, inline: false }
                    ],
                    timestamp: new Date().toISOString()
                });
                NOTIFIED_MATCHES.add(notificationKey);
            }
        }
    }
}
