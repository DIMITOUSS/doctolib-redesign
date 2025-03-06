"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { Clock, Plus, Edit, Trash2, CalendarPlus2Icon as CalendarIcon2 } from "lucide-react"

export function ScheduleManagement() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      patientName: "Ahmed Bouazizi",
      time: "09:00 AM",
      duration: 30,
      type: "Check-up",
      status: "confirmed",
    },
    {
      id: 2,
      patientName: "Fatima Zahra",
      time: "10:00 AM",
      duration: 45,
      type: "Consultation",
      status: "confirmed",
    },
    {
      id: 3,
      patientName: "Omar Kaddouri",
      time: "11:30 AM",
      duration: 30,
      type: "Follow-up",
      status: "pending",
    },
    {
      id: 4,
      patientName: "Leila Benali",
      time: "02:00 PM",
      duration: 60,
      type: "New Patient",
      status: "confirmed",
    },
  ])

  const [workingHours, setWorkingHours] = useState([
    { day: "Monday", start: "09:00", end: "17:00", isWorking: true },
    { day: "Tuesday", start: "09:00", end: "17:00", isWorking: true },
    { day: "Wednesday", start: "09:00", end: "17:00", isWorking: true },
    { day: "Thursday", start: "09:00", end: "17:00", isWorking: true },
    { day: "Friday", start: "09:00", end: "14:00", isWorking: true },
    { day: "Saturday", start: "10:00", end: "14:00", isWorking: false },
    { day: "Sunday", start: "00:00", end: "00:00", isWorking: false },
  ])

  const timeSlots = [
    "09:00 AM",
    "09:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
    "12:30 PM",
    "01:00 PM",
    "01:30 PM",
    "02:00 PM",
    "02:30 PM",
    "03:00 PM",
    "03:30 PM",
    "04:00 PM",
    "04:30 PM",
  ]

  const getAppointmentsForDate = (date: Date) => {
    // In a real app, this would filter appointments by the selected date
    return appointments
  }

  const handleUpdateWorkingHours = (index: number, field: string, value: string | boolean) => {
    const updatedHours = [...workingHours]
    updatedHours[index] = { ...updatedHours[index], [field]: value }
    setWorkingHours(updatedHours)
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Schedule Management</h2>
        <p className="text-muted-foreground">Manage your appointments and working hours</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
            <CardDescription>Select a date to view appointments</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border"
            />
          </CardContent>
          <CardFooter>
            <div className="flex justify-between w-full text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-primary mr-2"></div>
                <span>Busy</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-muted mr-2"></div>
                <span>Available</span>
              </div>
            </div>
          </CardFooter>
        </Card>

        {/* Daily Schedule */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Daily Schedule</CardTitle>
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
                    Create a new appointment for {format(selectedDate, "MMMM d, yyyy")}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="patient" className="text-right">
                      Patient
                    </Label>
                    <Input id="patient" placeholder="Patient name" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="time" className="text-right">
                      Time
                    </Label>
                    <Select>
                      <SelectTrigger id="time" className="col-span-3">
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="duration" className="text-right">
                      Duration
                    </Label>
                    <Select defaultValue="30">
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
                    <Label htmlFor="type" className="text-right">
                      Type
                    </Label>
                    <Select>
                      <SelectTrigger id="type" className="col-span-3">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="checkup">Check-up</SelectItem>
                        <SelectItem value="consultation">Consultation</SelectItem>
                        <SelectItem value="followup">Follow-up</SelectItem>
                        <SelectItem value="newpatient">New Patient</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Save Appointment</Button>
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
                    className={`flex items-center justify-between p-4 rounded-lg border ${appointment.status === "confirmed" ? "border-primary/50 bg-primary/5" : "border-muted"
                      }`}
                  >
                    <div className="flex items-center">
                      <div className="mr-4 flex-shrink-0">
                        <Clock className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <h4 className="font-medium">{appointment.patientName}</h4>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <span>{appointment.time}</span>
                          <span className="mx-2">•</span>
                          <span>{appointment.duration} min</span>
                          <span className="mx-2">•</span>
                          <span>{appointment.type}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <CalendarIcon2 className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                  <h3 className="mt-4 text-lg font-medium">No appointments</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    There are no appointments scheduled for this day.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Working Hours */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Working Hours</CardTitle>
            <CardDescription>Set your regular working hours for each day of the week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {workingHours.map((day, index) => (
                <div key={day.day} className="space-y-4 p-4 rounded-lg border">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{day.day}</h4>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`working-${day.day}`}
                        checked={day.isWorking}
                        onCheckedChange={(checked) => handleUpdateWorkingHours(index, "isWorking", Boolean(checked))}
                      />
                      <Label htmlFor={`working-${day.day}`}>Working</Label>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`start-${day.day}`}>Start Time</Label>
                      <Select
                        disabled={!day.isWorking}
                        value={day.start}
                        onValueChange={(value) => handleUpdateWorkingHours(index, "start", value)}
                      >
                        <SelectTrigger id={`start-${day.day}`}>
                          <SelectValue placeholder="Start time" />
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
                      <Label htmlFor={`end-${day.day}`}>End Time</Label>
                      <Select
                        disabled={!day.isWorking}
                        value={day.end}
                        onValueChange={(value) => handleUpdateWorkingHours(index, "end", value)}
                      >
                        <SelectTrigger id={`end-${day.day}`}>
                          <SelectValue placeholder="End time" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="14:00">14:00</SelectItem>
                          <SelectItem value="15:00">15:00</SelectItem>
                          <SelectItem value="16:00">16:00</SelectItem>
                          <SelectItem value="17:00">17:00</SelectItem>
                          <SelectItem value="18:00">18:00</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button className="ml-auto">Save Working Hours</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

