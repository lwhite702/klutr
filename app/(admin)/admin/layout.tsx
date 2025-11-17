import { redirect } from "next/navigation";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { requireAdmin } from "@/lib/admin/auth";

/**
 * Admin Layout - Protects all /admin routes
 * 
 * Auth:
 * - Server-side check using requireAdmin()
 * - Redirects to /app/stream if not admin
 * - Only users with is_admin = true can access
 */
export default async function AdminLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    await requireAdmin();
  } catch (error) {
    // Not admin or not authenticated - redirect to main app
    redirect("/app/stream");
  }

  return <AdminLayout>{children}</AdminLayout>;
}

