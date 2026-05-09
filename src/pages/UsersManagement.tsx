import { useState, useEffect } from "react";
import apiClient from "../lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

export default function UsersManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchUsers = async () => {
    try {
      const response = await apiClient.get("/api/admin/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEnable = async (userId: number) => {
    try {
      await apiClient.put(`/api/admin/users/${userId}/enable`);
      setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, enabled: true } : u));
    } catch (error) {
      console.error("Error enabling user:", error);
    }
  };

  const handleDisable = async (userId: number) => {
    try {
      await apiClient.put(`/api/admin/users/${userId}/disable`);
      setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, enabled: false } : u));
    } catch (error) {
      console.error("Error disabling user:", error);
    }
  };

  const handleDelete = async (userId: number) => {
    try {
      await apiClient.delete(`/api/admin/users/${userId}`);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const filtered = users.filter((u) => {
    const matchSearch =
      u.username?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase());
    const status = u.enabled === true ? "active" : "disabled";
    const matchStatus = statusFilter === "all" || status === statusFilter;
    return matchSearch && matchStatus;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-GB", {
      year: "numeric", month: "short", day: "2-digit",
      hour: "2-digit", minute: "2-digit",
    });
  };

  const StatusBadge = ({ enabled }: { enabled: boolean }) => (
    <Badge variant={enabled ? "default" : "secondary"} className="capitalize">
      {enabled ? "Active" : "Disabled"}
    </Badge>
  );

  const ActionButtons = ({ u }: { u: any }) => (
    <div className="flex gap-1">
      {!u.enabled && (
        <Button size="sm" variant="outline" onClick={() => handleEnable(u.id)}>
          Enable
        </Button>
      )}
      {u.enabled && (
        <Button size="sm" variant="outline" onClick={() => handleDisable(u.id)}>
          Disable
        </Button>
      )}
      <Button size="sm" variant="destructive" onClick={() => handleDelete(u.id)}>
        Delete
      </Button>
    </div>
  );

  return (
    <div className="space-y-4 p-4 sm:p-6">
      {/* Header */}
      <h1 className="text-xl font-semibold text-primary">Users Management</h1>

      {/* Filters */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <Input
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:max-w-xs"
        />
        <div className="flex gap-1">
          {["all", "active", "disabled"].map((f) => (
            <Button
              key={f}
              size="sm"
              variant={statusFilter === f ? "default" : "outline"}
              onClick={() => setStatusFilter(f)}
              className="capitalize"
            >
              {f}
            </Button>
          ))}
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden sm:block rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Signup Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((u) => (
              <TableRow key={u.id}>
                <TableCell className="font-medium">{u.username}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                  {formatDate(u.createdAt)}
                </TableCell>
                <TableCell><StatusBadge enabled={u.enabled} /></TableCell>
                <TableCell><ActionButtons u={u} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="flex flex-col gap-3 sm:hidden">
        {filtered.map((u) => (
          <Card key={u.id}>
            <CardContent className="pt-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm truncate">{u.username}</p>
                  <p className="text-sm text-muted-foreground truncate">{u.email}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{formatDate(u.createdAt)}</p>
                </div>
                <StatusBadge enabled={u.enabled} />
              </div>
              <ActionButtons u={u} />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="py-12 text-center text-sm text-muted-foreground">
          No users found.
        </div>
      )}
    </div>
  );
}