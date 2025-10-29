import { NextRequest, NextResponse } from "next/server";

// Content Security Policy configuration
export interface CSPConfig {
  defaultSrc?: string[];
  scriptSrc?: string[];
  styleSrc?: string[];
  imgSrc?: string[];
  connectSrc?: string[];
  fontSrc?: string[];
  objectSrc?: string[];
  mediaSrc?: string[];
  frameSrc?: string[];
  workerSrc?: string[];
  manifestSrc?: string[];
  formAction?: string[];
  frameAncestors?: string[];
  baseUri?: string[];
  upgradeInsecureRequests?: boolean;
  blockAllMixedContent?: boolean;
}

// Default CSP policy for the application
const DEFAULT_CSP: CSPConfig = {
  defaultSrc: ["'self'"],
  scriptSrc: [
    "'self'",
    "'unsafe-inline'", // Required for Next.js
    "'unsafe-eval'", // Required for Next.js development
  ],
  styleSrc: [
    "'self'",
    "'unsafe-inline'", // Required for styled-components/Tailwind
    "https://fonts.googleapis.com",
  ],
  imgSrc: ["'self'", "data:", "https:", "blob:"],
  connectSrc: [
    "'self'",
    "https://api.openai.com",
    "https://api.anthropic.com",
    "wss:",
    "ws:",
  ],
  fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
  objectSrc: ["'none'"],
  mediaSrc: ["'self'"],
  frameSrc: ["'none'"],
  workerSrc: ["'self'"],
  manifestSrc: ["'self'"],
  formAction: ["'self'"],
  frameAncestors: ["'none'"],
  baseUri: ["'self'"],
  upgradeInsecureRequests: true,
  blockAllMixedContent: true,
};

// Development CSP policy (more permissive)
const DEV_CSP: CSPConfig = {
  ...DEFAULT_CSP,
  scriptSrc: [
    "'self'",
    "'unsafe-inline'",
    "'unsafe-eval'",
    "http://localhost:*",
    "ws://localhost:*",
  ],
  connectSrc: [
    "'self'",
    "http://localhost:*",
    "ws://localhost:*",
    "wss://localhost:*",
    "https://api.openai.com",
    "https://api.anthropic.com",
  ],
};

// Generate CSP header string
export function generateCSPHeader(config: CSPConfig): string {
  const directives: string[] = [];

  // Add each directive
  Object.entries(config).forEach(([key, value]) => {
    if (value === undefined) return;

    const directive = key.replace(/([A-Z])/g, "-$1").toLowerCase();

    if (typeof value === "boolean") {
      if (value) {
        directives.push(directive);
      }
    } else if (Array.isArray(value)) {
      if (value.length > 0) {
        directives.push(`${directive} ${value.join(" ")}`);
      }
    }
  });

  return directives.join("; ");
}

// Get appropriate CSP config based on environment
export function getCSPConfig(): CSPConfig {
  return process.env.NODE_ENV === "development" ? DEV_CSP : DEFAULT_CSP;
}

// Middleware to add security headers
export function addSecurityHeaders(response: NextResponse): NextResponse {
  const cspConfig = getCSPConfig();
  const cspHeader = generateCSPHeader(cspConfig);

  // Add security headers
  response.headers.set("Content-Security-Policy", cspHeader);
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );

  // Add HSTS header in production
  if (process.env.NODE_ENV === "production") {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains"
    );
  }

  return response;
}

// Enhanced error response with security headers
export function createSecureErrorResponse(
  message: string,
  status: number = 400,
  code?: string
): NextResponse {
  const response = NextResponse.json(
    {
      error: message,
      code,
      timestamp: new Date().toISOString(),
    },
    { status }
  );

  return addSecurityHeaders(response);
}

// Enhanced success response with security headers
export function createSecureSuccessResponse<T>(
  data: T,
  schema?: any // Zod schema
): NextResponse {
  let response: NextResponse;

  if (schema) {
    const validation = schema.safeParse(data);
    if (!validation.success) {
      console.error("Response validation failed:", validation.error);
      response = NextResponse.json(
        {
          error: "Invalid response format",
          code: "RESPONSE_VALIDATION_ERROR",
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      );
    } else {
      response = NextResponse.json(validation.data);
    }
  } else {
    response = NextResponse.json(data);
  }

  return addSecurityHeaders(response);
}

// Sanitize error messages to prevent XSS
export function sanitizeErrorMessage(message: string): string {
  return message
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

// Validate and sanitize user input
export function sanitizeUserInput(input: unknown): string {
  if (typeof input !== "string") {
    return "";
  }

  return sanitizeErrorMessage(input);
}
