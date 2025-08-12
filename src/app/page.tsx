// src/app/page.tsx
"use client";

import { useState } from "react";

import dynamic from "next/dynamic";
const STLViewer = dynamic(() => import("../components/STLViewer"), { ssr: false });


export default function Home() {
    const [prompt, setPrompt] = useState("");
    const [loading, setLoading] = useState(false);
    const [answer, setAnswer] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const apiBase = process.env.NEXT_PUBLIC_API_BASE ?? ""; // e.g. https://<azure-proxy>.azurewebsites.net

    async function handleAsk() {
        setLoading(true);
        setError(null);
        setAnswer(null);

        try {
            if (!apiBase) throw new Error("API not configured. Set NEXT_PUBLIC_API_BASE.");
            const resp = await fetch(`${apiBase}/ask-ai`, {
                method: "POST",
                headers: { "Content-Type": "text/plain", "X-Ui-Origin": "ai-geo-ui" },
                body: prompt.trim(),
            });

            const text = await resp.text();
            if (!resp.ok) throw new Error(text || `HTTP ${resp.status}`);

            setAnswer(text);
        } catch (e: any) {
            setError(e.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
            <header className="mx-auto max-w-6xl px-6 py-10">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold tracking-tight">PO • AI Geometry</h1>
                    <a
                        className="rounded-xl border border-white/10 px-4 py-2 text-sm hover:bg-white/5"
                        href="https://pipelineorganics.co.uk"
                        target="_blank"
                    >
                        Pipeline Organics
                    </a>
                </div>
            </header>

            <section className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-6 pb-16 lg:grid-cols-3">
                {/* Left panel: Inputs */}
                <div className="lg:col-span-1">
                    <div className="rounded-3xl border border-white/10 bg-black/30 p-6 shadow-2xl backdrop-blur">
                        <h2 className="mb-3 text-lg font-medium">Ask the Designer</h2>
                        <p className="mb-4 text-sm text-slate-300">
                            Start with <span className="font-mono">tell me …</span> for Q&A, or write a geometry request to generate code later.
                        </p>

                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="tell me the best params for a TPMS electrode…"
                            className="h-44 w-full resize-none rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm outline-none ring-0 focus:border-white/20"
                        />

                        <div className="mt-4 flex items-center justify-between">
                            <div className="text-xs text-slate-400">
                                API: <code className="font-mono">{apiBase || "not set"}</code>
                            </div>
                            <button
                                onClick={handleAsk}
                                disabled={loading || !prompt.trim()}
                                className="rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading ? "Thinking…" : "Ask AI"}
                            </button>
                        </div>
                        {error && <p className="mt-3 text-sm text-rose-400">{error}</p>}
                    </div>
                </div>

                {/* Middle panel: Preview */}
                <div className="lg:col-span-1">
                    <div className="rounded-3xl border border-white/10 bg-black/30 p-6 shadow-2xl backdrop-blur">
                        <h2 className="mb-3 text-lg font-medium">3D Preview</h2>
                        <div className="aspect-video w-full rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-sm text-slate-400">
                            {/* Later: drop your STL/GLTF viewer here (three.js, react-three-fiber) */}
                            Coming soon: lattice viewer
                        </div>
                        <p className="mt-3 text-xs text-slate-400">
                            This will display PicoGK‑generated geometry after we wire the API.
                        </p>
                    </div>
                </div>

                {/* Right panel: Output */}
                <div className="lg:col-span-1">
                    <div className="rounded-3xl border border-white/10 bg-black/30 p-6 shadow-2xl backdrop-blur">
                        <h2 className="mb-3 text-lg font-medium">Result</h2>
                        <div className="h-64 overflow-auto rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-sm">
                            {answer ? (
                                <pre className="whitespace-pre-wrap font-sans leading-relaxed">{answer}</pre>
                            ) : (
                                <p className="text-slate-400">Your answer will appear here.</p>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <footer className="mx-auto max-w-6xl px-6 pb-8 text-center text-xs text-slate-500">
                © {new Date().getFullYear()} Pipeline Organics — prototype UI
            </footer>
        </main>
    );
}
