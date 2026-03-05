"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import SplashLoader from "@/components/SplashLoader";

function generateRoomId(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export default function Home() {
  const router = useRouter();
  const [joinId, setJoinId] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashFinished = useCallback(() => {
    setShowSplash(false);
  }, []);

  const handleCreateRoom = async () => {
    setIsCreating(true);
    try {
      const res = await fetch("/api/rooms/available");
      const data = await res.json();
      if (data.available && data.available.length > 0) {
        router.push(`/room/${data.available[0].shortId}`);
        return;
      }
    } catch {
      // Fall through to create new room
    }
    const roomId = generateRoomId();
    router.push(`/room/${roomId}`);
  };

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (joinId.trim()) {
      router.push(`/room/${joinId.trim()}`);
    }
  };

  return (
    <>
      {showSplash && <SplashLoader onFinished={handleSplashFinished} />}
    <div className="landing">
      {/* Cyberpunk grid background */}
      <div className="cyber-grid" />

      {/* Neon glow orbs */}
      <div className="orb orb-cyan" />
      <div className="orb orb-magenta" />
      <div className="orb orb-purple" />

      {/* Horizontal neon lines */}
      <div className="neon-line neon-line-1" />
      <div className="neon-line neon-line-2" />

      <div className="landing-content">
        {/* Logo */}
        <div className="brand">
          <div className="logo-box">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="url(#cyber-grad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <defs>
                <linearGradient id="cyber-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00ffff" />
                  <stop offset="50%" stopColor="#bf5af2" />
                  <stop offset="100%" stopColor="#ff0080" />
                </linearGradient>
              </defs>
              <polyline points="16 18 22 12 16 6" />
              <polyline points="8 6 2 12 8 18" />
              <line x1="14" y1="4" x2="10" y2="20" />
            </svg>
          </div>
          <h1 className="brand-name">
            CODE<span className="brand-accent">HUB</span>
          </h1>
        </div>

        <p className="tagline">
          <span className="tagline-glow">REAL-TIME COLLABORATIVE CODE EDITOR</span>
          <br />
          <span className="tagline-sub">Write · Share · Execute · Together</span>
        </p>

        {/* Main Action Card */}
        <div className="action-card">
          {/* Animated border trace */}
          <div className="card-border" />

          <button
            className={`cta-btn ${isCreating ? "loading" : ""}`}
            onClick={handleCreateRoom}
            disabled={isCreating}
          >
            {isCreating ? (
              <>
                <div className="cta-spinner" />
                <span>INITIALIZING...</span>
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
                <span>START COLLAB ROOM</span>
              </>
            )}
          </button>

          <button
            className="solo-btn"
            onClick={() => router.push("/solo")}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="16 18 22 12 16 6" />
              <polyline points="8 6 2 12 8 18" />
            </svg>
            <span>CODE SOLO</span>
          </button>

          <div className="separator">
            <div className="sep-line" />
            <span className="sep-text">// OR JOIN</span>
            <div className="sep-line" />
          </div>

          <form className="join-form" onSubmit={handleJoinRoom}>
            <div className="input-wrapper">
              <span className="input-prefix">&gt;_</span>
              <input
                type="text"
                className="join-input"
                placeholder="ENTER_ROOM_ID"
                value={joinId}
                onChange={(e) => setJoinId(e.target.value)}
                spellCheck={false}
                autoComplete="off"
              />
            </div>
            <button type="submit" className="join-btn" disabled={!joinId.trim()}>
              JACK IN
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </form>
        </div>

        {/* Feature chips */}
        <div className="features">
          {[
            { icon: "⚡", label: "REAL-TIME SYNC", color: "#ffcc00" },
            { icon: "👁", label: "LIVE CURSORS", color: "#00ffff" },
            { icon: "◇", label: "10+ LANGUAGES", color: "#00ff88" },
            { icon: "▶", label: "CODE EXECUTION", color: "#ff0080" },
            { icon: "⌨", label: "SOLO MODE", color: "#bf5af2" },
          ].map((f) => (
            <div key={f.label} className="feature" style={{ "--feat-color": f.color } as React.CSSProperties}>
              <span className="feat-icon">{f.icon}</span>
              <span>{f.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="site-footer">
        <span className="footer-copy">&copy; {new Date().getFullYear()} Bismaya. All rights reserved.</span>
        <div className="footer-links">
          <a href="https://bismaya.xyz" target="_blank" rel="noopener noreferrer" className="footer-link">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            bismaya.xyz
          </a>
          <a href="https://github.com/dukebismaya" target="_blank" rel="noopener noreferrer" className="footer-link">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
            GitHub
          </a>
          <a href="https://www.linkedin.com/in/bismaya-jyoti-d-74692a328" target="_blank" rel="noopener noreferrer" className="footer-link">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            LinkedIn
          </a>
        </div>
      </footer>

      <style jsx>{`
        .landing {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background: var(--bg-primary);
          position: relative;
          overflow: hidden;
        }

        /* Perspective grid floor */
        .cyber-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(0, 255, 255, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 255, 0.04) 1px, transparent 1px);
          background-size: 80px 80px;
          mask-image: radial-gradient(ellipse 70% 50% at 50% 50%, black 20%, transparent 70%);
          -webkit-mask-image: radial-gradient(ellipse 70% 50% at 50% 50%, black 20%, transparent 70%);
          pointer-events: none;
        }

        /* Neon horizontal accent lines */
        .neon-line {
          position: absolute;
          left: 0;
          right: 0;
          height: 1px;
          pointer-events: none;
          opacity: 0.15;
        }
        .neon-line-1 {
          top: 30%;
          background: linear-gradient(90deg, transparent, var(--cyan), transparent);
        }
        .neon-line-2 {
          bottom: 25%;
          background: linear-gradient(90deg, transparent, var(--magenta), transparent);
        }

        /* Floating orbs */
        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(120px);
          pointer-events: none;
          animation: float 8s ease-in-out infinite;
        }
        .orb-cyan {
          width: 500px; height: 500px;
          background: rgba(0, 255, 255, 0.06);
          top: -150px; right: -120px;
        }
        .orb-magenta {
          width: 400px; height: 400px;
          background: rgba(255, 0, 128, 0.05);
          bottom: -100px; left: -100px;
          animation-delay: -3s;
        }
        .orb-purple {
          width: 300px; height: 300px;
          background: rgba(191, 90, 242, 0.04);
          top: 50%; left: 40%;
          animation-delay: -5s;
        }

        .landing-content {
          text-align: center;
          max-width: 480px;
          padding: 40px 24px;
          position: relative;
          z-index: 1;
          animation: contentIn 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes contentIn {
          from { opacity: 0; transform: translateY(30px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* Brand */
        .brand {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          margin-bottom: 20px;
        }

        .logo-box {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 52px;
          height: 52px;
          background: rgba(0, 255, 255, 0.04);
          border: 1px solid rgba(0, 255, 255, 0.12);
          border-radius: var(--radius-md);
          transition: all var(--transition-normal);
          position: relative;
        }

        .logo-box:hover {
          border-color: rgba(0, 255, 255, 0.3);
          box-shadow: var(--shadow-neon);
          transform: scale(1.08);
        }

        .brand-name {
          font-family: var(--font-display);
          font-size: 36px;
          font-weight: 800;
          color: var(--text-primary);
          letter-spacing: 0.08em;
        }

        .brand-accent {
          background: linear-gradient(135deg, #00ffff, #bf5af2, #ff0080);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Tagline */
        .tagline {
          margin-bottom: 36px;
          line-height: 2;
        }

        .tagline-glow {
          font-family: var(--font-display);
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.2em;
          color: var(--cyan);
          text-shadow: 0 0 12px var(--cyan-glow);
          animation: text-glow 3s ease-in-out infinite;
        }

        .tagline-sub {
          font-family: var(--font-sans);
          font-size: 14px;
          color: var(--text-muted);
          letter-spacing: 0.15em;
        }

        /* Action Card */
        .action-card {
          position: relative;
          background: rgba(5, 5, 16, 0.8);
          border: 1px solid rgba(0, 255, 255, 0.08);
          border-radius: var(--radius-lg);
          padding: 24px;
          backdrop-filter: blur(20px);
          transition: all var(--transition-normal);
        }

        .action-card:hover {
          border-color: rgba(0, 255, 255, 0.15);
          box-shadow: 0 0 40px rgba(0, 255, 255, 0.04);
        }

        /* CTA Button */
        .cta-btn {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          padding: 16px 24px;
          background: linear-gradient(135deg, rgba(0, 255, 255, 0.12), rgba(191, 90, 242, 0.12));
          border: 1px solid rgba(0, 255, 255, 0.2);
          border-radius: var(--radius-md);
          color: var(--cyan);
          font-family: var(--font-display);
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.15em;
          cursor: pointer;
          transition: all var(--transition-normal);
          overflow: hidden;
        }

        .cta-btn::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(0, 255, 255, 0.15), rgba(255, 0, 128, 0.15));
          opacity: 0;
          transition: opacity var(--transition-normal);
        }

        .cta-btn:hover:not(:disabled)::before {
          opacity: 1;
        }

        .cta-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          border-color: rgba(0, 255, 255, 0.4);
          box-shadow: 0 0 24px rgba(0, 255, 255, 0.15), 0 0 60px rgba(0, 255, 255, 0.05);
          text-shadow: 0 0 12px var(--cyan-glow);
        }

        .cta-btn:active:not(:disabled) { transform: translateY(0); }
        .cta-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .cta-btn.loading {
          background: var(--surface);
          border-color: var(--border-light);
          color: var(--text-muted);
        }

        .cta-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(0, 255, 255, 0.15);
          border-top-color: var(--cyan);
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        /* Solo Button */
        .solo-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          padding: 14px 24px;
          margin-top: 10px;
          background: rgba(191, 90, 242, 0.08);
          border: 1px solid rgba(191, 90, 242, 0.2);
          border-radius: var(--radius-md);
          color: var(--purple);
          font-family: var(--font-display);
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.15em;
          cursor: pointer;
          transition: all var(--transition-normal);
          position: relative;
          overflow: hidden;
        }

        .solo-btn:hover {
          transform: translateY(-2px);
          border-color: rgba(191, 90, 242, 0.4);
          box-shadow: 0 0 24px rgba(191, 90, 242, 0.15), 0 0 60px rgba(191, 90, 242, 0.05);
          text-shadow: 0 0 12px var(--purple-glow);
          background: rgba(191, 90, 242, 0.12);
        }

        .solo-btn:active { transform: translateY(0); }

        /* Separator */
        .separator {
          display: flex;
          align-items: center;
          gap: 14px;
          margin: 20px 0;
        }

        .sep-line {
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.1), transparent);
        }

        .sep-text {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--text-muted);
          letter-spacing: 0.1em;
        }

        /* Join form */
        .join-form {
          display: flex;
          gap: 8px;
        }

        .input-wrapper {
          flex: 1;
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-prefix {
          position: absolute;
          left: 14px;
          font-family: var(--font-mono);
          font-size: 13px;
          color: var(--cyan);
          pointer-events: none;
          text-shadow: 0 0 8px var(--cyan-glow);
          opacity: 0.6;
        }

        .join-input {
          width: 100%;
          padding: 12px 16px 12px 42px;
          background: rgba(0, 255, 255, 0.02);
          border: 1px solid rgba(0, 255, 255, 0.08);
          border-radius: var(--radius-sm);
          color: var(--text-primary);
          font-family: var(--font-mono);
          font-size: 13px;
          letter-spacing: 0.05em;
          outline: none;
          transition: all var(--transition-normal);
        }

        .join-input:focus {
          border-color: rgba(0, 255, 255, 0.3);
          box-shadow: 0 0 0 3px rgba(0, 255, 255, 0.05), 0 0 20px rgba(0, 255, 255, 0.05);
          background: rgba(0, 255, 255, 0.03);
        }

        .join-input::placeholder {
          color: var(--text-muted);
          letter-spacing: 0.05em;
        }

        .join-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 12px 18px;
          background: rgba(255, 0, 128, 0.06);
          border: 1px solid rgba(255, 0, 128, 0.15);
          border-radius: var(--radius-sm);
          color: var(--magenta);
          font-family: var(--font-display);
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.1em;
          cursor: pointer;
          transition: all var(--transition-normal);
          white-space: nowrap;
        }

        .join-btn:hover:not(:disabled) {
          background: rgba(255, 0, 128, 0.12);
          border-color: rgba(255, 0, 128, 0.3);
          box-shadow: 0 0 20px rgba(255, 0, 128, 0.1);
          transform: translateY(-1px);
          text-shadow: 0 0 12px rgba(255, 0, 128, 0.25);
        }

        .join-btn:disabled {
          opacity: 0.25;
          cursor: not-allowed;
        }

        /* Feature chips */
        .features {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 36px;
        }

        .feature {
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.08em;
          color: var(--feat-color);
          padding: 6px 14px;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid color-mix(in srgb, var(--feat-color) 12%, transparent);
          border-radius: 2px;
          transition: all var(--transition-normal);
          text-shadow: 0 0 8px color-mix(in srgb, var(--feat-color) 25%, transparent);
        }

        .feat-icon {
          font-size: 11px;
        }

        .feature:hover {
          border-color: color-mix(in srgb, var(--feat-color) 30%, transparent);
          transform: translateY(-2px);
          box-shadow: 0 0 16px color-mix(in srgb, var(--feat-color) 10%, transparent);
        }

        /* Footer */
        .site-footer {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 28px;
          z-index: 2;
          border-top: 1px solid rgba(0, 255, 255, 0.06);
          background: rgba(5, 5, 16, 0.5);
          backdrop-filter: blur(10px);
        }

        .footer-copy {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--text-muted);
          letter-spacing: 0.04em;
        }

        .footer-links {
          display: flex;
          align-items: center;
          gap: 18px;
        }

        .footer-link {
          display: flex;
          align-items: center;
          gap: 5px;
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--text-secondary);
          text-decoration: none;
          letter-spacing: 0.03em;
          transition: color var(--transition-fast), text-shadow var(--transition-fast);
        }

        .footer-link:hover {
          color: var(--cyan);
          text-shadow: 0 0 8px var(--cyan-glow);
        }

        @media (max-width: 480px) {
          .brand-name { font-size: 28px; }
          .features { flex-direction: column; align-items: center; }
          .action-card { padding: 20px 16px; }
          .site-footer {
            flex-direction: column;
            gap: 10px;
            padding: 14px 16px;
            text-align: center;
          }
        }
      `}</style>
    </div>
    </>
  );
}
