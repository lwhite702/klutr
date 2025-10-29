import { NextRequest } from "next/server";

// Redis-based rate limiter for production
export interface RedisRateLimitConfig {
  limit: number;
  windowMs: number;
  keyGenerator?: (req: NextRequest) => string;
  redisUrl?: string;
}

// Redis client interface (implement with your preferred Redis client)
interface RedisClient {
  get(key: string): Promise<string | null>;
  setex(key: string, seconds: number, value: string): Promise<void>;
  incr(key: string): Promise<number>;
  expire(key: string, seconds: number): Promise<void>;
}

// Mock Redis client for development/testing
class MockRedisClient implements RedisClient {
  private store = new Map<string, { value: string; expires: number }>();

  async get(key: string): Promise<string | null> {
    const item = this.store.get(key);
    if (!item || Date.now() > item.expires) {
      this.store.delete(key);
      return null;
    }
    return item.value;
  }

  async setex(key: string, seconds: number, value: string): Promise<void> {
    this.store.set(key, {
      value,
      expires: Date.now() + seconds * 1000,
    });
  }

  async incr(key: string): Promise<number> {
    const current = await this.get(key);
    const newValue = current ? parseInt(current) + 1 : 1;
    await this.setex(key, 60, newValue.toString());
    return newValue;
  }

  async expire(key: string, seconds: number): Promise<void> {
    const item = this.store.get(key);
    if (item) {
      item.expires = Date.now() + seconds * 1000;
    }
  }
}

// Production Redis client (using ioredis as example)
class ProductionRedisClient implements RedisClient {
  private client: any; // Replace with actual Redis client type

  constructor(redisUrl?: string) {
    // Initialize your Redis client here
    // Example with ioredis:
    // this.client = new Redis(redisUrl || process.env.REDIS_URL);
  }

  async get(key: string): Promise<string | null> {
    return await this.client.get(key);
  }

  async setex(key: string, seconds: number, value: string): Promise<void> {
    await this.client.setex(key, seconds, value);
  }

  async incr(key: string): Promise<number> {
    return await this.client.incr(key);
  }

  async expire(key: string, seconds: number): Promise<void> {
    await this.client.expire(key, seconds);
  }
}

// Factory function to create appropriate Redis client
function createRedisClient(redisUrl?: string): RedisClient {
  if (process.env.NODE_ENV === "production" && redisUrl) {
    return new ProductionRedisClient(redisUrl);
  }
  return new MockRedisClient();
}

export function createRedisRateLimit(config: RedisRateLimitConfig) {
  const redis = createRedisClient(config.redisUrl);

  return async (req: NextRequest): Promise<boolean> => {
    const key = config.keyGenerator
      ? config.keyGenerator(req)
      : req.ip || req.headers.get("x-forwarded-for") || "anonymous";

    const rateLimitKey = `rate_limit:${key}`;
    const windowSeconds = Math.floor(config.windowMs / 1000);

    try {
      // Get current count
      const currentCount = await redis.get(rateLimitKey);
      const count = currentCount ? parseInt(currentCount) : 0;

      if (count >= config.limit) {
        return false;
      }

      // Increment counter
      await redis.incr(rateLimitKey);

      // Set expiration if this is the first request
      if (!currentCount) {
        await redis.expire(rateLimitKey, windowSeconds);
      }

      return true;
    } catch (error) {
      console.error("Redis rate limit error:", error);
      // Fallback to allowing the request if Redis fails
      return true;
    }
  };
}

// Enhanced rate limiter that supports both in-memory and Redis
export function createProductionRateLimit(config: RedisRateLimitConfig) {
  // Use Redis in production, in-memory in development
  if (process.env.NODE_ENV === "production" && config.redisUrl) {
    return createRedisRateLimit(config);
  }

  // Fallback to in-memory rate limiting
  const inMemoryStore = new Map<string, { count: number; resetTime: number }>();

  return (req: NextRequest): boolean => {
    const key = config.keyGenerator
      ? config.keyGenerator(req)
      : req.ip || req.headers.get("x-forwarded-for") || "anonymous";

    const now = Date.now();
    const windowStart = now - config.windowMs;

    // Clean up expired entries
    for (const [k, v] of inMemoryStore.entries()) {
      if (v.resetTime < now) {
        inMemoryStore.delete(k);
      }
    }

    const current = inMemoryStore.get(key);

    if (!current || current.resetTime < now) {
      inMemoryStore.set(key, { count: 1, resetTime: now + config.windowMs });
      return true;
    }

    if (current.count >= config.limit) {
      return false;
    }

    current.count++;
    return true;
  };
}
