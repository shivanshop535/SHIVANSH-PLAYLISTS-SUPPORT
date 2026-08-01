// All "day" boundaries for streaks and the daily goal use IST (Asia/Kolkata),
// since that's the channel's home timezone. Change TIMEZONE if needed.
const TIMEZONE = "Asia/Kolkata";

/** Returns today's date as YYYY-MM-DD in the configured timezone. */
export function todayKey(date = new Date()) {
  return dateKey(date);
}

export function dateKey(date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

/** Returns yesterday's date as YYYY-MM-DD in the configured timezone. */
export function yesterdayKey(date = new Date()) {
  const d = new Date(date);
  d.setUTCDate(d.getUTCDate() - 1);
  return dateKey(d);
}

/**
 * Given a sorted-descending list of unique YYYY-MM-DD support dates for one
 * user, compute their current streak (consecutive days, ending today or
 * yesterday — a streak isn't broken until a full day is missed).
 */
export function computeStreak(sortedDatesDesc) {
  if (!sortedDatesDesc.length) return 0;

  const today = todayKey();
  const yesterday = yesterdayKey();
  const mostRecent = sortedDatesDesc[0];

  if (mostRecent !== today && mostRecent !== yesterday) return 0;

  let streak = 1;
  let cursor = new Date(`${mostRecent}T12:00:00`);

  for (let i = 1; i < sortedDatesDesc.length; i++) {
    cursor.setUTCDate(cursor.getUTCDate() - 1);
    const expected = dateKey(cursor);
    if (sortedDatesDesc[i] === expected) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}
