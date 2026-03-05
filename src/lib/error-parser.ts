export interface EditorError {
  lineNumber: number;
  column: number;
  endColumn: number;
  message: string;
  severity: "error" | "warning";
}

/**
 * Parse stderr output to extract line/column information for editor markers.
 * Supports common error formats from JavaScript, Python, C/C++, Java, Go, Rust, Ruby, PHP.
 */
export function parseErrors(stderr: string): EditorError[] {
  if (!stderr) return [];

  const errors: EditorError[] = [];
  const lines = stderr.split("\n");
  const seen = new Set<string>();

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Python: File "<stdin>", line X | File "...", line X
    const pyMatch = line.match(/(?:File\s+".+?",\s+line\s+(\d+))/i);
    if (pyMatch) {
      const lineNum = parseInt(pyMatch[1], 10);
      // Next line usually has the error message
      const msg = lines[i + 1]?.trim() || lines[i + 2]?.trim() || line.trim();
      const key = `${lineNum}:${msg}`;
      if (!seen.has(key)) {
        seen.add(key);
        errors.push({ lineNumber: lineNum, column: 1, endColumn: 1000, message: msg, severity: "error" });
      }
      continue;
    }

    // C/C++/Go/Rust: file:line:col: error/warning: message
    const cMatch = line.match(/(?:\w+\.(?:c|cpp|cc|h|go|rs|java|js|ts)):(\d+):(\d+):\s*(error|warning|note):\s*(.+)/i);
    if (cMatch) {
      const lineNum = parseInt(cMatch[1], 10);
      const col = parseInt(cMatch[2], 10);
      const sev = cMatch[3].toLowerCase() === "warning" ? "warning" as const : "error" as const;
      const msg = cMatch[4].trim();
      const key = `${lineNum}:${col}:${msg}`;
      if (!seen.has(key)) {
        seen.add(key);
        errors.push({ lineNumber: lineNum, column: col, endColumn: col + 1, message: msg, severity: sev });
      }
      continue;
    }

    // Java: Main.java:line: error: message
    const javaMatch = line.match(/\.java:(\d+):\s*(?:error|warning):\s*(.+)/i);
    if (javaMatch) {
      const lineNum = parseInt(javaMatch[1], 10);
      const msg = javaMatch[2].trim();
      const key = `${lineNum}:${msg}`;
      if (!seen.has(key)) {
        seen.add(key);
        errors.push({ lineNumber: lineNum, column: 1, endColumn: 1000, message: msg, severity: "error" });
      }
      continue;
    }

    // Ruby: file:line: ... (SyntaxError) | file:line:in `method': message
    const rbMatch = line.match(/:(\d+):\s*(?:in\s+`[^']*':\s*)?(.+)/);
    if (rbMatch && !line.startsWith("  ")) {
      const lineNum = parseInt(rbMatch[1], 10);
      const msg = rbMatch[2].trim();
      if (lineNum > 0 && lineNum < 10000 && msg.length > 3) {
        const key = `${lineNum}:${msg}`;
        if (!seen.has(key)) {
          seen.add(key);
          errors.push({ lineNumber: lineNum, column: 1, endColumn: 1000, message: msg, severity: "error" });
        }
      }
      continue;
    }

    // Generic: "line X" or "Line X" patterns
    const genericMatch = line.match(/\bline\s+(\d+)\b/i);
    if (genericMatch && !pyMatch) {
      const lineNum = parseInt(genericMatch[1], 10);
      if (lineNum > 0 && lineNum < 10000) {
        const msg = line.trim();
        const key = `${lineNum}:${msg}`;
        if (!seen.has(key)) {
          seen.add(key);
          errors.push({ lineNumber: lineNum, column: 1, endColumn: 1000, message: msg, severity: "error" });
        }
      }
    }
  }

  return errors;
}
