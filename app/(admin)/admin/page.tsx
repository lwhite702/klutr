import { AdminOverview } from "@/components/admin/pages/AdminOverview";

/**
 * Admin Overview Page
 * 
 * Displays:
 * - Summary cards (total users, active users, notes, AI cost)
 * - Charts (requests per day, cost per day)
 * - Recent AI errors table
 */
export default function AdminOverviewPage() {
  return <AdminOverview />;
}

