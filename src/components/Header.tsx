"use client";

import { useState } from "react";
import LanguageSelector from "@/components/LanguageSelector";
import ActiveUsers from "@/components/ActiveUsers";
import { Language } from "@/lib/constants";

interface HeaderProps {
  language: Language;
  onLanguageChange: (language: Language) => void;
  onRunCode: () => void;
  isRunning: boolean;
  roomId?: string;
  showCollaboration?: boolean;
  onExit?: () => void;
}

export default function Header({
  language,
  onLanguageChange,
  onRunCode,
  isRunning,
  roomId,
  showCollaboration = false,
  onExit,
}: HeaderProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const input = document.createElement("input");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="header">
      <div className="header-inner">
        {/* Brand */}
        <div className="header-brand">
          <div className="logo-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="url(#hdr-grad)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <defs>
                <linearGradient id="hdr-grad" x1="0%" y1="0%" x2="100%" y2="100%">
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
          <h1 className="logo-text">
            CODE<span className="logo-accent">HUB</span>
          </h1>
          {roomId && (
            <span className="room-badge">
              <span className="room-dot" />
              {roomId}
            </span>
          )}
        </div>

        {/* Center: Active Users */}
        {showCollaboration && (
          <div className="header-center">
            <ActiveUsers />
          </div>
        )}

        {/* Controls */}
        <div className="header-controls">
          <LanguageSelector selected={language} onChange={onLanguageChange} />

          {showCollaboration && (
            <button
              className={`share-btn ${copied ? "copied" : ""}`}
              onClick={handleShare}
              title="Copy room link"
            >
              {copied ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>COPIED</span>
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                    <polyline points="16 6 12 2 8 6" />
                    <line x1="12" y1="2" x2="12" y2="15" />
                  </svg>
                  <span>SHARE</span>
                </>
              )}
            </button>
          )}

          <button
            className={`run-btn ${isRunning ? "running" : ""}`}
            onClick={onRunCode}
            disabled={isRunning}
          >
            {isRunning ? (
              <>
                <div className="run-spinner" />
                <span>EXECUTING...</span>
              </>
            ) : (
              <>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                <span>EXECUTE</span>
              </>
            )}
          </button>

          {onExit && (
            <button
              className="exit-btn"
              onClick={onExit}
              title="Exit session"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span>EXIT</span>
            </button>
          )}
        </div>
      </div>

      <style jsx>{`
        .header {
          position: relative;
          background: rgba(5, 5, 16, 0.9);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(0, 255, 255, 0.06);
          z-index: 50;
        }

        /* Subtle neon underline */
        .header::after {
          content: "";
          position: absolute;
          bottom: -1px;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.15), rgba(255, 0, 128, 0.1), transparent);
        }

        .header-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 20px;
          max-width: 100%;
        }

        .header-brand {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .logo-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 34px;
          height: 34px;
          background: rgba(0, 255, 255, 0.04);
          border: 1px solid rgba(0, 255, 255, 0.1);
          border-radius: var(--radius-sm);
          transition: all var(--transition-normal);
        }

        .logo-icon:hover {
          border-color: rgba(0, 255, 255, 0.3);
          box-shadow: 0 0 16px rgba(0, 255, 255, 0.1);
        }

        .logo-text {
          font-family: var(--font-display);
          font-size: 17px;
          font-weight: 800;
          color: var(--text-primary);
          letter-spacing: 0.1em;
        }

        .logo-accent {
          background: linear-gradient(135deg, #00ffff, #ff0080);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .room-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.05em;
          color: var(--cyan);
          background: rgba(0, 255, 255, 0.04);
          padding: 4px 10px;
          border-radius: 2px;
          border: 1px solid rgba(0, 255, 255, 0.08);
          text-shadow: 0 0 8px var(--cyan-glow);
        }

        .room-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--green);
          box-shadow: 0 0 6px rgba(0, 255, 136, 0.5);
          animation: pulse-dot 2s ease-in-out infinite;
        }

        .header-center {
          display: flex;
          align-items: center;
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
        }

        .header-controls {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .share-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 7px 14px;
          background: rgba(0, 255, 255, 0.04);
          border: 1px solid rgba(0, 255, 255, 0.08);
          border-radius: var(--radius-sm);
          color: var(--text-secondary);
          font-family: var(--font-display);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.08em;
          cursor: pointer;
          transition: all var(--transition-normal);
          white-space: nowrap;
        }

        .share-btn:hover {
          background: rgba(0, 255, 255, 0.08);
          border-color: rgba(0, 255, 255, 0.2);
          color: var(--cyan);
          transform: translateY(-1px);
          box-shadow: 0 0 12px rgba(0, 255, 255, 0.08);
        }

        .share-btn:active { transform: translateY(0); }

        .share-btn.copied {
          border-color: rgba(0, 255, 136, 0.3);
          color: var(--green);
          background: var(--green-dim);
          text-shadow: 0 0 8px rgba(0, 255, 136, 0.3);
        }

        .run-btn {
          position: relative;
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 8px 18px;
          background: linear-gradient(135deg, rgba(0, 255, 255, 0.12), rgba(191, 90, 242, 0.12));
          border: 1px solid rgba(0, 255, 255, 0.2);
          color: var(--cyan);
          border-radius: var(--radius-sm);
          font-family: var(--font-display);
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.1em;
          cursor: pointer;
          transition: all var(--transition-normal);
          white-space: nowrap;
          overflow: hidden;
        }

        .run-btn:hover:not(:disabled) {
          border-color: rgba(0, 255, 255, 0.4);
          box-shadow: 0 0 20px rgba(0, 255, 255, 0.15), 0 0 40px rgba(0, 255, 255, 0.05);
          transform: translateY(-1px);
          text-shadow: 0 0 12px var(--cyan-glow);
        }

        .run-btn:active:not(:disabled) { transform: translateY(0); }

        .run-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .run-btn.running {
          background: var(--surface);
          border-color: rgba(255, 204, 0, 0.15);
          color: var(--yellow);
        }

        .run-spinner {
          width: 14px;
          height: 14px;
          border: 2px solid rgba(255, 204, 0, 0.15);
          border-top-color: var(--yellow);
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        .exit-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 7px 14px;
          background: rgba(255, 51, 102, 0.06);
          border: 1px solid rgba(255, 51, 102, 0.15);
          border-radius: var(--radius-sm);
          color: var(--text-secondary);
          font-family: var(--font-display);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.08em;
          cursor: pointer;
          transition: all var(--transition-normal);
          white-space: nowrap;
        }

        .exit-btn:hover {
          background: rgba(255, 51, 102, 0.12);
          border-color: rgba(255, 51, 102, 0.35);
          color: var(--red);
          transform: translateY(-1px);
          box-shadow: 0 0 12px rgba(255, 51, 102, 0.12);
          text-shadow: 0 0 8px rgba(255, 51, 102, 0.25);
        }

        .exit-btn:active { transform: translateY(0); }

        @media (max-width: 768px) {
          .header-inner { padding: 8px 12px; }
          .logo-text { font-size: 14px; }
          .room-badge { display: none; }
          .header-center { display: none; }
          .share-btn span { display: none; }
          .run-btn span { display: none; }
          .run-btn { padding: 8px 12px; }
          .share-btn { padding: 7px 10px; }
          .exit-btn span { display: none; }
          .exit-btn { padding: 7px 10px; }
        }
      `}</style>
    </header>
  );
}
