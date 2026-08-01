/**
 * Shortens a target URL using the GPLinks API
 * @param {string} longUrl - The destination URL you want the user to end up on after completing the link
 * @returns {Promise<string>} - The shortened GPLink URL
 */
export async function generateGPLink(longUrl) {
  const apiKey = process.env.GPLINKS_API_KEY;
  
  if (!apiKey) {
    throw new Error("GPLINKS_API_KEY environment variable is not defined.");
  }

  // GPLinks standard API endpoint structure
  const apiUrl = `https://gplinks.in/api?api=${encodeURIComponent(apiKey)}&url=${encodeURIComponent(longUrl)}`;

  try {
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`GPLinks network response issue: ${response.statusText}`);
    }

    const data = await response.json();

    // GPLinks returns status "success" along with the shortened URL inside the "shortenedUrl" or "url" property
    if (data.status === 'success' || data.url) {
      return data.url; 
    } else {
      throw new Error(data.message || "GPLinks API was unable to successfully shorten this link.");
    }
  } catch (error) {
    console.error("Error generating GPId link target:", error);
    throw error;
  }
}
