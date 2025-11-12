import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Routes that don't require authentication
const publicRoutes = [
  "/",
  "/login",
  "/signup",
  "/about",
  "/features",
  "/pricing",
  "/blog",
  "/changelog",
  "/faq",
  "/privacy",
  "/terms",
  "/roadmap",
  "/auth/callback",
  "/api/health",
  "/api/cron",
  "/api/preview",
  "/api/revalidate",
];

// API routes that require authentication
const protectedApiRoutes = [
  "/api/messages",
  "/api/notes",
  "/api/boards",
  "/api/stacks",
  "/api/vault",
  "/api/insights",
  "/api/mindstorm",
  "/api/muse",
  "/api/spark",
  "/api/stream",
  "/api/memory",
];

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (publicRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`))) {
    return NextResponse.next();
  }

  // Allow cron routes (protected by CRON_SECRET)
  if (pathname.startsWith("/api/cron/")) {
    return NextResponse.next();
  }

  // Check authentication for protected routes
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Get user session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect to login if not authenticated
  if (!user) {
    // For API routes, return 401
    if (protectedApiRoutes.some((route) => pathname.startsWith(route))) {
      return NextResponse.json(
        { error: "Unauthorized", message: "Authentication required" },
        { status: 401 }
      );
    }

    // For app routes, redirect to login (include root /app and /onboarding paths)
    if (
      pathname === "/app" ||
      pathname.startsWith("/app/") ||
      pathname === "/onboarding" ||
      pathname.startsWith("/onboarding/")
    ) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Redirect from login to app if already authenticated
  if (user && (pathname === "/login" || pathname === "/signup")) {
    return NextResponse.redirect(new URL("/app", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};

