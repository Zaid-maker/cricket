"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { LiveScoreSummary } from "@/types";

interface UseLiveMatchesOptions {
    /** Polling interval in milliseconds (default: 30000 = 30s) */
    interval?: number;
    /** Whether to poll (default: true) */
    enabled?: boolean;
    /** Initial data */
    initialData?: LiveScoreSummary[];
}

interface UseLiveMatchesReturn {
    matches: LiveScoreSummary[];
    isLoading: boolean;
    error: string | null;
    lastUpdated: Date | null;
    refetch: () => Promise<void>;
}

/**
 * Hook for polling live match data
 * Automatically pauses when tab is hidden
 */
export function useLiveMatches(
    fetchFn: () => Promise<{ matches: LiveScoreSummary[]; error?: string }>,
    options: UseLiveMatchesOptions = {}
): UseLiveMatchesReturn {
    const { interval = 30000, enabled = true, initialData = [] } = options;

    const [matches, setMatches] = useState<LiveScoreSummary[]>(initialData);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const isVisibleRef = useRef(true);

    const fetchData = useCallback(async () => {
        if (!enabled) return;

        setIsLoading(true);
        try {
            const result = await fetchFn();
            setMatches(result.matches);
            setError(result.error || null);
            setLastUpdated(new Date());
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to fetch matches");
        } finally {
            setIsLoading(false);
        }
    }, [fetchFn, enabled]);

    // Handle visibility change
    useEffect(() => {
        const handleVisibilityChange = () => {
            isVisibleRef.current = document.visibilityState === "visible";

            if (isVisibleRef.current && enabled) {
                // Refetch when tab becomes visible
                fetchData();
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, [fetchData, enabled]);

    // Setup polling
    useEffect(() => {
        if (!enabled) {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            return;
        }

        // Initial fetch
        fetchData();

        // Setup interval
        intervalRef.current = setInterval(() => {
            if (isVisibleRef.current) {
                fetchData();
            }
        }, interval);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [fetchData, interval, enabled]);

    return {
        matches,
        isLoading,
        error,
        lastUpdated,
        refetch: fetchData,
    };
}

/**
 * Hook for managing match data with categories
 */
export function useCategorizedMatches(
    fetchFn: () => Promise<{
        live: LiveScoreSummary[];
        upcoming: LiveScoreSummary[];
        completed: LiveScoreSummary[];
        error?: string;
    }>,
    options: Omit<UseLiveMatchesOptions, "initialData"> & {
        initialData?: {
            live: LiveScoreSummary[];
            upcoming: LiveScoreSummary[];
            completed: LiveScoreSummary[];
        };
    } = {}
) {
    const { interval = 30000, enabled = true, initialData } = options;

    const [live, setLive] = useState<LiveScoreSummary[]>(initialData?.live || []);
    const [upcoming, setUpcoming] = useState<LiveScoreSummary[]>(
        initialData?.upcoming || []
    );
    const [completed, setCompleted] = useState<LiveScoreSummary[]>(
        initialData?.completed || []
    );
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const isVisibleRef = useRef(true);

    const fetchData = useCallback(async () => {
        if (!enabled) return;

        setIsLoading(true);
        try {
            const result = await fetchFn();
            setLive(result.live);
            setUpcoming(result.upcoming);
            setCompleted(result.completed);
            setError(result.error || null);
            setLastUpdated(new Date());
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to fetch matches");
        } finally {
            setIsLoading(false);
        }
    }, [fetchFn, enabled]);

    // Handle visibility change
    useEffect(() => {
        const handleVisibilityChange = () => {
            isVisibleRef.current = document.visibilityState === "visible";
            if (isVisibleRef.current && enabled) {
                fetchData();
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, [fetchData, enabled]);

    // Setup polling
    useEffect(() => {
        if (!enabled) {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            return;
        }

        fetchData();

        intervalRef.current = setInterval(() => {
            if (isVisibleRef.current) {
                fetchData();
            }
        }, interval);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [fetchData, interval, enabled]);

    return {
        live,
        upcoming,
        completed,
        isLoading,
        error,
        lastUpdated,
        refetch: fetchData,
    };
}
