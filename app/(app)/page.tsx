import { redirect } from "next/navigation";

/**
 * Root /app route redirects to /app/stream
 * This ensures users always land on the Stream page when accessing /app
 */
export default function AppRootPage() {
  redirect("/app/stream");
}

