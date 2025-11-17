import { AdminUsers } from "@/components/admin/pages/AdminUsers";

/**
 * Admin Users Page
 * 
 * Displays:
 * - Table of all users with stats
 * - Filters (active in last 7 days, high AI cost)
 * - Row click navigates to user detail
 */
export default function AdminUsersPage() {
  return <AdminUsers />;
}

