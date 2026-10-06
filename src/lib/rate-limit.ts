const hits = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(key: string, maxPerHour?: number): boolean {
  const max = maxPerHour ?? Number(process.env.RATE_LIMIT_MAX_PER_HOUR || 20);
  const now = Date.now();
  const entry = hits.get(key);
  if (!entry || entry.resetAt < now) {
    hits.set(key, { count: 1, resetAt: now + 60 * 60 * 1000 });
    return true;
  }
  if (entry.count >= max) return false;
  entry.count += 1;
  return true;
}
