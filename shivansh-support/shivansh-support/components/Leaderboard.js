"use client";

import { motion } from "framer-motion";
import { Flame, Trophy, Medal, Crown } from "lucide-react";

const RANK_STYLES = [
  { icon: Crown, color: "text-ember", ring: "border-ember/50 bg-ember/10" },
  { icon: Trophy, color: "text-orchid", ring: "border-orchid/50 bg-orchid/10" },
  { icon: Medal, color: "text-pulse", ring: "border-pulse/50 bg-pulse/10" },
];

export default function Leaderboard({ entries, loading }) {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-16 animate-pulse rounded-xl border border-white/5 bg-white/5"
          />
        ))}
      </div>
    );
  }

  if (!entries.length) {
    return (
      <div className="glass rounded-2xl p-10 text-center">
        <p className="font-display text-lg font-semibold text-white">
          No supporters yet today
        </p>
        <p className="mt-1 text-sm text-mist">
          Be the first to unlock and claim the top spot.
        </p>
      </div>
    );
  }

  return (
    <ol className="space-y-3">
      {entries.map((entry, index) => {
        const rankStyle = RANK_STYLES[index];
        const RankIcon = rankStyle?.icon;

        return (
          <motion.li
            key={entry.username + index}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(index * 0.03, 0.3) }}
            className={`glass flex items-center justify-between rounded-xl px-4 py-3.5 sm:px-5 ${
              index === 0 ? "shadow-glow-sm" : ""
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full border text-sm font-bold ${
                  rankStyle
                    ? rankStyle.ring
                    : "border-white/10 bg-white/5 text-mist"
                }`}
              >
                {RankIcon ? (
                  <RankIcon size={16} className={rankStyle.color} />
                ) : (
                  index + 1
                )}
              </div>
              <div>
                <p className="font-medium text-white">{entry.username}</p>
                <p className="text-xs text-mist">
                  {entry.total} unlock{entry.total === 1 ? "" : "s"} total
                </p>
              </div>
            </div>

            <div
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-semibold ${
                entry.streak > 0
                  ? "border-ember/40 bg-ember/10 text-ember"
                  : "border-white/10 text-mist"
              }`}
            >
              <Flame size={14} className={entry.streak > 0 ? "fill-ember/30" : ""} />
              {entry.streak}
            </div>
          </motion.li>
        );
      })}
    </ol>
  );
}
