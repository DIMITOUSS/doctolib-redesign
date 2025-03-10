// components/doctor/patient-list.tsx
"use client";

import { Appointment } from "@/types/auth";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface PatientListProps {
  doctorId: string;
  appointments: Appointment[];
}

export function PatientList({ doctorId, appointments }: PatientListProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Upcoming Appointments</h2>
      {appointments.length === 0 ? (
        <p>No upcoming appointments.</p>
      ) : (
        appointments.map((appointment) => (
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
        ))
      )}
    </div>
  );
}