// Mock Match Data for Development

import type { Match, LiveScoreSummary } from "@/types";
import { INTERNATIONAL_TEAMS, IPL_TEAMS } from "@/constants/teams";

// Helper to create a date relative to now
const getRelativeDate = (hoursOffset: number): Date => {
    const date = new Date();
    date.setHours(date.getHours() + hoursOffset);
    return date;
};

// Live Matches
export const liveMatches: LiveScoreSummary[] = [
    {
        matchId: "match-1",
        format: "T20",
        status: "LIVE",
        statusText: "India need 42 runs from 24 balls",
        team1: {
            name: "Australia",
            shortName: "AUS",
            score: "186/5",
            overs: "20.0",
        },
        team2: {
            name: "India",
            shortName: "IND",
            score: "145/4",
            overs: "16.0",
        },
        venue: "Melbourne Cricket Ground, Melbourne",
        startTime: getRelativeDate(-2),
        isLive: true,
    },
    {
        matchId: "match-2",
        format: "TEST",
        status: "LIVE",
        statusText: "Day 2 - Session 2",
        team1: {
            name: "England",
            shortName: "ENG",
            score: "312/7",
            overs: "89.2",
        },
        team2: {
            name: "South Africa",
            shortName: "SA",
            score: undefined,
            overs: undefined,
        },
        venue: "Lord's Cricket Ground, London",
        startTime: getRelativeDate(-8),
        isLive: true,
    },
    {
        matchId: "match-3",
        format: "ODI",
        status: "INNINGS_BREAK",
        statusText: "Innings Break",
        team1: {
            name: "Pakistan",
            shortName: "PAK",
            score: "287/8",
            overs: "50.0",
        },
        team2: {
            name: "New Zealand",
            shortName: "NZ",
            score: undefined,
            overs: undefined,
        },
        venue: "National Stadium, Karachi",
        startTime: getRelativeDate(-4),
        isLive: true,
    },
];

// Upcoming Matches
export const upcomingMatches: LiveScoreSummary[] = [
    {
        matchId: "match-4",
        format: "T20",
        status: "UPCOMING",
        statusText: "1st T20I",
        team1: {
            name: "India",
            shortName: "IND",
        },
        team2: {
            name: "Sri Lanka",
            shortName: "SL",
        },
        venue: "Wankhede Stadium, Mumbai",
        startTime: getRelativeDate(24),
        isLive: false,
    },
    {
        matchId: "match-5",
        format: "ODI",
        status: "UPCOMING",
        statusText: "2nd ODI",
        team1: {
            name: "West Indies",
            shortName: "WI",
        },
        team2: {
            name: "Bangladesh",
            shortName: "BAN",
        },
        venue: "Kensington Oval, Bridgetown",
        startTime: getRelativeDate(48),
        isLive: false,
    },
];

// Recent/Completed Matches
export const completedMatches: LiveScoreSummary[] = [
    {
        matchId: "match-6",
        format: "T20",
        status: "COMPLETED",
        statusText: "Australia won by 5 wickets",
        team1: {
            name: "New Zealand",
            shortName: "NZ",
            score: "164/7",
            overs: "20.0",
        },
        team2: {
            name: "Australia",
            shortName: "AUS",
            score: "165/5",
            overs: "18.4",
        },
        venue: "Eden Park, Auckland",
        startTime: getRelativeDate(-24),
        isLive: false,
    },
    {
        matchId: "match-7",
        format: "TEST",
        status: "COMPLETED",
        statusText: "India won by an innings and 64 runs",
        team1: {
            name: "India",
            shortName: "IND",
            score: "487/6d",
            overs: "112.0",
        },
        team2: {
            name: "England",
            shortName: "ENG",
            score: "218 & 205",
            overs: "58.4",
        },
        venue: "MA Chidambaram Stadium, Chennai",
        startTime: getRelativeDate(-72),
        isLive: false,
    },
];

// All Matches Combined
export const allMatches = [
    ...liveMatches,
    ...upcomingMatches,
    ...completedMatches,
];

// Full Match Detail (example)
export const sampleMatchDetail: Match = {
    id: "match-1",
    seriesId: "series-1",
    seriesName: "Australia vs India T20 Series 2024",
    matchNumber: 3,
    format: "T20",
    status: "LIVE",
    statusText: "India need 42 runs from 24 balls",
    team1: {
        id: "aus",
        name: "Australia",
        shortName: "AUS",
        code: "AUS",
        primaryColor: INTERNATIONAL_TEAMS.AUS.primaryColor,
        secondaryColor: INTERNATIONAL_TEAMS.AUS.secondaryColor,
    },
    team2: {
        id: "ind",
        name: "India",
        shortName: "IND",
        code: "IND",
        primaryColor: INTERNATIONAL_TEAMS.IND.primaryColor,
        secondaryColor: INTERNATIONAL_TEAMS.IND.secondaryColor,
    },
    tossWinner: "India",
    tossDecision: "BOWL",
    venue: {
        id: "mcg",
        name: "Melbourne Cricket Ground",
        city: "Melbourne",
        country: "Australia",
        capacity: 100024,
    },
    startTime: getRelativeDate(-2),
    innings: [
        {
            id: "inn-1",
            inningsNumber: 1,
            battingTeamId: "aus",
            bowlingTeamId: "ind",
            runs: 186,
            wickets: 5,
            overs: 20,
            balls: 0,
            runRate: 9.3,
            extras: {
                wides: 6,
                noBalls: 2,
                byes: 1,
                legByes: 3,
                penalties: 0,
                total: 12,
            },
            batting: [
                {
                    playerId: "p1",
                    playerName: "David Warner",
                    runs: 78,
                    balls: 52,
                    fours: 8,
                    sixes: 3,
                    strikeRate: 150.0,
                    isOut: true,
                    wicketType: "CAUGHT",
                    dismissedBy: "Bumrah",
                    position: 1,
                },
                {
                    playerId: "p2",
                    playerName: "Travis Head",
                    runs: 54,
                    balls: 38,
                    fours: 5,
                    sixes: 2,
                    strikeRate: 142.1,
                    isOut: true,
                    wicketType: "BOWLED",
                    dismissedBy: "Chahal",
                    position: 2,
                },
            ],
            bowling: [
                {
                    playerId: "p3",
                    playerName: "Jasprit Bumrah",
                    overs: 4,
                    maidens: 0,
                    runs: 28,
                    wickets: 2,
                    economy: 7.0,
                    wides: 1,
                    noBalls: 0,
                    dotBalls: 10,
                },
            ],
            fallOfWickets: [
                {
                    wicketNumber: 1,
                    runs: 89,
                    overs: 10.2,
                    playerId: "p1",
                    playerName: "David Warner",
                },
            ],
            partnerships: [],
            recentOvers: [],
            isCompleted: true,
        },
        {
            id: "inn-2",
            inningsNumber: 2,
            battingTeamId: "ind",
            bowlingTeamId: "aus",
            runs: 145,
            wickets: 4,
            overs: 16,
            balls: 0,
            runRate: 9.06,
            requiredRunRate: 10.5,
            target: 187,
            extras: {
                wides: 4,
                noBalls: 1,
                byes: 2,
                legByes: 0,
                penalties: 0,
                total: 7,
            },
            batting: [
                {
                    playerId: "p4",
                    playerName: "Virat Kohli",
                    runs: 68,
                    balls: 42,
                    fours: 6,
                    sixes: 2,
                    strikeRate: 161.9,
                    isOut: false,
                    isOnStrike: true,
                    position: 3,
                },
                {
                    playerId: "p5",
                    playerName: "Hardik Pandya",
                    runs: 32,
                    balls: 18,
                    fours: 3,
                    sixes: 2,
                    strikeRate: 177.8,
                    isOut: false,
                    isOnStrike: false,
                    position: 5,
                },
            ],
            bowling: [
                {
                    playerId: "p6",
                    playerName: "Pat Cummins",
                    overs: 3,
                    maidens: 0,
                    runs: 32,
                    wickets: 1,
                    economy: 10.67,
                    wides: 2,
                    noBalls: 0,
                    dotBalls: 5,
                },
            ],
            fallOfWickets: [],
            partnerships: [],
            recentOvers: [],
            isCompleted: false,
        },
    ],
    currentInnings: 2,
    isLive: true,
    lastUpdated: new Date(),
};

// Featured Series
export const featuredSeries = [
    {
        id: "series-1",
        name: "Australia vs India T20 Series 2024",
        matches: 5,
        currentStatus: "Match 3 of 5",
        startDate: "Dec 1, 2024",
        endDate: "Dec 15, 2024",
    },
    {
        id: "series-2",
        name: "IPL 2025",
        matches: 74,
        currentStatus: "Upcoming",
        startDate: "Mar 22, 2025",
        endDate: "May 26, 2025",
    },
    {
        id: "series-3",
        name: "ICC Champions Trophy 2025",
        matches: 15,
        currentStatus: "Upcoming",
        startDate: "Feb 19, 2025",
        endDate: "Mar 9, 2025",
    },
];
