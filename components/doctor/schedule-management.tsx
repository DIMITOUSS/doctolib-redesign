"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { Clock, Plus, Trash2 } from "lucide-react"
import { appointmentApi, doctorsApi, patientsApi } from "@/lib/api"
import { Appointment, Availability, Patient } from "@/types/auth"

interface ScheduleManagementProps {
  doctorId: string
}

export function ScheduleManagement({ doctorId }: ScheduleManagementProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [availableSlots, setAvailableSlots] = useState<Availability[]>([])
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [newAppt, setNewAppt] = useState({ patientId: "", time: "", duration: "30", type: "" })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [apptRes, slotsRes, patientsRes] = await Promise.all([
          appointmentApi.getDoctorAppointments(doctorId),
          doctorsApi.getAvailability(doctorId),
          patientsApi.getPatients(),
        ])
        setAppointments(apptRes)
        setAvailableSlots(slotsRes)
        setPatients(patientsRes)
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load schedule")
      } finally {
        setLoading(false)
      }
    }

    if (doctorId) fetchData()
  }, [doctorId])

  const getAppointmentsForDate = (date: Date) => {
    return appointments.filter((appt) =>
      new Date(appt.date).toDateString() === date.toDateString()
    )
  }

  const getSlotsForDate = (date: Date) => {
    return availableSlots.filter((slot) =>
      new Date(slot.startTime).toDateString() === date.toDateString()
    )
  }

  const handleAddAppointment = async () => {
    try {
      const slot = availableSlots.find((s) => format(new Date(s.startTime), "hh:mm a") === newAppt.time)
      if (!slot) throw new Error("Selected time slot unavailable")

      const date = new Date(selectedDate)
      const [hours, minutes] = newAppt.time.split(/:| /)
      date.setHours(parseInt(hours) + (newAppt.time.includes("PM") ? 12 : 0), parseInt(minutes))

      const newAppointment = await appointmentApi.book({
        doctorId,
        patientId: newAppt.patientId,
        date: date.toISOString(),
        duration: parseInt(newAppt.duration),
        type: newAppt.type,
      })
      setAppointments([...appointments, newAppointment])
      setNewAppt({ patientId: "", time: "", duration: "30", type: "" })
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to book appointment")
    }
  }

  const handleDeleteAppointment = async (id: string) => {
    try {
      await appointmentApi.deleteAppointment(id)
      setAppointments(appointments.filter((appt) => appt.id !== id))
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete appointment")
    }
  }

  const handleAddSlot = async (start: string, end: string) => {
    try {
      const startDate = new Date(selectedDate)
      const [startHours, startMinutes] = start.split(":")
      startDate.setHours(parseInt(startHours), parseInt(startMinutes))

      const endDate = new Date(selectedDate)
      const [endHours, endMinutes] = end.split(":")
      endDate.setHours(parseInt(endHours), parseInt(endMinutes))

      // Check for overlap with existing slots
      const overlaps = getSlotsForDate(selectedDate).some((slot) => {
        const existingStart = new Date(slot.startTime)
        const existingEnd = new Date(slot.endTime)
        return (
          (startDate < existingEnd && endDate > existingStart) // Overlap condition
        )
      })

      if (overlaps) {
        setError("This slot overlaps with an existing availability slot")
        return
      }

      const newSlot = await doctorsApi.createAvailability({
        doctorId,
        startTime: startDate.toISOString(),
        endTime: endDate.toISOString(),
      })
      setAvailableSlots([...availableSlots, newSlot])
      setError(null) // Clear any previous error
    } catch (err: any) {
      const message = err.response?.status === 409
        ? "Slot conflicts with existing availability"
        : err.response?.data?.message || "Failed to add availability slot"
      setError(message)
    }
  }

  const handleDeleteSlot = async (slotId: string) => {
    try {
      await doctorsApi.deleteAvailability(slotId)
      setAvailableSlots(availableSlots.filter((slot) => slot.id !== slotId))
      setError(null)
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete slot")
    }
  }

  if (loading) return <div className="p-4">Loading schedule...</div>
  if (error) return <div className="p-4 text-destructive">{error}</div>

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Schedule Management</h2>
        <p className="text-muted-foreground">View appointments and manage your availability</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
            <CardDescription>Select a date to manage your schedule</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Appointments</CardTitle>
              <CardDescription>{format(selectedDate, "EEEE, MMMM d, yyyy")}</CardDescription>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Appointment
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Appointment</DialogTitle>
                  <DialogDescription>
                    Schedule an appointment for {format(selectedDate, "MMMM d, yyyy")}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="patient" className="text-right">Patient</Label>
                    <Select
                      value={newAppt.patientId}
                      onValueChange={(value) => setNewAppt({ ...newAppt, patientId: value })}
                    >
                      <SelectTrigger id="patient" className="col-span-3">
                        <SelectValue placeholder="Select patient" />
                      </SelectTrigger>
                      <SelectContent>
                        {patients.map((patient) => (
                          <SelectItem key={patient.id} value={patient.id}>
                            {patient.firstName} {patient.lastName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="time" className="text-right">Time</Label>
                    <Select
                      value={newAppt.time}
                      onValueChange={(value) => setNewAppt({ ...newAppt, time: value })}
                    >
                      <SelectTrigger id="time" className="col-span-3">
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        {getSlotsForDate(selectedDate).map((slot) => (
                          <SelectItem key={slot.id} value={format(new Date(slot.startTime), "hh:mm a")}>
                            {format(new Date(slot.startTime), "hh:mm a")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="duration" className="text-right">Duration</Label>
                    <Select
                      value={newAppt.duration}
                      onValueChange={(value) => setNewAppt({ ...newAppt, duration: value })}
                    >
                      <SelectTrigger id="duration" className="col-span-3">
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="45">45 minutes</SelectItem>
                        <SelectItem value="60">60 minutes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="type" className="text-right">Type</Label>
                    <Select
                      value={newAppt.type}
                      onValueChange={(value) => setNewAppt({ ...newAppt, type: value })}
                    >
                      <SelectTrigger id="type" className="col-span-3">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Check-up">Check-up</SelectItem>
                        <SelectItem value="Consultation">Consultation</SelectItem>
                        <SelectItem value="Follow-up">Follow-up</SelectItem>
                        <SelectItem value="New Patient">New Patient</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleAddAppointment}>Save Appointment</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {getAppointmentsForDate(selectedDate).length > 0 ? (
                getAppointmentsForDate(selectedDate).map((appointment) => (
                  <div
                    key={appointment.id}
                    className={`flex items-center justify-between p-4 rounded-lg border ${appointment.status === "CONFIRMED" ? "border-primary/50 bg-primary/5" : "border-muted"}`}
                  >
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-muted-foreground mr-4" />
                      <div>
                        <h4 className="font-medium">{appointment.patient.firstName} {appointment.patient.lastName}</h4>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <span>{new Date(appointment.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          <span className="mx-2">•</span>
                          <span>{appointment.duration} min</span>
                          <span className="mx-2">•</span>
                          <span>{appointment.type}</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDeleteAppointment(appointment.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground">No appointments scheduled for this day.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Availability Slots</CardTitle>
            <CardDescription>Set your available times for {format(selectedDate, "EEEE, MMMM d, yyyy")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex space-x-4">
                <div className="space-y-2">
                  <Label htmlFor="start-time">Start Time</Label>
                  <Select onValueChange={(value) => handleAddSlot(value, "12:00")}>
                    <SelectTrigger id="start-time">
                      <SelectValue placeholder="Select start time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="08:00">08:00</SelectItem>
                      <SelectItem value="09:00">09:00</SelectItem>
                      <SelectItem value="10:00">10:00</SelectItem>
                      <SelectItem value="11:00">11:00</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-time">End Time</Label>
                  <Select onValueChange={(value) => handleAddSlot("08:00", value)}>
                    <SelectTrigger id="end-time">
                      <SelectValue placeholder="Select end time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12:00">12:00</SelectItem>
                      <SelectItem value="14:00">14:00</SelectItem>
                      <SelectItem value="16:00">16:00</SelectItem>
                      <SelectItem value="17:00">17:00</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={() => handleAddSlot("09:00", "17:00")}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Slot
                </Button>
              </div>
              {getSlotsForDate(selectedDate).length > 0 ? (
                getSlotsForDate(selectedDate).map((slot) => (
                  <div
                    key={slot.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-muted"
                  >
                    <div>
                      <span>{format(new Date(slot.startTime), "hh:mm a")}</span>
                      <span className="mx-2">-</span>
                      <span>{format(new Date(slot.endTime), "hh:mm a")}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDeleteSlot(slot.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No availability slots set for this day.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}