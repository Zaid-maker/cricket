// Cricket Constants

import type {
    MatchFormat,
    MatchStatus,
    PlayerRole,
    WicketType,
    ExtraType,
} from "@/types";

// Match Formats with display names
export const MATCH_FORMATS: Record<MatchFormat, { label: string; overs: number | null }> = {
    T10: { label: "T10", overs: 10 },
    T20: { label: "T20", overs: 20 },
    THE_HUNDRED: { label: "The Hundred", overs: null }, // Ball based
    ODI: { label: "ODI", overs: 50 },
    TEST: { label: "Test", overs: null }, // Unlimited
};

// Match Status with display names and colors
export const MATCH_STATUSES: Record<
    MatchStatus,
    { label: string; color: string; bgColor: string }
> = {
    LIVE: { label: "LIVE", color: "text-red-600", bgColor: "bg-red-500" },
    UPCOMING: { label: "Upcoming", color: "text-blue-600", bgColor: "bg-blue-500" },
    COMPLETED: { label: "Completed", color: "text-gray-600", bgColor: "bg-gray-500" },
    ABANDONED: { label: "Abandoned", color: "text-orange-600", bgColor: "bg-orange-500" },
    NO_RESULT: { label: "No Result", color: "text-gray-500", bgColor: "bg-gray-400" },
    DELAYED: { label: "Delayed", color: "text-yellow-600", bgColor: "bg-yellow-500" },
    INNINGS_BREAK: { label: "Innings Break", color: "text-purple-600", bgColor: "bg-purple-500" },
    TEA: { label: "Tea", color: "text-green-600", bgColor: "bg-green-500" },
    LUNCH: { label: "Lunch", color: "text-green-600", bgColor: "bg-green-500" },
    DRINKS: { label: "Drinks", color: "text-blue-400", bgColor: "bg-blue-400" },
};

// Player Roles
export const PLAYER_ROLES: Record<PlayerRole, string> = {
    BATSMAN: "Batsman",
    BOWLER: "Bowler",
    ALL_ROUNDER: "All-rounder",
    WICKET_KEEPER: "Wicket Keeper",
    WICKET_KEEPER_BATSMAN: "WK-Batsman",
};

// Wicket Types
export const WICKET_TYPES: Record<WicketType, string> = {
    BOWLED: "Bowled",
    CAUGHT: "Caught",
    CAUGHT_AND_BOWLED: "Caught & Bowled",
    LBW: "LBW",
    RUN_OUT: "Run Out",
    STUMPED: "Stumped",
    HIT_WICKET: "Hit Wicket",
    RETIRED_HURT: "Retired Hurt",
    RETIRED_OUT: "Retired Out",
    HANDLED_BALL: "Handled Ball",
    OBSTRUCTING_FIELD: "Obstructing Field",
    TIMED_OUT: "Timed Out",
};

// Extra Types
export const EXTRA_TYPES: Record<ExtraType, { label: string; abbr: string }> = {
    WIDE: { label: "Wide", abbr: "wd" },
    NO_BALL: { label: "No Ball", abbr: "nb" },
    BYE: { label: "Bye", abbr: "b" },
    LEG_BYE: { label: "Leg Bye", abbr: "lb" },
    PENALTY: { label: "Penalty", abbr: "pen" },
};

// Ball outcome symbols for scoreboard
export const BALL_SYMBOLS = {
    DOT: "•",
    WICKET: "W",
    WIDE: "wd",
    NO_BALL: "nb",
    BYE: "b",
    LEG_BYE: "lb",
    FOUR: "4",
    SIX: "6",
} as const;

// Powerplay configuration
export const POWERPLAY_CONFIG = {
    T20: {
        mandatory: { start: 1, end: 6 },
    },
    ODI: {
        powerplay1: { start: 1, end: 10 },
        powerplay2: { start: 11, end: 40 },
        powerplay3: { start: 41, end: 50 },
    },
} as const;

// DRS (Decision Review System)
export const DRS_CONFIG = {
    T20: { reviews: 2, topUp: false },
    ODI: { reviews: 2, topUp: true, topUpAt: 80 },
    TEST: { reviews: 2, topUp: true, topUpAt: 80 },
} as const;

// Over milestones
export const OVER_MILESTONES = {
    T20: [6, 15, 20],
    ODI: [10, 35, 50],
} as const;
