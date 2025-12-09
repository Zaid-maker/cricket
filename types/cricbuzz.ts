
export interface CricbuzzMatchInfo {
    matchId: number;
    seriesId: number;
    seriesName: string;
    matchDesc: string;
    matchFormat: string;
    startDate: string; // timestamp string
    endDate: string;
    state: string; // e.g., "Complete", "In Progress"
    status: string; // e.g., "Nigeria won by 23 runs"
    team1: CricbuzzTeam;
    team2: CricbuzzTeam;
    venueInfo?: { // inferred
        id: number;
        ground: string;
        city: string;
        country?: string;
        timezone: string;
    };
    currentBatTeamId?: number; // might be in matchInfo or separate
}

export interface CricbuzzTeam {
    teamId: number;
    teamName: string;
    teamSName: string;
    imageId?: number;
}

export interface CricbuzzLiveMatchItem {
    matchInfo: CricbuzzMatchInfo;
    matchScore?: {
        team1Score?: {
            inngs1?: { runs?: number; wickets?: number; overs?: number | string };
        };
        team2Score?: {
            inngs1?: { runs?: number; wickets?: number; overs?: number | string };
        };
    };
}

export interface CricbuzzLiveResponse {
    typeMatches: Array<{
        matchType: string;
        seriesMatches: Array<{
            seriesAdWrapper?: {
                seriesId: number;
                seriesName: string;
                matches: Array<CricbuzzLiveMatchItem>;
            };
        }>;
    }>;
}

export interface CricbuzzBatsman {
    id: number;
    name: string;
    runs: number;
    balls: number;
    fours: number;
    sixes: number;
    strkrate: string;
    outdec: string;
    iscaptain?: boolean;
    iskeeper?: boolean;
}

export interface CricbuzzBowler {
    id: number;
    name: string;
    overs: number;
    maidens: number;
    runs: number;
    wickets: number;
    economy: string; // inferred
    no_balls?: number;
    wides?: number;
}

export interface CricbuzzInnings {
    inningsId: number;
    batsman: CricbuzzBatsman[];
    bowler: CricbuzzBowler[]; // inferred, assuming typical cricbuzz structure
    scoreDetails?: {
        runs: number;
        wickets: number;
        overs: number;
    };
    extras?: {
        total: number;
        byes: number;
        legByes: number;
        wides: number;
        noBalls: number;
    };
}

export interface CricbuzzScorecardResponse {
    scorecard: CricbuzzInnings[];
    matchHeader?: CricbuzzMatchInfo; // sometimes included
}
