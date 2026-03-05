"use client";

import { useEffect, useState } from "react";

export default function SplashLoader({ onFinished }: { onFinished: () => void }) {
  const [phase, setPhase] = useState<"init" | "collapse" | "fade">("init");

  useEffect(() => {
    // Brief delay then collapse the text
    const collapseTimer = setTimeout(() => setPhase("collapse"), 200);
    const fadeTimer = setTimeout(() => setPhase("fade"), 2200);
    const doneTimer = setTimeout(() => onFinished(), 2700);
    return () => {
      clearTimeout(collapseTimer);
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, [onFinished]);

  const isFading = phase === "fade";
  const isCollapsed = phase === "collapse" || phase === "fade";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#050510",
        overflow: "hidden",
        transition: "opacity 0.5s ease, visibility 0.5s ease",
        opacity: isFading ? 0 : 1,
        visibility: isFading ? "hidden" : "visible",
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: KEYFRAMES }} />

      {/* ── Ambient aurora blobs ── */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        <div
          style={{
            position: "absolute",
            top: "-30%",
            left: "-20%",
            width: "70%",
            height: "70%",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0,255,255,0.08) 0%, rgba(0,255,255,0) 70%)",
            filter: "blur(80px)",
            animation: "sp-drift1 8s ease-in-out infinite alternate",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-25%",
            right: "-15%",
            width: "65%",
            height: "65%",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(191,90,242,0.09) 0%, rgba(191,90,242,0) 70%)",
            filter: "blur(80px)",
            animation: "sp-drift2 10s ease-in-out infinite alternate",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "20%",
            right: "10%",
            width: "40%",
            height: "40%",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,0,128,0.06) 0%, rgba(255,0,128,0) 70%)",
            filter: "blur(60px)",
            animation: "sp-drift3 12s ease-in-out infinite alternate",
          }}
        />
        {/* Subtle mesh/grain overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.03,
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
            backgroundSize: "128px 128px",
          }}
        />
      </div>

      {/* ── Scanlines ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,255,0.018) 2px, rgba(0,255,255,0.018) 4px)",
        }}
      />

      {/* ── Sci-fi whirl spinner (centered behind text) ── */}
      <div
        style={{
          position: "absolute",
          width: "min(340px, 80vw)",
          height: "min(340px, 80vw)",
          opacity: isCollapsed ? 1 : 0,
          transition: "opacity 0.8s ease",
        }}
      >
        <svg viewBox="0 0 200 200" style={{ width: "100%", height: "100%", position: "absolute" }}>
          <defs>
            <linearGradient id="sp-g1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00ffff" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#00ffff" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="sp-g2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#bf5af2" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#bf5af2" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="sp-g3" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#ff0080" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#ff0080" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Outer ring — fast */}
          <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(0,255,255,0.04)" strokeWidth="1" />
          <g style={{ animation: "sp-spin-fast 0.8s linear infinite" }}>
            <circle cx="100" cy="100" r="90" fill="none" stroke="url(#sp-g1)" strokeWidth="1.5"
              strokeLinecap="round" strokeDasharray="80 486" />
          </g>
          {/* Mid ring — counter-rotate */}
          <circle cx="100" cy="100" r="70" fill="none" stroke="rgba(191,90,242,0.04)" strokeWidth="1" />
          <g style={{ animation: "sp-spin-fast 1.2s linear infinite reverse" }}>
            <circle cx="100" cy="100" r="70" fill="none" stroke="url(#sp-g2)" strokeWidth="2"
              strokeLinecap="round" strokeDasharray="50 390" />
            <circle cx="100" cy="100" r="70" fill="none" stroke="rgba(191,90,242,0.15)" strokeWidth="1"
              strokeLinecap="round" strokeDasharray="20 420" strokeDashoffset="180" />
          </g>
          {/* Inner ring — fastest */}
          <circle cx="100" cy="100" r="48" fill="none" stroke="rgba(255,0,128,0.04)" strokeWidth="1" />
          <g style={{ animation: "sp-spin-fast 0.6s linear infinite" }}>
            <circle cx="100" cy="100" r="48" fill="none" stroke="url(#sp-g3)" strokeWidth="2.5"
              strokeLinecap="round" strokeDasharray="40 262" />
          </g>
          {/* Tiny core ring */}
          <g style={{ animation: "sp-spin-fast 0.4s linear infinite reverse" }}>
            <circle cx="100" cy="100" r="24" fill="none" stroke="rgba(0,255,255,0.2)" strokeWidth="1.5"
              strokeLinecap="round" strokeDasharray="15 136" />
          </g>
        </svg>
        {/* Glow core */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: 60,
            height: 60,
            marginTop: -30,
            marginLeft: -30,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0,255,255,0.08) 0%, transparent 70%)",
            animation: "sp-core-pulse 1.5s ease-in-out infinite",
          }}
        />
      </div>

      {/* ── BISMAYA text with collapse animation ── */}
      <div style={{ position: "relative", zIndex: 1, userSelect: "none", textAlign: "center" }}>
        <div
          style={{
            fontFamily: "var(--font-orbitron, 'Orbitron', monospace)",
            fontSize: "clamp(36px, 9vw, 80px)",
            fontWeight: 900,
            lineHeight: 1,
            textTransform: "uppercase",
            color: "#e0f0ff",
            letterSpacing: isCollapsed ? "-0.02em" : "0.5em",
            transform: isCollapsed ? "scale(1)" : "scale(1.05)",
            textShadow: isCollapsed
              ? "0 0 20px rgba(0,255,255,0.6), 0 0 60px rgba(0,255,255,0.2), 0 0 120px rgba(191,90,242,0.15)"
              : "0 0 5px rgba(0,255,255,0.2)",
            transition: "letter-spacing 1s cubic-bezier(0.16,1,0.3,1), transform 1s cubic-bezier(0.16,1,0.3,1), text-shadow 0.8s ease",
            animation: "sp-flicker 0.15s infinite alternate",
          }}
        >
          BISMAYA
        </div>

        {/* RGB split layers */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            fontFamily: "var(--font-orbitron, 'Orbitron', monospace)",
            fontSize: "clamp(36px, 9vw, 80px)",
            fontWeight: 900,
            lineHeight: 1,
            textTransform: "uppercase",
            textAlign: "center",
            color: "#ff0080",
            mixBlendMode: "screen",
            clipPath: "inset(0 0 60% 0)",
            letterSpacing: isCollapsed ? "-0.02em" : "0.5em",
            transition: "letter-spacing 1s cubic-bezier(0.16,1,0.3,1)",
            animation: "sp-glitch-r 1.2s steps(2, end) infinite",
            pointerEvents: "none",
            opacity: isCollapsed ? 0.7 : 0,
          }}
        >
          BISMAYA
        </div>
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            fontFamily: "var(--font-orbitron, 'Orbitron', monospace)",
            fontSize: "clamp(36px, 9vw, 80px)",
            fontWeight: 900,
            lineHeight: 1,
            textTransform: "uppercase",
            textAlign: "center",
            color: "#00ffff",
            mixBlendMode: "screen",
            clipPath: "inset(40% 0 20% 0)",
            letterSpacing: isCollapsed ? "-0.02em" : "0.5em",
            transition: "letter-spacing 1s cubic-bezier(0.16,1,0.3,1)",
            animation: "sp-glitch-g 0.9s steps(3, end) infinite reverse",
            pointerEvents: "none",
            opacity: isCollapsed ? 0.6 : 0,
          }}
        >
          BISMAYA
        </div>

        {/* Subtitle fades in after collapse */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            marginTop: 20,
            opacity: isCollapsed ? 1 : 0,
            transform: isCollapsed ? "translateY(0)" : "translateY(6px)",
            transition: "opacity 0.6s ease 0.6s, transform 0.6s ease 0.6s",
          }}
        >
          <span
            style={{
              width: 40,
              height: 1,
              background: "linear-gradient(90deg, transparent, rgba(0,255,255,0.4))",
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-jetbrains, 'JetBrains Mono', monospace)",
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "0.3em",
              color: "rgba(0,255,255,0.5)",
              textShadow: "0 0 10px rgba(0,255,255,0.15)",
            }}
          >
            SYSTEMS ONLINE
          </span>
          <span
            style={{
              width: 40,
              height: 1,
              background: "linear-gradient(90deg, rgba(0,255,255,0.4), transparent)",
            }}
          />
        </div>
      </div>
    </div>
  );
}

const KEYFRAMES = `
  @keyframes sp-drift1 {
    0% { transform: translate(0, 0) scale(1); }
    100% { transform: translate(8%, 12%) scale(1.1); }
  }
  @keyframes sp-drift2 {
    0% { transform: translate(0, 0) scale(1); }
    100% { transform: translate(-10%, -8%) scale(1.15); }
  }
  @keyframes sp-drift3 {
    0% { transform: translate(0, 0) scale(1); }
    100% { transform: translate(-5%, 10%) scale(1.05); }
  }
  @keyframes sp-spin-fast {
    to { transform: rotate(360deg); }
  }
  @keyframes sp-core-pulse {
    0%, 100% { opacity: 0.5; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.3); }
  }
  @keyframes sp-flicker {
    0% { opacity: 1; }
    30% { opacity: 0.98; }
    60% { opacity: 1; }
    80% { opacity: 0.96; }
    100% { opacity: 1; }
  }
  @keyframes sp-glitch-r {
    0%   { transform: translate(0); }
    20%  { transform: translate(-3px, 1px); }
    40%  { transform: translate(2px, -1px); }
    60%  { transform: translate(-1px, 2px); }
    80%  { transform: translate(3px, 0); }
    100% { transform: translate(0); }
  }
  @keyframes sp-glitch-g {
    0%   { transform: translate(0); }
    15%  { transform: translate(2px, -2px); }
    35%  { transform: translate(-3px, 1px); }
    55%  { transform: translate(1px, 1px); }
    75%  { transform: translate(-2px, -1px); }
    100% { transform: translate(0); }
  }
`;
