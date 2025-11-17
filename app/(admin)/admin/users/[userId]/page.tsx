import { AdminUserDetail } from "@/components/admin/pages/AdminUserDetail";

/**
 * Admin User Detail Page
 * 
 * Displays:
 * - User identity card
 * - Stats (total notes, AI requests, AI cost)
 * - Timeline of recent AI interactions
 */
export default function AdminUserDetailPage({
  params,
}: {
  params: { userId: string };
}) {
  return <AdminUserDetail userId={params.userId} />;
}

