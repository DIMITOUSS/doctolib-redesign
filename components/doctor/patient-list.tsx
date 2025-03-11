"use client";

import { Appointment } from "@/types/auth";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface PatientListProps {
  doctorId: string;
  appointments: { data: Appointment[] }; // ✅ Expecting `data` inside
}

export function PatientList({ doctorId, appointments }: PatientListProps) {
  const appointmentList = Array.isArray(appointments.data) ? appointments.data : []; // ✅ Extract `data` safely

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
      {appointmentList.map((appointment) => (
        <Card key={appointment.id}>
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarFallback>
                  {appointment.patient.firstName[0]}
                  {appointment.patient.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">
                  {appointment.patient.firstName} {appointment.patient.lastName}
                </p>
                <p className="text-sm text-muted-foreground">
                  {new Date(appointment.appointmentDate).toLocaleString()}
                </p>
              </div>
            </div>
            <Button variant="outline">View Details</Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
