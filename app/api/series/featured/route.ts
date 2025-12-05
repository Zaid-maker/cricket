import { NextResponse } from "next/server";
import { getFeaturedSeries } from "@/app/actions/series";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
    try {
        const data = await getFeaturedSeries();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch series" },
            { status: 500 }
        );
    }
}
