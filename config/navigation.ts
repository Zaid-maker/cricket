// Navigation Configuration

export interface NavItem {
    title: string;
    href: string;
    description?: string;
    icon?: string;
    disabled?: boolean;
    external?: boolean;
    children?: NavItem[];
}

export const mainNavItems: NavItem[] = [
    {
        title: "Live Scores",
        href: "/live",
        description: "Real-time cricket scores and updates",
    },
    {
        title: "Matches",
        href: "/matches",
        description: "All cricket matches",
        children: [
            {
                title: "Live",
                href: "/matches/live",
                description: "Currently ongoing matches",
            },
            {
                title: "Upcoming",
                href: "/matches/upcoming",
                description: "Scheduled matches",
            },
            {
                title: "Results",
                href: "/matches/results",
                description: "Completed matches",
            },
        ],
    },
    {
        title: "Series",
        href: "/series",
        description: "Cricket series and tournaments",
        children: [
            {
                title: "International",
                href: "/series/international",
                description: "International cricket series",
            },
            {
                title: "Domestic",
                href: "/series/domestic",
                description: "Domestic leagues and tournaments",
            },
            {
                title: "T20 Leagues",
                href: "/series/t20-leagues",
                description: "IPL, BBL, PSL, and more",
            },
        ],
    },
    {
        title: "Teams",
        href: "/teams",
        description: "Cricket teams worldwide",
        children: [
            {
                title: "International",
                href: "/teams/international",
                description: "National cricket teams",
            },
            {
                title: "IPL",
                href: "/teams/ipl",
                description: "Indian Premier League teams",
            },
            {
                title: "Domestic",
                href: "/teams/domestic",
                description: "Domestic cricket teams",
            },
        ],
    },
    {
        title: "Rankings",
        href: "/rankings",
        description: "ICC Cricket Rankings",
        children: [
            {
                title: "Teams",
                href: "/rankings/teams",
                description: "Team rankings across formats",
            },
            {
                title: "Batters",
                href: "/rankings/batters",
                description: "Top batting rankings",
            },
            {
                title: "Bowlers",
                href: "/rankings/bowlers",
                description: "Top bowling rankings",
            },
            {
                title: "All-rounders",
                href: "/rankings/all-rounders",
                description: "Top all-rounder rankings",
            },
        ],
    },
    {
        title: "News",
        href: "/news",
        description: "Latest cricket news and articles",
    },
    {
        title: "Videos",
        href: "/videos",
        description: "Cricket highlights and videos",
    },
];

export const footerNavItems: NavItem[] = [
    {
        title: "Company",
        href: "#",
        children: [
            { title: "About Us", href: "/about" },
            { title: "Careers", href: "/careers" },
            { title: "Contact", href: "/contact" },
        ],
    },
    {
        title: "Resources",
        href: "#",
        children: [
            { title: "Help Center", href: "/help" },
            { title: "Terms of Service", href: "/terms" },
            { title: "Privacy Policy", href: "/privacy" },
        ],
    },
    {
        title: "Cricket",
        href: "#",
        children: [
            { title: "ICC", href: "https://www.icc-cricket.com", external: true },
            { title: "BCCI", href: "https://www.bcci.tv", external: true },
            { title: "ECB", href: "https://www.ecb.co.uk", external: true },
        ],
    },
];

export const mobileNavItems: NavItem[] = [
    { title: "Live Scores", href: "/live" },
    { title: "Matches", href: "/matches" },
    { title: "Series", href: "/series" },
    { title: "Teams", href: "/teams" },
    { title: "Rankings", href: "/rankings" },
    { title: "News", href: "/news" },
    { title: "Videos", href: "/videos" },
];
