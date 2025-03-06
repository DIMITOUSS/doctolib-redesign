import { AppointmentBookingSystem } from "@/components/patient/appointment-booking-system"
import { MedicalRecordsView } from "@/components/patient/medical-records-view"
import { MessagingSystem } from "@/components/patient/messaging-system"
import { MainNav } from "@/components/main-nav"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function PatientDashboard() {
  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <div className="container mx-auto py-6">
        <h1 className="text-4xl font-bold mb-6">Patient Dashboard</h1>

        <Tabs defaultValue="appointments" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="records">Medical Records</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
          </TabsList>

          <TabsContent value="appointments">
            <AppointmentBookingSystem />
          </TabsContent>

          <TabsContent value="records">
            <MedicalRecordsView />
          </TabsContent>

          <TabsContent value="messages">
            <MessagingSystem />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

