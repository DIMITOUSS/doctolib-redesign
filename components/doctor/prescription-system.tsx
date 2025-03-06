"use client"

import { useState, useEffect } from "react"
import { appointmentApi, medicalRecordsApi } from "@/lib/api"
import { Appointment, MedicalRecord } from "@/types/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"

interface PrescriptionSystemProps {
  doctorId: string
}

export function PrescriptionSystem({ doctorId }: PrescriptionSystemProps) {
  const [records, setRecords] = useState<MedicalRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        setLoading(true)
        // Fetch appointments for the doctor
        const allAppointments = await appointmentApi.getDoctorAppointments(doctorId)
        const allRecords = await Promise.all(
          allAppointments.data.map((appt: Appointment) => {
            // Try to get the patientId from the nested patient or fallback to patientId field
            const patientId = appt.patient?.id || appt.patientId;

            if (patientId) {
              return medicalRecordsApi.getPatientRecords(patientId)
            } else {
              console.error("Missing patientId in appointment", appt)
              return [] // Return an empty array if patientId is missing
            }
          })
        )
        const flattenedRecords = allRecords.flat().filter((record) => record.doctorId === doctorId)
        setRecords(flattenedRecords)
      } catch (err) {
        setError("Failed to load prescriptions")
      } finally {
        setLoading(false)
      }
    }

    fetchPrescriptions()
  }, [doctorId])

  if (loading) return <p>Loading prescriptions...</p>
  if (error) return <p>{error}</p>

  return (
    <Card>
      <CardHeader>
        <CardTitle>Prescription Management</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient ID</TableHead>
              <TableHead>Diagnosis</TableHead>
              <TableHead>Prescriptions</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map((record, index) => (
              <TableRow key={`${record.patientId}-${record.createdAt}-${index}`}>
                <TableCell>{record.patientId}</TableCell>
                <TableCell>{record.diagnosis}</TableCell>
                <TableCell>{record.prescriptions.join(", ")}</TableCell>
                <TableCell>{new Date(record.createdAt).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
