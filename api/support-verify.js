const { getSupabaseAdmin } = require("../lib/supabase");
const { todayKey } = require("../lib/date");

module.exports = async (req, res) => {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || `https://${req.headers.host}`;
  const id = req.query.id;

  if (!id) {
    res.writeHead(302, { Location: `${siteUrl}/?supported=0` });
    res.end();
    return;
  }

  try {
    const supabase = getSupabaseAdmin();

    const { data: record, error: fetchError } = await supabase
      .from("supports")
      .select("id, status")
      .eq("id", id)
      .single();

    if (fetchError || !record) {
      res.writeHead(302, { Location: `${siteUrl}/?supported=0` });
      res.end();
      return;
    }

    // Idempotent: if it's already verified, don't double count — just
    // send the visitor back to the success state.
    if (record.status !== "verified") {
      const { error: updateError } = await supabase
        .from("supports")
        .update({
          status: "verified",
          verified_at: new Date().toISOString(),
          support_date: todayKey(),
        })
        .eq("id", id)
        .eq("status", "pending");

      if (updateError) throw updateError;
    }

    res.writeHead(302, { Location: `${siteUrl}/?supported=1` });
    res.end();
  } catch (err) {
    console.error("support-verify error:", err);
    res.writeHead(302, { Location: `${siteUrl}/?supported=0` });
    res.end();
  }
};
