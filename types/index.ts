// Cricket App Type Definitions

// Match Formats
export type MatchFormat = "T20" | "ODI" | "TEST" | "T10" | "THE_HUNDRED";

// Match Status
export type MatchStatus =
    | "LIVE"
    | "UPCOMING"
    | "COMPLETED"
    | "ABANDONED"
    | "NO_RESULT"
    | "DELAYED"
    | "INNINGS_BREAK"
    | "TEA"
    | "LUNCH"
    | "DRINKS";

// Player Role
export type PlayerRole =
    | "BATSMAN"
    | "BOWLER"
    | "ALL_ROUNDER"
    | "WICKET_KEEPER"
    | "WICKET_KEEPER_BATSMAN";

// Bowling Style
export type BowlingStyle =
    | "RIGHT_ARM_FAST"
    | "RIGHT_ARM_MEDIUM"
    | "RIGHT_ARM_MEDIUM_FAST"
    | "LEFT_ARM_FAST"
    | "LEFT_ARM_MEDIUM"
    | "LEFT_ARM_MEDIUM_FAST"
    | "RIGHT_ARM_OFF_SPIN"
    | "RIGHT_ARM_LEG_SPIN"
    | "LEFT_ARM_ORTHODOX"
    | "LEFT_ARM_CHINAMAN";

// Batting Style
export type BattingStyle = "RIGHT_HAND" | "LEFT_HAND";

// Wicket Types
export type WicketType =
    | "BOWLED"
    | "CAUGHT"
    | "CAUGHT_AND_BOWLED"
    | "LBW"
    | "RUN_OUT"
    | "STUMPED"
    | "HIT_WICKET"
    | "RETIRED_HURT"
    | "RETIRED_OUT"
    | "HANDLED_BALL"
    | "OBSTRUCTING_FIELD"
    | "TIMED_OUT";

// Extra Types
export type ExtraType = "WIDE" | "NO_BALL" | "BYE" | "LEG_BYE" | "PENALTY";

// Player Interface
export interface Player {
    id: string;
    name: string;
    shortName: string;
    country: string;
    role: PlayerRole;
    battingStyle: BattingStyle;
    bowlingStyle?: BowlingStyle;
    imageUrl?: string;
    jerseyNumber?: number;
}

// Team Interface
export interface Team {
    id: string;
    name: string;
    shortName: string; // e.g., "IND", "AUS"
    code: string;
    flagUrl?: string;
    primaryColor: string;
    secondaryColor: string;
    players?: Player[];
}

// Batting Stats (for a batsman in an innings)
export interface BattingStats {
    playerId: string;
    playerName: string;
    runs: number;
    balls: number;
    fours: number;
    sixes: number;
    strikeRate: number;
    isOut: boolean;
    isOnStrike?: boolean;
    wicketType?: WicketType;
    dismissedBy?: string; // Bowler/Fielder name
    position: number; // Batting position (1-11)
}

// Bowling Stats (for a bowler in an innings)
export interface BowlingStats {
    playerId: string;
    playerName: string;
    overs: number;
    maidens: number;
    runs: number;
    wickets: number;
    economy: number;
    wides: number;
    noBalls: number;
    dotBalls: number;
}

// Ball/Delivery Interface
export interface Ball {
    id: string;
    overNumber: number;
    ballNumber: number;
    batsmanId: string;
    bowlerId: string;
    runs: number;
    extras: number;
    extraType?: ExtraType;
    isWicket: boolean;
    wicketType?: WicketType;
    dismissedPlayerId?: string;
    fielderId?: string;
    isBoundary: boolean;
    isSix: boolean;
    commentary?: string;
    timestamp: Date;
}

// Over Summary
export interface Over {
    overNumber: number;
    bowlerId: string;
    bowlerName: string;
    runs: number;
    wickets: number;
    balls: Ball[];
}

// Partnership
export interface Partnership {
    batsman1Id: string;
    batsman1Name: string;
    batsman1Runs: number;
    batsman2Id: string;
    batsman2Name: string;
    batsman2Runs: number;
    totalRuns: number;
    balls: number;
    wicketNumber: number;
}

// Innings Interface
export interface Innings {
    id: string;
    inningsNumber: number;
    battingTeamId: string;
    bowlingTeamId: string;
    runs: number;
    wickets: number;
    overs: number;
    balls: number; // balls in current over
    runRate: number;
    requiredRunRate?: number;
    target?: number;
    extras: {
        wides: number;
        noBalls: number;
        byes: number;
        legByes: number;
        penalties: number;
        total: number;
    };
    batting: BattingStats[];
    bowling: BowlingStats[];
    fallOfWickets: {
        wicketNumber: number;
        runs: number;
        overs: number;
        playerId: string;
        playerName: string;
    }[];
    partnerships: Partnership[];
    recentOvers: Over[];
    isCompleted: boolean;
    isDeclared?: boolean; // For Test matches
}

// Venue Interface
export interface Venue {
    id: string;
    name: string;
    city: string;
    country: string;
    capacity?: number;
    timezone?: string;
}

// Series Interface
export interface Series {
    id: string;
    name: string;
    startDate: Date;
    endDate: Date;
    format: MatchFormat;
    totalMatches: number;
}

// Match Interface
export interface Match {
    id: string;
    seriesId?: string;
    seriesName?: string;
    matchNumber?: number; // e.g., "3rd T20I"
    format: MatchFormat;
    status: MatchStatus;
    statusText: string; // e.g., "India won by 5 wickets"

    // Teams
    team1: Team;
    team2: Team;
    tossWinner?: string;
    tossDecision?: "BAT" | "BOWL";

    // Venue & Time
    venue: Venue;
    startTime: Date;
    endTime?: Date;

    // Scores
    innings: Innings[];
    currentInnings?: number;

    // Live match specific
    isLive: boolean;
    lastUpdated?: Date;

    // Result
    winner?: string;
    resultMargin?: string; // e.g., "5 wickets", "34 runs"
    manOfTheMatch?: Player;
}

// Live Score Summary (for cards/widgets)
export interface LiveScoreSummary {
    matchId: string;
    format: MatchFormat;
    status: MatchStatus;
    statusText: string;
    team1: {
        name: string;
        shortName: string;
        score?: string; // e.g., "185/4"
        overs?: string; // e.g., "18.2"
    };
    team2: {
        name: string;
        shortName: string;
        score?: string;
        overs?: string;
    };
    venue: string;
    startTime: Date;
    isLive: boolean;
}

// News Article
export interface NewsArticle {
    id: string;
    title: string;
    summary: string;
    content?: string;
    imageUrl?: string;
    author?: string;
    publishedAt: Date;
    category: "NEWS" | "MATCH_REPORT" | "FEATURE" | "INTERVIEW" | "OPINION";
    tags?: string[];
    relatedMatchId?: string;
}

// Rankings
export interface PlayerRanking {
    rank: number;
    previousRank: number;
    playerId: string;
    playerName: string;
    country: string;
    rating: number;
}

export interface TeamRanking {
    rank: number;
    previousRank: number;
    teamId: string;
    teamName: string;
    rating: number;
    matches: number;
    points: number;
}

// API Response Types
export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
    error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
