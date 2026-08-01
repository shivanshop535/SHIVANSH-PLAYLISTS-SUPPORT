"use client";

import { motion } from "framer-motion";
import { Lock, LockOpen } from "lucide-react";

const SIZE = 260;
const STROKE = 14;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function VaultRing({ percent = 0, todayCount = 0, goal = 50 }) {
  const clamped = Math.min(Math.max(percent, 0), 100);
  const offset = CIRCUMFERENCE - (clamped / 100) * CIRCUMFERENCE;
  const unlocked = clamped >= 100;

  return (
    <div className="relative mx-auto flex h-[260px] w-[260px] items-center justify-center">
      {/* ambient glow */}
      <div className="absolute inset-0 rounded-full bg-keyhole-glow blur-2xl" />

      {/* pulse rings when the vault is unlocked */}
      {unlocked && (
        <>
          <span className="absolute inset-6 rounded-full border border-ember/60 animate-pulse-ring" />
          <span
            className="absolute inset-6 rounded-full border border-orchid/60 animate-pulse-ring"
            style={{ animationDelay: "0.7s" }}
          />
        </>
      )}

      <svg width={SIZE} height={SIZE} className="relative -rotate-90">
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="rgba(196,181,253,0.12)"
          strokeWidth={STROKE}
        />
        <motion.circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="url(#vaultGradient)"
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          initial={{ strokeDashoffset: CIRCUMFERENCE }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.1, ease: "easeOut" }}
        />
        <defs>
          <linearGradient id="vaultGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7C3AED" />
            <stop offset="55%" stopColor="#C084FC" />
            <stop offset="100%" stopColor={unlocked ? "#FBBF24" : "#E879F9"} />
          </linearGradient>
        </defs>
      </svg>

      <div className="absolute flex flex-col items-center justify-center text-center">
        <div
          className={`mb-2 flex h-14 w-14 items-center justify-center rounded-full border ${
            unlocked
              ? "border-ember/50 bg-ember/10"
              : "border-orchid/30 bg-white/5"
          }`}
        >
          {unlocked ? (
            <LockOpen size={24} className="text-ember" strokeWidth={2.2} />
          ) : (
            <Lock size={22} className="text-orchid" strokeWidth={2.2} />
          )}
        </div>
        <span className="font-display text-4xl font-bold text-white">
          {todayCount}
          <span className="text-mist">/{goal}</span>
        </span>
        <span className="mt-1 text-xs uppercase tracking-[0.2em] text-mist">
          {unlocked ? "Vault unlocked today" : "Supporters today"}
        </span>
      </div>
    </div>
  );
}
