import { NextResponse } from "next/server";
import { getMatchDetails } from "@/app/actions/matches";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const data = await getMatchDetails(id);
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch match details" },
            { status: 500 }
        );
    }
}
