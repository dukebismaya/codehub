<div align="center">

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%" />

<img src="https://readme-typing-svg.demolab.com?font=Orbitron&weight=800&size=40&duration=3000&pause=1000&color=00FFFF&center=true&vCenter=true&width=600&height=80&lines=CodeHub;Real-Time+Collaboration;Developed+By+Bismaya;Scifi+IDE" alt="Animated CodeHub Title" />

**A Next-Gen Real-Time Collaborative Code Editor**

<a href="https://codehub.bismaya.xyz">
  <img src="https://readme-typing-svg.demolab.com?font=Orbitron&weight=600&size=22&duration=4000&pause=1000&color=BF5AF2&center=true&vCenter=true&width=400&height=40&lines=%E2%86%92+LIVE+AT:+codehub.bismaya.xyz+%E2%86%90;Jack+into+the+grid+now!;Execute+code+in+real-time" alt="Live Demo Link" />
</a>

<p align="center">
  <img src="https://img.shields.io/badge/NEXT.JS-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/REACT-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/TYPESCRIPT-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/TAILWIND_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/LIVEBLOCKS-18181B?style=for-the-badge&logo=liveblocks&logoColor=white" alt="Liveblocks" />
  <img src="https://img.shields.io/badge/JUDGE0-0052CC?style=for-the-badge&logo=atlassian&logoColor=white" alt="Judge0" />
</p>

*Write code together with live cursors, execute it securely in 10+ languages, or jack into solo mode. Experience the grid.*

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%" />

</div>

## ✦ THE ARSENAL ✦

<table width="100%">
  <tr>
    <td width="50%">
      <h3>⚡ Synchronized Editing</h3>
      <p>Edit the same file simultaneously. Watch your teammates type with <b>live multi-colored cursors</b> powered by Liveblocks and Yjs.</p>
    </td>
    <td width="50%">
      <h3>▶️ Instant Execution</h3>
      <p>Execute your code directly in the browser via Judge0 CE. Supports <b>Python, JavaScript, C, C++, Go, Rust, Java, Ruby, PHP</b>.</p>
    </td>
  </tr>
  <tr>
    <td>
      <h3>⌨️ Solo Mode</h3>
      <p>A blazing-fast standalone environment at <code>/solo</code> for when you're hacking off-grid.</p>
    </td>
    <td>
      <h3>🐛 Smart Diagnostics</h3>
      <p>CodeHub parses <code>stderr</code> automatically, plotting <b>inline error markers & squigglies</b> right in the Monaco Editor.</p>
    </td>
  </tr>
  <tr>
    <td>
      <h3>🌐 Dynamic Stack</h3>
      <p>Change languages on the fly, instantly synchronized across all connected users in the room.</p>
    </td>
    <td>
      <h3>♻️ Session Recovery</h3>
      <p>Active sessions are discovered and surfaced automatically on the landing page so you can easily rejoin the terminal.</p>
    </td>
  </tr>
</table>

## 👾 TECH STACK

<div align="center">
  <br />
  <a>
    <img src="https://skillicons.dev/icons?i=nextjs,react,ts,tailwind,nodejs,npm,vscode,github&theme=dark" alt="Tech Stack" />
  </a>
  <br /><br />
  <code>Next.js 16</code> • <code>React 19</code> • <code>TypeScript</code> • <code>Tailwind v4</code> • <code>Monaco</code> • <code>Liveblocks</code> • <code>Judge0</code>
  <br />
</div>

## 🚀 SPIN UP THE MAINFRAME

Follow these steps to deploy the terminal to your local grid.

### 1. Jack In (Install)

```bash
git clone https://github.com/dukebismaya/codehub.git
cd codehub
npm install
```

### 2. Bypass Security (Environment Variables)
Create a `.env.local` file in the root directory:

```env
# >> LIVEBLOCKS CONFIG (Multiplayer Engine)
NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY=pk_...
LIVEBLOCKS_SECRET_KEY=sk_...

# >> JUDGE0 API (Execution Engine)
JUDGE0_API_URL=https://judge0-ce.p.rapidapi.com
JUDGE0_API_KEY=your_rapidapi_key
```

> **🔑 KEY ACCESS:**
> - **Liveblocks**: Grab a free key from the [Liveblocks Dashboard](https://liveblocks.io/dashboard)
> - **Judge0**: Sign up at [RapidAPI Judge0 CE](https://rapidapi.com/judge0-official/api/judge0-ce)

### 3. Initialize Process

```bash
npm run dev
```

📡 Open **[http://localhost:3000](http://localhost:3000)** to enter the system.

<br />
<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=rect&color=0:00ffff,100:bf5af2&height=4&section=header" width="100%"/>
</div>
<br />

## 📂 FILE SYSTEM ARCHITECTURE

```text
codehub/
├── public/                ✨ Brand assets & SVG gradients
├── src/
│   ├── app/               
│   │   ├── page.tsx       🛸 The Grid (Main Interface)
│   │   ├── solo/          💻 Solo Terminal
│   │   ├── room/[id]/     🌐 Multiplayer Instance
│   │   └── api/           🔌 Backend Proxies (Judge0 & Rooms)
│   ├── components/
│   │   ├── Editor         🔤 Monaco Core (Collaborative & Solo)
│   │   ├── SplashLoader   📺 Glitch Intro Splash Screen
│   │   └── Terminal       🖥️ Execution Output Panel
│   └── lib/               ⚙️ Parser & Admin Utilities
```

## ☁️ DEPLOY TO THE EDGE (CLOUDFLARE)

CodeHub is built to deploy flawlessly to **Cloudflare Pages** or **Vercel** with zero configuration headaches. No secrets are tracked in this repository.

### For Cloudflare Pages:

1. Push your code to a GitHub/GitLab repository.
2. Go to the [Cloudflare Dashboard](https://dash.cloudflare.com) > **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
3. Select your repository and proceed to setup.
4. Set the following Build Options:
   - **Framework preset**: `Next.js`
   - **Build command**: `npx @cloudflare/next-on-pages@1`
   - **Build output directory**: `.vercel/output/static`
5. Expand **Environment variables** and add:
   - `NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY`
   - `LIVEBLOCKS_SECRET_KEY`
   - `JUDGE0_API_URL`
   - `JUDGE0_API_KEY`
6. Expand **Settings** > **Functions**, and ensure the **Compatibility flags** include `nodejs_compat`.
7. Click **Save and Deploy**. 🚀

<br />

<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=rect&color=0:00ffff,100:bf5af2&height=4&section=footer" width="100%"/>
  <br/><br/>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square" alt="License"/></a>
  <br/><br/>
  💻 Built with <span style="color: #ff0080">❤️</span> by <a href="https://bismaya.xyz"><b>Bismaya</b></a>
</div>
