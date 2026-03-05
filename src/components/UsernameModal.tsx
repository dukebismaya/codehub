"use client";

import { useState, useEffect, useRef } from "react";

interface UsernameModalProps {
  onSubmit: (username: string) => void;
}

const STORAGE_KEY = "codehub-username";

function getSavedUsername(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(STORAGE_KEY) || "";
}

export default function UsernameModal({ onSubmit }: UsernameModalProps) {
  const [name, setName] = useState("");
  const [hasSaved, setHasSaved] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = getSavedUsername();
    if (saved) {
      setName(saved);
      setHasSaved(true);
    }
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    localStorage.setItem(STORAGE_KEY, trimmed);
    onSubmit(trimmed);
  };

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      zIndex: 1000,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "rgba(5, 5, 16, 0.92)",
      backdropFilter: "blur(16px)",
      WebkitBackdropFilter: "blur(16px)",
    }}>
      <div style={{
        width: "100%",
        maxWidth: 420,
        margin: "0 16px",
        padding: 32,
        background: "#0a0a1a",
        border: "1px solid rgba(0, 255, 255, 0.08)",
        borderRadius: 12,
        textAlign: "center",
        animation: "modalSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Subtle top glow line */}
        <div style={{
          position: "absolute",
          top: 0,
          left: "10%",
          right: "10%",
          height: 1,
          background: "linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.3), rgba(255, 0, 128, 0.2), transparent)",
        }} />

        {/* Icon */}
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 56,
          height: 56,
          marginBottom: 16,
          background: "rgba(0, 255, 255, 0.04)",
          border: "1px solid rgba(0, 255, 255, 0.1)",
          borderRadius: 8,
        }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="url(#modal-cyber)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <defs>
              <linearGradient id="modal-cyber" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00ffff" />
                <stop offset="100%" stopColor="#ff0080" />
              </linearGradient>
            </defs>
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>

        {/* Title */}
        <h2 style={{
          fontFamily: "'Orbitron', 'Inter', sans-serif",
          fontSize: 16,
          fontWeight: 700,
          color: "#e0f0ff",
          marginBottom: 8,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
        }}>IDENTIFY YOURSELF</h2>

        <p style={{
          fontSize: 13,
          color: "#445577",
          marginBottom: 24,
          lineHeight: 1.5,
          fontFamily: "'Rajdhani', sans-serif",
          fontWeight: 500,
        }}>
          Your handle will be visible to other operators in this session.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
            <span style={{
              position: "absolute",
              left: 14,
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 13,
              color: "#00ffff",
              pointerEvents: "none",
              opacity: 0.5,
              textShadow: "0 0 8px rgba(0, 255, 255, 0.25)",
              zIndex: 1,
            }}>&gt;_</span>
            <input
              ref={inputRef}
              type="text"
              placeholder="ENTER_HANDLE"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={24}
              spellCheck={false}
              autoComplete="off"
              style={{
                width: "100%",
                padding: "14px 16px 14px 44px",
                background: "rgba(0, 255, 255, 0.02)",
                border: "1px solid rgba(0, 255, 255, 0.08)",
                borderRadius: 4,
                color: "#e0f0ff",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 14,
                letterSpacing: "0.03em",
                outline: "none",
                boxSizing: "border-box",
                transition: "border-color 0.2s, box-shadow 0.2s",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "rgba(0, 255, 255, 0.3)";
                e.currentTarget.style.boxShadow = "0 0 0 3px rgba(0, 255, 255, 0.05), 0 0 20px rgba(0, 255, 255, 0.05)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "rgba(0, 255, 255, 0.08)";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
          </div>

          <button
            type="submit"
            disabled={!name.trim()}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              width: "100%",
              padding: 14,
              color: name.trim() ? "#00ffff" : "#445577",
              border: `1px solid ${name.trim() ? "rgba(0, 255, 255, 0.2)" : "rgba(0, 255, 255, 0.05)"}`,
              borderRadius: 4,
              fontFamily: "'Orbitron', sans-serif",
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: "0.15em",
              cursor: name.trim() ? "pointer" : "not-allowed",
              opacity: name.trim() ? 1 : 0.4,
              background: name.trim()
                ? "linear-gradient(135deg, rgba(0, 255, 255, 0.1), rgba(255, 0, 128, 0.08))"
                : "rgba(0, 255, 255, 0.02)",
              transition: "all 0.25s",
              boxShadow: name.trim() ? "0 0 20px rgba(0, 255, 255, 0.08)" : "none",
              textShadow: name.trim() ? "0 0 12px rgba(0, 255, 255, 0.25)" : "none",
            }}
            onMouseEnter={(e) => {
              if (name.trim()) {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 0 30px rgba(0, 255, 255, 0.15)";
                e.currentTarget.style.borderColor = "rgba(0, 255, 255, 0.35)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = name.trim() ? "0 0 20px rgba(0, 255, 255, 0.08)" : "none";
              e.currentTarget.style.borderColor = name.trim() ? "rgba(0, 255, 255, 0.2)" : "rgba(0, 255, 255, 0.05)";
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
            <span>{hasSaved ? "RECONNECT" : "JACK IN"}</span>
          </button>
        </form>

        {hasSaved && (
          <p style={{
            marginTop: 16,
            fontSize: 11,
            color: "#445577",
            fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: "0.03em",
          }}>
            Welcome back, <strong style={{ color: "#00ffff", textShadow: "0 0 8px rgba(0, 255, 255, 0.25)" }}>{getSavedUsername()}</strong>. Press Enter to reconnect.
          </p>
        )}
      </div>

      <style>{`
                @keyframes modalSlideUp {
                    from { opacity: 0; transform: translateY(30px) scale(0.96); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
            `}</style>
    </div>
  );
}
