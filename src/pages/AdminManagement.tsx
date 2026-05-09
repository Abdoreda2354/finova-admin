import { useState, useEffect } from "react";
import apiClient from "../lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function AdminManagement() {
  const [admins, setAdmins] = useState([]);
  const [newName, setNewName] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showForm, setShowForm] = useState(false);

  const fetchAdmins = async () => {
    try {
      const response = await apiClient.get('/api/admin/admins');
      localStorage.setItem("admins", JSON.stringify(response.data));
      setAdmins(response.data);
    } catch (error) {
      console.error("Error fetching admins:", error);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleEnable = async (adminId: number) => {
    try {
      await apiClient.put(`/api/admin/admins/${adminId}/enable`);
      fetchAdmins();
    } catch (error) {
      console.error("Error enabling admin:", error);
    }
  };

  const handleDisable = async (adminId: number) => {
    try {
      await apiClient.put(`/api/admin/admins/${adminId}/disable`);
      fetchAdmins();
    } catch (error) {
      console.error("Error disabling admin:", error);
    }
  };

  const handleCreateAdmin = async () => {
    try {
      const newAdminData = { name: newName, username: newUsername, password: newPassword };
      const response = await apiClient.post('/api/admin/admins', newAdminData);
      if (response.data === "Admin created successfully") {
        alert("Admin created successfully!");
        fetchAdmins();
      }
      setAdmins([...admins, response.data]);
      setNewName("");
      setNewUsername("");
      setNewPassword("");
      setShowForm(false);
    } catch (error) {
      console.error("Error creating admin:", error);
    }
  };

  return (
    <div className="space-y-4 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-semibold text-primary">Admin Management</h1>
        <Button
          className="w-full sm:w-auto"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancel" : "Add New Admin"}
        </Button>
      </div>

      {/* Add Admin Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">New Admin</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:items-end">
              <div className="space-y-1">
                <Label>Name</Label>
                <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Full name" />
              </div>
              <div className="space-y-1">
                <Label>Username</Label>
                <Input value={newUsername} onChange={(e) => setNewUsername(e.target.value)} placeholder="Username" />
              </div>
              <div className="space-y-1">
                <Label>Password</Label>
                <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Password" />
              </div>
              <Button onClick={handleCreateAdmin} className="w-full sm:col-span-2 lg:col-span-1">
                Create
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Desktop Table — hidden on mobile */}
      <div className="hidden sm:block rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {admins.map((a) => (
              <TableRow key={a.id}>
                <TableCell className="font-medium">{a.email}</TableCell>
                <TableCell>{a.username}</TableCell>
                <TableCell>
                  <Badge
                    variant={a.enabled ? "default" : "secondary"}
                    className="capitalize"
                  >
                    {a.enabled ? "Enabled" : "Disabled"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => a.enabled ? handleDisable(a.id) : handleEnable(a.id)}
                  >
                    {a.enabled ? "Disable" : "Enable"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards — shown only on mobile */}
      <div className="flex flex-col gap-3 sm:hidden">
        {admins.map((a) => (
          <Card key={a.id}>
            <CardContent className="pt-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1 space-y-1">
                  <p className="truncate font-medium text-sm">{a.email}</p>
                  <p className="text-sm text-muted-foreground">@{a.username}</p>
                </div>
                <Badge
                  variant={a.enabled ? "default" : "secondary"}
                  className="capitalize shrink-0"
                >
                  {a.enabled ? "Enabled" : "Disabled"}
                </Badge>
              </div>
              <div className="mt-3">
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full"
                  onClick={() => a.enabled ? handleDisable(a.id) : handleEnable(a.id)}
                >
                  {a.enabled ? "Disable" : "Enable"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty state */}
      {admins.length === 0 && (
        <div className="py-12 text-center text-sm text-muted-foreground">
          No admins found.
        </div>
      )}
    </div>
  );
}