import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { computeStreak, todayKey } from "@/lib/date";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();

    const { data: rows, error } = await supabase
      .from("supports")
      .select("username, support_date")
      .eq("status", "verified")
      .order("support_date", { ascending: false });

    if (error) throw error;

    const byUser = new Map();
    for (const row of rows) {
      if (!row.support_date) continue;
      const entry = byUser.get(row.username) || {
        username: row.username,
        total: 0,
        dates: new Set(),
      };
      entry.total += 1;
      entry.dates.add(row.support_date);
      byUser.set(row.username, entry);
    }

    const today = todayKey();

    const leaderboard = Array.from(byUser.values())
      .map((entry) => {
        const sortedDates = Array.from(entry.dates).sort((a, b) =>
          a < b ? 1 : -1
        );
        return {
          username: entry.username,
          total: entry.total,
          streak: computeStreak(sortedDates),
          supportedToday: entry.dates.has(today),
        };
      })
      .sort((a, b) => b.total - a.total || b.streak - a.streak)
      .slice(0, 25);

    return NextResponse.json({ leaderboard });
  } catch (err) {
    console.error("leaderboard error:", err);
    return NextResponse.json(
      { error: "Could not load the leaderboard." },
      { status: 500 }
    );
  }
}
