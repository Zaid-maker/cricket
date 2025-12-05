// API Response Types for CricketData.org (CricAPI)

// Generic API Response Info
export interface ApiInfo {
    hitsToday: number;
    hitsUsed: number;
    hitsLimit: number;
    credits: number;
    server: number;
    offsetRows: number;
    totalRows: number;
    queryTime: number;
    s: number;
    cache: number;
}

// Base API Response
export interface BaseApiResponse {
    apikey: string;
    data: unknown;
    status: string;
    info: ApiInfo;
}

// Team Score from API
export interface ApiTeamScore {
    r: number;      // runs
    w: number;      // wickets
    o: number;      // overs
    inning: string; // inning name
}

// Match from Current Matches API
export interface ApiMatch {
    id: string;
    name: string;           // "Team1 vs Team2, Match Number"
    matchType: string;      // "t20", "odi", "test"
    status: string;         // Match status text
    venue: string;
    date: string;           // ISO date string
    dateTimeGMT: string;
    teams: string[];        // [team1, team2]
    teamInfo?: ApiTeamInfo[];
    score?: ApiTeamScore[];
    series_id: string;
    fantasyEnabled: boolean;
    bbbEnabled: boolean;    // Ball by ball enabled
    hasSquad: boolean;
    matchStarted: boolean;
    matchEnded: boolean;
}

// Team Info
export interface ApiTeamInfo {
    name: string;
    shortname: string;
    img: string;
}

// Current Matches Response
export interface CurrentMatchesResponse extends BaseApiResponse {
    data: ApiMatch[];
}

// Series from API
export interface ApiSeries {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    odi: number;
    t20: number;
    test: number;
    squads: number;
    matches: number;
}

// Series Response
export interface SeriesResponse extends BaseApiResponse {
    data: ApiSeries[];
}

// Match Info (Detailed)
export interface ApiMatchInfo {
    id: string;
    name: string;
    matchType: string;
    status: string;
    venue: string;
    date: string;
    dateTimeGMT: string;
    teams: string[];
    teamInfo: ApiTeamInfo[];
    score: ApiTeamScore[];
    tossWinner: string;
    tossChoice: string;
    matchWinner: string;
    series_id: string;
    umpires: string;
    referee: string;
    equation: string;
    venue_info?: {
        city: string;
        country: string;
        timezone: string;
    };
}

// Match Info Response
export interface MatchInfoResponse extends BaseApiResponse {
    data: ApiMatchInfo;
}

// Scorecard Batting Entry
export interface ApiScorecardBatting {
    batsman: {
        id: string;
        name: string;
    };
    dismissal: string;
    "dismissal-text": string;
    r: number;
    b: number;
    "4s": number;
    "6s": number;
    sr: number;
}

// Scorecard Bowling Entry
export interface ApiScorecardBowling {
    bowler: {
        id: string;
        name: string;
    };
    o: number;
    m: number;
    r: number;
    w: number;
    nb: number;
    wd: number;
    eco: number;
}

// Scorecard Innings
export interface ApiScorecardInnings {
    inning: string;
    batting: ApiScorecardBatting[];
    bowling: ApiScorecardBowling[];
    extras: {
        r: number;
        b: number;
    };
    totals: {
        R: string;
        O: string;
        W: string;
    };
}

// Scorecard Response
export interface ScorecardResponse extends BaseApiResponse {
    data: {
        id: string;
        name: string;
        matchType: string;
        status: string;
        venue: string;
        date: string;
        teams: string[];
        teamInfo: ApiTeamInfo[];
        score: ApiTeamScore[];
        scorecard: ApiScorecardInnings[];
    };
}

// Player Info
export interface ApiPlayerInfo {
    id: string;
    name: string;
    country: string;
    role?: string;
    battingStyle?: string;
    bowlingStyle?: string;
    placeOfBirth?: string;
    dateOfBirth?: string;
    stats?: ApiPlayerStats[];
}

// Player Stats
export interface ApiPlayerStats {
    fn: string;  // format name (Test, ODI, T20)
    matchtype: string;
    stat: string;
    value: string;
}

// Player Info Response
export interface PlayerInfoResponse extends BaseApiResponse {
    data: ApiPlayerInfo;
}

// Countries Response
export interface CountriesResponse extends BaseApiResponse {
    data: {
        id: string;
        name: string;
        genericFlag: string;
    }[];
}

// API Error Response
export interface ApiErrorResponse {
    status: string;
    reason?: string;
}
