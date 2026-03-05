/**
 * Liveblocks Admin API — Room Reuse Only
 *
 * Strategy: NEVER delete rooms. Each room created counts against the
 * 500/month free quota, even if deleted. Instead, we reuse empty rooms.
 */

const LIVEBLOCKS_API = "https://api.liveblocks.io/v2";

function getSecretKey(): string {
    const key = process.env.LIVEBLOCKS_SECRET_KEY;
    if (!key) {
        throw new Error("LIVEBLOCKS_SECRET_KEY is not set in environment variables");
    }
    return key;
}

function headers() {
    return {
        Authorization: `Bearer ${getSecretKey()}`,
        "Content-Type": "application/json",
    };
}

export interface LiveblocksRoom {
    type: string;
    id: string;
    lastConnectionAt: string | null;
    createdAt: string;
    metadata: Record<string, string | string[]>;
}

export interface ActiveUser {
    type: string;
    connectionId: number;
    id: string;
}

/**
 * List all rooms with optional prefix filter. Handles pagination.
 */
export async function listRooms(prefix?: string): Promise<LiveblocksRoom[]> {
    const allRooms: LiveblocksRoom[] = [];
    let cursor: string | null = null;

    do {
        const params = new URLSearchParams({ limit: "100" });
        if (prefix) params.set("query", `roomId^"${prefix}"`);
        if (cursor) params.set("startingAfter", cursor);

        const res = await fetch(`${LIVEBLOCKS_API}/rooms?${params}`, {
            headers: headers(),
        });

        if (!res.ok) {
            throw new Error(`Failed to list rooms: ${res.status} ${res.statusText}`);
        }

        const data = await res.json();
        allRooms.push(...data.data);
        cursor = data.nextCursor || null;
    } while (cursor);

    return allRooms;
}

/**
 * Get active users in a specific room.
 */
export async function getActiveUsers(roomId: string): Promise<ActiveUser[]> {
    const res = await fetch(`${LIVEBLOCKS_API}/rooms/${encodeURIComponent(roomId)}/active_users`, {
        headers: headers(),
    });

    if (!res.ok) {
        if (res.status === 404) return [];
        throw new Error(`Failed to get active users: ${res.status}`);
    }

    const data = await res.json();
    return data.data || [];
}

/**
 * Find available (empty) codehub- rooms for reuse.
 * Returns rooms sorted by most recently active (freshest first).
 * Stops early once we find enough rooms.
 */
export async function findAvailableRooms(maxResults: number = 3): Promise<{
    id: string;
    shortId: string;
    lastActive: string | null;
}[]> {
    const rooms = await listRooms("codehub-");
    const available: { id: string; shortId: string; lastActive: string | null }[] = [];

    // Check most recently active rooms first (more likely to have warm caches)
    const sorted = rooms.sort((a, b) => {
        const aTime = a.lastConnectionAt ? new Date(a.lastConnectionAt).getTime() : 0;
        const bTime = b.lastConnectionAt ? new Date(b.lastConnectionAt).getTime() : 0;
        return bTime - aTime; // descending — most recent first
    });

    for (const room of sorted) {
        try {
            const users = await getActiveUsers(room.id);
            if (users.length === 0) {
                available.push({
                    id: room.id,
                    shortId: room.id.replace("codehub-", ""),
                    lastActive: room.lastConnectionAt,
                });
            }
        } catch {
            continue; // Skip rooms we can't check
        }

        if (available.length >= maxResults) break;
    }

    return available;
}
