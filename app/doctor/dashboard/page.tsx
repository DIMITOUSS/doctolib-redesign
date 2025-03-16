"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/stores/auth";
import { protectedApi, doctorsApi } from "@/lib/api";
import { UserProfile, Appointment } from "@/types/auth";
import { PatientList } from "@/components/doctor/patient-list"; // Fixed to named import
import BannedPatientsList from "@/components/doctor/banned-patients-list"; // Default, correct
import { MainNav } from "@/components/main-nav";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScheduleManagement } from "@/components/doctor/schedule-management";
import { PrescriptionSystem } from "@/components/doctor/prescription-system";

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
        setDoctorProfile(profile);

        const appts = await doctorsApi.getUpcomingAppointments(profile.id);
        console.log("Fetched appointments:", appts);
        setAppointments(appts);
      } catch (error: any) {
        console.error("Dashboard error:", error);
        setError(error.response?.data?.message || "Failed to load dashboard data");
        if (error.response?.status === 401) {
          clearAuth();
          window.location.href = "/auth/login";
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctorData();
  }, [userId, token, role, clearAuth]);

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  if (error || !doctorProfile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        {error || "Unable to load dashboard"}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <div className="container mx-auto py-6">
        <h1 className="text-4xl font-bold mb-6">
          Welcome, Dr. {doctorProfile.firstName} {doctorProfile.lastName}
        </h1>
        <Tabs defaultValue="patients" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="patients">Patients</TabsTrigger>
            <TabsTrigger value="banned">Banned Patients</TabsTrigger>
            <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
          </TabsList>
          <TabsContent value="schedule">
            <ScheduleManagement doctorId={userId!} />
          </TabsContent>
          <TabsContent value="patients">
            <PatientList doctorId={userId!} appointments={appointments} />
          </TabsContent>
          <TabsContent value="banned">
            <BannedPatientsList doctorId={userId!} />
          </TabsContent>
          <TabsContent value="prescriptions">
            <PrescriptionSystem doctorId={userId!} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}