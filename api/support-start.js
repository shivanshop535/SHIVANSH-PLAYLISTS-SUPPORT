const { getSupabaseAdmin } = require("../lib/supabase");
const { createGplinksShortlink } = require("../lib/gplinks");

const USERNAME_PATTERN = /^[a-zA-Z0-9_ .]{2,24}$/;

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
    const username = String(body.username || "").trim();

    if (!USERNAME_PATTERN.test(username)) {
      res.status(400).json({
        error:
          "Enter a name between 2 and 24 characters (letters, numbers, spaces, . and _ only).",
      });
      return;
    }

    const supabase = getSupabaseAdmin();

    const { data: pending, error: insertError } = await supabase
      .from("supports")
      .insert({ username, status: "pending" })
      .select("id")
      .single();

    if (insertError) throw insertError;

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || `https://${req.headers.host}`;
    const verifyUrl = `${siteUrl}/api/support-verify?id=${pending.id}`;

    const { url, demo } = await createGplinksShortlink(verifyUrl);

    res.status(200).json({ redirectUrl: url, id: pending.id, demo });
  } catch (err) {
    console.error("support-start error:", err);
    res.status(500).json({ error: "Something went wrong starting your support. Try again." });
  }
};
