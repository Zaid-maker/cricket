import { LiveScoreSummary } from "@/types";
import { query } from "@/lib/db";

// Table initialization
async function ensureTableExists() {
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS notified_matches (
            match_id VARCHAR(255) PRIMARY KEY,
            notified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            notification_type VARCHAR(50) DEFAULT 'START'
        );
    `;
    try {
        await query(createTableQuery);
    } catch (error) {
        console.error("Failed to ensure notification table exists:", error);
    }
}

// Ensure table exists on module load (fire and forget)
ensureTableExists();

// Helper to check if notified
async function hasNotified(matchId: string, type: 'start' | 'end'): Promise<boolean> {
    const id = `${type}-${matchId}`;
    try {
        const result = await query("SELECT 1 FROM notified_matches WHERE match_id = $1", [id]);
        return (result.rowCount ?? 0) > 0;
    } catch (e) {
        console.error("DB Check Failed:", e);
        return false;
    }
}

// Helper to save notification
async function markAsNotified(matchId: string, type: 'start' | 'end') {
    const id = `${type}-${matchId}`;
    try {
        await query(
            "INSERT INTO notified_matches (match_id, notification_type) VALUES ($1, $2) ON CONFLICT (match_id) DO NOTHING",
            [id, type.toUpperCase()]
        );
    } catch (e) {
        console.error("DB Save Failed:", e);
    }
}

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
            const alreadyNotified = await hasNotified(matchId, 'start');

            if (!alreadyNotified) {
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
                await markAsNotified(matchId, 'start');
            }
        }

        // Notify on Match Complete
        if (status === "completed" || status === "result") {
            const alreadyNotified = await hasNotified(matchId, 'end');

            if (!alreadyNotified) {
                await sendDiscordWebhook({
                    title: "🏁 Match Ended",
                    description: `**${match.team1.name}** vs **${match.team2.name}** has finished.`,
                    color: 0xf87171, // Red
                    fields: [
                        { name: "Status", value: match.statusText, inline: false }
                    ],
                    timestamp: new Date().toISOString()
                });
                await markAsNotified(matchId, 'end');
            }
        }
    }
}
