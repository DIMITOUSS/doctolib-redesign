"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Plus, Trash2, FileText, Send, Download, Printer } from "lucide-react"

export function PrescriptionSystem() {
  const [selectedPatient, setSelectedPatient] = useState<string>("")
  const [medications, setMedications] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  const [prescriptions, setPrescriptions] = useState([
    {
      id: 1,
      patientName: "Ahmed Bouazizi",
      date: "2023-11-05",
      medications: [
        { name: "Amoxicillin", dosage: "500mg", frequency: "3 times daily", duration: "7 days" },
        { name: "Ibuprofen", dosage: "400mg", frequency: "As needed", duration: "5 days" },
      ],
      status: "Active",
    },
    {
      id: 2,
      patientName: "Fatima Zahra",
      date: "2023-10-22",
      medications: [
        { name: "Metformin", dosage: "1000mg", frequency: "Twice daily", duration: "30 days" },
        { name: "Atorvastatin", dosage: "20mg", frequency: "Once daily", duration: "30 days" },
      ],
      status: "Active",
    },
    {
      id: 3,
      patientName: "Omar Kaddouri",
      date: "2023-09-15",
      medications: [{ name: "Salbutamol Inhaler", dosage: "2 puffs", frequency: "As needed", duration: "30 days" }],
      status: "Expired",
    },
  ])

  const patients = [
    { id: 1, name: "Ahmed Bouazizi" },
    { id: 2, name: "Fatima Zahra" },
    { id: 3, name: "Omar Kaddouri" },
    { id: 4, name: "Leila Benali" },
    { id: 5, name: "Karim Mensouri" },
  ]

  const medicationsList = [
    { id: 1, name: "Amoxicillin", category: "Antibiotic" },
    { id: 2, name: "Ibuprofen", category: "Pain Reliever" },
    { id: 3, name: "Metformin", category: "Antidiabetic" },
    { id: 4, name: "Atorvastatin", category: "Cholesterol Lowering" },
    { id: 5, name: "Salbutamol Inhaler", category: "Bronchodilator" },
    { id: 6, name: "Omeprazole", category: "Proton Pump Inhibitor" },
    { id: 7, name: "Paracetamol", category: "Pain Reliever" },
    { id: 8, name: "Amlodipine", category: "Antihypertensive" },
  ]

  const addMedication = (medication: any) => {
    setMedications([...medications, { ...medication, dosage: "", frequency: "", duration: "" }])
  }

  const updateMedication = (index: number, field: string, value: string) => {
    const updatedMedications = [...medications]
    updatedMedications[index] = { ...updatedMedications[index], [field]: value }
    setMedications(updatedMedications)
  }

  const removeMedication = (index: number) => {
    const updatedMedications = [...medications]
    updatedMedications.splice(index, 1)
    setMedications(updatedMedications)
  }

  const filteredPrescriptions = prescriptions.filter((prescription) =>
    prescription.patientName.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Prescription System</h2>
        <p className="text-muted-foreground">Create and manage prescriptions for your patients</p>
      </div>

      <Tabs defaultValue="create" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="create">Create Prescription</TabsTrigger>
          <TabsTrigger value="history">Prescription History</TabsTrigger>
        </TabsList>

        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>New Prescription</CardTitle>
              <CardDescription>Create a new prescription for a patient</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="patient">Patient</Label>
                <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                  <SelectTrigger id="patient">
                    <SelectValue placeholder="Select patient" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id.toString()}>
                        {patient.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Medications</Label>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Medication
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Medication</DialogTitle>
                        <DialogDescription>Search and select a medication to add to the prescription</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="relative">
                          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input placeholder="Search medications..." className="pl-8" />
                        </div>
                        <div className="max-h-[200px] overflow-y-auto space-y-2">
                          {medicationsList.map((medication) => (
                            <div
                              key={medication.id}
                              className="flex items-center justify-between p-2 rounded-md hover:bg-muted cursor-pointer"
                              onClick={() => addMedication(medication)}
                            >
                              <div>
                                <p className="font-medium">{medication.name}</p>
                                <p className="text-sm text-muted-foreground">{medication.category}</p>
                              </div>
                              <Button variant="ghost" size="sm">
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {medications.length > 0 ? (
                  <div className="border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Medication</TableHead>
                          <TableHead>Dosage</TableHead>
                          <TableHead>Frequency</TableHead>
                          <TableHead>Duration</TableHead>
                          <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {medications.map((medication, index) => (
                          <TableRow key={index}>
                            <TableCell>{medication.name}</TableCell>
                            <TableCell>
                              <Input
                                placeholder="e.g., 500mg"
                                value={medication.dosage}
                                onChange={(e) => updateMedication(index, "dosage", e.target.value)}
                                className="h-8"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                placeholder="e.g., Twice daily"
                                value={medication.frequency}
                                onChange={(e) => updateMedication(index, "frequency", e.target.value)}
                                className="h-8"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                placeholder="e.g., 7 days"
                                value={medication.duration}
                                onChange={(e) => updateMedication(index, "duration", e.target.value)}
                                className="h-8"
                              />
                            </TableCell>
                            <TableCell>
                              <Button variant="ghost" size="icon" onClick={() => removeMedication(index)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="flex items-center justify-center border rounded-md p-8">
                    <div className="text-center">
                      <FileText className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                      <h3 className="mt-4 text-lg font-medium">No medications added</h3>
                      <p className="mt-2 text-sm text-muted-foreground">Add medications to create a prescription</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any additional instructions or notes..."
                  className="min-h-[100px]"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Save as Draft</Button>
              <div className="flex space-x-2">
                <Button variant="outline">
                  <Printer className="mr-2 h-4 w-4" />
                  Print
                </Button>
                <Button>
                  <Send className="mr-2 h-4 w-4" />
                  Issue Prescription
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Prescription History</CardTitle>
              <CardDescription>View and manage all prescriptions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search prescriptions..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Medications</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPrescriptions.map((prescription) => (
                      <TableRow key={prescription.id}>
                        <TableCell className="font-medium">{prescription.patientName}</TableCell>
                        <TableCell>{prescription.date}</TableCell>
                        <TableCell>
                          <div className="flex flex-col space-y-1">
                            {prescription.medications.map((med, index) => (
                              <div key={index} className="text-xs">
                                {med.name} {med.dosage}, {med.frequency}
                              </div>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={prescription.status === "Active" ? "default" : "secondary"}>
                            {prescription.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button variant="ghost" size="icon">
                              <Printer className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

