"use server";

// Server Actions for Series Data

import { fetchSeries } from "@/services/cricket-api";
// import { transformSeries } from "@/services/transformers"; // Unused if fetchSeries returns Series[]
import type { Series } from "@/types";
import { featuredSeries } from "@/data/matches";

// Transform featured series mock data to Series type
const mockSeries: Series[] = featuredSeries.map((s) => ({
    id: s.id,
    name: s.name,
    startDate: new Date(s.startDate),
    endDate: new Date(s.endDate),
    format: "T20" as const,
    totalMatches: s.matches,
}));

/**
 * Get all cricket series
 * Cached and revalidates every hour
 */
export async function getAllSeries(): Promise<{
    series: Series[];
    error?: string;
    usingMockData: boolean;
}> {
    try {
        const series = await fetchSeries();

        // If API isn't implemented (returns empty), fall back to mock for now
        if (series.length === 0) {
            throw new Error("Series API not implemented");
        }

        return {
            series,
            usingMockData: false,
        };
    } catch (error) {
        console.error("Failed to fetch series:", error);

        return {
            series: mockSeries,
            error: error instanceof Error ? error.message : "Failed to fetch series",
            usingMockData: true,
        };
    }
}

/**
 * Get featured/active series
 * Returns top 5 most relevant series
 */
export async function getFeaturedSeries(): Promise<{
    series: Series[];
    error?: string;
    usingMockData: boolean;
}> {
    try {
        const allSeries = await fetchSeries();

        if (allSeries.length === 0) {
            throw new Error("Series API not implemented");
        }

        const now = new Date();

        // Filter to active or upcoming series and take top 5
        const series = allSeries
            .filter((s) => s.endDate >= now)
            .slice(0, 5);

        return {
            series,
            usingMockData: false,
        };
    } catch (error) {
        console.error("Failed to fetch featured series:", error);

        return {
            series: mockSeries,
            error: error instanceof Error ? error.message : "Failed to fetch series",
            usingMockData: true,
        };
    }
}
