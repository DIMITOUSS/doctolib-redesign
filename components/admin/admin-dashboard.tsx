"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/stores/auth";
import { adminApi } from "@/lib/api";
import { UserProfile, Doctor } from "@/types/auth";
import {
  Users,
  MoreVertical,
  Search,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Trash,
} from "lucide-react";

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  // Pagination states
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [usersPage, setUsersPage] = useState(1);
  const [usersTotal, setUsersTotal] = useState(0);
  const [pendingDoctors, setPendingDoctors] = useState<Doctor[]>([]);
  const [pendingDoctorsPage, setPendingDoctorsPage] = useState(1);
  const [pendingDoctorsTotal, setPendingDoctorsTotal] = useState(0);

  const itemsPerPage = 10;
  const { role } = useAuthStore();

  useEffect(() => {
    if (role !== "ADMIN") {
      window.location.href = "/";
    }
  }, [role]);

  const fetchUsers = async (page: number) => {
    setLoading(true);
    try {
      const res = await adminApi.getUsers(page, itemsPerPage);
      setUsers(res.users);
      setUsersTotal(res.total);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setUsers([]);
      setUsersTotal(0);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingDoctors = async (page: number) => {
    setLoading(true);
    try {
      const res = await adminApi.getPendingDoctors(page, itemsPerPage);
      setPendingDoctors(res.doctors);
      setPendingDoctorsTotal(res.total);
    } catch (error) {
      console.error("Failed to fetch pending doctors:", error);
      setPendingDoctors([]);
      setPendingDoctorsTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(usersPage);
    fetchPendingDoctors(pendingDoctorsPage);
  }, [usersPage, pendingDoctorsPage]);

  const handleDoctorStatus = async (doctorId: string, status: "APPROVED" | "REJECTED") => {
    try {
      const updatedDoctor = await adminApi.updateDoctorStatus(doctorId, status);
      setPendingDoctors(prev => prev.filter(d => d.id !== doctorId));
      setPendingDoctorsTotal(prev => prev - 1);
      setUsers(prev => prev.map(u => (u.id === updatedDoctor.id ? updatedDoctor : u)));
    } catch (error) {
      console.error("Failed to update doctor status:", error);
    }
  };

  const handleBanUser = async (userId: string) => {
    try {
      const updatedUser = await adminApi.banUser(userId);
      setUsers(prev => prev.map(u => (u.id === userId ? updatedUser : u)));
    } catch (error) {
      console.error("Failed to ban user:", error);
    }
  };

  const handleUnbanUser = async (userId: string) => {
    try {
      const updatedUser = await adminApi.unbanUser(userId);
      setUsers(prev => prev.map(u => (u.id === userId ? updatedUser : u)));
    } catch (error) {
      console.error("Failed to unban user:", error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await adminApi.deleteUser(userId);
      setUsers(prev => prev.filter(u => u.id !== userId));
      setPendingDoctors(prev => prev.filter(d => d.id !== userId));
      setUsersTotal(prev => prev - 1);
      setPendingDoctorsTotal(prev => prev - 1);
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case "ACTIVE":
      case "APPROVED":
        return <Badge className="bg-green-500">{status}</Badge>;
      case "PENDING":
        return <Badge className="bg-yellow-500">{status}</Badge>;
      case "INACTIVE":
      case "REJECTED":
        return <Badge className="bg-red-500">{status}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const PaginationControls = ({ currentPage, totalItems, setPage }: { currentPage: number; totalItems: number; setPage: (page: number) => void }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    return (
      <div className="flex items-center justify-between mt-4">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === 1}
          onClick={() => setPage(currentPage - 1)}
        >
          <ChevronLeft className="h-4 w-4" /> Previous
        </Button>
        <span>
          Page {currentPage} of {totalPages} ({totalItems} items)
        </span>
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === totalPages}
          onClick={() => setPage(currentPage + 1)}
        >
          Next <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage users and doctor approvals</p>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="pending-doctors">Pending Doctors</TabsTrigger>
          </TabsList>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                className="pl-8 w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Users</CardTitle>
                <CardDescription>Newly registered users</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow><TableCell colSpan={4}>Loading...</TableCell></TableRow>
                    ) : users.length === 0 ? (
                      <TableRow><TableCell colSpan={4}>No users found</TableCell></TableRow>
                    ) : (
                      users.slice(0, 5).map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.firstName} {user.lastName}</TableCell>
                          <TableCell>{user.role}</TableCell>
                          <TableCell>{getStatusBadge(user.banned ? "INACTIVE" : "ACTIVE")}</TableCell>
                          <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => setActiveTab("users")}>
                  View All Users
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pending Doctor Approvals</CardTitle>
                <CardDescription>Doctors awaiting approval</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Specialty</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow><TableCell colSpan={4}>Loading...</TableCell></TableRow>
                    ) : pendingDoctors.length === 0 ? (
                      <TableRow><TableCell colSpan={4}>No pending doctors</TableCell></TableRow>
                    ) : (
                      pendingDoctors.slice(0, 5).map((doctor) => (
                        <TableRow key={doctor.id}>
                          <TableCell className="font-medium">{doctor.firstName} {doctor.lastName}</TableCell>
                          <TableCell>{doctor.email}</TableCell>
                          <TableCell>{doctor.specialty}</TableCell>
                          <TableCell>{getStatusBadge(doctor.status)}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => setActiveTab("pending-doctors")}>
                  View All Pending Doctors
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Users</CardTitle>
              <CardDescription>Manage all users</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Missed</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow><TableCell colSpan={6}>Loading...</TableCell></TableRow>
                  ) : users.length === 0 ? (
                    <TableRow><TableCell colSpan={6}>No users found</TableCell></TableRow>
                  ) : (
                    users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.firstName} {user.lastName}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell>{getStatusBadge(user.banned ? "INACTIVE" : "ACTIVE")}</TableCell>
                        <TableCell>{user.missedAppointments}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              {user.banned ? (
                                <DropdownMenuItem onClick={() => handleUnbanUser(user.id)}>
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Unban
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem onClick={() => handleBanUser(user.id)}>
                                  <XCircle className="mr-2 h-4 w-4" />
                                  Ban
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteUser(user.id)}>
                                <Trash className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              <PaginationControls currentPage={usersPage} totalItems={usersTotal} setPage={setUsersPage} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending-doctors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Doctors</CardTitle>
              <CardDescription>Review and approve/reject doctor applications</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Specialty</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow><TableCell colSpan={5}>Loading...</TableCell></TableRow>
                  ) : pendingDoctors.length === 0 ? (
                    <TableRow><TableCell colSpan={5}>No pending doctors found</TableCell></TableRow>
                  ) : (
                    pendingDoctors.map((doctor) => (
                      <TableRow key={doctor.id}>
                        <TableCell className="font-medium">{doctor.firstName} {doctor.lastName}</TableCell>
                        <TableCell>{doctor.email}</TableCell>
                        <TableCell>{doctor.specialty}</TableCell>
                        <TableCell>{getStatusBadge(doctor.status)}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => handleDoctorStatus(doctor.id, "APPROVED")}>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Approve
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDoctorStatus(doctor.id, "REJECTED")}>
                                <XCircle className="mr-2 h-4 w-4" />
                                Reject
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              <PaginationControls currentPage={pendingDoctorsPage} totalItems={pendingDoctorsTotal} setPage={setPendingDoctorsPage} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}