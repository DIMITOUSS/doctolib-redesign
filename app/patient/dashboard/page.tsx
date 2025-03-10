"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Calendar, Clock, FileText } from "lucide-react"
import { useAuthStore } from "@/stores/auth"
import { AppointmentBookingSystem } from "@/components/patient/appointment-booking-system"
import { MedicalRecordsView } from "@/components/patient/medical-records-view"
import { MainNav } from "@/components/main-nav"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { protectedApi, appointmentApi } from "@/lib/api"
import { UserProfile, Appointment } from "@/types/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { toast } from "@/components/ui/use-toast"

export default function PatientDashboard() {
  const [patient, setPatient] = useState<UserProfile | null>(null)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const { token, userId, role, clearAuth } = useAuthStore()
  const router = useRouter()

  // Fetch patient profile and appointments
  useEffect(() => {
    if (!token || role !== "PATIENT") {
      clearAuth()
      router.push("/auth/login")
      return
    }

    const fetchData = async () => {
      try {
        setLoading(true)
        const profile = await protectedApi.getProfile()
        setPatient(profile)

        try {
          const appts = await appointmentApi.getPatientAppointments()
          console.log("Appointments:", appts)
          setAppointments(appts || [])
        } catch (error: any) {
          console.error("Appointments fetch error:", error.response?.data || error.message)
          if (error.response?.status === 404 || error.response?.status === 500) {
            setAppointments([])
          } else {
            throw error
          }
        }
      } catch (error: any) {
        console.error("Full fetch error:", error.response?.data || error.message)
        clearAuth()
        router.push("/login")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [token, userId, role, clearAuth, router])

  const handleCancelAppointment = async (appointmentId: string) => {
    if (confirm("Are you sure you want to cancel this appointment?")) {
      try {
        await appointmentApi.deleteAppointment(appointmentId)
        setAppointments(appointments.filter((appt) => appt.id !== appointmentId))
        toast({ title: "Success", description: "Appointment cancelled successfully." })
      } catch (error: any) {
        console.error("Failed to cancel appointment:", error.response?.data || error.message)
        toast({
          title: "Error",
          description: "Failed to cancel appointment.",
          variant: "destructive",
        })
      }
    }
  }

  if (loading) return <div className="p-4">Loading...</div>
  if (!patient) return null

  const upcomingAppointments = appointments.filter(
    (appt) => new Date(appt.appointmentDate) >= new Date()
  )
  const pastAppointments = appointments.filter(
    (appt) => new Date(appt.appointmentDate) < new Date()
  )

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <div className="container mx-auto py-6">
        <h1 className="text-4xl font-bold mb-6">
          Welcome, {patient.firstName} {patient.lastName}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{upcomingAppointments.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Past Appointments</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pastAppointments.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Medical Records</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                View Records
              </Button>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="appointments" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="records">Medical Records</TabsTrigger>
          </TabsList>

          <TabsContent value="appointments" className="space-y-6">
            {/* Upcoming Appointments Section */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Upcoming Appointments</h2>
              {upcomingAppointments.length === 0 ? (
                <p>No upcoming appointments.</p>
              ) : (
                upcomingAppointments.map((appointment) => (
                  <Card key={appointment.id}>
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarFallback>
                            {appointment.doctor.firstName[0]}
                            {appointment.doctor.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">
                            Dr. {appointment.doctor.firstName} {appointment.doctor.lastName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {appointment.doctor.specialty || "N/A"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(appointment.appointmentDate).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() =>
                            router.push(
                              `/doctor/${appointment.doctor.id}?reschedule=${appointment.id}`
                            )
                          }
                        >
                          Reschedule
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleCancelAppointment(appointment.id)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {/* Book New Appointment Section */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Book a New Appointment</h2>
              <AppointmentBookingSystem patientId={patient.id} />
            </div>
          </TabsContent>

          <TabsContent value="records">
            <MedicalRecordsView />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}