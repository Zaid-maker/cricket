"use client";

import useSWR from "swr";
import type { LiveScoreSummary, Match } from "@/types";

/**
 * SWR-optimized hook for live matches
 * Provides automatic revalidation, caching, and deduplication
 */
export function useLiveScores() {
    const { data, error, isLoading, mutate } = useSWR<{
        live: LiveScoreSummary[];
        upcoming: LiveScoreSummary[];
        completed: LiveScoreSummary[];
        error?: string;
        usingMockData: boolean;
    }>(
        "/api/matches/current",
        async () => {
            const response = await fetch("/api/matches/current");
            if (!response.ok) throw new Error("Failed to fetch matches");
            return response.json();
        },
        {
            // Auto-refresh every 10 seconds for live data
            refreshInterval: 10000,

            // Don't refresh when tab is hidden (saves API calls)
            refreshWhenHidden: false,

            // Don't refresh when offline
            refreshWhenOffline: false,

            // Refresh when window regains focus
            revalidateOnFocus: true,

            // Dedupe requests within 5 seconds
            dedupingInterval: 5000,

            // Keep previous data while fetching new data
            keepPreviousData: true,

            // Error retry configuration
            errorRetryCount: 3,
            errorRetryInterval: 5000,

            // Revalidate if stale
            revalidateIfStale: true,

            // Revalidate on mount
            revalidateOnMount: true,
        }
    );

    return {
        live: data?.live || [],
        upcoming: data?.upcoming || [],
        completed: data?.completed || [],
        usingMockData: data?.usingMockData ?? true,
        error: error?.message || data?.error,
        isLoading,
        refetch: mutate,
    };
}

/**
 * SWR-optimized hook for live matches only (faster polling)
 */
export function useLiveMatchesOnly() {
    const { data, error, isLoading, mutate } = useSWR<{
        matches: LiveScoreSummary[];
        error?: string;
        usingMockData: boolean;
    }>(
        "/api/matches/live",
        async () => {
            const response = await fetch("/api/matches/live");
            if (!response.ok) throw new Error("Failed to fetch live matches");
            return response.json();
        },
        {
            // Faster refresh for live matches only (10s)
            refreshInterval: 10000,
            refreshWhenHidden: false,
            refreshWhenOffline: false,
            revalidateOnFocus: true,
            dedupingInterval: 5000,
            keepPreviousData: true,
        }
    );

    return {
        matches: data?.matches || [],
        usingMockData: data?.usingMockData ?? true,
        error: error?.message || data?.error,
        isLoading,
        refetch: mutate,
    };
}

/**
 * SWR hook for featured series (slower refresh, data changes less frequently)
 */
export function useFeaturedSeries() {
    const { data, error, isLoading, mutate } = useSWR(
        "/api/series/featured",
        async () => {
            const response = await fetch("/api/series/featured");
            if (!response.ok) throw new Error("Failed to fetch series");
            return response.json();
        },
        {
            // Slower refresh for series (5 minutes)
            refreshInterval: 300000,
            refreshWhenHidden: false,
            refreshWhenOffline: false,
            revalidateOnFocus: false,
            dedupingInterval: 60000,
            keepPreviousData: true,
        }
    );

    return {
        series: data?.series || [],
        usingMockData: data?.usingMockData ?? true,
        error: error?.message || data?.error,
        isLoading,
        refetch: mutate,
    };
}

/**
 * SWR hook for a specific match detail
 */
export function useMatchDetail(matchId: string | null) {
    const { data, error, isLoading, mutate } = useSWR<{
        match: Match | null;
        error?: string;
        usingMockData?: boolean;
    }>(
        matchId ? `/api/matches/${matchId}` : null,
        async (url: string) => {
            const response = await fetch(url);
            if (!response.ok) throw new Error("Failed to fetch match details");
            return response.json();
        },
        {
            // Medium refresh for match details (15s)
            refreshInterval: 15000,
            refreshWhenHidden: false,
            refreshWhenOffline: false,
            revalidateOnFocus: true,
            dedupingInterval: 5000,
            keepPreviousData: true,
        }
    );

    return {
        match: data?.match || null,
        error: error?.message || data?.error,
        isLoading,
        refetch: mutate,
    };
}
