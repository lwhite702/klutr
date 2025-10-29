import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export interface RateLimitConfig {
  limit: number;
  windowMs: number;
  keyGenerator?: (req: NextRequest) => string;
}

export function createRateLimit(config: RateLimitConfig) {
  return (req: NextRequest): boolean => {
    const key = config.keyGenerator 
      ? config.keyGenerator(req)
      : req.ip || req.headers.get("x-forwarded-for") || "anonymous";

    const now = Date.now();
    const windowStart = now - config.windowMs;

    // Clean up expired entries
    for (const [k, v] of rateLimitStore.entries()) {
      if (v.resetTime < now) {
        rateLimitStore.delete(k);
      }
    }

    const current = rateLimitStore.get(key);
    
    if (!current || current.resetTime < now) {
      rateLimitStore.set(key, { count: 1, resetTime: now + config.windowMs });
      return true;
    }

    if (current.count >= config.limit) {
      return false;
    }

    current.count++;
    return true;
  };
}

export function validateRequest<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: string } {
  try {
    const result = schema.safeParse(data);
    if (result.success) {
      return { success: true, data: result.data };
    }
    return { 
      success: false, 
      error: result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')
    };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown validation error'
    };
  }
}

export function createErrorResponse(
  message: string,
  status: number = 400,
  code?: string
): NextResponse {
  return NextResponse.json(
    {
      error: message,
      code,
      timestamp: new Date().toISOString(),
    },
    { status }
  );
}

export function createSuccessResponse<T>(data: T): NextResponse {
  return NextResponse.json(data);
}

// Common rate limit configurations
export const RATE_LIMITS = {
  // General API endpoints
  GENERAL: { limit: 100, windowMs: 15 * 60 * 1000 }, // 100 requests per 15 minutes
  
  // Note creation (more restrictive)
  CREATE_NOTE: { limit: 20, windowMs: 15 * 60 * 1000 }, // 20 notes per 15 minutes
  
  // AI operations (very restrictive)
  AI_OPERATIONS: { limit: 5, windowMs: 15 * 60 * 1000 }, // 5 AI calls per 15 minutes
  
  // Vault operations (very restrictive for security)
  VAULT_OPERATIONS: { limit: 10, windowMs: 15 * 60 * 1000 }, // 10 vault ops per 15 minutes
  
  // Reclustering (very restrictive)
  RECLUSTER: { limit: 3, windowMs: 60 * 60 * 1000 }, // 3 reclusters per hour
} as const;

// Middleware wrapper for API routes
export function withRateLimit(
  config: RateLimitConfig,
  handler: (req: NextRequest) => Promise<NextResponse>
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const rateLimit = createRateLimit(config);
    
    if (!rateLimit(req)) {
      return createErrorResponse(
        "Rate limit exceeded. Please try again later.",
        429,
        "RATE_LIMIT_EXCEEDED"
      );
    }

    return handler(req);
  };
}

// Middleware wrapper for validation + rate limiting
export function withValidationAndRateLimit<T>(
  schema: z.ZodSchema<T>,
  config: RateLimitConfig,
  handler: (req: NextRequest, data: T) => Promise<NextResponse>
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    // Rate limiting first
    const rateLimit = createRateLimit(config);
    if (!rateLimit(req)) {
      return createErrorResponse(
        "Rate limit exceeded. Please try again later.",
        429,
        "RATE_LIMIT_EXCEEDED"
      );
    }

    // Parse and validate request body
    let body: unknown;
    try {
      body = await req.json();
    } catch (error) {
      return createErrorResponse("Invalid JSON in request body", 400, "INVALID_JSON");
    }

    const validation = validateRequest(schema, body);
    if (!validation.success) {
      return createErrorResponse(
        `Validation failed: ${validation.error}`,
        400,
        "VALIDATION_ERROR"
      );
    }

    return handler(req, validation.data);
  };
}
