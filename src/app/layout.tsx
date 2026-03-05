import type { Metadata } from "next";
import { Orbitron, Rajdhani, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-orbitron",
  display: "swap",
});

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-rajdhani",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CodeHub - Real-Time Collaborative Code Editor",
  description:
    "Write, share, and execute code together in real-time. Powered by Monaco Editor, Liveblocks, and Judge0.",
  keywords: ["code editor", "collaborative", "real-time", "code execution", "online IDE"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${orbitron.variable} ${rajdhani.variable} ${jetbrainsMono.variable}`}>
      <head>
        {/* Inline critical styles to prevent FOUC */}
        <style dangerouslySetInnerHTML={{ __html: `
          html, body { background: #050510; margin: 0; padding: 0; }
          html { color-scheme: dark; }
        `}} />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
