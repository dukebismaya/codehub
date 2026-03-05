import { NextRequest, NextResponse } from "next/server";

/**
 * Judge0 CE — Uses environment variable for the API endpoint.
 * Set JUDGE0_API_URL in your .env.local, e.g. https://judge0-ce.p.rapidapi.com
 * Falls back to the public CE endpoint for local dev.
 */
const JUDGE0_API = process.env.JUDGE0_API_URL || "https://ce.judge0.com";
const JUDGE0_API_KEY = process.env.JUDGE0_API_KEY || "";

async function executeCode(sourceCode: string, languageId: number) {
    // Submit code
    const apiHeaders: Record<string, string> = { "Content-Type": "application/json" };
    if (JUDGE0_API_KEY) {
        apiHeaders["X-RapidAPI-Key"] = JUDGE0_API_KEY;
        apiHeaders["X-RapidAPI-Host"] = new URL(JUDGE0_API).host;
    }

    const submitRes = await fetch(`${JUDGE0_API}/submissions?base64_encoded=false&wait=false`, {
        method: "POST",
        headers: apiHeaders,
        body: JSON.stringify({
            source_code: sourceCode,
            language_id: languageId,
            stdin: "",
        }),
    });

    if (!submitRes.ok) {
        if (submitRes.status === 429) throw new RateLimitError();
        throw new Error(`Judge0 submission failed: ${submitRes.status}`);
    }

    const { token } = await submitRes.json();

    // Poll for result (max 10 attempts, 1s apart)
    for (let i = 0; i < 10; i++) {
        await new Promise(r => setTimeout(r, 1000));

        const resultRes = await fetch(
            `${JUDGE0_API}/submissions/${token}?base64_encoded=false`,
            { headers: apiHeaders }
        );

        if (!resultRes.ok) continue;

        const data = await resultRes.json();

        // Status 1 = In Queue, 2 = Processing
        if (data.status?.id <= 2) continue;

        return {
            stdout: data.stdout || "",
            stderr: data.stderr || data.compile_output || "",
            exitCode: data.exit_code,
            time: data.time,
            memory: data.memory,
            status: data.status?.description || "Unknown",
        };
    }

    throw new Error("Execution timed out — try simplifying your code.");
}

class RateLimitError extends Error {
    constructor() {
        super("Rate limit exceeded");
        this.name = "RateLimitError";
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { sourceCode, languageId } = body;

        if (!sourceCode || typeof sourceCode !== "string") {
            return NextResponse.json(
                { error: "Source code is required" },
                { status: 400 }
            );
        }

        if (!languageId || typeof languageId !== "number") {
            return NextResponse.json(
                { error: "Language ID is required" },
                { status: 400 }
            );
        }

        if (sourceCode.length > 100_000) {
            return NextResponse.json(
                { error: "Source code exceeds maximum size (100KB)" },
                { status: 400 }
            );
        }

        const result = await executeCode(sourceCode, languageId);
        return NextResponse.json({ success: true, ...result });
    } catch (error: unknown) {
        if (error instanceof RateLimitError) {
            return NextResponse.json(
                { error: "Rate limit exceeded. Please wait a moment and try again.", isRateLimit: true },
                { status: 429 }
            );
        }

        console.error("Execution error:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Execution failed" },
            { status: 500 }
        );
    }
}
