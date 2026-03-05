import { NextResponse } from "next/server";
import { findAvailableRooms } from "@/lib/liveblocks-admin";

/**
 * GET /api/rooms/available
 *
 * Returns empty codehub- rooms for reuse.
 * Strategy: NEVER create new rooms if empty ones exist.
 * This saves the 500 rooms/month Liveblocks quota.
 */
export async function GET() {
    try {
        const available = await findAvailableRooms(3);

        return NextResponse.json({
            available,
            hasRooms: available.length > 0,
        });
    } catch (error: unknown) {
        // Graceful degradation if secret key not set
        if (error instanceof Error && error.message.includes("LIVEBLOCKS_SECRET_KEY")) {
            return NextResponse.json({
                available: [],
                hasRooms: false,
                note: "Secret key not configured — room reuse disabled",
            });
        }

        console.error("Available rooms error:", error);
        return NextResponse.json({
            available: [],
            hasRooms: false,
        });
    }
}
