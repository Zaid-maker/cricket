"use server";

// Server Actions for Match Data
// Using Next.js 16 server actions with caching

import { fetchCurrentMatches, fetchMatchInfo, fetchMatchScorecard, CricApiError } from "@/services/cricket-api";
import { transformMatches, categorizeMatches, transformToScoreSummary } from "@/services/transformers";
import type { LiveScoreSummary } from "@/types";
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
        const response = await fetchCurrentMatches();
        const matches = transformMatches(response.data);
        const categorized = categorizeMatches(matches);

        return {
            ...categorized,
            usingMockData: false,
        };
    } catch (error) {
        console.error("Failed to fetch current matches:", error);

        // Fallback to mock data
        return {
            live: liveMatches,
            upcoming: upcomingMatches,
            completed: completedMatches,
            error: error instanceof CricApiError ? error.message : "Failed to fetch matches",
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
        const response = await fetchCurrentMatches();
        const matches = transformMatches(response.data);
        const liveOnly = matches.filter((m) => m.isLive);

        return {
            matches: liveOnly,
            usingMockData: false,
        };
    } catch (error) {
        console.error("Failed to fetch live matches:", error);

        return {
            matches: liveMatches,
            error: error instanceof CricApiError ? error.message : "Failed to fetch matches",
            usingMockData: true,
        };
    }
}

/**
 * Get match details by ID
 */
export async function getMatchDetails(matchId: string): Promise<{
    match: LiveScoreSummary | null;
    error?: string;
}> {
    try {
        const response = await fetchMatchInfo(matchId);
        const match = transformToScoreSummary({
            ...response.data,
            matchStarted: true,
            matchEnded: response.data.status.toLowerCase().includes("won"),
            fantasyEnabled: false,
            bbbEnabled: false,
            hasSquad: false,
        });

        return { match };
    } catch (error) {
        console.error("Failed to fetch match details:", error);

        return {
            match: null,
            error: error instanceof CricApiError ? error.message : "Failed to fetch match details",
        };
    }
}

/**
 * Get match scorecard by ID
 */
export async function getMatchScorecard(matchId: string) {
    try {
        const response = await fetchMatchScorecard(matchId);
        return {
            data: response.data,
            error: undefined,
        };
    } catch (error) {
        console.error("Failed to fetch scorecard:", error);

        return {
            data: null,
            error: error instanceof CricApiError ? error.message : "Failed to fetch scorecard",
        };
    }
}
