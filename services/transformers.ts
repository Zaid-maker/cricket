// Data Transformers
// Transform API responses to app types

import type {
    ApiMatch,
    ApiMatchInfo,
    ApiSeries,
    ApiTeamScore,
    ApiTeamInfo,
    ApiScorecardInnings,
    ApiScorecardBatting,
    ApiScorecardBowling,
} from "@/types/api";

import type {
    LiveScoreSummary,
    MatchFormat,
    MatchStatus,
    Match,
    Team,
    Innings,
    BattingStats,
    BowlingStats,
    Series,
} from "@/types";

/**
 * Transform API match type to app MatchFormat
 */
export function transformMatchFormat(apiType: string): MatchFormat {
    const formatMap: Record<string, MatchFormat> = {
        t20: "T20",
        t10: "T10",
        odi: "ODI",
        test: "TEST",
        the_hundred: "THE_HUNDRED",
    };
    return formatMap[apiType.toLowerCase()] || "T20";
}

/**
 * Transform API match to MatchStatus
 */
export function transformMatchStatus(
    matchStarted: boolean,
    matchEnded: boolean,
    status: string
): MatchStatus {
    if (!matchStarted) return "UPCOMING";
    if (matchEnded) return "COMPLETED";

    // Check for breaks
    const lowerStatus = status.toLowerCase();
    if (lowerStatus.includes("innings break")) return "INNINGS_BREAK";
    if (lowerStatus.includes("lunch")) return "LUNCH";
    if (lowerStatus.includes("tea")) return "TEA";
    if (lowerStatus.includes("drinks")) return "DRINKS";
    if (lowerStatus.includes("rain") || lowerStatus.includes("delay")) return "DELAYED";

    return "LIVE";
}

/**
 * Format score from API response
 */
function formatScore(score?: ApiTeamScore): string | undefined {
    if (!score) return undefined;
    return `${score.r}/${score.w}`;
}

/**
 * Format overs from API response
 */
function formatOvers(score?: ApiTeamScore): string | undefined {
    if (!score) return undefined;
    return score.o.toString();
}

/**
 * Transform API match to LiveScoreSummary (for cards/widgets)
 */
export function transformToScoreSummary(match: ApiMatch): LiveScoreSummary {
    const team1 = match.teams[0] || "TBD";
    const team2 = match.teams[1] || "TBD";

    // Find team info and scores
    const team1Info = match.teamInfo?.find(
        (t) => t.name.toLowerCase() === team1.toLowerCase()
    );
    const team2Info = match.teamInfo?.find(
        (t) => t.name.toLowerCase() === team2.toLowerCase()
    );

    // Scores are ordered by innings, find latest for each team
    const team1Score = match.score?.find((s) =>
        s.inning.toLowerCase().includes(team1.toLowerCase())
    );
    const team2Score = match.score?.find((s) =>
        s.inning.toLowerCase().includes(team2.toLowerCase())
    );

    return {
        matchId: match.id,
        format: transformMatchFormat(match.matchType),
        status: transformMatchStatus(match.matchStarted, match.matchEnded, match.status),
        statusText: match.status,
        team1: {
            name: team1,
            shortName: team1Info?.shortname || team1.substring(0, 3).toUpperCase(),
            score: formatScore(team1Score),
            overs: formatOvers(team1Score),
        },
        team2: {
            name: team2,
            shortName: team2Info?.shortname || team2.substring(0, 3).toUpperCase(),
            score: formatScore(team2Score),
            overs: formatOvers(team2Score),
        },
        venue: match.venue,
        startTime: new Date(match.dateTimeGMT),
        isLive: match.matchStarted && !match.matchEnded,
    };
}

/**
 * Transform API team info to app Team type
 */
export function transformTeam(
    name: string,
    teamInfo?: ApiTeamInfo
): Team {
    return {
        id: name.toLowerCase().replace(/\s+/g, "-"),
        name: name,
        shortName: teamInfo?.shortname || name.substring(0, 3).toUpperCase(),
        code: teamInfo?.shortname || name.substring(0, 3).toUpperCase(),
        primaryColor: "#1e4d8c", // Default color
        secondaryColor: "#ffffff",
        flagUrl: teamInfo?.img,
    };
}

/**
 * Transform API series to app Series type
 */
export function transformSeries(apiSeries: ApiSeries): Series {
    // Determine format based on match counts
    let format: MatchFormat = "T20";
    if (apiSeries.test > 0) format = "TEST";
    else if (apiSeries.odi > 0) format = "ODI";
    else if (apiSeries.t20 > 0) format = "T20";

    return {
        id: apiSeries.id,
        name: apiSeries.name,
        startDate: new Date(apiSeries.startDate),
        endDate: new Date(apiSeries.endDate),
        format,
        totalMatches: apiSeries.matches,
    };
}

/**
 * Transform scorecard batting entry to BattingStats
 */
export function transformBattingStats(
    batting: ApiScorecardBatting,
    position: number
): BattingStats {
    return {
        playerId: batting.batsman.id,
        playerName: batting.batsman.name,
        runs: batting.r,
        balls: batting.b,
        fours: batting["4s"],
        sixes: batting["6s"],
        strikeRate: batting.sr,
        isOut: batting.dismissal !== "not out",
        position,
    };
}

/**
 * Transform scorecard bowling entry to BowlingStats
 */
export function transformBowlingStats(bowling: ApiScorecardBowling): BowlingStats {
    return {
        playerId: bowling.bowler.id,
        playerName: bowling.bowler.name,
        overs: bowling.o,
        maidens: bowling.m,
        runs: bowling.r,
        wickets: bowling.w,
        economy: bowling.eco,
        wides: bowling.wd,
        noBalls: bowling.nb,
        dotBalls: 0, // Not provided by API
    };
}

/**
 * Transform scorecard innings to app Innings type
 */
export function transformInnings(
    innings: ApiScorecardInnings,
    inningsNumber: number,
    battingTeamId: string,
    bowlingTeamId: string
): Innings {
    const [runs, wickets] = innings.totals.R.split("/").map(Number);
    const overs = parseFloat(innings.totals.O) || 0;
    const balls = Math.round((overs % 1) * 10);

    return {
        id: `innings-${inningsNumber}`,
        inningsNumber,
        battingTeamId,
        bowlingTeamId,
        runs: runs || 0,
        wickets: wickets || 0,
        overs: Math.floor(overs),
        balls,
        runRate: overs > 0 ? Number((runs / overs).toFixed(2)) : 0,
        extras: {
            wides: 0,
            noBalls: 0,
            byes: innings.extras.b,
            legByes: 0,
            penalties: 0,
            total: innings.extras.r,
        },
        batting: innings.batting.map((b, i) => transformBattingStats(b, i + 1)),
        bowling: innings.bowling.map(transformBowlingStats),
        fallOfWickets: [],
        partnerships: [],
        recentOvers: [],
        isCompleted: parseInt(innings.totals.W) >= 10,
    };
}

/**
 * Batch transform multiple API matches to LiveScoreSummary array
 */
export function transformMatches(matches: ApiMatch[]): LiveScoreSummary[] {
    return matches.map(transformToScoreSummary);
}

/**
 * Separate matches by status
 */
export function categorizeMatches(matches: LiveScoreSummary[]): {
    live: LiveScoreSummary[];
    upcoming: LiveScoreSummary[];
    completed: LiveScoreSummary[];
} {
    const live: LiveScoreSummary[] = [];
    const upcoming: LiveScoreSummary[] = [];
    const completed: LiveScoreSummary[] = [];

    for (const match of matches) {
        if (match.isLive) {
            live.push(match);
        } else if (match.status === "UPCOMING") {
            upcoming.push(match);
        } else {
            completed.push(match);
        }
    }

    return { live, upcoming, completed };
}
/**
 * Transform API match info + scorecard to full Match object
 */
export function transformToFullMatch(
    info: ApiMatchInfo | ScorecardResponse["data"],
    scorecardData?: ApiScorecardInnings[]
): Match {
    const team1 = info.teams[0] || "TBD";
    const team2 = info.teams[1] || "TBD";

    // Find team info
    const team1Info = info.teamInfo?.find(
        (t) => t.name.toLowerCase() === team1.toLowerCase()
    );
    const team2Info = info.teamInfo?.find(
        (t) => t.name.toLowerCase() === team2.toLowerCase()
    );

    // Transform teams
    const t1 = transformTeam(team1, team1Info);
    const t2 = transformTeam(team2, team2Info);

    // Transform innings if available
    const innings: Innings[] = [];
    if (scorecardData && scorecardData.length > 0) {
        scorecardData.forEach((inn, index) => {
            // Determine batting/bowling teams based on inning name
            let battingTeamId = t1.id;
            let bowlingTeamId = t2.id;

            if (inn.inning.toLowerCase().includes(team2.toLowerCase())) {
                battingTeamId = t2.id;
                bowlingTeamId = t1.id;
            }

            innings.push(transformInnings(inn, index + 1, battingTeamId, bowlingTeamId));
        });
    }

    // Determine current innings
    const currentInnings = innings.length > 0 ? innings.length : 1;

    // Determine status
    const matchStarted = info.status !== "Match not started";
    const matchEnded = info.status.toLowerCase().includes("won") ||
        info.status.toLowerCase().includes("draw") ||
        info.status.toLowerCase().includes("tie") ||
        info.status.toLowerCase().includes("abandoned");

    return {
        id: info.id,
        seriesId: "series_id" in info ? info.series_id : undefined,
        format: transformMatchFormat(info.matchType),
        status: transformMatchStatus(matchStarted, matchEnded, info.status),
        statusText: info.status,
        team1: t1,
        team2: t2,
        venue: {
            id: info.venue,
            name: info.venue,
            city: info.venue.split(",").pop()?.trim() || "",
            country: "",
        },
        startTime: new Date(info.dateTimeGMT),
        innings,
        currentInnings,
        isLive: matchStarted && !matchEnded,
        lastUpdated: new Date(),
        // Result fields can be parsed from statusText if needed
    };
}
