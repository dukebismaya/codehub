"use client";

interface OutputTerminalProps {
  output: string;
  error: string;
  isLoading: boolean;
  execMeta?: {
    language?: string;
    version?: string;
    exitCode?: number | null;
    time?: string | null;
    memory?: number | null;
  } | null;
}

export default function OutputTerminal({ output, error, isLoading, execMeta }: OutputTerminalProps) {
  const hasOutput = output || error;
  const hasError = !!error;
  const exitedClean = execMeta?.exitCode === 0;

  return (
    <div className="terminal">
      {/* Header */}
      <div className="terminal-header">
        <div className="header-left">
          <div className="window-dots">
            <span className="dot dot-red" />
            <span className="dot dot-yellow" />
            <span className="dot dot-green" />
          </div>
          <span className="header-title">&gt;_ OUTPUT</span>
        </div>
        <div className="header-status">
          {isLoading ? (
            <span className="status running">
              <span className="status-indicator running" />
              EXECUTING
            </span>
          ) : hasOutput ? (
            <span className={`status ${hasError && !output ? "error" : "done"}`}>
              <span className={`status-indicator ${hasError && !output ? "error" : "done"}`} />
              {hasError && !output ? "ERROR" : "COMPLETED"}
            </span>
          ) : (
            <span className="status idle">
              <span className="status-indicator idle" />
              STANDBY
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="terminal-body">
        {isLoading ? (
          <div className="loading-state">
            <div className="loader">
              <div className="loader-ring" />
              <div className="loader-ring inner" />
            </div>
            <span className="loading-text">EXECUTING CODE<span className="loading-dots" /></span>
          </div>
        ) : error && !output ? (
          <div className="content error-content">
            <div className="label-row">
              <span className="label error-label">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
                STDERR
              </span>
            </div>
            <pre className="output-pre error-text">{error}</pre>
          </div>
        ) : output && error ? (
          <div className="content">
            <div className="label-row">
              <span className="label success-label">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                STDOUT
              </span>
            </div>
            <pre className="output-pre">{output}</pre>
            <div className="separator" />
            <div className="label-row">
              <span className="label warn-label">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                STDERR
              </span>
            </div>
            <pre className="output-pre warn-text">{error}</pre>
          </div>
        ) : output ? (
          <div className="content success-content">
            <div className="label-row">
              <span className="label success-label">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                STDOUT
              </span>
            </div>
            <pre className="output-pre">{output}</pre>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="4 17 10 11 4 5" />
                <line x1="12" y1="19" x2="20" y2="19" />
              </svg>
            </div>
            <p className="empty-title">AWAITING INPUT</p>
            <p className="empty-hint">
              Click <kbd>▶ EXECUTE</kbd> to run
            </p>
          </div>
        )}
      </div>

      {/* Footer Metadata */}
      {execMeta && !isLoading && hasOutput && (
        <div className="terminal-footer">
          {execMeta.language && (
            <span className="meta">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>
              {execMeta.language}
            </span>
          )}
          {execMeta.time && (
            <span className="meta">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
              {execMeta.time}s
            </span>
          )}
          {execMeta.memory && (
            <span className="meta">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2" /><rect x="2" y="14" width="20" height="8" rx="2" ry="2" /><line x1="6" y1="6" x2="6.01" y2="6" /><line x1="6" y1="18" x2="6.01" y2="18" /></svg>
              {(execMeta.memory / 1024).toFixed(1)} MB
            </span>
          )}
          {execMeta.exitCode !== undefined && execMeta.exitCode !== null && (
            <span className={`meta ${exitedClean ? "meta-ok" : "meta-fail"}`}>
              exit {execMeta.exitCode}
            </span>
          )}
        </div>
      )}

      <style jsx>{`
        .terminal {
          display: flex;
          flex-direction: column;
          height: 100%;
          background: var(--bg-secondary);
          border-radius: var(--radius-lg);
          border: 1px solid rgba(0, 255, 255, 0.06);
          overflow: hidden;
          transition: border-color var(--transition-normal);
        }

        .terminal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 16px;
          background: var(--bg-tertiary);
          border-bottom: 1px solid rgba(0, 255, 255, 0.06);
          user-select: none;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .window-dots {
          display: flex;
          gap: 6px;
        }

        .dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          transition: opacity var(--transition-fast);
        }

        .dot-red { background: var(--red); box-shadow: 0 0 6px rgba(255, 51, 102, 0.3); }
        .dot-yellow { background: var(--yellow); box-shadow: 0 0 6px rgba(255, 204, 0, 0.3); }
        .dot-green { background: var(--green); box-shadow: 0 0 6px rgba(0, 255, 136, 0.3); }

        .header-title {
          font-family: var(--font-display);
          font-size: 11px;
          font-weight: 600;
          color: var(--text-muted);
          letter-spacing: 0.1em;
        }

        .header-status {
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.05em;
        }

        .status {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .status.running { color: var(--yellow); text-shadow: 0 0 8px rgba(255, 204, 0, 0.3); }
        .status.done { color: var(--green); text-shadow: 0 0 8px rgba(0, 255, 136, 0.3); }
        .status.idle { color: var(--text-muted); }
        .status.error { color: var(--red); text-shadow: 0 0 8px rgba(255, 51, 102, 0.3); }

        .status-indicator {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }

        .status-indicator.running {
          background: var(--yellow);
          box-shadow: 0 0 8px rgba(255, 204, 0, 0.5);
          animation: pulse-dot 1.2s ease-in-out infinite;
        }

        .status-indicator.done { background: var(--green); box-shadow: 0 0 8px rgba(0, 255, 136, 0.5); }
        .status-indicator.idle { background: var(--text-muted); }
        .status-indicator.error { background: var(--red); box-shadow: 0 0 8px rgba(255, 51, 102, 0.5); }

        .terminal-body {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
        }

        /* Loading */
        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          gap: 20px;
        }

        .loader {
          position: relative;
          width: 36px;
          height: 36px;
        }

        .loader-ring {
          position: absolute;
          inset: 0;
          border: 2px solid rgba(0, 255, 255, 0.08);
          border-top-color: var(--cyan);
          border-radius: 50%;
          animation: spin 0.9s linear infinite;
          filter: drop-shadow(0 0 4px var(--cyan-glow));
        }

        .loader-ring.inner {
          inset: 6px;
          border-top-color: var(--magenta);
          animation-direction: reverse;
          animation-duration: 0.6s;
          filter: drop-shadow(0 0 4px var(--magenta-glow));
        }

        .loading-text {
          font-family: var(--font-mono);
          font-size: 12px;
          color: var(--cyan);
          letter-spacing: 0.1em;
          text-shadow: 0 0 8px var(--cyan-glow);
        }

        .loading-dots::after {
          content: '';
          animation: dots 1.5s steps(3) infinite;
        }

        @keyframes dots {
          0% { content: ''; }
          33% { content: '.'; }
          66% { content: '..'; }
          100% { content: '...'; }
        }

        /* Content */
        .content {
          animation: fadeIn 0.25s ease-out;
        }

        .label-row {
          margin-bottom: 10px;
        }

        .label {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-family: var(--font-mono);
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          padding: 3px 9px;
          border-radius: 2px;
        }

        .success-label {
          color: var(--green);
          background: var(--green-dim);
          text-shadow: 0 0 8px rgba(0, 255, 136, 0.3);
        }

        .error-label {
          color: var(--red);
          background: var(--red-dim);
          text-shadow: 0 0 8px rgba(255, 51, 102, 0.3);
        }

        .warn-label {
          color: var(--yellow);
          background: var(--yellow-dim);
          text-shadow: 0 0 8px rgba(255, 204, 0, 0.3);
        }

        .output-pre {
          font-family: var(--font-mono);
          font-size: 13px;
          line-height: 1.75;
          white-space: pre-wrap;
          word-break: break-word;
          margin: 0;
          color: var(--text-primary);
        }

        .error-text { color: var(--red); }
        .warn-text { color: var(--yellow); }

        .separator {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.08), transparent);
          margin: 16px 0;
        }

        /* Empty */
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          text-align: center;
          gap: 12px;
        }

        .empty-icon {
          color: var(--cyan);
          opacity: 0.2;
          filter: drop-shadow(0 0 8px var(--cyan-glow));
        }

        .empty-title {
          font-family: var(--font-display);
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.15em;
          color: var(--text-muted);
        }

        .empty-hint {
          font-size: 12px;
          color: var(--text-muted);
          opacity: 0.5;
        }

        .empty-hint kbd {
          background: rgba(0, 255, 255, 0.04);
          border: 1px solid rgba(0, 255, 255, 0.08);
          border-radius: 2px;
          padding: 2px 7px;
          font-family: var(--font-mono);
          font-size: 11px;
          font-weight: 500;
          color: var(--cyan);
        }

        /* Footer */
        .terminal-footer {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 8px 16px;
          background: var(--bg-tertiary);
          border-top: 1px solid rgba(0, 255, 255, 0.06);
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.03em;
          color: var(--text-muted);
          animation: fadeIn 0.3s ease-out;
        }

        .meta {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .meta-ok { color: var(--green); text-shadow: 0 0 8px rgba(0, 255, 136, 0.3); }
        .meta-fail { color: var(--red); text-shadow: 0 0 8px rgba(255, 51, 102, 0.3); }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.85); }
        }
      `}</style>
    </div>
  );
}
