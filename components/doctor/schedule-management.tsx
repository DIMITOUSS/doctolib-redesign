"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Clock } from "lucide-react"
import { doctorsApi, appointmentApi } from "@/lib/api"
import { Availability, Appointment } from "@/types/auth"
import { format } from "date-fns"

interface ScheduleManagementProps {
  doctorId: string
}

export function ScheduleManagement({ doctorId }: ScheduleManagementProps) {
  const [weeklyHours, setWeeklyHours] = useState([
    { day: 1, start: "08:00", end: "18:00" }, // Monday
    { day: 2, start: "08:00", end: "18:00" }, // Tuesday
    { day: 3, start: "08:00", end: "18:00" }, // Wednesday
    { day: 4, start: "08:00", end: "18:00" }, // Thursday
    { day: 5, start: "08:00", end: "18:00" }, // Friday
  ])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [availableSlots, setAvailableSlots] = useState<Availability[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [apptRes, slotsRes] = await Promise.all([
          appointmentApi.getDoctorAppointments(doctorId),
          doctorsApi.getAvailability(doctorId),
        ])
        setAppointments(apptRes)
        setAvailableSlots(slotsRes)
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load data")
      } finally {
        setLoading(false)
      }
    }
    if (doctorId) fetchData()
  }, [doctorId])

  const handleSetWeeklyHours = async () => {
    try {
      const newSlots = await doctorsApi.createWeeklyAvailability(doctorId, weeklyHours)
      setAvailableSlots([...availableSlots, ...newSlots])
      setError(null)
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to set weekly hours")
    }
  }

  const updateDayHours = (day: number, field: "start" | "end", value: string) => {
    setWeeklyHours((prev) =>
      prev.map((d) => (d.day === day ? { ...d, [field]: value } : d))
    )
  }

  const getAppointmentsForDay = (day: number) => {
    const now = new Date()
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay())) // Sunday
    const targetDate = new Date(startOfWeek)
    targetDate.setDate(startOfWeek.getDate() + day)
    return appointments.filter(
      (appt) => new Date(appt.date).toDateString() === targetDate.toDateString()
    )
  }

  if (loading) return <div className="p-4">Loading...</div>
  if (error) return <div className="p-4 text-destructive">{error}</div>

  return (
    <div className="container mx-auto py-6">
      <h2 className="text-3xl font-bold mb-6">Schedule Management</h2>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Set Weekly Working Hours</CardTitle>
          <CardDescription>Define your availability for the week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {weeklyHours.map(({ day, start, end }) => (
              <div key={day} className="flex items-center space-x-4">
                <Label className="w-24">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][day]}
                </Label>
                <Select value={start} onValueChange={(value) => updateDayHours(day, "start", value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["08:00", "09:00", "10:00", "11:00", "12:00"].map((time) => (
                      <SelectItem key={time} value={time}>{time}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span>to</span>
                <Select value={end} onValueChange={(value) => updateDayHours(day, "end", value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["14:00", "15:00", "16:00", "17:00", "18:00"].map((time) => (
                      <SelectItem key={time} value={time}>{time}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
            <Button onClick={handleSetWeeklyHours}>Save Weekly Schedule</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>This Week’s Appointments</CardTitle>
          <CardDescription>View your scheduled appointments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {weeklyHours.map(({ day }) => {
              const dayAppts = getAppointmentsForDay(day)
              return (
                <div key={day}>
                  <h3 className="font-medium">
                    {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][day]}
                  </h3>
                  {dayAppts.length > 0 ? (
                    dayAppts.map((appt) => (
                      <div key={appt.id} className="flex items-center p-2 border-b">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>
                          {format(new Date(appt.date), "hh:mm a")} - {appt.patient.firstName} {appt.patient.lastName} ({appt.type})
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No appointments</p>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}