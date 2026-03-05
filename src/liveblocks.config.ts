"use client";

import { createClient } from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";

const client = createClient({
    publicApiKey: process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY!,
});

// Presence: what each user shares with others
type Presence = {
    cursor: { lineNumber: number; column: number } | null;
    user: {
        name: string;
        color: string;
    };
    language: string; // monacoId of the currently selected language
};

// Room event types
type RoomEvent = {
    type: "LANGUAGE_CHANGE";
    language: string;
};

export const {
    RoomProvider,
    useRoom,
    useMyPresence,
    useUpdateMyPresence,
    useOthers,
    useSelf,
    useBroadcastEvent,
    useEventListener,
} = createRoomContext<Presence, never, never, RoomEvent>(client);
