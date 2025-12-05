// Site Configuration

export const siteConfig = {
    name: "CricketLive",
    description:
        "Live cricket scores, match updates, news, and comprehensive cricket coverage. Follow your favorite teams and players.",
    url: "https://cricketlive.com",
    ogImage: "/og-image.jpg",

    // SEO
    keywords: [
        "cricket",
        "live scores",
        "cricket news",
        "IPL",
        "T20",
        "ODI",
        "Test cricket",
        "cricket highlights",
        "match updates",
    ],

    // Social Links
    links: {
        twitter: "https://twitter.com/cricketlive",
        facebook: "https://facebook.com/cricketlive",
        instagram: "https://instagram.com/cricketlive",
        youtube: "https://youtube.com/cricketlive",
    },

    // App Version
    version: "1.0.0",

    // Creator
    creator: "CricketLive Team",
};

export type SiteConfig = typeof siteConfig;
