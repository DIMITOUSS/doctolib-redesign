"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation"; // ✅ Correct Next.js 13+ routing
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, Clipboard, Clock } from "lucide-react";
import { appointmentApi } from "@/lib/api";
import { useAuthStore } from "@/stores/auth";
import { Appointment } from "@/types/auth";

export default function AppointmentPage() {
    const params = useParams(); // ✅ Correct way to get `id` in Next.js 13+
    const router = useRouter();
    const id = params.id as string; // Ensure it's a string

    const userId = useAuthStore((state) => state.userId);
    const userRole = useAuthStore((state) => state.role); // ✅ Role-based logic

    const [appointment, setAppointment] = useState<Appointment | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) {
            console.error("❌ No appointment ID found in URL");
            return;
        }

        const fetchAppointment = async () => {
            setLoading(true);
            try {
                const response = await appointmentApi.getById(id);
                console.log("✅ Appointment Fetched:", response);
                setAppointment(response);
            } catch (err) {
                setError("Failed to load appointment details. Please try again.");
                console.error("❌ Fetch appointment error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAppointment();
    }, [id]);

    const handleCancel = async () => {
        if (!appointment) return;
        try {
            await appointmentApi.updateAppointment(appointment.id, { status: "CANCELLED" });
            setAppointment({ ...appointment, status: "CANCELLED" });
        } catch (err) {
            console.error("❌ Cancel appointment error:", err);
            setError("Failed to cancel appointment.");
        }
    };

    const handleReschedule = () => {
        router.push(`/appointments/${appointment?.id}/reschedule`);
    };

    const handleConfirm = async () => {
        if (!appointment) return;
        try {
            await appointmentApi.updateAppointment(appointment.id, { status: "CONFIRMED" });
            setAppointment({ ...appointment, status: "CONFIRMED" });
        } catch (err) {
            console.error("❌ Confirm appointment error:", err);
            setError("Failed to confirm appointment.");
        }
    };

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        return `${date.toLocaleDateString()} at ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    };

    if (loading) return <p>Loading...</p>;
    if (error || !appointment) return <p className="text-red-500">{error || "Appointment not found."}</p>;

    const isPatient = userRole === "PATIENT";
    const isDoctor = userRole === "DOCTOR";
    const canCancel = appointment.status === "PENDING" || appointment.status === "CONFIRMED";
    const canConfirm = isDoctor && appointment.status === "PENDING";

    return (
        <div className="container mx-auto py-6">
            <div className="mb-8">
                <h2 className="text-3xl font-bold mb-2">Appointment Details</h2>
                <p className="text-muted-foreground">View and manage your appointment</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>Appointment #{appointment.id}</span>
                        <Badge
                            variant={
                                appointment.status === "CONFIRMED"
                                    ? "default"
                                    : appointment.status === "CANCELLED"
                                        ? "destructive"
                                        : "secondary"
                            }
                        >
                            {appointment.status}
                        </Badge>
                    </CardTitle>
                    <CardDescription>
                        Scheduled on {formatDateTime(appointment.appointmentDate)}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center space-x-3">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                        <div>
                            <p className="font-medium">Date & Time</p>
                            <p className="text-sm text-muted-foreground">{formatDateTime(appointment.appointmentDate)}</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3">
                        <User className="h-5 w-5 text-muted-foreground" />
                        <div>
                            <p className="font-medium">{isPatient ? "Doctor" : "Patient"}</p>
                            <p className="text-sm text-muted-foreground">
                                {isPatient ? appointment.doctor.lastName : appointment.patient.lastName}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {isPatient ? appointment.doctor.email : appointment.patient.email}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3">
                        <Clipboard className="h-5 w-5 text-muted-foreground" />
                        <div>
                            <p className="font-medium">Status</p>
                            <p className="text-sm text-muted-foreground">{appointment.status}</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3">
                        <Clock className="h-5 w-5 text-muted-foreground" />
                        <div>
                            <p className="font-medium">Created At</p>
                            <p className="text-sm text-muted-foreground">{formatDateTime(appointment.createdAt)}</p>
                        </div>
                    </div>
                </CardContent>
                <CardContent>
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    <div className="flex space-x-3">
                        {canCancel && (
                            <Button variant="destructive" onClick={handleCancel}>
                                Cancel Appointment
                            </Button>
                        )}
                        {canCancel && isPatient && (
                            <Button variant="outline" onClick={handleReschedule}>
                                Reschedule
                            </Button>
                        )}
                        {canConfirm && (
                            <Button onClick={handleConfirm}>
                                Confirm Appointment
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
