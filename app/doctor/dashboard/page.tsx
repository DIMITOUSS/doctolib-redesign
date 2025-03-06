"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/stores/auth";
import { protectedApi } from "@/lib/api";
import { UserProfile } from "@/types/auth";
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

  useEffect(() => {
    // Check authentication and role
    if (!userId || !token || role !== 'DOCTOR') {
      clearAuth();
      window.location.href = "/auth/login";
      return;
    }

    const fetchDoctorProfile = async () => {
      try {
        setIsLoading(true);
        // Use the /users/me endpoint to get the profile
        const response = await protectedApi.getProfile();
        setDoctorProfile(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load profile");
        if (err.response?.status === 401) {
          clearAuth();
          window.location.href = "/auth/login";
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctorProfile();
  }, [userId, token, role, clearAuth]);

  if (isLoading)
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  if (error || !doctorProfile)
    return (
      <div className="flex min-h-screen items-center justify-center">
        {error || "Unable to load dashboard"}
      </div>
    );

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
            <PatientList doctorId={userId!} />
          </TabsContent>
          <TabsContent value="prescriptions">
            <PrescriptionSystem doctorId={userId!} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
