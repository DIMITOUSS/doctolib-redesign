"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/stores/auth"
import { AppointmentBookingSystem } from "@/components/patient/appointment-booking-system"
import { MedicalRecordsView } from "@/components/patient/medical-records-view"
import { MainNav } from "@/components/main-nav"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { protectedApi, appointmentApi } from "@/lib/api"
import { UserProfile, Appointment } from "@/types/auth"

export default function PatientDashboard() {
  const [patient, setPatient] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [upcomingAppointment, setUpcomingAppointment] = useState<Appointment | null>(null)
  const router = useRouter()
  const { token, clearAuth } = useAuthStore()

  // Fetch patient profile
  useEffect(() => {
    const fetchPatientProfile = async () => {
      if (!token) {
        router.push("/login")
        return
      }
      try {
        setLoading(true)
        const profile = await protectedApi.getProfile()
        setPatient(profile)
      } catch (err) {
        console.error("Failed to fetch patient profile:", err)
        clearAuth()
        router.push("/login")
      } finally {
        setLoading(false)
      }
    }
    fetchPatientProfile()
  }, [token, router, clearAuth])

  // Fetch upcoming appointments for the patient
  useEffect(() => {
    if (!patient) return

    const fetchAppointments = async () => {
      try {
        const appointments = await appointmentApi.getPatientAppointments()
        // Filter upcoming appointments (assuming appointment.date is in ISO string format)
        const now = new Date()
        const upcoming = appointments.filter(app => new Date(app.date) >= now)
        if (upcoming.length > 0) {
          // Sort ascending and pick the nearest appointment
          upcoming.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
          setUpcomingAppointment(upcoming[0])
        }
      } catch (error) {
        console.error("Failed to fetch appointments:", error)
      }
    }
    fetchAppointments()
  }, [patient])

  if (loading) return <div className="p-4">Loading...</div>
  if (!patient) return null

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <div className="container mx-auto py-6">
        <h1 className="text-4xl font-bold mb-6">
          Welcome, {patient.firstName} {patient.lastName}
        </h1>

        {upcomingAppointment && (
          <div className="mb-4 p-4 bg-primary/10 text-primary rounded">
            You have an appointment with Dr. {upcomingAppointment.doctor.firstName} {upcomingAppointment.doctor.lastName} at{" "}
            {new Date(upcomingAppointment.date).toLocaleString()}.
          </div>
        )}

        <Tabs defaultValue="appointments" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="records">Medical Records</TabsTrigger>
          </TabsList>

          <TabsContent value="appointments">
            <AppointmentBookingSystem patientId={patient.id} />
          </TabsContent>

          <TabsContent value="records">
            <MedicalRecordsView />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
