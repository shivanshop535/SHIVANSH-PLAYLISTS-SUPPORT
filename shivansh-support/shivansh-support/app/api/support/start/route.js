import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { createGplinksShortlink } from "@/lib/gplinks";

const USERNAME_PATTERN = /^[a-zA-Z0-9_ .]{2,24}$/;

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const username = String(body?.username || "").trim();

    if (!USERNAME_PATTERN.test(username)) {
      return NextResponse.json(
        {
          error:
            "Enter a name between 2 and 24 characters (letters, numbers, spaces, . and _ only).",
        },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    const { data: pending, error: insertError } = await supabase
      .from("supports")
      .insert({ username, status: "pending" })
      .select("id")
      .single();

    if (insertError) throw insertError;

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
    const verifyUrl = `${siteUrl}/api/support/verify?id=${pending.id}`;

    const { url, demo } = await createGplinksShortlink(verifyUrl);

    return NextResponse.json({ redirectUrl: url, id: pending.id, demo });
  } catch (err) {
    console.error("support/start error:", err);
    return NextResponse.json(
      { error: "Something went wrong starting your support. Try again." },
      { status: 500 }
    );
  }
}
