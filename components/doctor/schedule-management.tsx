// components/doctor/ScheduleManagement.tsx
"use client";

import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import toast, { Toaster } from "react-hot-toast";
import { doctorsApi, appointmentApi } from "@/lib/api";
import { Availability, Appointment } from "@/types/auth";

interface ScheduleManagementProps {
  doctorId: string;
}

interface WeeklyHourSlot {
  day: number;
  start: string;
  end: string;
  breakStart?: string; // Optional break start time
  breakEnd?: string;   // Optional break end time
}

export function ScheduleManagement({ doctorId }: ScheduleManagementProps) {
  const [weeklyHours, setWeeklyHours] = useState<Record<number, { start: string; end: string; breakStart?: string; breakEnd?: string }>>(
    Array.from({ length: 5 }, (_, index) => index + 1).reduce((acc, day) => {
      acc[day] = { start: "08:00", end: "18:00", breakStart: "12:00", breakEnd: "13:00" }; // Default break
      return acc;
    }, {} as Record<number, { start: string; end: string; breakStart?: string; breakEnd?: string }>)
  );
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [availableSlots, setAvailableSlots] = useState<Availability[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [apptRes, slotsRes] = await Promise.all([
          appointmentApi.getDoctorAppointments(doctorId),
          doctorsApi.getAvailability(doctorId),
        ]);

        setAppointments(apptRes);
        setAvailableSlots(slotsRes);
      } catch (error) {
        toast.error("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (doctorId) fetchData();
  }, [doctorId]);

  const handleSetWeeklyHours = async () => {
    try {
      const slots: WeeklyHourSlot[] = Object.entries(weeklyHours).map(([day, { start, end, breakStart, breakEnd }]) => ({
        day: parseInt(day),
        start,
        end,
        breakStart,
        breakEnd,
      }));

      const newSlots = await doctorsApi.createWeeklyAvailability(doctorId, slots);
      setAvailableSlots(newSlots); // Replace all slots with the new set
      toast.success("Weekly availability updated successfully!");
    } catch (error) {
      toast.error("Failed to update weekly availability.");
    }
  };

  const handleDateSelect = async (selectionInfo: any) => {
    const startDate = new Date(selectionInfo.startStr);
    const endDate = new Date(selectionInfo.endStr);
    const now = new Date(); // Get current date & time

    // Prevent selecting past dates
    if (startDate < now) {
      toast.error("You cannot set availability in the past.");
      return;
    }

    if (startDate >= endDate) {
      toast.error("Start time must be before end time.");
      return;
    }

    try {
      const newSlot = await doctorsApi.createAvailability({
        doctorId,
        startTime: startDate.toISOString(),
        endTime: endDate.toISOString(),
      });

      setAvailableSlots([...availableSlots, newSlot]);
      toast.success("Availability slot added successfully!");
    } catch (error) {
      toast.error("Failed to add availability slot.");
    }
  };


  const handleEventClick = async (clickInfo: any) => {
    const slotId = clickInfo.event.id;
    if (!slotId || clickInfo.event.backgroundColor === "#ffccbc") return;

    if (confirm(`Delete slot from ${clickInfo.event.startStr} to ${clickInfo.event.endStr}?`)) {
      try {
        await doctorsApi.deleteAvailability(slotId);
        setAvailableSlots(availableSlots.filter((slot) => slot.id !== slotId));
        toast.success("Availability slot deleted successfully!");
      } catch (error) {
        toast.error("Failed to delete availability slot.");
      }
    }
  };

  const handleClearAllAvailability = async () => {
    try {
      setIsDeleting(true);
      await doctorsApi.deleteAllAvailability(doctorId);
      setAvailableSlots([]);
      toast.success("All availability slots deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete all availability slots.");
    } finally {
      setIsDeleting(false);
      setIsDialogOpen(false);
    }
  };

  const updateDayHours = (day: number, field: "start" | "end" | "breakStart" | "breakEnd", value: string) => {
    setWeeklyHours((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }));
  };

  const events = [
    ...availableSlots.map((slot) => ({
      id: slot.id,
      title: "Available",
      start: slot.startTime,
      end: slot.endTime,
      backgroundColor: "#25ff29",
      borderColor: "#00acc1",
      editable: false,
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
  ];

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="container mx-auto py-6  ">
      <Toaster />
      <h2 className="text-3xl font-bold mb-6">Schedule Management</h2>

      <div className="grid grid-cols-1 lg:grid-cols-1 mx-auto gap-6 ">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Set Weekly Hours</CardTitle>
            <CardDescription>Define your weekly availability and breaks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 ">
              {Object.entries(weeklyHours).map(([day, { start, end, breakStart, breakEnd }]) => (
                <div key={day} className="flex items-center space-x-2">
                  <Label className="w-16">{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][parseInt(day)]}</Label>
                  <Select value={start} onValueChange={(value) => updateDayHours(parseInt(day), "start", value)}>
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["08:00", "09:00", "10:00", "11:00", "12:00"].map((time) => (
                        <SelectItem key={time} value={time}>{time}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span>to</span>
                  <Select value={end} onValueChange={(value) => updateDayHours(parseInt(day), "end", value)}>
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["14:00", "15:00", "16:00", "17:00", "18:00"].map((time) => (
                        <SelectItem key={time} value={time}>{time}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span>Break:</span>
                  <Select value={breakStart || ""} onValueChange={(value) => updateDayHours(parseInt(day), "breakStart", value)}>
                    <SelectTrigger className="w-24">
                      <SelectValue placeholder="Start" />
                    </SelectTrigger>
                    <SelectContent>
                      {["12:00", "13:00", "14:00"].map((time) => (
                        <SelectItem key={time} value={time}>{time}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span>to</span>
                  <Select value={breakEnd || ""} onValueChange={(value) => updateDayHours(parseInt(day), "breakEnd", value)}>
                    <SelectTrigger className="w-24">
                      <SelectValue placeholder="End" />
                    </SelectTrigger>
                    <SelectContent>
                      {["13:00", "14:00", "15:00"].map((time) => (
                        <SelectItem key={time} value={time}>{time}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
              <div className="flex justify-center gap-6 ">

                <Button onClick={handleSetWeeklyHours} className="mt-4 ">Save Weekly Schedule</Button>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="destructive" className="mt-4 ">Clear All Availability</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Confirm Deletion</DialogTitle>
                      <DialogDescription>Are you sure?</DialogDescription>
                    </DialogHeader>
                    <Button variant="destructive" onClick={handleClearAllAvailability}>Delete All</Button>
                  </DialogContent>
                </Dialog>
              </div>

            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 ">
          <CardHeader>
            <CardTitle>Weekly Schedule</CardTitle>
            <CardDescription>Drag to add slots, click to delete available slots</CardDescription>
          </CardHeader>
          <CardContent>
            <FullCalendar
              plugins={[timeGridPlugin, interactionPlugin]}
              initialView="timeGridWeek"
              slotDuration="00:15:00"
              slotMinTime="08:00:00"
              slotMaxTime="18:00:00"
              events={events}
              selectable
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
  );
}