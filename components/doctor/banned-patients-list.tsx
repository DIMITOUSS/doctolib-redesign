"use client";

import { useState, useEffect } from "react";
import { BannedPatient } from "@/types/auth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { appointmentApi } from "@/lib/api";

interface BannedPatientsListProps {
    doctorId: string;
}

export default function BannedPatientsList({ doctorId }: BannedPatientsListProps) {
    const [bannedPatients, setBannedPatients] = useState<BannedPatient[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBannedPatients = async () => {
            try {
                setIsLoading(true);
                const patients = await appointmentApi.getBannedPatients(doctorId);
                setBannedPatients(patients);
            } catch (err: any) {
                console.error("Fetch banned patients error:", err);
                setError(err.response?.data?.message || "Failed to load banned patients");
            } finally {
                setIsLoading(false);
            }
        };
        fetchBannedPatients();
    }, [doctorId]);

    const handleUnban = async (patientId: string) => {
        try {
            await appointmentApi.unbanPatient(doctorId, patientId);
            setBannedPatients(prev => prev.filter(p => p.patient.id !== patientId));
        } catch (err: any) {
            console.error("Unban error:", err);
            alert("Failed to unban: " + (err.response?.data?.message || err.message));
        }
    };

    if (isLoading) return <p>Loading banned patients...</p>;
    if (error) return <p>{error}</p>;
    if (bannedPatients.length === 0) {
        return (
            <div className="space-y-4">
                <h2 className="text-2xl font-semibold">Banned Patients</h2>
                <p>No banned patients found.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Banned Patients</h2>
            {bannedPatients.map((ban) => (
                <Card key={ban.id}>
                    <CardContent className="flex items-center justify-between p-4">
                        <div>
                            <p className="font-semibold">
                                {ban.patient.firstName} {ban.patient.lastName}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Email: {ban.patient.email}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Banned on: {new Date(ban.bannedAt).toLocaleString('en-US', {
                                    dateStyle: 'short',
                                    timeStyle: 'short',
                                })}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Reason: {ban.reason}
                            </p>
                        </div>
                        <Button variant="secondary" onClick={() => handleUnban(ban.patient.id)}>
                            Unban
                        </Button>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}