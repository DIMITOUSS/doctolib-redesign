"use client";

import { useState, useEffect } from "react";
import { prescriptionApi, protectedApi } from "@/lib/api";
import { Prescription, UserProfile, Medication } from "@/types/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { jsPDF } from "jspdf";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RxCross2, RxPencil2, RxCheck, RxDownload, RxPlus } from "react-icons/rx";
import { cn } from "@/lib/utils";

export function PrescriptionSystem({ doctorId }: { doctorId: string }) {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [doctorProfile, setDoctorProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Prescription>>({
    medications: [{ name: '', dosage: '', frequency: '', duration: '', quantity: '' }]
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [prescriptionsData, profile] = await Promise.all([
          prescriptionApi.getByDoctor(),
          protectedApi.getProfile(),
        ]);
        setPrescriptions(prescriptionsData);
        setDoctorProfile(profile);
      } catch (err) {
        setError("Failed to load prescriptions");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [doctorId]);

  const handleEdit = (prescription: Prescription) => {
    setEditingId(prescription.id);
    setFormData({
      ...prescription,
      medications: prescription.medications?.length ? prescription.medications : [{ name: '', dosage: '', frequency: '', duration: '', quantity: '' }]
    });
  };

  const handleMedicationChange = (index: number, field: keyof Medication, value: string) => {
    const newMedications = [...(formData.medications || [])];
    newMedications[index] = { ...newMedications[index], [field]: value };
    setFormData({ ...formData, medications: newMedications });
  };

  const addMedication = () => {
    setFormData({
      ...formData,
      medications: [...(formData.medications || []), { name: '', dosage: '', frequency: '', duration: '', quantity: '' }]
    });
  };

  const removeMedication = (index: number) => {
    const newMedications = [...(formData.medications || [])];
    newMedications.splice(index, 1);
    setFormData({ ...formData, medications: newMedications });
  };

  const handleSave = async () => {
    if (!editingId) return;
    try {
      const updated = await prescriptionApi.update(editingId, formData);
      setPrescriptions(prev => prev.map(p => p.id === editingId ? updated : p));
      setEditingId(null);
    } catch (err) {
      setError("Failed to save prescription");
    }
  };

  const handleFinalize = async (id: string) => {
    try {
      const finalized = await prescriptionApi.finalize(id, "mock-signature-base64");
      setPrescriptions(prev => prev.map(p => p.id === id ? finalized : p));
    } catch (err) {
      setError("Failed to finalize prescription");
    }
  };

  const handleExportPDF = (prescription: Prescription) => {
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();

    // Set global font styles
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    // Clinic Header with improved styling
    doc.setFillColor(23, 92, 156);
    doc.rect(0, 0, pageWidth, 25, 'F');
    doc.setFontSize(18);
    doc.setTextColor(255, 255, 255);
    doc.text("HEALTHCARE CLINIC", pageWidth / 2, 15, { align: "center" });
    doc.setFontSize(10);
    doc.text(`${doctorProfile?.street} • ${doctorProfile?.city} • ${doctorProfile?.phone}`, pageWidth / 2, 22, { align: "center" });

    // Doctor Information Section
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.text(`Dr. ${doctorProfile?.firstName} ${doctorProfile?.lastName}`, 20, 40);
    doc.setFontSize(10);
    doc.text(`Specialty: ${doctorProfile?.specialty}`, 20, 45);
    doc.text(`License #: ${doctorProfile?.licenseNumber}`, 20, 50);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, pageWidth - 20, 50, { align: "right" });

    // Patient Information Section
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 55, pageWidth - 20, 55);
    doc.setFontSize(12);
    doc.text(`Patient: ${prescription.patient.firstName} ${prescription.patient.lastName}`, 20, 65);
    doc.text(`DOB: ${new Date(prescription.patient.birthDate).toLocaleDateString()}`, 20, 70);
    doc.text(`Reference #: ${prescription.referenceNumber}`, pageWidth - 20, 70, { align: "right" });

    // Medications Table
    let yPosition = 85;
    doc.setFontSize(12);
    doc.setTextColor(23, 92, 156);
    doc.text("Prescribed Medications", 20, yPosition);
    yPosition += 8;

    // Table Headers
    doc.setFillColor(245, 245, 245);
    doc.rect(20, yPosition, pageWidth - 40, 8, 'F');
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text("Medication", 22, yPosition + 6);
    doc.text("Dosage", 80, yPosition + 6);
    doc.text("Frequency", 120, yPosition + 6);
    doc.text("Duration", 160, yPosition + 6);
    doc.text('Quantity', 180, yPosition + 6);
    yPosition += 12;

    // Medication Rows
    prescription.medications?.forEach((med, index) => {
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text(`${index + 1}. ${med.name.toUpperCase()}`, 22, yPosition);
      doc.text(med.dosage, 80, yPosition);
      doc.text(med.frequency, 120, yPosition);
      doc.text(med.duration, 160, yPosition);
      doc.text(med.quantity, 180, yPosition);

      yPosition += 8;

      // Add spacing between medications
      if (index < prescription.medications.length - 1) {
        doc.setDrawColor(220, 220, 220);
        doc.line(20, yPosition + 2, pageWidth - 20, yPosition + 2);
        yPosition += 6;
      }
    });

    // Signature Section
    yPosition = 250;
    doc.setFontSize(10);
    doc.text(" Signature: ___________________________________", 20, yPosition);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, pageWidth - 70, yPosition);


    doc.save(`Prescription_${prescription.referenceNumber}.pdf`);
  };


  if (loading) return <div className="text-center py-8">Loading prescriptions...</div>;
  if (error) return <div className="text-center text-red-600 py-8">{error}</div>;

  return (
    <div className="bg-slate-50 min-h-screen p-6">
      <Card className="rounded-xl shadow-lg overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-900 to-blue-700 text-white">
          <CardTitle className="text-2xl flex items-center gap-3">
            <RxPencil2 className="w-6 h-6" />
            Electronic Prescription System
            <Badge variant="secondary" className="ml-2">
              {prescriptions.length} Active
            </Badge>
          </CardTitle>
        </CardHeader>

        <ScrollArea className="h-[calc(100vh-180px)]">
          <CardContent className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {prescriptions.map(prescription => (
              <div key={prescription.id} className="relative bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-900 hover:shadow-lg transition-all">
                <Badge className={cn(
                  "absolute -top-3 right-4",
                  prescription.status === 'FINALIZED' ? 'bg-green-600' : 'bg-yellow-600'
                )}>
                  {prescription.status}
                </Badge>

                <div className="space-y-4">
                  <div className="border-b pb-4">
                    <h3 className="text-lg font-semibold text-blue-900 flex items-center gap-2">
                      <span className="bg-blue-100 px-2 py-1 rounded">{prescription.referenceNumber}</span>
                      {prescription.patient.firstName} {prescription.patient.lastName}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      DOB: {new Date(prescription.patient.birthDate).toLocaleDateString()}
                    </p>
                  </div>

                  {editingId === prescription.id ? (
                    <div className="space-y-6">
                      <div className="space-y-4">
                        {(formData.medications || []).map((med, index) => (
                          <div key={index} className="bg-blue-50 p-4 rounded-lg relative">
                            {index > 0 && (
                              <button
                                onClick={() => removeMedication(index)}
                                className="absolute top-2 right-2 text-red-600 hover:text-red-700"
                              >
                                <RxCross2 className="w-4 h-4" />
                              </button>
                            )}
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>Medication Name</Label>
                                <Input
                                  value={med.name}
                                  onChange={(e) => handleMedicationChange(index, 'name', e.target.value)}
                                  placeholder="Enter medication name"
                                />
                              </div>
                              <div>
                                <Label>Dosage</Label>
                                <Input
                                  value={med.dosage}
                                  onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)}
                                  placeholder="e.g., 500mg"
                                />
                              </div>
                              <div>
                                <Label>Frequency</Label>
                                <Input
                                  value={med.frequency}
                                  onChange={(e) => handleMedicationChange(index, 'frequency', e.target.value)}
                                  placeholder="e.g., Once daily"
                                />
                              </div>
                              <div>
                                <Label>Duration</Label>
                                <Input
                                  value={med.duration}
                                  onChange={(e) => handleMedicationChange(index, 'duration', e.target.value)}
                                  placeholder="e.g., 7 days"
                                />
                              </div>
                            </div>
                            <div>
                              <Label>Quantité</Label>
                              <Input
                                value={med.quantity}
                                onChange={(e) => handleMedicationChange(index, 'quantity', e.target.value)}
                                placeholder="e.g., 1ps"
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between items-center">
                        <Button onClick={addMedication} variant="outline" className="border-blue-900 text-blue-900">
                          <RxPlus className="mr-2" /> Add Medication
                        </Button>
                        <div className="space-x-2">
                          <Button onClick={handleSave} className="bg-blue-900 hover:bg-blue-800">
                            <RxCheck className="mr-2" /> Save Changes
                          </Button>
                          <Button variant="outline" onClick={() => setEditingId(null)}>
                            <RxCross2 className="mr-2" /> Cancel
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-4">
                        {prescription.medications?.map((med, index) => (
                          <div key={index} className="bg-blue-50 p-4 rounded-lg">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="font-medium">Medication:</span>
                                <p className="text-blue-900 font-semibold">{med.name || "N/A"}</p>
                              </div>
                              <div>
                                <span className="font-medium">Dosage:</span>
                                <p>{med.dosage}</p>
                              </div>
                              <div>
                                <span className="font-medium">Frequency:</span>
                                <p>{med.frequency}</p>
                              </div>
                              <div>
                                <span className="font-medium">Duration:</span>
                                <p>{med.duration}</p>
                              </div>
                              <div>
                                <span className="font-medium">Quantité:</span>
                                <p>{med.quantity}</p>
                              </div>

                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-end gap-3 border-t pt-4">
                        <Button
                          onClick={() => handleEdit(prescription)}
                          variant="outline"
                          className="border-blue-900 text-blue-900 hover:bg-blue-50"
                        >
                          <RxPencil2 className="mr-2" /> Edit
                        </Button>
                        <Button
                          onClick={() => handleFinalize(prescription.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Finalize Prescription
                        </Button>
                        <Button
                          onClick={() => handleExportPDF(prescription)}
                          variant="ghost"
                          className="text-blue-900 hover:bg-blue-50"
                        >
                          <RxDownload className="mr-2" /> PDF
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </ScrollArea>
      </Card>
    </div>
  );
}