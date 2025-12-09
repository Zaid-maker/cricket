"use server";

// Server Actions for Match Data
// Using Next.js 16 server actions with caching

import { fetchCurrentMatches, fetchMatchInfo, fetchMatchScorecard } from "@/services/cricket-api";
import { addScorecardToMatch, transformToFullMatch } from "@/services/transformers";
import { LiveScoreSummary, Match } from "@/types";
import { liveMatches, upcomingMatches, completedMatches } from "@/data/matches";

/**
 * Get all current matches (live, upcoming, recent)
 * Cached and revalidates every 30 seconds
 */
export async function getCurrentMatches(): Promise<{
    live: LiveScoreSummary[];
    upcoming: LiveScoreSummary[];
    completed: LiveScoreSummary[];
    error?: string;
    usingMockData: boolean;
}> {
    try {
        const matches = await fetchCurrentMatches();

        // Categorize manually since fetchCurrentMatches returns flat list of LiveScoreSummary
        const live = matches.filter(m => m.status === "LIVE" || m.status === "INNINGS_BREAK" || m.status === "TEA" || m.status === "LUNCH" || m.status === "DRINKS" || m.status === "DELAYED");
        const upcoming = matches.filter(m => m.status === "UPCOMING");
        const completed = matches.filter(m => m.status === "COMPLETED" || m.status === "ABANDONED" || m.status === "NO_RESULT");

        return {
            live,
            upcoming,
            completed,
            usingMockData: false,
        };
    } catch (error) {
        console.error("Failed to fetch current matches:", error);
        return {
            live: liveMatches,
            upcoming: upcomingMatches,
            completed: completedMatches,
            error: error instanceof Error ? error.message : "Failed to fetch matches",
            usingMockData: true,
        };
    }
}

/**
 * Get live matches only
 * Useful for live ticker
 */
export async function getLiveMatches(): Promise<{
    matches: LiveScoreSummary[];
    error?: string;
    usingMockData: boolean;
}> {
    try {
        const result = await getCurrentMatches();
        return {
            matches: result.live,
            usingMockData: result.usingMockData,
            error: result.error
        };
    } catch (error) {
        return {
            matches: liveMatches,
            error: "Failed",
            usingMockData: true
        };
    }
}

/**
 * Get match details by ID
 * Tries to fetch full scorecard, falls back to basic info
 */
export async function getMatchDetails(matchId: string): Promise<{
    match: Match | null;
    error?: string;
}> {
    try {
        // 1. Get basic info (returns Match object with empty innings)
        const matchBasic = await fetchMatchInfo(matchId);

        if (!matchBasic) {
            return { match: null, error: "Match not found" };
        }

        // 2. Get Scorecard
        try {
            const scorecardResponse = await fetchMatchScorecard(matchId);

            if (scorecardResponse) {
                // Merge scorecard into match info
                const matchFull = addScorecardToMatch(matchBasic, scorecardResponse);
                return { match: matchFull };
            }
            return { match: matchBasic };
        } catch (e) {
            console.log("Scorecard fetch failed, falling back to match info");
            return { match: matchBasic };
        }
    } catch (error) {
        console.error("Failed to fetch match details:", error);
        return { match: null, error: "Failed" };
    }
}

/**
 * Get match scorecard by ID
 */
export async function getMatchScorecard(matchId: string) {
    const data = await fetchMatchScorecard(matchId);
    return { data, error: undefined };
}
