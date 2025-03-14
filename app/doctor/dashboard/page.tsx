"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/stores/auth";
import { protectedApi, doctorsApi } from "@/lib/api";
import { UserProfile, Appointment } from "@/types/auth";
import { ScheduleManagement } from "@/components/doctor/schedule-management";
import { PatientList } from "@/components/doctor/patient-list";
import { PrescriptionSystem } from "@/components/doctor/prescription-system";
import { MainNav } from "@/components/main-nav";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function DoctorDashboard() {
  const { userId, token, role, clearAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [doctorProfile, setDoctorProfile] = useState<UserProfile | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    if (!userId || !token || role !== "DOCTOR") {
      clearAuth();
      window.location.href = "/auth/login";
      return;
    }

    const fetchDoctorData = async () => {
      try {
        setIsLoading(true);
        const profile = await protectedApi.getProfile();
        console.log("Doctor ID:", profile.id);
        setDoctorProfile(profile);

        try {
          const appts = await doctorsApi.getUpcomingAppointments(profile.id);
          console.log("Raw appointments fetched:", appts); // Log raw response
          if (!appts || appts.length === 0) {
            console.warn("No appointments returned from API");
          }
          setAppointments(appts || []);
        } catch (error: any) {
          console.error("Error fetching appointments:", error.response?.status, error.response?.data || error.message);
          if (error.response?.status === 404) {
            console.warn("404: No upcoming appointments found");
            setAppointments([]);
          } else {
            throw error;
          }
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load dashboard data");
        console.error("Dashboard error:", err);
        if (err.response?.status === 401) {
          clearAuth();
          window.location.href = "/auth/login";
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctorData();
  }, [userId, token, role, clearAuth]);

  if (isLoading)
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  if (error || !doctorProfile)
    return (
      <div className="flex min-h-screen items-center justify-center">
        {error || "Unable to load dashboard"}
      </div>
    );

  console.log("Appointments passed to PatientList:", appointments); // Log before rendering

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <div className="container mx-auto py-6">
        <h1 className="text-4xl font-bold mb-6">
          Welcome, Dr. {doctorProfile.firstName} {doctorProfile.lastName}
        </h1>
        <Tabs defaultValue="schedule" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="patients">Patients</TabsTrigger>
            <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
          </TabsList>
          <TabsContent value="schedule">
            <ScheduleManagement doctorId={userId!} />

          </TabsContent>

          <TabsContent value="patients">
            <PatientList doctorId={userId!} appointments={{ data: { data: appointments } }} />
          </TabsContent>
          <TabsContent value="prescriptions">
            <PrescriptionSystem doctorId={userId!} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}