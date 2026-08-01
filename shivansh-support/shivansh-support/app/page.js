"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { CheckCircle2, XCircle, X } from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VaultRing from "@/components/VaultRing";
import SupportPanel from "@/components/SupportPanel";
import Leaderboard from "@/components/Leaderboard";

const POLL_MS = 15000;

function fireConfetti() {
  const colors = ["#7C3AED", "#C084FC", "#E879F9", "#FBBF24"];
  confetti({
    particleCount: 120,
    spread: 90,
    origin: { y: 0.6 },
    colors,
  });
  confetti({
    particleCount: 60,
    angle: 60,
    spread: 60,
    origin: { x: 0, y: 0.7 },
    colors,
  });
  confetti({
    particleCount: 60,
    angle: 120,
    spread: 60,
    origin: { x: 1, y: 0.7 },
    colors,
  });
}

export default function Home() {
  const [stats, setStats] = useState({ todayCount: 0, goal: 50, percent: 0 });
  const [leaderboard, setLeaderboard] = useState([]);
  const [loadingBoard, setLoadingBoard] = useState(true);
  const [toast, setToast] = useState(null);
  const [prevGoalHit, setPrevGoalHit] = useState(false);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("/api/stats", { cache: "no-store" });
      const data = await res.json();
      if (res.ok) {
        setStats(data);
        if (data.goalHit && !prevGoalHit) {
          fireConfetti();
        }
        setPrevGoalHit(Boolean(data.goalHit));
      }
    } catch {
      // silent — next poll will retry
    }
  }, [prevGoalHit]);

  const fetchLeaderboard = useCallback(async () => {
    try {
      const res = await fetch("/api/leaderboard", { cache: "no-store" });
      const data = await res.json();
      if (res.ok) setLeaderboard(data.leaderboard || []);
    } catch {
      // silent — next poll will retry
    } finally {
      setLoadingBoard(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    fetchLeaderboard();
    const interval = setInterval(() => {
      fetchStats();
      fetchLeaderboard();
    }, POLL_MS);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const supported = params.get("supported");
    if (supported === "1") {
      setToast({
        type: "success",
        message: "You're verified! Thanks for the support — check your rank below.",
      });
      fireConfetti();
      fetchStats();
      fetchLeaderboard();
    } else if (supported === "0") {
      setToast({
        type: "error",
        message: "That link couldn't be verified. Try unlocking again.",
      });
    }
    if (supported) {
      window.history.replaceState({}, "", window.location.pathname);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="relative">
      {/* ambient background orbs */}
      <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-amethyst/25 blur-[100px]" />
      <div className="pointer-events-none absolute -right-24 top-64 h-80 w-80 rounded-full bg-pulse/20 blur-[110px]" />

      <Navbar />

      {toast && (
        <div className="fixed inset-x-0 top-4 z-50 flex justify-center px-4">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass flex max-w-md items-center gap-3 rounded-xl px-4 py-3 shadow-card ${
              toast.type === "success" ? "border-ember/30" : "border-pulse/30"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle2 size={18} className="shrink-0 text-ember" />
            ) : (
              <XCircle size={18} className="shrink-0 text-pulse" />
            )}
            <p className="text-sm text-white">{toast.message}</p>
            <button
              onClick={() => setToast(null)}
              className="ml-1 shrink-0 text-mist hover:text-white"
              aria-label="Dismiss"
            >
              <X size={16} />
            </button>
          </motion.div>
        </div>
      )}

      {/* Hero */}
      <section className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-6 pb-16 pt-8 text-center md:pt-16">
        <span className="mb-5 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-orchid">
          Daily goal · {stats.goal} supporters
        </span>

        <h1 className="font-display text-4xl font-extrabold leading-[1.1] text-white sm:text-5xl md:text-6xl">
          Unlock today&apos;s drop for{" "}
          <span className="text-shimmer">Shivansh Playlists</span>
        </h1>

        <p className="mt-5 max-w-xl text-base text-mist sm:text-lg">
          One quick link keeps the channel going. Unlock it, get verified
          instantly, and watch your name climb the vault leaderboard.
        </p>

        <div className="mt-12 flex w-full flex-col items-center gap-10 md:flex-row md:items-center md:justify-center md:gap-16">
          <VaultRing
            percent={stats.percent}
            todayCount={stats.todayCount}
            goal={stats.goal}
          />
          <SupportPanel />
        </div>
      </section>

      {/* Leaderboard */}
      <section
        id="leaderboard"
        className="relative z-10 mx-auto max-w-2xl px-6 pb-24"
      >
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-white">
              Leaderboard
            </h2>
            <p className="text-sm text-mist">Ranked by total unlocks</p>
          </div>
        </div>

        <Leaderboard entries={leaderboard} loading={loadingBoard} />
      </section>

      <Footer />
    </main>
  );
}
