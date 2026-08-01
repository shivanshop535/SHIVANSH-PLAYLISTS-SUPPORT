import { KeyRound } from "lucide-react";

export default function Navbar() {
  return (
    <header className="relative z-20 flex items-center justify-between px-6 py-6 md:px-12">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amethyst to-pulse shadow-glow-sm">
          <KeyRound size={20} className="text-white" strokeWidth={2.5} />
        </div>
        <div className="leading-tight">
          <p className="font-display text-sm font-bold tracking-wide text-white">
            SHIVANSH PLAYLISTS
          </p>
          <p className="text-[11px] uppercase tracking-[0.2em] text-mist">
            Support Vault
          </p>
        </div>
      </div>

      <a
        href="#leaderboard"
        className="hidden rounded-full border border-white/10 px-5 py-2 text-sm font-medium text-mist transition hover:border-orchid/50 hover:text-white sm:block"
      >
        Leaderboard
      </a>
    </header>
  );
}
