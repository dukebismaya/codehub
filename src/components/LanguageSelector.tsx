"use client";

import { useState, useRef, useEffect } from "react";
import { Language, LANGUAGES } from "@/lib/constants";

interface LanguageSelectorProps {
  selected: Language;
  onChange: (language: Language) => void;
}

const LANG_ICONS: Record<string, string> = {
  JavaScript: "JS",
  TypeScript: "TS",
  Python: "PY",
  "C++": "C+",
  Java: "JV",
  C: "C",
  Go: "GO",
  Rust: "RS",
  Ruby: "RB",
  PHP: "HP",
};

export default function LanguageSelector({ selected, onChange }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (language: Language) => {
    onChange(language);
    setIsOpen(false);
  };

  return (
    <div className="selector" ref={dropdownRef}>
      <button
        className={`trigger ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="trigger-icon">{LANG_ICONS[selected.name] || "?"}</span>
        <span className="trigger-label">{selected.name}</span>
        <svg
          className={`trigger-chevron ${isOpen ? "rotated" : ""}`}
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <div className="dropdown" role="listbox">
          <div className="dropdown-header">// SELECT_LANGUAGE</div>
          {LANGUAGES.map((lang, idx) => (
            <button
              key={lang.id}
              className={`option ${lang.id === selected.id ? "active" : ""}`}
              onClick={() => handleSelect(lang)}
              role="option"
              aria-selected={lang.id === selected.id}
              style={{ animationDelay: `${idx * 0.02}s` }}
            >
              <span className="option-icon">{LANG_ICONS[lang.name] || "?"}</span>
              <span className="option-name">{lang.name}</span>
              {lang.id === selected.id && (
                <svg className="option-check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}

      <style jsx>{`
        .selector {
          position: relative;
        }

        .trigger {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 7px 12px;
          background: rgba(0, 255, 255, 0.03);
          border: 1px solid rgba(0, 255, 255, 0.08);
          border-radius: var(--radius-sm);
          color: var(--text-primary);
          font-family: var(--font-sans);
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all var(--transition-normal);
          white-space: nowrap;
        }

        .trigger:hover, .trigger.open {
          background: rgba(0, 255, 255, 0.06);
          border-color: rgba(0, 255, 255, 0.15);
        }

        .trigger.open {
          box-shadow: 0 0 0 3px rgba(0, 255, 255, 0.05);
          border-color: rgba(0, 255, 255, 0.2);
        }

        .trigger-icon {
          font-family: var(--font-mono);
          font-size: 10px;
          font-weight: 700;
          color: var(--cyan);
          background: rgba(0, 255, 255, 0.08);
          padding: 2px 5px;
          border-radius: 2px;
          letter-spacing: -0.03em;
          text-shadow: 0 0 8px var(--cyan-glow);
        }

        .trigger-chevron {
          color: var(--text-muted);
          transition: transform var(--transition-normal);
        }

        .trigger-chevron.rotated { transform: rotate(180deg); }

        .dropdown {
          position: absolute;
          top: calc(100% + 6px);
          right: 0;
          min-width: 200px;
          background: var(--bg-secondary);
          border: 1px solid rgba(0, 255, 255, 0.1);
          border-radius: var(--radius-md);
          padding: 4px;
          z-index: 100;
          box-shadow: var(--shadow-lg), 0 0 30px rgba(0, 255, 255, 0.03);
          animation: slideDown 0.15s ease-out;
        }

        .dropdown-header {
          padding: 8px 12px 6px;
          font-family: var(--font-mono);
          font-size: 10px;
          font-weight: 600;
          color: var(--cyan);
          letter-spacing: 0.06em;
          text-shadow: 0 0 8px var(--cyan-glow);
          opacity: 0.6;
        }

        .option {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          padding: 8px 12px;
          background: none;
          border: none;
          color: var(--text-secondary);
          font-family: var(--font-sans);
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          border-radius: var(--radius-sm);
          transition: all var(--transition-fast);
          text-align: left;
          animation: fadeIn 0.15s ease-out both;
        }

        .option:hover {
          background: rgba(0, 255, 255, 0.04);
          color: var(--text-primary);
          transform: translateX(2px);
        }

        .option.active {
          color: var(--cyan);
          background: rgba(0, 255, 255, 0.06);
          text-shadow: 0 0 8px var(--cyan-glow);
        }

        .option-icon {
          font-family: var(--font-mono);
          font-size: 10px;
          font-weight: 700;
          color: var(--text-muted);
          width: 22px;
          text-align: center;
        }

        .option.active .option-icon {
          color: var(--cyan);
          text-shadow: 0 0 8px var(--cyan-glow);
        }

        .option-check {
          color: var(--cyan);
          margin-left: auto;
          filter: drop-shadow(0 0 4px var(--cyan-glow));
        }
      `}</style>
    </div>
  );
}
