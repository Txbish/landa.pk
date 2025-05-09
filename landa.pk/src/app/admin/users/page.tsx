"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  MoreHorizontal,
  Search,
  UserCog,
  ShieldAlert,
  Store,
  User,
  Ban,
  CheckCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import axios from "@/lib/axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/users");
        setUsers(response.data || []);
        setFilteredUsers(response.data || []);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    let filtered = [...users];

    // Apply role filter
    if (roleFilter !== "all") {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }

    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.name?.toLowerCase().includes(search) ||
          user.email?.toLowerCase().includes(search)
      );
    }

    setFilteredUsers(filtered);
  }, [users, roleFilter, searchTerm]);

  const handleToggleBlockUser = async (
    userId: string,
    currentStatus: boolean
  ) => {
    try {
      await axios.put(`/users/${userId}/toggle-block`);

      // Update local state
      setUsers(
        users.map((user) =>
          user._id === userId ? { ...user, isBlocked: !currentStatus } : user
        )
      );

      if (selectedUser?._id === userId) {
        setSelectedUser({
          ...selectedUser,
          isBlocked: !currentStatus,
        });
      }
    } catch (error) {
      console.error("Error toggling user block status:", error);
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return (
          <Badge className="bg-purple-500">
            <ShieldAlert className="mr-1 h-3 w-3" />
            Admin
          </Badge>
        );
      case "seller":
        return (
          <Badge className="bg-blue-500">
            <Store className="mr-1 h-3 w-3" />
            Seller
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            <User className="mr-1 h-3 w-3" />
            Customer
          </Badge>
        );
    }
  };

  const viewUserDetails = (user: any) => {
    setSelectedUser(user);
    setDetailsOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Users</h1>
        <p className="text-muted-foreground">Manage user accounts.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col gap-4 md:flex-row">
            <div className="flex w-full max-w-sm items-center space-x-2">
              <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button type="submit">
                <Search className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="user">Customers</SelectItem>
                  <SelectItem value="seller">Sellers</SelectItem>
                  <SelectItem value="admin">Admins</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {loading ? (
            <div className="flex h-40 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          No users found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map((user) => (
                        <TableRow key={user._id}>
                          <TableCell className="font-medium">
                            {user.name}
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{getRoleBadge(user.role)}</TableCell>
                          <TableCell>
                            {user.createdAt
                              ? format(new Date(user.createdAt), "MMM dd, yyyy")
                              : "N/A"}
                          </TableCell>
                          <TableCell>
                            {user.isBlocked ? (
                              <Badge variant="destructive">Blocked</Badge>
                            ) : (
                              <Badge
                                variant="outline"
                                className="border-green-500 text-green-500"
                              >
                                Active
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Open menu</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem
                                  onClick={() => viewUserDetails(user)}
                                >
                                  <UserCog className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleToggleBlockUser(
                                      user._id,
                                      user.isBlocked
                                    )
                                  }
                                >
                                  {user.isBlocked ? (
                                    <>
                                      <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                                      Unblock User
                                    </>
                                  ) : (
                                    <>
                                      <Ban className="mr-2 h-4 w-4 text-red-500" />
                                      Block User
                                    </>
                                  )}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              View and manage user information.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                  {selectedUser.profileImage ? (
                    <Image
                      src={selectedUser.profileImage || "/placeholder.svg"}
                      alt={selectedUser.name}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <h3 className="font-medium">{selectedUser.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedUser.email}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium">Role</h3>
                  <div className="mt-1">{getRoleBadge(selectedUser.role)}</div>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Status</h3>
                  <div className="mt-1">
                    {selectedUser.isBlocked ? (
                      <Badge variant="destructive">Blocked</Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="border-green-500 text-green-500"
                      >
                        Active
                      </Badge>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Joined</h3>
                  <p className="text-sm">
                    {selectedUser.createdAt
                      ? format(
                          new Date(selectedUser.createdAt),
                          "MMMM dd, yyyy"
                        )
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Phone</h3>
                  <p className="text-sm">
                    {selectedUser.phone || "Not provided"}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium">Address</h3>
                <p className="text-sm whitespace-pre-line">
                  {selectedUser.address || "Not provided"}
                </p>
              </div>

              {selectedUser.role === "seller" && selectedUser.sellerDetails && (
                <div>
                  <h3 className="text-sm font-medium">Business Name</h3>
                  <p className="text-sm">
                    {selectedUser.sellerDetails.businessName || "Not provided"}
                  </p>
                  <div className="mt-2">
                    <h3 className="text-sm font-medium">Total Earnings</h3>
                    <p className="text-sm">
                      $
                      {selectedUser.sellerDetails.earnings?.toFixed(2) ||
                        "0.00"}
                    </p>
                  </div>
                </div>
              )}

              <div className="pt-4">
                <Button
                  variant={selectedUser.isBlocked ? "default" : "destructive"}
                  className="w-full"
                  onClick={() => {
                    handleToggleBlockUser(
                      selectedUser._id,
                      selectedUser.isBlocked
                    );
                    setDetailsOpen(false);
                  }}
                >
                  {selectedUser.isBlocked ? (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Unblock User
                    </>
                  ) : (
                    <>
                      <Ban className="mr-2 h-4 w-4" />
                      Block User
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
