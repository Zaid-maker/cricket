
// Cricbuzz API Service (RapidAPI)
import { LiveScoreSummary, Match, Series, Innings, BattingStats, BowlingStats, Player } from "@/types";
import { transformToLiveScoreSummary, transformToFullMatch } from "./transformers";
import { CricbuzzLiveResponse, CricbuzzScorecardResponse, CricbuzzMatchInfo } from "@/types/cricbuzz";

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const RAPIDAPI_HOST = process.env.RAPIDAPI_HOST || "cricbuzz-cricket.p.rapidapi.com";
const BASE_URL = `https://${RAPIDAPI_HOST}`;

// Cache for match list
let matchCache: { data: any[], timestamp: number } | null = null;
const CACHE_TTL = 30 * 1000; // 30 seconds

async function fetchAPI<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
    if (!RAPIDAPI_KEY) {
        throw new Error("RAPIDAPI_KEY is not defined");
    }

    const url = new URL(`${BASE_URL}/${endpoint}`);
    Object.keys(params).forEach((key) => url.searchParams.append(key, params[key]));

    const response = await fetch(url.toString(), {
        headers: {
            "x-rapidapi-key": RAPIDAPI_KEY,
            "x-rapidapi-host": RAPIDAPI_HOST,
        },
        next: { revalidate: 30 },
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error(`API Error (${response.status}):`, errorText);
        throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
}

/**
 * Fetch Live & Recent Matches from Cricbuzz
 */
export async function fetchCurrentMatches(): Promise<LiveScoreSummary[]> {
    try {
        const data = await fetchAPI<CricbuzzLiveResponse>("matches/v1/live");

        // Flatten the nested structure
        const matches: any[] = [];
        if (data?.typeMatches) {
            data.typeMatches.forEach(type => {
                type.seriesMatches?.forEach(series => {
                    const seriesMatches = series.seriesAdWrapper?.matches;
                    if (seriesMatches) {
                        seriesMatches.forEach(m => {
                            // Attach series name to match info for easier access
                            if (m.matchInfo) {
                                (m.matchInfo as any).seriesName = series.seriesAdWrapper?.seriesName;
                            }
                            matches.push(m);
                        });
                    }
                });
            });
        }

        // Update simple cache
        matchCache = { data: matches, timestamp: Date.now() };

        return matches.map(m => transformToLiveScoreSummary(m));
    } catch (error) {
        console.error("Error fetching current matches:", error);
        return [];
    }
}

/**
 * Fetch Match Info
 * Since `matches/get-info` is unreliable, we check our live/recent cache
 * or try to fetch the live list if cache is stale.
 */
export async function fetchMatchInfo(matchId: string): Promise<Match | null> {
    // 1. Try to find basic info in our cache or fetch list
    let basicMatchData = null;

    // Check cache first
    if (matchCache && (Date.now() - matchCache.timestamp < CACHE_TTL)) {
        basicMatchData = matchCache.data.find((m: any) => String(m.matchInfo?.matchId) === matchId);
    }

    if (!basicMatchData) {
        try {
            const data = await fetchAPI<CricbuzzLiveResponse>("matches/v1/live");
            // Quick parse to find match
            if (data?.typeMatches) {
                for (const type of data.typeMatches) {
                    if (basicMatchData) break;
                    for (const series of type.seriesMatches || []) {
                        if (basicMatchData) break;
                        for (const m of series.seriesAdWrapper?.matches || []) {
                            if (String(m.matchInfo?.matchId) === matchId) {
                                basicMatchData = m;
                                if (m.matchInfo) (m.matchInfo as any).seriesName = series.seriesAdWrapper?.seriesName;
                                break;
                            }
                        }
                    }
                }
            }
        } catch (e) {
            console.error("Error fetching live list for fallback:", e);
        }
    }

    // If we have basic data, we can start transforming to a Match object
    // Note: The caller usually merges this with scorecard data. 
    // If we return null here, the `getMatchDetails` action might fail or return just scorecard data?
    // We should return what we have.

    if (!basicMatchData) return null;

    // Transform basic data to Match (without innings first)
    // The scorecard call will fill in the innings.
    // We can use transformToFullMatch but might need to adjust it to handle missing innings.
    return transformToFullMatch(basicMatchData, null);
}

/**
 * Fetch Scorecard
 */
export async function fetchMatchScorecard(matchId: string): Promise<CricbuzzScorecardResponse | null> {
    try {
        const data = await fetchAPI<CricbuzzScorecardResponse>(`mcenter/v1/${matchId}/hscard`);
        return data;
    } catch (error) {
        console.error(`Error fetching scorecard for ${matchId}:`, error);
        return null;
    }
}

export async function fetchSeries(): Promise<Series[]> {
    // Placeholder - Cricbuzz series endpoint not inspected yet
    return [];
}

export async function fetchPlayerInfo(id: string): Promise<Player | null> {
    return null; // Not implemented yet
}
