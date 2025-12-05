"use server";

// Server Actions for Series Data

import { fetchSeries, CricApiError } from "@/services/cricket-api";
import { transformSeries } from "@/services/transformers";
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
        const response = await fetchSeries();
        const series = response.data.map(transformSeries);

        return {
            series,
            usingMockData: false,
        };
    } catch (error) {
        console.error("Failed to fetch series:", error);

        return {
            series: mockSeries,
            error: error instanceof CricApiError ? error.message : "Failed to fetch series",
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
        const response = await fetchSeries();
        const now = new Date();

        // Filter to active or upcoming series and take top 5
        const series = response.data
            .map(transformSeries)
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
            error: error instanceof CricApiError ? error.message : "Failed to fetch series",
            usingMockData: true,
        };
    }
}
