"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import OutputTerminal from "@/components/OutputTerminal";
import { Language, DEFAULT_LANGUAGE } from "@/lib/constants";
import { parseErrors, EditorError } from "@/lib/error-parser";

const SoloEditor = dynamic(() => import("@/components/SoloEditor"), {
  ssr: false,
});

export default function SoloPage() {
  const router = useRouter();
  const [language, setLanguage] = useState<Language>(DEFAULT_LANGUAGE);
  const [code, setCode] = useState<string>(DEFAULT_LANGUAGE.defaultCode);
  const [output, setOutput] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [editorErrors, setEditorErrors] = useState<EditorError[]>([]);
  const [execMeta, setExecMeta] = useState<{
    language?: string;
    version?: string;
    exitCode?: number | null;
    time?: string | null;
    memory?: number | null;
  } | null>(null);

  // Resizable panels
  const [editorSize, setEditorSize] = useState(62);
  const [isVertical, setIsVertical] = useState(false);
  const isDragging = useRef(false);
  const workspaceRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 768px)");
    const update = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsVertical(e.matches);
    };
    update(mql);
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  const handleLanguageChange = useCallback((newLanguage: Language) => {
    setLanguage(newLanguage);
    setCode(newLanguage.defaultCode);
  }, []);

  const handleCodeChange = useCallback((value: string) => {
    setCode(value);
  }, []);

  const handleRunCode = useCallback(async () => {
    if (!code.trim()) {
      setError("No code to execute. Write some code first!");
      return;
    }

    setIsRunning(true);
    setOutput("");
    setError("");
    setExecMeta(null);
    setEditorErrors([]);

    try {
      const response = await fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceCode: code,
          languageId: language.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || `Execution failed (HTTP ${response.status})`);
        return;
      }

      setExecMeta({
        language: language.name,
        exitCode: data.exitCode,
        time: data.time,
        memory: data.memory,
      });

      if (data.stderr && !data.stdout) {
        setError(data.stderr);
        setEditorErrors(parseErrors(data.stderr));
      } else if (data.stderr && data.stdout) {
        setOutput(data.stdout);
        setError(data.stderr);
        setEditorErrors(parseErrors(data.stderr));
      } else if (data.stdout) {
        setOutput(data.stdout);
      } else {
        setOutput("Program finished with no output.");
      }
    } catch {
      setError("Failed to connect to the execution service. Check your internet connection.");
    } finally {
      setIsRunning(false);
    }
  }, [code, language]);

  // Resize drag handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isDragging.current = true;
    document.body.style.cursor = isVertical ? "row-resize" : "col-resize";
    document.body.style.userSelect = "none";
  }, [isVertical]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !workspaceRef.current) return;
      const rect = workspaceRef.current.getBoundingClientRect();

      let pct: number;
      if (isVertical) {
        const y = e.clientY - rect.top;
        pct = (y / rect.height) * 100;
      } else {
        const x = e.clientX - rect.left;
        pct = (x / rect.width) * 100;
      }

      setEditorSize(Math.min(80, Math.max(25, pct)));
    };

    const handleMouseUp = () => {
      if (isDragging.current) {
        isDragging.current = false;
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isVertical]);

  const editorFlex = isVertical
    ? { flex: `0 0 ${editorSize}%`, minHeight: 0 }
    : { flex: `0 0 ${editorSize}%`, minWidth: 0 };
  const outputFlex = isVertical
    ? { flex: `0 0 ${100 - editorSize - 1}%`, minHeight: 0 }
    : { flex: `0 0 ${100 - editorSize - 1}%`, minWidth: 0 };

  return (
    <div className="app">
      <Header
        language={language}
        onLanguageChange={handleLanguageChange}
        onRunCode={handleRunCode}
        isRunning={isRunning}
        onExit={() => router.push("/")}
      />

      <main className={`workspace ${isVertical ? "vertical" : "horizontal"}`} ref={workspaceRef}>
        <section className="panel editor-panel" style={editorFlex}>
          <div className="panel-bar">
            <div className="bar-dots">
              <span className="bd bd-r" />
              <span className="bd bd-y" />
              <span className="bd bd-g" />
            </div>
            <span className="bar-label">editor</span>
            <span className="bar-badge">{language.name}</span>
          </div>
          <div className="panel-body">
            <SoloEditor
              language={language.monacoId}
              defaultCode={language.defaultCode}
              onCodeChange={handleCodeChange}
              errors={editorErrors}
            />
          </div>
        </section>

        <div
          className={`divider ${isDragging.current ? "active" : ""}`}
          onMouseDown={handleMouseDown}
        >
          <div className="divider-line" />
          <div className="divider-grip">
            <span /><span /><span />
          </div>
          <div className="divider-line" />
        </div>

        <section className="panel output-panel" style={outputFlex}>
          <OutputTerminal
            output={output}
            error={error}
            isLoading={isRunning}
            execMeta={execMeta}
          />
        </section>
      </main>

      <style jsx>{`
        .app {
          display: flex;
          flex-direction: column;
          height: 100vh;
          background: var(--bg-primary);
        }

        .workspace {
          display: flex;
          flex: 1;
          overflow: hidden;
          padding: 8px 12px 12px;
          gap: 0;
          animation: fadeIn 0.4s ease-out;
        }

        .workspace.horizontal { flex-direction: row; }

        .workspace.vertical {
          flex-direction: column;
          padding: 6px 8px 8px;
        }

        .panel {
          display: flex;
          flex-direction: column;
          min-width: 0;
          min-height: 0;
          background: var(--bg-secondary);
          border-radius: var(--radius-lg);
          border: 1px solid rgba(0, 255, 255, 0.06);
          overflow: hidden;
          transition: border-color var(--transition-normal);
        }

        .panel:hover { border-color: rgba(0, 255, 255, 0.12); }

        .panel-bar {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          background: var(--bg-tertiary);
          border-bottom: 1px solid rgba(0, 255, 255, 0.06);
          user-select: none;
          flex-shrink: 0;
        }

        .bar-dots { display: flex; gap: 6px; }

        .bd {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          transition: transform var(--transition-spring), opacity var(--transition-fast);
        }

        .panel:hover .bd { transform: scale(1.1); }
        .bd-r { background: var(--red); box-shadow: 0 0 6px rgba(255, 51, 102, 0.3); }
        .bd-y { background: var(--yellow); box-shadow: 0 0 6px rgba(255, 204, 0, 0.3); }
        .bd-g { background: var(--green); box-shadow: 0 0 6px rgba(0, 255, 136, 0.3); }

        .bar-label {
          font-family: var(--font-display);
          font-size: 11px;
          font-weight: 600;
          color: var(--text-muted);
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .bar-badge {
          margin-left: auto;
          font-family: var(--font-mono);
          font-size: 10px;
          font-weight: 500;
          color: var(--cyan);
          background: rgba(0, 255, 255, 0.06);
          padding: 3px 10px;
          border-radius: 2px;
          border: 1px solid rgba(0, 255, 255, 0.1);
          letter-spacing: 0.05em;
          text-shadow: 0 0 8px var(--cyan-glow);
          transition: all var(--transition-normal);
        }

        .panel:hover .bar-badge {
          border-color: rgba(0, 255, 255, 0.2);
          box-shadow: 0 0 12px rgba(0, 255, 255, 0.08);
        }

        .panel-body { flex: 1; overflow: hidden; }

        /* Draggable Divider */
        .divider {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: opacity var(--transition-fast);
        }

        .horizontal .divider {
          flex-direction: column;
          width: 16px;
          cursor: col-resize;
          gap: 4px;
        }

        .vertical .divider {
          flex-direction: row;
          height: 16px;
          cursor: row-resize;
          gap: 4px;
        }

        .divider:hover .divider-line,
        .divider.active .divider-line {
          background: var(--cyan);
          box-shadow: 0 0 8px var(--cyan-glow), 0 0 20px rgba(0, 255, 255, 0.08);
        }

        .divider:hover .divider-grip span,
        .divider.active .divider-grip span {
          background: var(--cyan);
          box-shadow: 0 0 4px var(--cyan-glow);
        }

        .divider-line {
          flex: 1;
          background: rgba(0, 255, 255, 0.06);
          border-radius: 1px;
          transition: all var(--transition-normal);
        }

        .horizontal .divider-line { width: 2px; }
        .vertical .divider-line { height: 2px; }

        .divider-grip {
          display: flex;
          gap: 3px;
        }

        .horizontal .divider-grip {
          flex-direction: column;
          padding: 6px 0;
        }

        .vertical .divider-grip {
          flex-direction: row;
          padding: 0 6px;
        }

        .divider-grip span {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: rgba(0, 255, 255, 0.12);
          transition: all var(--transition-normal);
        }

        .output-panel {
          border: none;
          background: transparent;
        }
        .output-panel:hover { border: none; }
      `}</style>
    </div>
  );
}
