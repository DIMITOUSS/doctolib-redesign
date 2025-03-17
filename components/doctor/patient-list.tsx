"use client";

import { useState, useEffect } from "react";
import { Appointment } from "@/types/auth";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { appointmentApi, prescriptionApi } from "@/lib/api";

interface PatientListProps {
  doctorId: string;
  appointments: Appointment[];
}

export function PatientList({ doctorId, appointments }: PatientListProps) {
  const [appointmentList, setAppointmentList] = useState(
    appointments.filter(a => ['SCHEDULED', 'CONFIRMED'].includes(a.status))
  );
  const [missedCounts, setMissedCounts] = useState<Map<string, number>>(new Map());
  const [bannedPatients, setBannedPatients] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchMissedCounts = async () => {
      const counts = new Map<string, number>();
      const banned = new Set<string>();
      for (const appt of appointmentList) {
        const count = await appointmentApi.getMissedCount(doctorId, appt.patient.id);
        counts.set(appt.patient.id, count);
        if (count >= 3) banned.add(appt.patient.id);
      }
      setMissedCounts(counts);
      setBannedPatients(banned);
    };
    fetchMissedCounts();
  }, [doctorId, appointmentList]);

  const handleConfirm = async (appointmentId: string) => {
    try {
      const updated = await appointmentApi.confirmAppointment(appointmentId);
      await prescriptionApi.createDraft(appointmentId); // Add this
      setAppointmentList(prev =>
        prev.map(a => (a.id === appointmentId ? { ...a, status: "CONFIRMED" } : a))
      );
    } catch (error: any) {
      console.error("Confirm error:", error);
      alert("Failed to confirm: " + (error.response?.data?.message || error.message));
    }
  };

  const handleMarkMissed = async (appointmentId: string) => {
    try {
      const updated = await appointmentApi.markAsMissed(appointmentId);
      setAppointmentList(prev =>
        prev.filter(a => a.id !== appointmentId)
      );
      const patientId = updated.patient.id;
      const newCount = (missedCounts.get(patientId) || 0) + 1;
      setMissedCounts(prev => new Map(prev).set(patientId, newCount));
      if (newCount >= 3) {
        setBannedPatients(prev => new Set(prev).add(patientId));
      }
    } catch (error: any) {
      console.error("Mark missed error:", error);
      alert("Failed to mark as missed: " + (error.response?.data?.message || error.message));
    }
  };

  const handleUnban = async (patientId: string) => {
    try {
      await appointmentApi.unbanPatient(doctorId, patientId);
      setBannedPatients(prev => {
        const newSet = new Set(prev);
        newSet.delete(patientId);
        return newSet;
      });
    } catch (error: any) {
      console.error("Unban error:", error);
      alert("Failed to unban: " + (error.response?.data?.message || error.message));
    }
  };

  if (appointmentList.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Upcoming Appointments</h2>
        <p>No upcoming appointments available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Upcoming Appointments</h2>
      {appointmentList.map((appointment) => {
        const missedCount = missedCounts.get(appointment.patient.id) || 0;
        const isBanned = bannedPatients.has(appointment.patient.id);
        const isPast = new Date(appointment.appointmentDate) < new Date();
        return (
          <Card key={appointment.id}>
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarFallback>
                    {appointment.patient?.firstName?.[0] || "?"}
                    {appointment.patient?.lastName?.[0] || "?"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">
                    {appointment.patient?.firstName || "Unknown"} {appointment.patient?.lastName || "Patient"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(appointment.appointmentDate).toLocaleString('en-US', {
                      timeZone: 'UTC',
                      dateStyle: 'short',
                      timeStyle: 'short',
                    })}
                  </p>
                  <p className="text-sm text-muted-foreground capitalize">
                    Status: {appointment.status.toLowerCase()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Missed: {missedCount}/3 {isBanned ? "(Banned)" : ""}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                {appointment.status === "SCHEDULED" && (
                  <Button variant="default" onClick={() => handleConfirm(appointment.id)}>
                    Confirm
                  </Button>
                )}
                {(appointment.status === "SCHEDULED" || (appointment.status === "CONFIRMED" && isPast)) && (
                  <Button variant="destructive" onClick={() => handleMarkMissed(appointment.id)}>
                    Mark Missed
                  </Button>
                )}
                {isBanned && (
                  <Button variant="secondary" onClick={() => handleUnban(appointment.patient.id)}>
                    Unban
                  </Button>
                )}
                <Button variant="outline">View Details</Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}