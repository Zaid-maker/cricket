"use client";

import useSWR from "swr";
import { getSystemStatus } from "@/app/actions/system";
import { Progress } from "@/components/ui/progress";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Activity, Database } from "lucide-react";

export function ApiUsage() {
    const { data } = useSWR("system-status", getSystemStatus, {
        refreshInterval: 60000, // Check every minute
        revalidateOnFocus: true
    });

    if (!data || !data.apiUsage || data.apiUsage.limit === 0) return null;

    const { limit, remaining, reset } = data.apiUsage;
    const used = limit - remaining;
    const percentage = (used / limit) * 100;

    // Color logic
    let colorClass = "bg-green-500";
    if (percentage > 75) colorClass = "bg-yellow-500";
    if (percentage > 90) colorClass = "bg-red-500";

    return (
        <div className="w-full px-2 py-2">
            <HoverCard>
                <HoverCardTrigger asChild>
                    <div className="flex flex-col gap-1 cursor-help group">
                        <div className="flex justify-between text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                            <span className="flex items-center gap-1.5"><Database className="h-3 w-3" /> API Usage</span>
                            <span className="font-mono">{remaining}/{limit}</span>
                        </div>
                        <Progress value={percentage} className="h-1.5" indicatorClassName={colorClass} />
                    </div>
                </HoverCardTrigger>
                <HoverCardContent className="w-80" side="right">
                    <div className="space-y-2">
                        <h4 className="text-sm font-semibold flex items-center gap-2">
                            <Activity className="h-4 w-4 text-primary" /> API Quota Status
                        </h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="text-muted-foreground">Requests Used:</div>
                            <div className="font-medium text-right">{used.toLocaleString()}</div>

                            <div className="text-muted-foreground">Remaining:</div>
                            <div className="font-medium text-right">{remaining.toLocaleString()}</div>

                            <div className="text-muted-foreground">Daily Limit:</div>
                            <div className="font-medium text-right">{limit.toLocaleString()}</div>
                        </div>
                        <div className="text-xs text-muted-foreground border-t pt-2 mt-2">
                            Reset in: {(reset / 3600).toFixed(1)} hours (approx)
                        </div>
                    </div>
                </HoverCardContent>
            </HoverCard>
        </div>
    );
}
