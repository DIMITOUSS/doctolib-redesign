"use client"

import { useState, useEffect } from "react"
import FullCalendar from "@fullcalendar/react"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { doctorsApi, appointmentApi } from "@/lib/api"
import { Availability, Appointment } from "@/types/auth"

interface ScheduleManagementProps {
  doctorId: string
}

export function ScheduleManagement({ doctorId }: ScheduleManagementProps) {
  const [weeklyHours, setWeeklyHours] = useState([
    { day: 1, start: "08:00", end: "18:00" }, // Mon
    { day: 2, start: "08:00", end: "18:00" }, // Tue
    { day: 3, start: "08:00", end: "18:00" }, // Wed
    { day: 4, start: "08:00", end: "18:00" }, // Thu
    { day: 5, start: "08:00", end: "18:00" }, // Fri
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

  const handleDateSelect = async (selectionInfo: any) => {
    const startDate = new Date(selectionInfo.startStr)
    const endDate = new Date(selectionInfo.endStr)

    if (startDate >= endDate) {
      setError("Start time must be before end time")
      return
    }

    const overlaps = availableSlots.some((slot) => {
      const existingStart = new Date(slot.startTime)
      const existingEnd = new Date(slot.endTime)
      return startDate < existingEnd && endDate > existingStart
    })

    if (overlaps) {
      setError("This slot overlaps with an existing availability")
      return
    }

    try {
      const newSlot = await doctorsApi.createAvailability({
        doctorId,
        startTime: startDate.toISOString(),
        endTime: endDate.toISOString(),
      })
      setAvailableSlots([...availableSlots, newSlot])
      setError(null)
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to add slot")
    }
  }

  const handleEventClick = async (clickInfo: any) => {
    const slotId = clickInfo.event.id
    if (!slotId || clickInfo.event.backgroundColor === "#ffccbc") return // Skip appointments

    if (confirm(`Delete slot from ${clickInfo.event.startStr} to ${clickInfo.event.endStr}?`)) {
      try {
        await doctorsApi.deleteAvailability(slotId)
        setAvailableSlots(availableSlots.filter((slot) => slot.id !== slotId))
        setError(null)
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to delete slot")
      }
    }
  }

  const updateDayHours = (day: number, field: "start" | "end", value: string) => {
    setWeeklyHours((prev) =>
      prev.map((d) => (d.day === day ? { ...d, [field]: value } : d))
    )
  }

  const events = [
    ...availableSlots.map((slot) => ({
      id: slot.id,
      title: "Available",
      start: slot.startTime,
      end: slot.endTime,
      backgroundColor: "#25ff29",
      borderColor: "#00acc1",
      editable: false, // Prevent drag-and-drop for now
    })),
    ...appointments.map((appt) => ({
      id: appt.id,
      title: `${appt.patient.firstName} ${appt.patient.lastName} (${appt.type})`,
      start: appt.date,
      end: new Date(new Date(appt.date).getTime() + appt.duration * 60000),
      backgroundColor: "#ffccbc",
      borderColor: "#ff5722",
      editable: false,
    })),
  ]

  if (loading) return <div className="p-4">Loading...</div>
  if (error) return <div className="p-4 text-destructive">{error}</div>

  return (
    <div className="container mx-auto py-6">
      <h2 className="text-3xl font-bold mb-6">Schedule Management</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Hours */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Set Weekly Hours</CardTitle>
            <CardDescription>Define your weekly availability</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {weeklyHours.map(({ day, start, end }) => (
                <div key={day} className="flex items-center space-x-2">
                  <Label className="w-16">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][day]}
                  </Label>
                  <Select value={start} onValueChange={(value) => updateDayHours(day, "start", value)}>
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["08:00", "09:00", "10:00", "11:00", "12:00"].map((time) => (
                        <SelectItem key={time} value={time}>{time}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span>-</span>
                  <Select value={end} onValueChange={(value) => updateDayHours(day, "end", value)}>
                    <SelectTrigger className="w-24">
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
              <Button onClick={handleSetWeeklyHours} className="mt-4">Save Weekly Schedule</Button>
            </div>
          </CardContent>
        </Card>

        {/* Calendar */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Weekly Schedule</CardTitle>
            <CardDescription>
              Drag to add slots, click to delete available slots
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FullCalendar
              plugins={[timeGridPlugin, interactionPlugin]}
              initialView="timeGridWeek"
              slotDuration="00:15:00" // 15-minute slots
              slotMinTime="08:00:00"
              slotMaxTime="18:00:00"
              events={events}
              selectable={true}
              select={handleDateSelect}
              eventClick={handleEventClick}
              headerToolbar={{
                left: "prev,next",
                center: "title",
                right: "timeGridWeek,timeGridDay",
              }}
              height="auto"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}