"use client";

import * as Y from "yjs";
import { LiveblocksYjsProvider } from "@liveblocks/yjs";
import { useRoom } from "@/liveblocks.config";
import { useCallback, useEffect, useRef, useState } from "react";
import MonacoEditor from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { MonacoBinding } from "y-monaco";
import { Awareness } from "y-protocols/awareness";
import { EditorError } from "@/lib/error-parser";

interface CollaborativeEditorProps {
    language: string;
    onCodeChange?: (code: string) => void;
    username?: string;
    errors?: EditorError[];
}

// Random user colors for cursor presence
const CURSOR_COLORS = [
    "#7c3aed", "#ef4444", "#22c55e", "#3b82f6",
    "#f59e0b", "#ec4899", "#06b6d4", "#f97316",
    "#8b5cf6", "#14b8a6",
];

function getRandomColor() {
    return CURSOR_COLORS[Math.floor(Math.random() * CURSOR_COLORS.length)];
}

export default function CollaborativeEditor({ language, onCodeChange, username, errors }: CollaborativeEditorProps) {
    const room = useRoom();
    const [editorInstance, setEditorInstance] = useState<editor.IStandaloneCodeEditor>();
    const bindingRef = useRef<MonacoBinding | null>(null);
    const providerRef = useRef<LiveblocksYjsProvider | null>(null);
    const userRef = useRef({ name: username || "Anonymous", color: getRandomColor() });

    // Set up Liveblocks Yjs provider and MonacoBinding
    useEffect(() => {
        if (!editorInstance || !room) return;

        const yDoc = new Y.Doc();
        const provider = new LiveblocksYjsProvider(room, yDoc);
        providerRef.current = provider;

        const yText = yDoc.getText("monaco");
        const model = editorInstance.getModel();

        if (model) {
            const binding = new MonacoBinding(
                yText,
                model,
                new Set([editorInstance]),
                provider.awareness as unknown as Awareness
            );
            bindingRef.current = binding;
        }

        // Set user awareness (for cursor labels) — uses the custom username
        provider.awareness.setLocalStateField("user", userRef.current);

        // Track code changes for the parent
        const onChange = () => {
            if (onCodeChange) {
                const model = editorInstance.getModel();
                if (model) {
                    onCodeChange(model.getValue());
                }
            }
        };

        const disposable = editorInstance.onDidChangeModelContent(onChange);

        return () => {
            disposable.dispose();
            bindingRef.current?.destroy();
            provider.destroy();
            yDoc.destroy();
        };
    }, [editorInstance, room, onCodeChange]);

    // Update language when it changes
    useEffect(() => {
        if (editorInstance) {
            const model = editorInstance.getModel();
            if (model) {
                editor.setModelLanguage(model, language);
            }
        }
    }, [language, editorInstance]);

    // Set error markers in the editor
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
            severity: err.severity === "warning" ? 4 : 8, // MarkerSeverity.Warning = 4, Error = 8
        }));

        editor.setModelMarkers(model, "execution", markers);
    }, [errors, editorInstance]);

    const handleOnMount = useCallback((e: editor.IStandaloneCodeEditor) => {
        setEditorInstance(e);
    }, []);

    return (
        <MonacoEditor
            height="100%"
            theme="vs-dark"
            defaultLanguage={language}
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
                    <span className="animate-pulse-glow" style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: "var(--accent)",
                        display: "inline-block",
                    }} />
                    Connecting to room...
                </div>
            }
        />
    );
}
