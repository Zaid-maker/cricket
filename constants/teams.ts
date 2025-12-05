// Team Constants

export interface TeamInfo {
    id: string;
    name: string;
    shortName: string;
    code: string;
    primaryColor: string;
    secondaryColor: string;
    flagEmoji?: string;
}

// International Teams
export const INTERNATIONAL_TEAMS: Record<string, TeamInfo> = {
    IND: {
        id: "ind",
        name: "India",
        shortName: "India",
        code: "IND",
        primaryColor: "#0066b3",
        secondaryColor: "#ff9933",
        flagEmoji: "🇮🇳",
    },
    AUS: {
        id: "aus",
        name: "Australia",
        shortName: "Australia",
        code: "AUS",
        primaryColor: "#ffcc00",
        secondaryColor: "#006400",
        flagEmoji: "🇦🇺",
    },
    ENG: {
        id: "eng",
        name: "England",
        shortName: "England",
        code: "ENG",
        primaryColor: "#002147",
        secondaryColor: "#cf142b",
        flagEmoji: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    },
    PAK: {
        id: "pak",
        name: "Pakistan",
        shortName: "Pakistan",
        code: "PAK",
        primaryColor: "#006400",
        secondaryColor: "#ffffff",
        flagEmoji: "🇵🇰",
    },
    SA: {
        id: "sa",
        name: "South Africa",
        shortName: "South Africa",
        code: "SA",
        primaryColor: "#006400",
        secondaryColor: "#ffc72c",
        flagEmoji: "🇿🇦",
    },
    NZ: {
        id: "nz",
        name: "New Zealand",
        shortName: "New Zealand",
        code: "NZ",
        primaryColor: "#000000",
        secondaryColor: "#ffffff",
        flagEmoji: "🇳🇿",
    },
    SL: {
        id: "sl",
        name: "Sri Lanka",
        shortName: "Sri Lanka",
        code: "SL",
        primaryColor: "#0066b3",
        secondaryColor: "#ffcc00",
        flagEmoji: "🇱🇰",
    },
    BAN: {
        id: "ban",
        name: "Bangladesh",
        shortName: "Bangladesh",
        code: "BAN",
        primaryColor: "#006400",
        secondaryColor: "#f42a41",
        flagEmoji: "🇧🇩",
    },
    WI: {
        id: "wi",
        name: "West Indies",
        shortName: "West Indies",
        code: "WI",
        primaryColor: "#7b0041",
        secondaryColor: "#ffcc00",
        flagEmoji: "🌴",
    },
    AFG: {
        id: "afg",
        name: "Afghanistan",
        shortName: "Afghanistan",
        code: "AFG",
        primaryColor: "#0066b3",
        secondaryColor: "#ce1126",
        flagEmoji: "🇦🇫",
    },
    ZIM: {
        id: "zim",
        name: "Zimbabwe",
        shortName: "Zimbabwe",
        code: "ZIM",
        primaryColor: "#006400",
        secondaryColor: "#ffc72c",
        flagEmoji: "🇿🇼",
    },
    IRE: {
        id: "ire",
        name: "Ireland",
        shortName: "Ireland",
        code: "IRE",
        primaryColor: "#006400",
        secondaryColor: "#ff8c00",
        flagEmoji: "🇮🇪",
    },
};

// IPL Teams
export const IPL_TEAMS: Record<string, TeamInfo> = {
    CSK: {
        id: "csk",
        name: "Chennai Super Kings",
        shortName: "Chennai",
        code: "CSK",
        primaryColor: "#fcca00",
        secondaryColor: "#0081e9",
    },
    MI: {
        id: "mi",
        name: "Mumbai Indians",
        shortName: "Mumbai",
        code: "MI",
        primaryColor: "#004ba0",
        secondaryColor: "#d1ab3e",
    },
    RCB: {
        id: "rcb",
        name: "Royal Challengers Bengaluru",
        shortName: "Bengaluru",
        code: "RCB",
        primaryColor: "#ec1c24",
        secondaryColor: "#000000",
    },
    KKR: {
        id: "kkr",
        name: "Kolkata Knight Riders",
        shortName: "Kolkata",
        code: "KKR",
        primaryColor: "#3a225d",
        secondaryColor: "#b3a123",
    },
    DC: {
        id: "dc",
        name: "Delhi Capitals",
        shortName: "Delhi",
        code: "DC",
        primaryColor: "#0078bc",
        secondaryColor: "#ef1b23",
    },
    PBKS: {
        id: "pbks",
        name: "Punjab Kings",
        shortName: "Punjab",
        code: "PBKS",
        primaryColor: "#ed1b24",
        secondaryColor: "#dcdddf",
    },
    RR: {
        id: "rr",
        name: "Rajasthan Royals",
        shortName: "Rajasthan",
        code: "RR",
        primaryColor: "#254aa5",
        secondaryColor: "#eb83b5",
    },
    SRH: {
        id: "srh",
        name: "Sunrisers Hyderabad",
        shortName: "Hyderabad",
        code: "SRH",
        primaryColor: "#f7a721",
        secondaryColor: "#000000",
    },
    GT: {
        id: "gt",
        name: "Gujarat Titans",
        shortName: "Gujarat",
        code: "GT",
        primaryColor: "#1c1c1c",
        secondaryColor: "#5fa8d3",
    },
    LSG: {
        id: "lsg",
        name: "Lucknow Super Giants",
        shortName: "Lucknow",
        code: "LSG",
        primaryColor: "#a72056",
        secondaryColor: "#ffcc00",
    },
};

// Get all teams
export const getAllTeams = (): TeamInfo[] => [
    ...Object.values(INTERNATIONAL_TEAMS),
    ...Object.values(IPL_TEAMS),
];

// Get team by code
export const getTeamByCode = (code: string): TeamInfo | undefined => {
    return INTERNATIONAL_TEAMS[code] || IPL_TEAMS[code];
};
