import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { todayKey } from "@/lib/date";

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const id = searchParams.get("id");
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || origin;

  if (!id) {
    return NextResponse.redirect(`${siteUrl}/?supported=0`);
  }

  try {
    const supabase = getSupabaseAdmin();

    const { data: record, error: fetchError } = await supabase
      .from("supports")
      .select("id, status")
      .eq("id", id)
      .single();

    if (fetchError || !record) {
      return NextResponse.redirect(`${siteUrl}/?supported=0`);
    }

    // Idempotent: if it's already verified (user re-hit the link), don't
    // double count it — just send them back to a success state.
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

    return NextResponse.redirect(`${siteUrl}/?supported=1`);
  } catch (err) {
    console.error("support/verify error:", err);
    return NextResponse.redirect(`${siteUrl}/?supported=0`);
  }
}
