const { getSupabaseAdmin } = require("../lib/supabase");
const { todayKey } = require("../lib/date");

const DAILY_GOAL = Number(process.env.DAILY_GOAL || 50);

module.exports = async (req, res) => {
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

    res.status(200).json({
      todayCount,
      goal: DAILY_GOAL,
      remaining: Math.max(DAILY_GOAL - todayCount, 0),
      percent: Math.min(Math.round((todayCount / DAILY_GOAL) * 100), 100),
      goalHit: todayCount >= DAILY_GOAL,
    });
  } catch (err) {
    console.error("stats error:", err);
    res.status(500).json({ error: "Could not load today's stats." });
  }
};
