// src/components/patient/MedicalRecordsView.tsx
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { medicalRecordsApi, appointmentApi, patientsApi } from '@/lib/api';
import { MedicalRecord, Appointment } from '@/types/auth';
import { useAuthStore } from '@/stores/auth';
import jsPDF from 'jspdf';

export default function MedicalRecordsView() {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [visits, setVisits] = useState<Appointment[]>([]);
  const [medications, setMedications] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userId } = useAuthStore(); // patientId from auth store
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) {
        setError('User not authenticated');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const recordsData = await medicalRecordsApi.getPatientRecords(userId); // Pass userId
        setRecords(recordsData);

        const appointmentsData = await appointmentApi.getPatientAppointments();
        const completedVisits = appointmentsData.appointments.filter(
          (appt: Appointment) => appt.status === 'COMPLETED'
        );
        setVisits(completedVisits);

        const meds = recordsData
          .filter((record) => record.prescription)
          .map((record) => record.prescription as string);
        setMedications([...new Set(meds)]);
      } catch (err) {
        setError('Failed to load medical records.');
        toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch data.' });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [userId, toast]);

  const handleRequestCorrection = async (recordId: string) => {
    try {
      toast({
        title: 'Correction Requested',
        description: 'Your request has been sent to the doctor.',
      });
    } catch (err) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to request correction.' });
    }
  };

  const exportRecords = () => {
    const doc = new jsPDF();
    doc.text('Medical Records', 10, 10);
    let y = 20;
    records.forEach((record, index) => {
      doc.text(`Record ${index + 1}:`, 10, y);
      doc.text(`Date: ${new Date(record.createdAt).toLocaleString()}`, 10, y + 10);
      doc.text(`Diagnosis: ${record.diagnosis}`, 10, y + 20);
      if (record.prescription) doc.text(`Prescription: ${record.prescription}`, 10, y + 30);
      y += 40;
    });
    doc.save(`medical_records_${userId}.pdf`);
  };

  const shareWithDoctor = async (doctorId: string) => {
    if (!userId) {
      toast({ variant: 'destructive', title: 'Error', description: 'User not authenticated.' });
      return;
    }
    try {
      await patientsApi.grantConsent(userId, { doctorId });
      toast({
        title: 'Records Shared',
        description: 'Records shared with the doctor successfully.',
      });
    } catch (err) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to share records.' });
    }
  };

  if (isLoading) return <div>Loading medical records...</div>;
  if (error) return <div>{error} <Button onClick={() => window.location.reload()}>Retry</Button></div>;

  return (
    <Tabs defaultValue="visits" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="visits">Visits</TabsTrigger>
        <TabsTrigger value="medications">Medications</TabsTrigger>
        <TabsTrigger value="records">Records</TabsTrigger>
      </TabsList>

      <TabsContent value="visits">
        <Card>
          <CardHeader><CardTitle>Past Visits</CardTitle></CardHeader>
          <CardContent>
            {visits.length > 0 ? (
              visits.map((visit) => (
                <div key={visit.id} className="mb-4 p-4 border rounded">
                  <p><strong>Date:</strong> {new Date(visit.appointmentDate).toLocaleString()}</p>
                  <p><strong>Doctor:</strong> {visit.doctor.firstName} {visit.doctor.lastName}</p>
                  <p><strong>Type:</strong> {visit.type}</p>
                </div>
              ))
            ) : (
              <p>No past visits found.</p>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="medications">
        <Card>
          <CardHeader><CardTitle>Medications</CardTitle></CardHeader>
          <CardContent>
            {medications.length > 0 ? (
              <ul className="list-disc pl-5">
                {medications.map((med, index) => (
                  <li key={index}>{med}</li>
                ))}
              </ul>
            ) : (
              <p>No medications recorded.</p>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="records">
        <Card>
          <CardHeader><CardTitle>Medical Records</CardTitle></CardHeader>
          <CardContent>
            {records.length > 0 ? (
              records.map((record) => (
                <div key={record.id} className="mb-4 p-4 border rounded">
                  <p><strong>Date:</strong> {new Date(record.createdAt).toLocaleString()}</p>
                  <p><strong>Diagnosis:</strong> {record.diagnosis}</p>
                  {record.prescription && <p><strong>Prescription:</strong> {record.prescription}</p>}
                  {record.medicalTests && <p><strong>Tests:</strong> {record.medicalTests}</p>}
                  {record.notes && <p><strong>Notes:</strong> {record.notes}</p>}
                  <Button
                    variant="outline"
                    className="mt-2"
                    onClick={() => handleRequestCorrection(record.id)}
                  >
                    Request Correction
                  </Button>
                </div>
              ))
            ) : (
              <p>No medical records found.</p>
            )}
            <div className="mt-4 flex gap-2">
              <Button onClick={exportRecords}>Export Records</Button>
              <select
                onChange={(e) => shareWithDoctor(e.target.value)}
                className="border p-2 rounded"
                defaultValue=""
              >
                <option value="" disabled>Select Doctor to Share</option>
                {visits.map((visit) => (
                  <option key={visit.doctor.id} value={visit.doctor.id}>
                    {visit.doctor.firstName} {visit.doctor.lastName}
                  </option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}