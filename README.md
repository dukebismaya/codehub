# CodeHub

A real-time collaborative code editor with a cyberpunk-themed UI. Write code together with live cursors, execute it in 10+ languages, or use solo mode when you just want to hack on something by yourself.

Built with Next.js, Monaco Editor, Liveblocks + Yjs for real-time sync, and Judge0 for code execution.

## Features

- **Real-time collaboration** — Multiple users edit the same file simultaneously with live cursor tracking
- **Code execution** — Run code in Python, JavaScript, C, C++, Go, Rust, Java, Ruby, PHP, and more via Judge0
- **Solo mode** — A standalone editor at `/solo` for when you don't need a room
- **Error diagnostics** — Parsed stderr output shows inline error markers in the editor
- **Language switching** — Change languages on the fly; synced across all users in a room
- **Room reuse** — Available rooms are surfaced so you can join existing sessions

## Getting Started

```bash
# install dependencies
npm install

# create a .env.local with your keys
cp .env.example .env.local

# run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to get started.

### Environment Variables

Create a `.env.local` file in the project root:

```env
# Liveblocks (required for collab rooms)
NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY=pk_...
LIVEBLOCKS_SECRET_KEY=sk_...

# Judge0 code execution (optional — falls back to public CE endpoint)
JUDGE0_API_URL=https://judge0-ce.p.rapidapi.com
JUDGE0_API_KEY=your_rapidapi_key
```

- **Liveblocks keys** — Get them from [liveblocks.io/dashboard](https://liveblocks.io/dashboard)
- **Judge0** — The free public endpoint works for local dev. For production, grab a key from [RapidAPI](https://rapidapi.com/judge0-official/api/judge0-ce)

## Tech Stack

- [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- [React 19](https://react.dev/)
- [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- [Liveblocks](https://liveblocks.io/) + [Yjs](https://yjs.dev/) for CRDT-based real-time sync
- [Judge0 CE](https://judge0.com/) for sandboxed code execution
- [Tailwind CSS 4](https://tailwindcss.com/)

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── solo/page.tsx         # Solo editor
│   ├── room/[id]/page.tsx    # Collaborative room
│   ├── api/execute/route.ts  # Judge0 proxy
│   └── api/rooms/available/  # Room discovery
├── components/
│   ├── CollaborativeEditor   # Monaco + Liveblocks/Yjs
│   ├── SoloEditor            # Monaco standalone
│   ├── Header                # Top bar with controls
│   ├── OutputTerminal        # Execution output panel
│   ├── ActiveUsers           # Presence avatars
│   ├── LanguageSelector      # Language picker
│   ├── UsernameModal         # Name entry for rooms
│   └── SplashLoader          # Animated intro screen
└── lib/
    ├── constants.ts           # Language configs
    ├── error-parser.ts        # Stderr → editor markers
    └── liveblocks-admin.ts    # Server-side Liveblocks client
```

## Deployment

Works on Vercel, Cloudflare Pages, or any platform that supports Next.js. Just set the environment variables in your hosting dashboard — no secrets are committed to the repo.

## License

MIT
