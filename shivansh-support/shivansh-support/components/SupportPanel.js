"use client";

import { useEffect, useState } from "react";
import { Sparkles, ArrowUpRight, Loader2 } from "lucide-react";

const STORAGE_KEY = "sp_username";

export default function SupportPanel() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) setUsername(saved);
  }, []);

  async function handleSupport(e) {
    e.preventDefault();
    setError("");

    const trimmed = username.trim();
    if (trimmed.length < 2) {
      setError("Enter a name with at least 2 characters.");
      return;
    }

    setLoading(true);
    window.localStorage.setItem(STORAGE_KEY, trimmed);

    try {
      const res = await fetch("/api/support/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: trimmed }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Could not start support.");

      window.location.href = data.redirectUrl;
    } catch (err) {
      setError(err.message || "Something went wrong. Try again.");
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSupport}
      className="glass w-full max-w-md rounded-2xl p-6 shadow-card sm:p-7"
    >
      <label
        htmlFor="username"
        className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-mist"
      >
        Your name for the leaderboard
      </label>
      <input
        id="username"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="e.g. Rohan"
        maxLength={24}
        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 outline-none transition focus:border-orchid/60"
      />

      {error && <p className="mt-2 text-sm text-pulse">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="group mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amethyst to-pulse py-3.5 font-display text-sm font-bold text-white shadow-glow transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Opening the link…
          </>
        ) : (
          <>
            <Sparkles size={18} />
            Unlock &amp; Support
            <ArrowUpRight
              size={16}
              className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </>
        )}
      </button>

      <p className="mt-3 text-center text-xs leading-relaxed text-mist/80">
        You&apos;ll complete a quick link, then land right back here —
        verified instantly, streak and rank updated automatically.
      </p>
    </form>
  );
}
