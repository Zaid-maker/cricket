"use server";

import { getApiUsage } from "@/services/cricket-api";

export async function getSystemStatus() {
    return {
        apiUsage: getApiUsage()
    };
}
