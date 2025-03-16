// src/components/patient/PatientDashboard.tsx
'use client'
// src/components/patient/PatientDashboard.tsx
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { appointmentApi, notificationApi, protectedApi, patientsApi } from '@/lib/api';
import { Appointment, AppNotification, UserProfile } from '@/types/auth';
import { useAuthStore } from '@/stores/auth';
import io from 'socket.io-client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { AppointmentBookingSystem } from '@/components/patient/appointment-booking-system';
import MedicalRecordsView from '@/components/patient/medical-records-view';

export default function PatientDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [totalAppointments, setTotalAppointments] = useState(0);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<{ statusBreakdown: { status: string; count: number }[]; monthlyTrends: { month: string; count: number }[] } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userId, token } = useAuthStore();
  const { toast } = useToast();

  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [page, setPage] = useState(1);
  const [limit] = useState(5);

  const [isEditing, setIsEditing] = useState(false);
  const [editProfile, setEditProfile] = useState<Partial<UserProfile>>({});

  useEffect(() => {
    if (!userId || !token) return;

    const socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000', {
      auth: { token },
    });

    socket.on('connect', () => console.log('Connected to WebSocket'));
    socket.on('newNotification', (notification: AppNotification) => {
      setNotifications((prev) => [notification, ...prev]);
      toast({ title: 'New Notification', description: notification.message });
      if (notification.type === 'APPOINTMENT') fetchAppointments();
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, token, toast]);

  const fetchAppointments = async () => {
    try {
      const filters = {
        status: statusFilter,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        page,
        limit,
      };
      const { appointments: data, total } = await appointmentApi.getPatientAppointments(filters);
      setAppointments(data);
      setTotalAppointments(total);
    } catch (err) {
      setError('Failed to load appointments.');
      toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch appointments.' });
    }
  };

  const fetchNotifications = async () => {
    try {
      const data = await notificationApi.getPreferences(userId!);
      setNotifications(data.notifications.filter((n: AppNotification) => !n.isRead));
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch notifications.' });
    }
  };

  const fetchProfile = async () => {
    try {
      const profileData = await protectedApi.getProfile();
      setProfile(profileData);
      setEditProfile(profileData);
    } catch (err) {
      setError('Failed to load profile.');
      toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch profile.' });
    }
  };

  const fetchStats = async () => {
    try {
      const statsData = await patientsApi.getAppointmentStats();
      setStats(statsData);
    } catch (err) {
      setError('Failed to load analytics.');
      toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch analytics data.' });
    }
  };

  useEffect(() => {
    if (!userId) return;
    setIsLoading(true);
    Promise.all([fetchAppointments(), fetchNotifications(), fetchProfile(), fetchStats()]).finally(() => setIsLoading(false));
  }, [userId, page, statusFilter, startDate, endDate]);

  const handleProfileUpdate = async () => {
    try {
      const updatedProfile = await protectedApi.updateProfile(editProfile);
      setProfile(updatedProfile);
      setIsEditing(false);
      toast({ title: 'Profile Updated', description: 'Your profile has been successfully updated.' });
    } catch (err) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to update profile.' });
    }
  };

  if (isLoading) return <div>Loading dashboard...</div>;
  if (error) return <div>{error}</div>;

  const upcoming = appointments.find((appt: Appointment) => new Date(appt.appointmentDate) > new Date());
  const totalPages = Math.ceil(totalAppointments / limit);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="container mx-auto p-4">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader><CardTitle>Upcoming Appointment</CardTitle></CardHeader>
          <CardContent>
            {upcoming ? (
              <>
                <p>{new Date(upcoming.appointmentDate).toLocaleString()}</p>
                <p>With {upcoming.doctor.firstName} {upcoming.doctor.lastName}</p>
              </>
            ) : (
              <p>No upcoming appointments.</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Past Appointments</CardTitle></CardHeader>
          <CardContent>
            {appointments.filter((appt: Appointment) => new Date(appt.appointmentDate) <= new Date()).length} past
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              Notifications <Bell className="ml-2" />
            </CardTitle>
          </CardHeader>
          <CardContent>{notifications.length} unread</CardContent>
        </Card>
      </div>

      <Tabs defaultValue="appointments" className="mt-6">
        <TabsList>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="records">Medical Records</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="appointments">
          <Card>
            <CardHeader>
              <CardTitle>Your Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-4">
                <Select onValueChange={setStatusFilter} value={statusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  placeholder="Start Date"
                />
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  placeholder="End Date"
                />
              </div>

              {appointments.length > 0 ? (
                appointments.map((appt: Appointment) => (
                  <div key={appt.id} className="mb-4 p-4 border rounded">
                    <p><strong>Date:</strong> {new Date(appt.appointmentDate).toLocaleString()}</p>
                    <p><strong>Doctor:</strong> {appt.doctor.firstName} {appt.doctor.lastName}</p>
                    <p><strong>Status:</strong> {appt.status}</p>
                    <p><strong>Type:</strong> {appt.type}</p>
                  </div>
                ))
              ) : (
                <p>No appointments found.</p>
              )}

              <div className="flex justify-between mt-4">
                <Button
                  disabled={page === 1}
                  onClick={() => setPage((prev) => prev - 1)}
                >
                  Previous
                </Button>
                <span>Page {page} of {totalPages}</span>
                <Button
                  disabled={page === totalPages}
                  onClick={() => setPage((prev) => prev + 1)}
                >
                  Next
                </Button>
              </div>
            </CardContent>
          </Card>
          <AppointmentBookingSystem patientId={userId!} />
        </TabsContent>
        <TabsContent value="records">
          <MedicalRecordsView />
        </TabsContent>
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Your Profile</CardTitle>
            </CardHeader>
            <CardContent>
              {profile ? (
                isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <Label>First Name</Label>
                      <Input
                        value={editProfile.firstName || ''}
                        onChange={(e) => setEditProfile({ ...editProfile, firstName: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Last Name</Label>
                      <Input
                        value={editProfile.lastName || ''}
                        onChange={(e) => setEditProfile({ ...editProfile, lastName: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input
                        value={editProfile.email || ''}
                        onChange={(e) => setEditProfile({ ...editProfile, email: e.target.value })}
                        disabled
                      />
                    </div>
                    <div>
                      <Label>Phone</Label>
                      <Input
                        value={editProfile.phone || ''}
                        onChange={(e) => setEditProfile({ ...editProfile, phone: e.target.value })}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleProfileUpdate}>Save</Button>
                      <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p><strong>First Name:</strong> {profile.firstName}</p>
                    <p><strong>Last Name:</strong> {profile.lastName}</p>
                    <p><strong>Email:</strong> {profile.email}</p>
                    <p><strong>Phone:</strong> {profile.phone || 'Not set'}</p>
                    <p><strong>Role:</strong> {profile.role}</p>
                    <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                  </div>
                )
              ) : (
                <p>Loading profile...</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Appointment Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              {stats ? (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Status Breakdown</h3>
                    <PieChart width={400} height={300}>
                      <Pie
                        data={stats.statusBreakdown}
                        dataKey="count"
                        nameKey="status"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        label
                      >
                        {stats.statusBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Monthly Trends (Last 12 Months)</h3>
                    <BarChart width={600} height={300} data={stats.monthlyTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" fill="#82ca9d" />
                    </BarChart>
                  </div>
                </div>
              ) : (
                <p>No analytics data available.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}