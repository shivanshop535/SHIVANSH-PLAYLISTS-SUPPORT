/**
 * Wraps a destination URL in a fresh GPLinks shortlink using GPLinks'
 * public "quick link" API: https://gplinks.in/api?api=API_KEY&url=DEST
 *
 * If no GPLINKS_API_KEY is set, we fall back to "demo mode" and hand back
 * the destination URL untouched, so the rest of the site keeps working
 * while you're building/testing without a real GPLinks account.
 */
export async function createGplinksShortlink(destinationUrl) {
  const apiKey = process.env.GPLINKS_API_KEY;

  if (!apiKey) {
    return { url: destinationUrl, demo: true };
  }

  const endpoint = `https://gplinks.in/api?api=${encodeURIComponent(
    apiKey
  )}&url=${encodeURIComponent(destinationUrl)}`;

  const res = await fetch(endpoint, { cache: "no-store" });

  if (!res.ok) {
    throw new Error(`GPLinks API responded with status ${res.status}`);
  }

  const data = await res.json();

  // GPLinks (and most PYP shortlink APIs) return one of these shapes
  // depending on the endpoint version:
  //   { status: "success", shortenedUrl: "https://gplinks.in/xxxx" }
  //   { status: "success", shortened_url: "https://gplinks.in/xxxx" }
  const shortUrl = data.shortenedUrl || data.shortened_url || data.short;

  if (!shortUrl) {
    throw new Error(
      `GPLinks API did not return a shortened URL: ${JSON.stringify(data)}`
    );
  }

  return { url: shortUrl, demo: false };
}
