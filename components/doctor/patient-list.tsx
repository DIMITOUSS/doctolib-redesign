"use client"

import { useState, useEffect } from "react"
import { appointmentApi } from "@/lib/api"
import { Appointment } from "@/types/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface PatientListProps {
  doctorId: string
}

export function PatientList({ doctorId }: PatientListProps) {
  const [patients, setPatients] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true)
        const response = await appointmentApi.getDoctorAppointments(doctorId)
        // Create a map using a unique identifier:
        // Use the nested patient id if available, otherwise fallback to patientId.
        const uniquePatients = Array.from(
          new Map(
            (response.data as Appointment[]).map((appt: Appointment) => [
              appt.patient?.id || appt.patientId,
              appt
            ])
          ).values()
        ) as Appointment[]  // <-- Type assertion here
        setPatients(uniquePatients)
      } catch (err) {
        setError("Failed to load patient list")
      } finally {
        setLoading(false)
      }
    }

    fetchPatients()
  }, [doctorId])

  if (loading) return <p>Loading patients...</p>
  if (error) return <p>{error}</p>

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Patients</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient ID</TableHead>
              <TableHead>Last Appointment</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patients.map((patient, index) => {
              // Determine a unique key using the nested patient id or fallback to patientId or index.
              const key = patient.patient?.id || patient.patientId || index.toString();
              return (
                <TableRow key={key}>
                  <TableCell>{patient.patient?.id || patient.patientId}</TableCell>
                  <TableCell>{new Date(patient.date).toLocaleDateString()}</TableCell>
                  <TableCell>{patient.status}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
