"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FilePlus, Pill, Activity, Calendar, Download, Eye, Share2 } from "lucide-react"

export function MedicalRecordsView() {
  const [activeTab, setActiveTab] = useState("visits")

  // Mock data
  const visits = [
    {
      id: 1,
      date: "2023-10-15",
      doctor: "Dr. Amina Benali",
      specialty: "Cardiology",
      reason: "Annual checkup",
      notes: "Patient is in good health. Blood pressure is normal.",
    },
    {
      id: 2,
      date: "2023-08-22",
      doctor: "Dr. Karim Mensouri",
      specialty: "Dermatology",
      reason: "Skin rash",
      notes: "Prescribed topical cream for eczema. Follow up in 2 weeks.",
    },
    {
      id: 3,
      date: "2023-06-10",
      doctor: "Dr. Leila Hadj",
      specialty: "General Medicine",
      reason: "Flu symptoms",
      notes: "Diagnosed with seasonal flu. Rest and fluids recommended.",
    },
  ]

  const medications = [
    {
      id: 1,
      name: "Amoxicillin",
      dosage: "500mg",
      frequency: "3 times daily",
      startDate: "2023-06-10",
      endDate: "2023-06-17",
      prescribedBy: "Dr. Leila Hadj",
    },
    {
      id: 2,
      name: "Hydrocortisone Cream",
      dosage: "Apply thin layer",
      frequency: "Twice daily",
      startDate: "2023-08-22",
      endDate: "2023-09-05",
      prescribedBy: "Dr. Karim Mensouri",
    },
    {
      id: 3,
      name: "Vitamin D",
      dosage: "1000 IU",
      frequency: "Once daily",
      startDate: "2023-10-15",
      endDate: "Ongoing",
      prescribedBy: "Dr. Amina Benali",
    },
  ]

  const tests = [
    {
      id: 1,
      name: "Complete Blood Count",
      date: "2023-10-15",
      orderedBy: "Dr. Amina Benali",
      results: "Normal",
      notes: "All values within normal range",
    },
    {
      id: 2,
      name: "Skin Biopsy",
      date: "2023-08-22",
      orderedBy: "Dr. Karim Mensouri",
      results: "Negative",
      notes: "No abnormal cells detected",
    },
    {
      id: 3,
      name: "Chest X-Ray",
      date: "2023-06-10",
      orderedBy: "Dr. Leila Hadj",
      results: "Normal",
      notes: "No signs of infection or abnormalities",
    },
  ]

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Medical Records</h2>
        <p className="text-muted-foreground">Securely view and manage your medical history</p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export Records
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="mr-2 h-4 w-4" />
            Share with Doctor
          </Button>
        </div>
        <Button variant="outline" size="sm">
          <FilePlus className="mr-2 h-4 w-4" />
          Upload Document
        </Button>
      </div>

      <Tabs defaultValue="visits" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="visits" className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            <span>Visits</span>
          </TabsTrigger>
          <TabsTrigger value="medications" className="flex items-center">
            <Pill className="mr-2 h-4 w-4" />
            <span>Medications</span>
          </TabsTrigger>
          <TabsTrigger value="tests" className="flex items-center">
            <Activity className="mr-2 h-4 w-4" />
            <span>Test Results</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="visits">
          <Card>
            <CardHeader>
              <CardTitle>Visit History</CardTitle>
              <CardDescription>A record of your past doctor visits and consultations</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Specialty</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visits.map((visit) => (
                    <TableRow key={visit.id}>
                      <TableCell>{visit.date}</TableCell>
                      <TableCell>{visit.doctor}</TableCell>
                      <TableCell>{visit.specialty}</TableCell>
                      <TableCell>{visit.reason}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="medications">
          <Card>
            <CardHeader>
              <CardTitle>Medications</CardTitle>
              <CardDescription>Current and past medications prescribed to you</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Medication</TableHead>
                    <TableHead>Dosage</TableHead>
                    <TableHead>Frequency</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Prescribed By</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {medications.map((medication) => (
                    <TableRow key={medication.id}>
                      <TableCell>{medication.name}</TableCell>
                      <TableCell>{medication.dosage}</TableCell>
                      <TableCell>{medication.frequency}</TableCell>
                      <TableCell>{medication.startDate}</TableCell>
                      <TableCell>{medication.endDate}</TableCell>
                      <TableCell>{medication.prescribedBy}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tests">
          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
              <CardDescription>Results from your medical tests and lab work</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Test Name</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Ordered By</TableHead>
                    <TableHead>Results</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tests.map((test) => (
                    <TableRow key={test.id}>
                      <TableCell>{test.name}</TableCell>
                      <TableCell>{test.date}</TableCell>
                      <TableCell>{test.orderedBy}</TableCell>
                      <TableCell>{test.results}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
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
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

