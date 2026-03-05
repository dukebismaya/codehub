"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import MonacoEditor from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { EditorError } from "@/lib/error-parser";

interface SoloEditorProps {
    language: string;
    defaultCode?: string;
    onCodeChange?: (code: string) => void;
    errors?: EditorError[];
}

export default function SoloEditor({ language, defaultCode, onCodeChange, errors }: SoloEditorProps) {
    const [editorInstance, setEditorInstance] = useState<editor.IStandaloneCodeEditor>();
    const initialCodeSet = useRef(false);

    // Update language when it changes
    useEffect(() => {
        if (editorInstance) {
            const model = editorInstance.getModel();
            if (model) {
                editor.setModelLanguage(model, language);
            }
        }
    }, [language, editorInstance]);

    // Set default code when language changes
    useEffect(() => {
        if (editorInstance && defaultCode !== undefined) {
            const model = editorInstance.getModel();
            if (model && !initialCodeSet.current) {
                model.setValue(defaultCode);
                initialCodeSet.current = true;
            }
        }
    }, [editorInstance, defaultCode]);

    // Set error markers
    useEffect(() => {
        if (!editorInstance) return;
        const model = editorInstance.getModel();
        if (!model) return;

        if (!errors || errors.length === 0) {
            editor.setModelMarkers(model, "execution", []);
            return;
        }

        const markers = errors.map((err) => ({
            startLineNumber: err.lineNumber,
            startColumn: err.column,
            endLineNumber: err.lineNumber,
            endColumn: err.endColumn,
            message: err.message,
            severity: err.severity === "warning" ? 4 : 8,
        }));

        editor.setModelMarkers(model, "execution", markers);
    }, [errors, editorInstance]);

    const handleOnMount = useCallback((e: editor.IStandaloneCodeEditor) => {
        setEditorInstance(e);
        if (defaultCode) {
            e.getModel()?.setValue(defaultCode);
            initialCodeSet.current = true;
        }
    }, [defaultCode]);

    const handleChange = useCallback((value: string | undefined) => {
        if (onCodeChange && value !== undefined) {
            onCodeChange(value);
        }
    }, [onCodeChange]);

    return (
        <MonacoEditor
            height="100%"
            theme="vs-dark"
            defaultLanguage={language}
            onChange={handleChange}
            onMount={handleOnMount}
            options={{
                fontSize: 14,
                fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
                fontLigatures: true,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                padding: { top: 16, bottom: 16 },
                lineNumbers: "on",
                renderLineHighlight: "line",
                cursorBlinking: "smooth",
                cursorSmoothCaretAnimation: "on",
                smoothScrolling: true,
                bracketPairColorization: { enabled: true },
                automaticLayout: true,
                wordWrap: "on",
                tabSize: 2,
                scrollbar: {
                    verticalScrollbarSize: 6,
                    horizontalScrollbarSize: 6,
                    verticalSliderSize: 6,
                    horizontalSliderSize: 6,
                },
            }}
            loading={
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    color: "var(--text-muted)",
                    fontFamily: "var(--font-mono)",
                    fontSize: "13px",
                    gap: "8px",
                }}>
                    <span style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: "var(--accent)",
                        display: "inline-block",
                        animation: "neon-pulse 2s ease-in-out infinite",
                    }} />
                    Loading editor...
                </div>
            }
        />
    );
}
