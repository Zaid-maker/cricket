
import {
    LiveScoreSummary,
    Match,
    Team,
    Innings,
    BattingStats,
    BowlingStats,
    Player,
    Series,
    MatchStatus,
    MatchFormat
} from "@/types";
import { CricbuzzMatchInfo, CricbuzzScorecardResponse, CricbuzzInnings, CricbuzzBatsman, CricbuzzBowler, CricbuzzLiveMatchItem, CricbuzzLiveResponse } from "@/types/cricbuzz";

// --- Helper Functions ---

function getStatusFromState(state: string, _statusText: string): MatchStatus {
    const s = state.toLowerCase();
    if (s === "complete" || s === "result") return "COMPLETED";
    if (s === "in progress" || s === "running" || s === "live") return "LIVE";
    if (s === "abandoned" || s === "no result") return "ABANDONED";
    if (s === "delay") return "DELAYED";
    return "UPCOMING";
}

function parseMatchFormat(format: string): MatchFormat {
    const f = format.toUpperCase();
    if (f === "T20" || f === "ODI" || f === "TEST" || f === "T10" || f === "THE_HUNDRED") {
        return f as MatchFormat;
    }
    return "T20"; // Fallback default
}

function safeParseFloat(val: string | number | undefined): number {
    if (typeof val === "number") return val;
    if (typeof val === "string") return parseFloat(val) || 0;
    return 0;
}

function safeParseInt(val: string | number | undefined): number {
    if (typeof val === "number") return Math.floor(val);
    if (typeof val === "string") return parseInt(val, 10) || 0;
    return 0;
}

// Transform for List View / Live Ticker
export function transformToLiveScoreSummary(apiMatch: CricbuzzLiveMatchItem & { seriesName?: string }): LiveScoreSummary {
    const info = apiMatch.matchInfo;
    const score = apiMatch.matchScore;

    // Note: LiveScoreSummary team objects have optional 'score' and 'overs', 
    // unlike the main Team interface. We construct them explicitly here.

    // Attempt to extract scores
    const t1ScoreStr = score?.team1Score?.inngs1?.runs
        ? `${score.team1Score.inngs1.runs}/${score.team1Score.inngs1.wickets !== undefined ? score.team1Score.inngs1.wickets : 0}`
        : undefined;
    const t1OversStr = score?.team1Score?.inngs1?.overs ? String(score.team1Score.inngs1.overs) : undefined;

    const t2ScoreStr = score?.team2Score?.inngs1?.runs
        ? `${score.team2Score.inngs1.runs}/${score.team2Score.inngs1.wickets !== undefined ? score.team2Score.inngs1.wickets : 0}`
        : undefined;
    const t2OversStr = score?.team2Score?.inngs1?.overs ? String(score.team2Score.inngs1.overs) : undefined;

    return {
        matchId: String(info.matchId),
        seriesName: info.seriesName || apiMatch.seriesName || "",
        team1: {
            name: info.team1.teamName,
            shortName: info.team1.teamSName,
            score: t1ScoreStr,
            overs: t1OversStr,
        },
        team2: {
            name: info.team2.teamName,
            shortName: info.team2.teamSName,
            score: t2ScoreStr,
            overs: t2OversStr,
        },
        status: getStatusFromState(info.state, info.status),
        statusText: info.status,
        venue: info.venueInfo?.ground || "Unknown Venue",
        startTime: new Date(Number(info.startDate)),
        format: parseMatchFormat(info.matchFormat),
        isLive: info.state.toLowerCase() === "in progress"
    };
}

// Transform for Match Detail Page
export function transformToFullMatch(
    apiMatch: CricbuzzLiveMatchItem & { seriesName?: string },
    scorecardData: CricbuzzScorecardResponse | null
): Match | null {
    if (!apiMatch) return null;

    const info = apiMatch.matchInfo;

    // Transform Innings if available
    let innings: Innings[] = [];
    if (scorecardData && scorecardData.scorecard) {
        innings = scorecardData.scorecard.map(inng => transformInnings(inng, info));
    }

    // Map strict Team objects (no scores here)
    const team1: Team = {
        id: String(info.team1.teamId),
        name: info.team1.teamName,
        shortName: info.team1.teamSName,
        code: info.team1.teamSName, // using shortName as code
        primaryColor: "#000", // Default
        secondaryColor: "#fff",
        flagUrl: info.team1.imageId ? `https://i.cricdb.com/images/${info.team1.imageId}.jpg` : undefined
    };

    const team2: Team = {
        id: String(info.team2.teamId),
        name: info.team2.teamName,
        shortName: info.team2.teamSName,
        code: info.team2.teamSName,
        primaryColor: "#000",
        secondaryColor: "#fff",
        flagUrl: info.team2.imageId ? `https://i.cricdb.com/images/${info.team2.imageId}.jpg` : undefined
    };

    return {
        id: String(info.matchId),
        seriesId: String(info.seriesId),
        seriesName: info.seriesName || apiMatch.seriesName,
        matchNumber: 0,
        format: parseMatchFormat(info.matchFormat),
        status: getStatusFromState(info.state, info.status),
        statusText: info.status,
        team1,
        team2,
        venue: {
            id: String(info.venueInfo?.id || "0"),
            name: info.venueInfo?.ground || "Unknown Venue",
            city: info.venueInfo?.city || "",
            country: info.venueInfo?.country || "",
        },
        startTime: new Date(Number(info.startDate)),
        endTime: new Date(Number(info.endDate)),
        innings,
        isLive: info.state.toLowerCase() === "in progress",
        lastUpdated: new Date()
    };
}

export function addScorecardToMatch(match: Match, scorecardData: CricbuzzScorecardResponse): Match {
    if (!scorecardData || !scorecardData.scorecard) return match;

    // We need to reconstruct minimal match info for transformInnings to work 
    // (it needs team IDs to map batting/bowling teams)
    // We can extract IDs from the Match object itself since we mapped them into id fields.
    const minimalMatchInfo = {
        team1: { teamId: Number(match.team1.id), teamName: match.team1.name },
        team2: { teamId: Number(match.team2.id), teamName: match.team2.name }
    } as unknown as CricbuzzMatchInfo;

    const innings = scorecardData.scorecard.map(inng => transformInnings(inng, minimalMatchInfo));

    return {
        ...match,
        innings: innings
    };
}

function transformInnings(inng: CricbuzzInnings, matchInfo: CricbuzzMatchInfo): Innings {
    const isTeam1 = inng.inningsId === 1 || inng.inningsId === 3;
    const battingTeamId = isTeam1 ? String(matchInfo.team1.teamId) : String(matchInfo.team2.teamId);
    const bowlingTeamId = isTeam1 ? String(matchInfo.team2.teamId) : String(matchInfo.team1.teamId);

    return {
        id: String(inng.inningsId),
        inningsNumber: inng.inningsId,
        battingTeamId: battingTeamId,
        bowlingTeamId: bowlingTeamId,
        runs: safeParseInt(inng.scoreDetails?.runs),
        wickets: safeParseInt(inng.scoreDetails?.wickets),
        overs: safeParseFloat(inng.scoreDetails?.overs), // number in type
        balls: 0,
        runRate: safeParseFloat(inng.scoreDetails?.runRate),
        extras: {
            wides: inng.extras?.wides || 0,
            noBalls: inng.extras?.noBalls || 0,
            byes: inng.extras?.byes || 0,
            legByes: inng.extras?.legByes || 0,
            penalties: 0,
            total: inng.extras?.total || 0
        },
        batting: (inng.batsman || []).map(b => transformBattingStats(b)),
        bowling: (inng.bowler || []).map(b => transformBowlingStats(b)),
        fallOfWickets: [],
        partnerships: [],
        recentOvers: [],
        isCompleted: false
    };
}

function transformBattingStats(b: CricbuzzBatsman): BattingStats {
    const isOut = !!b.outdec;

    return {
        playerId: String(b.id),
        playerName: b.name,
        runs: safeParseInt(b.runs),
        balls: safeParseInt(b.balls),
        fours: safeParseInt(b.fours),
        sixes: safeParseInt(b.sixes),
        strikeRate: safeParseFloat(b.strkrate),
        isOut: isOut,
        dismissedBy: b.outdec || undefined,
        position: 0
    };
}

function transformBowlingStats(b: CricbuzzBowler): BowlingStats {
    return {
        playerId: String(b.id),
        playerName: b.name,
        overs: safeParseFloat(b.overs),
        maidens: safeParseInt(b.maidens),
        runs: safeParseInt(b.runs),
        wickets: safeParseInt(b.wickets),
        economy: safeParseFloat(b.economy),
        wides: safeParseInt(b.wides),
        noBalls: safeParseInt(b.no_balls),
        dotBalls: 0
    };
}

export function transformMatches(data: CricbuzzLiveResponse): LiveScoreSummary[] {
    if (!data || !data.typeMatches) return [];

    // Flatten Cricbuzz nested structure: typeMatches -> seriesMatches -> seriesAdWrapper -> matches
    const summaries: LiveScoreSummary[] = [];

    data.typeMatches.forEach((tm) => {
        if (tm.seriesMatches) {
            tm.seriesMatches.forEach((sm) => {
                if (sm.seriesAdWrapper && sm.seriesAdWrapper.matches) {
                    sm.seriesAdWrapper.matches.forEach((m) => {
                        // We need to treat 'm' as mutable/intersected to inject seriesName
                        const matchWithSeries = m as CricbuzzLiveMatchItem & { seriesName?: string };

                        // Inject series name if missing in match info, though cricbuzz usually has it
                        if (!matchWithSeries.matchInfo.seriesName) matchWithSeries.seriesName = sm.seriesAdWrapper?.seriesName;
                        summaries.push(transformToLiveScoreSummary(matchWithSeries));
                    });
                }
            });
        }
    });

    return summaries;
}

export function categorizeMatches(matches: LiveScoreSummary[]): { live: LiveScoreSummary[], upcoming: LiveScoreSummary[], completed: LiveScoreSummary[] } {
    const live = matches.filter(m => m.status === "LIVE" || m.status === "INNINGS_BREAK" || m.status === "TEA" || m.status === "LUNCH" || m.status === "DRINKS" || m.status === "DELAYED");
    const upcoming = matches.filter(m => m.status === "UPCOMING");
    const completed = matches.filter(m => m.status === "COMPLETED" || m.status === "ABANDONED" || m.status === "NO_RESULT");
    return { live, upcoming, completed };
}

// Keeping these as 'any' for now as we don't have upstream types yet, but could add TODO
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function transformSeries(s: any): Series {
    return {
        id: String(s.id),
        name: s.name,
        startDate: new Date(),
        endDate: new Date(),
        format: "ODI", // placeholder
        totalMatches: 0
    };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function transformPlayer(p: any): Player {
    return {
        id: String(p.id),
        name: p.name,
        shortName: p.name, // simplification
        country: p.country,
        role: "BATSMAN", // placeholder
        battingStyle: "RIGHT_HAND", // placeholder
        imageUrl: p.image
    };
}
