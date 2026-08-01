import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { todayKey } from "@/lib/date";

export const dynamic = "force-dynamic";

const DAILY_GOAL = Number(process.env.NEXT_PUBLIC_DAILY_GOAL || 50);

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    const today = todayKey();

    const { count, error } = await supabase
      .from("supports")
      .select("id", { count: "exact", head: true })
      .eq("status", "verified")
      .eq("support_date", today);

    if (error) throw error;

    const todayCount = count || 0;

    return NextResponse.json({
      todayCount,
      goal: DAILY_GOAL,
      remaining: Math.max(DAILY_GOAL - todayCount, 0),
      percent: Math.min(Math.round((todayCount / DAILY_GOAL) * 100), 100),
      goalHit: todayCount >= DAILY_GOAL,
    });
  } catch (err) {
    console.error("stats error:", err);
    return NextResponse.json(
      { error: "Could not load today's stats." },
      { status: 500 }
    );
  }
}
