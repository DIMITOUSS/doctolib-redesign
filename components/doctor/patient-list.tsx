"use client";

import { useRouter } from "next/navigation";
import { Appointment } from "@/types/auth";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface PatientListProps {
  doctorId: string;
  appointments: { data: { data: Appointment[] } }; // Updated type to match structure
}

export function PatientList({ doctorId, appointments }: PatientListProps) {
  const router = useRouter();

  console.log("Raw appointments prop:", appointments);

  // Extract the inner 'data' array
  const appointmentList = Array.isArray(appointments.data.data) ? appointments.data.data : [];
  console.log("Extracted appointmentList:", appointmentList);

  if (appointmentList.length === 0) {
    console.warn("No appointments to display in PatientList - appointmentList is empty");
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Upcoming Appointments</h2>
        <p>No upcoming appointments available.</p>
      </div>
    );
  }

  const handleViewDetails = (appointmentId: string) => {
    console.log("Navigating to appointment:", appointmentId);
    router.push(`/appointments/${appointmentId}`);
  };

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
            <Button
              variant="outline"
              onClick={() => handleViewDetails(appointment.id)}
            >
              View Details
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}