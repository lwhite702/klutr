"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Search } from "lucide-react";

interface User {
  id: string;
  email: string;
  created_at: string;
  last_active_at: string | null;
  total_notes: number;
  total_ai_requests: number;
  total_ai_cost: number;
  is_admin: boolean;
}

/**
 * AdminUsers - Users management table
 */
export function AdminUsers() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterActive, setFilterActive] = useState(false);
  const [filterHighCost, setFilterHighCost] = useState(false);

  useEffect(() => {
    async function fetchUsers() {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        if (filterActive) params.append("activeLast7Days", "true");
        if (filterHighCost) params.append("highCost", "true");
        if (searchQuery) params.append("search", searchQuery);

        const res = await fetch(`/api/admin/users?${params.toString()}`);
        if (!res.ok) {
          throw new Error("Failed to fetch users");
        }

        const data = await res.json();
        setUsers(data.users || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load users");
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, [filterActive, filterHighCost, searchQuery]);

  const filteredUsers = users.filter((user) => {
    if (searchQuery) {
      return (
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return true;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Users</h1>
          <p className="text-muted-foreground mt-2">Manage and monitor users</p>
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-4 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Users</h1>
        <p className="text-muted-foreground mt-2">Manage and monitor users</p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by email or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterActive ? "default" : "outline"}
                onClick={() => setFilterActive(!filterActive)}
              >
                Active (7d)
              </Button>
              <Button
                variant={filterHighCost ? "default" : "outline"}
                onClick={() => setFilterHighCost(!filterHighCost)}
              >
                High AI Cost
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>
            {filteredUsers.length} user{filteredUsers.length !== 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead>AI Requests</TableHead>
                <TableHead>AI Cost</TableHead>
                <TableHead>Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow
                    key={user.id}
                    className="cursor-pointer hover:bg-accent/50"
                    onClick={() => router.push(`/admin/users/${user.id}`)}
                  >
                    <TableCell className="font-medium">{user.email}</TableCell>
                    <TableCell>
                      {new Date(user.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {user.last_active_at
                        ? new Date(user.last_active_at).toLocaleDateString()
                        : "Never"}
                    </TableCell>
                    <TableCell>{user.total_notes}</TableCell>
                    <TableCell>{user.total_ai_requests}</TableCell>
                    <TableCell>${user.total_ai_cost.toFixed(2)}</TableCell>
                    <TableCell>
                      {user.is_admin ? (
                        <Badge variant="default">Admin</Badge>
                      ) : (
                        <Badge variant="secondary">User</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

