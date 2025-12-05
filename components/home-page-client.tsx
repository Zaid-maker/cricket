"use client";

import Link from "next/link";
import { Play, Trophy, Users, Calendar, AlertCircle, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { useLiveScores, useFeaturedSeries } from "@/hooks";
import { MATCH_STATUSES } from "@/constants/cricket";
import type { LiveScoreSummary, Series } from "@/types";

export function HomePageClient() {
    const {
        live: liveMatches,
        upcoming: upcomingMatches,
        completed: completedMatches,
        usingMockData,
        error: matchesError,
        isLoading: matchesLoading,
    } = useLiveScores();

    const {
        series: featuredSeries,
        isLoading: seriesLoading,
    } = useFeaturedSeries();

    return (
        <div className="flex flex-col">
            {/* API Status Alert */}
            {usingMockData && (
                <div className="bg-yellow-500/10 border-b border-yellow-500/20">
                    <div className="container px-4 py-2 md:px-6">
                        <Alert variant="default" className="border-yellow-500/50 bg-transparent py-2">
                            <AlertCircle className="h-4 w-4 text-yellow-500" />
                            <AlertDescription className="text-sm text-yellow-700 dark:text-yellow-400">
                                {matchesError || "Using demo data. Add your API key to see live scores."}
                            </AlertDescription>
                        </Alert>
                    </div>
                </div>
            )}

            {/* Live Matches Ticker */}
            {liveMatches.length > 0 && (
                <section className="border-b bg-destructive/5 py-3">
                    <div className="container px-4 md:px-6">
                        <div className="flex items-center gap-4 overflow-x-auto">
                            <Badge variant="destructive" className="shrink-0 animate-pulse gap-1.5">
                                <span className="relative flex h-2 w-2">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                                    <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
                                </span>
                                LIVE
                            </Badge>
                            <div className="flex gap-6 text-sm">
                                {liveMatches.map((match) => (
                                    <Link
                                        key={match.matchId}
                                        href={`/match/${match.matchId}`}
                                        className="flex shrink-0 items-center gap-2 font-medium hover:text-primary"
                                    >
                                        <span>
                                            {match.team1.shortName} {match.team1.score} vs{" "}
                                            {match.team2.shortName} {match.team2.score || ""}
                                        </span>
                                        <span className="text-muted-foreground">•</span>
                                        <span className="text-muted-foreground">{match.format}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Main Content */}
            <section className="py-12 md:py-16">
                <div className="container px-4 md:px-6">
                    <div className="grid gap-8 lg:grid-cols-3">
                        {/* Matches Section - Takes 2 columns */}
                        <div className="lg:col-span-2">
                            <Tabs defaultValue="live" className="w-full">
                                <div className="mb-6 flex items-center justify-between">
                                    <h2 className="text-2xl font-bold tracking-tight">
                                        Matches
                                        {matchesLoading && (
                                            <Loader2 className="ml-2 inline h-5 w-5 animate-spin text-muted-foreground" />
                                        )}
                                    </h2>
                                    <TabsList>
                                        <TabsTrigger value="live" className="gap-1.5">
                                            <span className="relative flex h-2 w-2">
                                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
                                                <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                                            </span>
                                            Live ({liveMatches.length})
                                        </TabsTrigger>
                                        <TabsTrigger value="upcoming">Upcoming ({upcomingMatches.length})</TabsTrigger>
                                        <TabsTrigger value="results">Results ({completedMatches.length})</TabsTrigger>
                                    </TabsList>
                                </div>

                                <TabsContent value="live" className="mt-0 space-y-4">
                                    {liveMatches.length > 0 ? (
                                        liveMatches.map((match) => (
                                            <MatchCard key={match.matchId} match={match} />
                                        ))
                                    ) : (
                                        <Card className="p-8 text-center text-muted-foreground">
                                            No live matches at the moment
                                        </Card>
                                    )}
                                </TabsContent>

                                <TabsContent value="upcoming" className="mt-0 space-y-4">
                                    {upcomingMatches.length > 0 ? (
                                        upcomingMatches.map((match) => (
                                            <MatchCard key={match.matchId} match={match} />
                                        ))
                                    ) : (
                                        <Card className="p-8 text-center text-muted-foreground">
                                            No upcoming matches scheduled
                                        </Card>
                                    )}
                                </TabsContent>

                                <TabsContent value="results" className="mt-0 space-y-4">
                                    {completedMatches.length > 0 ? (
                                        completedMatches.map((match) => (
                                            <MatchCard key={match.matchId} match={match} />
                                        ))
                                    ) : (
                                        <Card className="p-8 text-center text-muted-foreground">
                                            No recent results
                                        </Card>
                                    )}
                                </TabsContent>
                            </Tabs>
                        </div>

                        {/* Sidebar - Takes 1 column */}
                        <div className="space-y-6">
                            {/* Featured Series */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <Trophy className="h-5 w-5 text-primary" />
                                        Featured Series
                                        {seriesLoading && (
                                            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                        )}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {featuredSeries.slice(0, 5).map((series: Series) => (
                                        <SeriesCard key={series.id} series={series} />
                                    ))}
                                </CardContent>
                            </Card>

                            {/* Quick Stats */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <Users className="h-5 w-5 text-primary" />
                                        Quick Stats
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="rounded-lg bg-muted p-3 text-center">
                                            <p className="text-2xl font-bold text-primary">
                                                {liveMatches.length}
                                            </p>
                                            <p className="text-xs text-muted-foreground">Live Now</p>
                                        </div>
                                        <div className="rounded-lg bg-muted p-3 text-center">
                                            <p className="text-2xl font-bold text-primary">
                                                {upcomingMatches.length}
                                            </p>
                                            <p className="text-xs text-muted-foreground">Upcoming</p>
                                        </div>
                                        <div className="rounded-lg bg-muted p-3 text-center">
                                            <p className="text-2xl font-bold text-primary">
                                                {featuredSeries.length}
                                            </p>
                                            <p className="text-xs text-muted-foreground">Series</p>
                                        </div>
                                        <div className="rounded-lg bg-muted p-3 text-center">
                                            <p className="text-2xl font-bold text-primary">
                                                {completedMatches.length}
                                            </p>
                                            <p className="text-xs text-muted-foreground">Results</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Upcoming Schedule */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <Calendar className="h-5 w-5 text-primary" />
                                        Schedule
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">
                                        View the complete cricket calendar and never miss a match.
                                    </p>
                                    <Button variant="outline" size="sm" className="mt-4 w-full" asChild>
                                        <Link href="/schedule">View Full Schedule</Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

// Match Card Component
function MatchCard({ match }: { match: LiveScoreSummary }) {
    const statusConfig = MATCH_STATUSES[match.status];

    return (
        <Link href={`/match/${match.matchId}`}>
            <Card className="transition-all hover:shadow-md hover:border-primary/30">
                <CardContent className="p-4">
                    <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                                {match.format}
                            </Badge>
                            {match.isLive && (
                                <Badge
                                    variant="destructive"
                                    className="animate-pulse gap-1 text-xs"
                                >
                                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                                    LIVE
                                </Badge>
                            )}
                        </div>
                        <span className="text-xs text-muted-foreground">
                            {match.venue.split(",")[0]}
                        </span>
                    </div>

                    <div className="space-y-2">
                        {/* Team 1 */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-bold">
                                    {match.team1.shortName.charAt(0)}
                                </div>
                                <span className="font-medium">{match.team1.name}</span>
                            </div>
                            {match.team1.score && (
                                <div className="text-right">
                                    <span className="font-bold">{match.team1.score}</span>
                                    {match.team1.overs && (
                                        <span className="ml-1 text-sm text-muted-foreground">
                                            ({match.team1.overs} ov)
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Team 2 */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-bold">
                                    {match.team2.shortName.charAt(0)}
                                </div>
                                <span className="font-medium">{match.team2.name}</span>
                            </div>
                            {match.team2.score && (
                                <div className="text-right">
                                    <span className="font-bold">{match.team2.score}</span>
                                    {match.team2.overs && (
                                        <span className="ml-1 text-sm text-muted-foreground">
                                            ({match.team2.overs} ov)
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Status Text */}
                    <div className="mt-3 border-t pt-3">
                        <p className={`text-sm ${match.isLive ? "text-primary font-medium" : "text-muted-foreground"}`}>
                            {match.statusText}
                        </p>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}

// Series Card Component
function SeriesCard({ series }: { series: Series }) {
    const formatDate = (date: Date) => {
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    return (
        <Link
            href={`/series/${series.id}`}
            className="group block rounded-lg border p-3 transition-colors hover:bg-accent"
        >
            <h4 className="font-medium group-hover:text-primary line-clamp-1">
                {series.name}
            </h4>
            <p className="mt-1 text-sm text-muted-foreground">
                {series.format} • {series.totalMatches} matches
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
                {formatDate(series.startDate)} - {formatDate(series.endDate)}
            </p>
        </Link>
    );
}
