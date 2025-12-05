import { NextResponse } from "next/server";
import { getCurrentMatches } from "@/app/actions/matches";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
    try {
        const data = await getCurrentMatches();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch matches" },
            { status: 500 }
        );
    }
}
