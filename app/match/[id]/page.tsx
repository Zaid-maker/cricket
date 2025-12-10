"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, MapPin, Users, Trophy, Loader2, RefreshCw, ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { useMatchDetail } from "@/hooks";
import { MATCH_STATUSES } from "@/constants/cricket";

import { Scorecard } from "@/components/match/scorecard";

export default function MatchDetailPage() {
    const params = useParams();
    const matchId = params.id as string;

    const { match, error, isLoading, refetch } = useMatchDetail(matchId);

    if (isLoading) {
        return (
            <div className="container flex min-h-[60vh] items-center justify-center px-4 py-12 md:px-6">
                <div className="text-center">
                    <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
                    <p className="mt-4 text-muted-foreground">Loading match details...</p>
                </div>
            </div>
        );
    }

    if (error || !match) {
        return (
            <div className="container px-4 py-12 md:px-6">
                <Card className="mx-auto max-w-2xl">
                    <CardContent className="pt-6 text-center">
                        <p className="text-lg text-muted-foreground">
                            {error || "Match not found"}
                        </p>
                        <Button variant="outline" className="mt-4" asChild>
                            <Link href="/">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Home
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const statusConfig = match.status ? MATCH_STATUSES[match.status] : undefined;

    // Helper to get team score from innings
    const getTeamScore = (teamId: string) => {
        // Find last inning for this team
        const teamInnings = match.innings?.filter(
            (inn) => inn.battingTeamId === teamId
        );
        const lastInning = teamInnings?.[teamInnings.length - 1];

        if (!lastInning) return null;

        return {
            score: `${lastInning.runs}/${lastInning.wickets}`,
            overs: lastInning.overs
        };
    };

    const team1Score = getTeamScore(match.team1.id);
    const team2Score = getTeamScore(match.team2.id);

    return (
        <div className="container px-4 py-8 md:px-6">
            {/* Back Button & Refresh */}
            <div className="mb-6 flex items-center justify-between">
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                    </Link>
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => refetch()}
                    className="gap-2"
                >
                    <RefreshCw className="h-4 w-4" />
                    Refresh
                </Button>
            </div>

            {/* Match Header */}
            <Card className="mb-6">
                <CardContent className="p-6">
                    {/* Match Format & Status */}
                    <div className="mb-4 flex flex-wrap items-center gap-2">
                        <Badge variant="outline">{match.format}</Badge>
                        {match.isLive && (
                            <Badge variant="destructive" className="animate-pulse gap-1.5">
                                <span className="h-2 w-2 rounded-full bg-white" />
                                LIVE
                            </Badge>
                        )}
                        {statusConfig && (
                            <Badge
                                variant="outline"
                                style={{
                                    backgroundColor: `${statusConfig.color}20`,
                                    borderColor: statusConfig.color,
                                    color: statusConfig.color,
                                }}
                            >
                                {statusConfig.label}
                            </Badge>
                        )}
                    </div>

                    {/* Teams & Scores */}
                    <div className="space-y-4">
                        {/* Team 1 */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                                    {match.team1.shortName.charAt(0)}
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold">{match.team1.name}</h2>
                                    <p className="text-sm text-muted-foreground">
                                        {match.team1.shortName}
                                    </p>
                                </div>
                            </div>
                            {team1Score && (
                                <div className="text-right">
                                    <p className="text-3xl font-bold">{team1Score.score}</p>
                                    <p className="text-sm text-muted-foreground">
                                        ({team1Score.overs} overs)
                                    </p>
                                </div>
                            )}
                        </div>

                        <Separator />

                        {/* Team 2 */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                                    {match.team2.shortName.charAt(0)}
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold">{match.team2.name}</h2>
                                    <p className="text-sm text-muted-foreground">
                                        {match.team2.shortName}
                                    </p>
                                </div>
                            </div>
                            {team2Score && (
                                <div className="text-right">
                                    <p className="text-3xl font-bold">{team2Score.score}</p>
                                    <p className="text-sm text-muted-foreground">
                                        ({team2Score.overs} overs)
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Status Text */}
                    {match.statusText && (
                        <div className="mt-6 rounded-lg bg-muted/50 p-4">
                            <p
                                className={`text-center font-medium ${match.isLive ? "text-primary" : "text-muted-foreground"
                                    }`}
                            >
                                {match.statusText}
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Match Info & Details */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Main Content - 2 columns */}
                <div className="space-y-6 lg:col-span-2">
                    {/* Scorecard */}
                    <Scorecard match={match} />

                    {/* Commentary (Placeholder) */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Commentary</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-center text-muted-foreground py-8">
                                Live ball-by-ball commentary will appear here during live matches.
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar - 1 column */}
                <div className="space-y-6">
                    {/* Match Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Match Info</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Venue */}
                            <div className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 shrink-0 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">Venue</p>
                                    <a
                                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(match.venue.name)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-primary hover:underline flex items-center gap-1"
                                    >
                                        {match.venue.name}
                                        <ExternalLink className="h-3 w-3" />
                                    </a>
                                </div>
                            </div>

                            {/* Date */}
                            <div className="flex items-start gap-3">
                                <Calendar className="h-5 w-5 shrink-0 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">Date & Time</p>
                                    <p className="text-sm text-muted-foreground">
                                        {new Date(match.startTime).toLocaleString("en-US", {
                                            weekday: "short",
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </p>
                                </div>
                            </div>

                            {/* Format */}
                            <div className="flex items-start gap-3">
                                <Users className="h-5 w-5 shrink-0 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">Format</p>
                                    <p className="text-sm text-muted-foreground">{match.format}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Live Updates Badge */}
                    {match.isLive && (
                        <Card className="border-destructive/50 bg-destructive/5">
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-2">
                                    <span className="relative flex h-3 w-3">
                                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-75" />
                                        <span className="relative inline-flex h-3 w-3 rounded-full bg-destructive" />
                                    </span>
                                    <p className="font-medium text-destructive">
                                        Live updates every 15 seconds
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
