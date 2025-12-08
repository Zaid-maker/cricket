import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Trophy } from "lucide-react";
import type { Match, Innings, BattingStats, BowlingStats } from "@/types";

interface ScorecardProps {
    match: Match;
}

export function Scorecard({ match }: ScorecardProps) {
    if (!match.innings || match.innings.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-primary" />
                        Scorecard
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-center text-muted-foreground py-8">
                        Scorecard not available yet.
                    </p>
                </CardContent>
            </Card>
        );
    }

    // Determine current or last active inning for default tab
    const defaultTab = match.innings[match.innings.length - 1]?.id || match.innings[0].id;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-primary" />
                    Scorecard
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <Tabs defaultValue={defaultTab} className="w-full">
                    <div className="px-6 border-b">
                        <ScrollArea className="w-full whitespace-nowrap">
                            <TabsList className="w-full justify-start h-auto bg-transparent p-0">
                                {match.innings.map((inning) => (
                                    <TabsTrigger
                                        key={inning.id}
                                        value={inning.id}
                                        className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                                    >
                                        {inning.inningsNumber === 1
                                            ? match.team1.shortName
                                            : match.team2.shortName}{" "}
                                        Innings
                                        <Badge variant="secondary" className="ml-2 text-xs">
                                            {inning.runs}/{inning.wickets}
                                        </Badge>
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                            <ScrollBar orientation="horizontal" />
                        </ScrollArea>
                    </div>

                    {match.innings.map((inning) => (
                        <TabsContent key={inning.id} value={inning.id} className="m-0">
                            <div className="p-6 space-y-8">
                                {/* Batting Table */}
                                <div>
                                    <h3 className="mb-4 font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                                        Batting
                                    </h3>
                                    <div className="rounded-md border">
                                        <Table>
                                            <TableHeader className="bg-muted/50">
                                                <TableRow>
                                                    <TableHead className="w-[40%]">Batter</TableHead>
                                                    <TableHead className="w-[10%] text-right">R</TableHead>
                                                    <TableHead className="w-[10%] text-right">B</TableHead>
                                                    <TableHead className="w-[10%] text-right">4s</TableHead>
                                                    <TableHead className="w-[10%] text-right">6s</TableHead>
                                                    <TableHead className="w-[20%] text-right">SR</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {inning.batting.map((batter) => (
                                                    <TableRow key={batter.playerId}>
                                                        <TableCell className="font-medium">
                                                            <div className="flex flex-col">
                                                                <span className={batter.isOut ? "" : "text-primary"}>
                                                                    {batter.playerName}
                                                                    {!batter.isOut && "*"}
                                                                </span>
                                                                <span className="text-xs text-muted-foreground font-normal">
                                                                    {batter.isOut
                                                                        ? batter.dismissedBy || "dimsissed"
                                                                        : "not out"}
                                                                </span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-right font-bold">
                                                            {batter.runs}
                                                        </TableCell>
                                                        <TableCell className="text-right text-muted-foreground">
                                                            {batter.balls}
                                                        </TableCell>
                                                        <TableCell className="text-right text-muted-foreground">
                                                            {batter.fours}
                                                        </TableCell>
                                                        <TableCell className="text-right text-muted-foreground">
                                                            {batter.sixes}
                                                        </TableCell>
                                                        <TableCell className="text-right text-muted-foreground">
                                                            {batter.strikeRate}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                                {/* Extras */}
                                                <TableRow className="bg-muted/30 font-medium">
                                                    <TableCell>Extras</TableCell>
                                                    <TableCell className="text-right" colSpan={5}>
                                                        {inning.extras.total} (w {inning.extras.wides}, nb{" "}
                                                        {inning.extras.noBalls}, b {inning.extras.byes}, lb{" "}
                                                        {inning.extras.legByes})
                                                    </TableCell>
                                                </TableRow>
                                                {/* Total */}
                                                <TableRow className="bg-muted/50 font-bold">
                                                    <TableCell>Total</TableCell>
                                                    <TableCell className="text-right" colSpan={5}>
                                                        {inning.runs}/{inning.wickets} ({inning.overs} overs)
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </div>
                                </div>

                                {/* Bowling Table */}
                                <div>
                                    <h3 className="mb-4 font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                                        Bowling
                                    </h3>
                                    <div className="rounded-md border">
                                        <Table>
                                            <TableHeader className="bg-muted/50">
                                                <TableRow>
                                                    <TableHead className="w-[40%]">Bowler</TableHead>
                                                    <TableHead className="w-[10%] text-right">O</TableHead>
                                                    <TableHead className="w-[10%] text-right">M</TableHead>
                                                    <TableHead className="w-[10%] text-right">R</TableHead>
                                                    <TableHead className="w-[10%] text-right">W</TableHead>
                                                    <TableHead className="w-[20%] text-right">Econ</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {inning.bowling.map((bowler) => (
                                                    <TableRow key={bowler.playerId}>
                                                        <TableCell className="font-medium">
                                                            {bowler.playerName}
                                                        </TableCell>
                                                        <TableCell className="text-right text-muted-foreground">
                                                            {bowler.overs}
                                                        </TableCell>
                                                        <TableCell className="text-right text-muted-foreground">
                                                            {bowler.maidens}
                                                        </TableCell>
                                                        <TableCell className="text-right font-medium">
                                                            {bowler.runs}
                                                        </TableCell>
                                                        <TableCell className="text-right font-bold text-primary">
                                                            {bowler.wickets}
                                                        </TableCell>
                                                        <TableCell className="text-right text-muted-foreground">
                                                            {bowler.economy}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>
                    ))}
                </Tabs>
            </CardContent>
        </Card>
    );
}
