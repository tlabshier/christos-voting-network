/**
 * In-memory rate limiter for Claude API calls.
 * Limits each IP to a configurable number of analysis requests per day.
 * A batch of N votes counts as N analysis calls.
 */

const DAILY_LIMIT = parseInt(process.env.DAILY_VOTE_LIMIT, 10) || 5;

// Map: ip -> { count, resetTime }
const ipBuckets = new Map();

function getOrCreateBucket(ip) {
  const now = Date.now();
  let bucket = ipBuckets.get(ip);

  if (!bucket || now >= bucket.resetTime) {
    // Reset at midnight UTC (or 24h from first request)
    const tomorrow = new Date();
    tomorrow.setUTCHours(24, 0, 0, 0);
    bucket = { count: 0, resetTime: tomorrow.getTime() };
    ipBuckets.set(ip, bucket);
  }

  return bucket;
}

function getRemainingVotes(ip) {
  const bucket = getOrCreateBucket(ip);
  return Math.max(0, DAILY_LIMIT - bucket.count);
}

function consume(ip, amount = 1) {
  const bucket = getOrCreateBucket(ip);
  bucket.count += amount;
  ipBuckets.set(ip, bucket);
}

/**
 * Express middleware that checks rate limits before vote endpoints.
 * For batch votes, checks if enough capacity exists for the entire batch.
 */
function rateLimitMiddleware(req, res, next) {
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  const remaining = getRemainingVotes(ip);

  // Determine how many votes this request will use
  let votesNeeded = 1;
  if (req.body?.votes && Array.isArray(req.body.votes)) {
    votesNeeded = req.body.votes.length;
  }

  // Set headers so the client can show remaining
  res.set('X-RateLimit-Limit', String(DAILY_LIMIT));
  res.set('X-RateLimit-Remaining', String(Math.max(0, remaining - votesNeeded)));

  if (remaining < votesNeeded) {
    const bucket = getOrCreateBucket(ip);
    const resetInSec = Math.ceil((bucket.resetTime - Date.now()) / 1000);
    res.set('X-RateLimit-Reset', String(resetInSec));

    return res.status(429).json({
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: `Daily limit of ${DAILY_LIMIT} free analyses reached. You have ${remaining} remaining. Resets in ${Math.ceil(resetInSec / 3600)} hour(s).`,
        remaining,
        limit: DAILY_LIMIT,
        resetInSeconds: resetInSec,
      },
    });
  }

  // Consume after the response is sent successfully (hook into response finish)
  const origEnd = res.end;
  res.end = function (...args) {
    // Only consume if the request succeeded (2xx)
    if (res.statusCode >= 200 && res.statusCode < 300) {
      consume(ip, votesNeeded);
    }
    origEnd.apply(this, args);
  };

  next();
}

// Clean up old buckets periodically (every hour)
setInterval(() => {
  const now = Date.now();
  for (const [ip, bucket] of ipBuckets) {
    if (now >= bucket.resetTime) {
      ipBuckets.delete(ip);
    }
  }
}, 60 * 60 * 1000);

module.exports = { rateLimitMiddleware, getRemainingVotes, DAILY_LIMIT };
