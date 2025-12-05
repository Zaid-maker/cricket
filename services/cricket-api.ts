// Cricket API Service
// Using CricketData.org (CricAPI) - https://cricketdata.org

import type {
    CurrentMatchesResponse,
    MatchInfoResponse,
    ScorecardResponse,
    SeriesResponse,
    PlayerInfoResponse,
    ApiErrorResponse,
} from "@/types/api";

const CRICAPI_BASE_URL = process.env.CRICAPI_BASE_URL || "https://api.cricapi.com/v1";
const CRICAPI_KEY = process.env.CRICAPI_KEY || "";

// Custom error class for API errors
export class CricApiError extends Error {
    constructor(
        message: string,
        public statusCode?: number,
        public reason?: string
    ) {
        super(message);
        this.name = "CricApiError";
    }
}

// Generic fetch function with error handling
async function fetchFromApi<T>(
    endpoint: string,
    params: Record<string, string> = {}
): Promise<T> {
    if (!CRICAPI_KEY) {
        throw new CricApiError(
            "API key not configured. Please set CRICAPI_KEY environment variable."
        );
    }

    const searchParams = new URLSearchParams({
        apikey: CRICAPI_KEY,
        ...params,
    });

    const url = `${CRICAPI_BASE_URL}${endpoint}?${searchParams.toString()}`;

    try {
        const response = await fetch(url, {
            next: { revalidate: 30 }, // Cache for 30 seconds
        });

        if (!response.ok) {
            throw new CricApiError(
                `API request failed: ${response.statusText}`,
                response.status
            );
        }

        const data = await response.json();

        // Check for API-level errors
        if (data.status === "failure") {
            throw new CricApiError(
                (data as ApiErrorResponse).reason || "API request failed",
                undefined,
                (data as ApiErrorResponse).reason
            );
        }

        return data as T;
    } catch (error) {
        if (error instanceof CricApiError) {
            throw error;
        }
        throw new CricApiError(
            `Failed to fetch from Cricket API: ${error instanceof Error ? error.message : "Unknown error"}`
        );
    }
}

/**
 * Fetch current/live matches
 * Returns all ongoing and recently completed matches
 */
export async function fetchCurrentMatches(): Promise<CurrentMatchesResponse> {
    return fetchFromApi<CurrentMatchesResponse>("/currentMatches");
}

/**
 * Fetch detailed match information
 * @param matchId - The match ID
 */
export async function fetchMatchInfo(
    matchId: string
): Promise<MatchInfoResponse> {
    return fetchFromApi<MatchInfoResponse>("/match_info", { id: matchId });
}

/**
 * Fetch match scorecard
 * @param matchId - The match ID
 */
export async function fetchMatchScorecard(
    matchId: string
): Promise<ScorecardResponse> {
    return fetchFromApi<ScorecardResponse>("/match_scorecard", { id: matchId });
}

/**
 * Fetch all cricket series
 * @param offset - Pagination offset (optional)
 */
export async function fetchSeries(offset?: number): Promise<SeriesResponse> {
    const params: Record<string, string> = {};
    if (offset !== undefined) {
        params.offset = offset.toString();
    }
    return fetchFromApi<SeriesResponse>("/series", params);
}

/**
 * Fetch player information
 * @param playerId - The player ID
 */
export async function fetchPlayerInfo(
    playerId: string
): Promise<PlayerInfoResponse> {
    return fetchFromApi<PlayerInfoResponse>("/players_info", { id: playerId });
}

/**
 * Check API status and remaining credits
 */
export async function checkApiStatus(): Promise<{
    hitsToday: number;
    hitsLimit: number;
    remaining: number;
}> {
    try {
        const response = await fetchCurrentMatches();
        return {
            hitsToday: response.info.hitsToday,
            hitsLimit: response.info.hitsLimit,
            remaining: response.info.hitsLimit - response.info.hitsToday,
        };
    } catch (error) {
        throw new CricApiError(
            `Failed to check API status: ${error instanceof Error ? error.message : "Unknown error"}`
        );
    }
}
