"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import {
  Video,
  Mic,
  MicOff,
  VideoOff,
  Phone,
  MessageSquare,
  Share2,
  Settings,
  CalendarIcon,
  Clock,
  Users,
} from "lucide-react"

export function VideoConsultation() {
  const [activeTab, setActiveTab] = useState("upcoming")
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [isInCall, setIsInCall] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)

  const upcomingConsultations = [
    {
      id: 1,
      patientName: "Ahmed Bouazizi",
      date: "2023-11-15",
      time: "10:00 AM",
      duration: "30 min",
      reason: "Follow-up",
      status: "confirmed",
    },
    {
      id: 2,
      patientName: "Fatima Zahra",
      date: "2023-11-16",
      time: "02:30 PM",
      duration: "45 min",
      reason: "Consultation",
      status: "confirmed",
    },
    {
      id: 3,
      patientName: "Omar Kaddouri",
      date: "2023-11-18",
      time: "11:15 AM",
      duration: "30 min",
      reason: "Review Test Results",
      status: "pending",
    },
  ]

  const pastConsultations = [
    {
      id: 4,
      patientName: "Leila Benali",
      date: "2023-11-05",
      time: "09:30 AM",
      duration: "45 min",
      reason: "Initial Consultation",
      status: "completed",
    },
    {
      id: 5,
      patientName: "Karim Mensouri",
      date: "2023-10-28",
      time: "03:00 PM",
      duration: "30 min",
      reason: "Follow-up",
      status: "completed",
    },
  ]

  const startCall = () => {
    setIsInCall(true)
  }

  const endCall = () => {
    setIsInCall(false)
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Telemedicine</h2>
        <p className="text-muted-foreground">Conduct virtual consultations with your patients</p>
      </div>

      {isInCall ? (
        <div className="space-y-6">
          <Card>
            <CardContent className="p-0">
              <div className="relative">
                <div className="aspect-video bg-muted rounded-t-lg overflow-hidden">
                  <div className="absolute top-4 right-4 z-10">
                    <div className="bg-background/80 backdrop-blur-sm rounded-lg p-2 w-48 h-36 flex items-center justify-center">
                      <Video className="h-12 w-12 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="h-full w-full flex items-center justify-center">
                    <Users className="h-24 w-24 text-muted-foreground opacity-50" />
                  </div>
                </div>
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-12 w-12 rounded-full bg-background/80 backdrop-blur-sm"
                      onClick={() => setIsMuted(!isMuted)}
                    >
                      {isMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
                    </Button>
                    <Button variant="destructive" size="icon" className="h-14 w-14 rounded-full" onClick={endCall}>
                      <Phone className="h-6 w-6 rotate-135" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-12 w-12 rounded-full bg-background/80 backdrop-blur-sm"
                      onClick={() => setIsVideoOff(!isVideoOff)}
                    >
                      {isVideoOff ? <VideoOff className="h-6 w-6" /> : <Video className="h-6 w-6" />}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between p-4">
              <div>
                <h3 className="font-medium">Ahmed Bouazizi</h3>
                <p className="text-sm text-muted-foreground">Follow-up Consultation</p>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="icon">
                  <MessageSquare className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      ) : (
        <Tabs defaultValue={activeTab} className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="upcoming">Upcoming Consultations</TabsTrigger>
            <TabsTrigger value="past">Past Consultations</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle>Calendar</CardTitle>
                  <CardDescription>Select a date to view consultations</CardDescription>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    className="rounded-md border"
                  />
                </CardContent>
                <CardFooter>
                  <p className="text-sm text-muted-foreground">{format(selectedDate, "MMMM d, yyyy")}</p>
                </CardFooter>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Upcoming Consultations</CardTitle>
                  <CardDescription>Your scheduled telemedicine appointments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingConsultations.length > 0 ? (
                      upcomingConsultations.map((consultation) => (
                        <div
                          key={consultation.id}
                          className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg border"
                        >
                          <div className="flex items-center space-x-4 mb-4 md:mb-0">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src="/placeholder.svg" alt={consultation.patientName} />
                              <AvatarFallback>
                                {consultation.patientName
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-medium">{consultation.patientName}</h4>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <CalendarIcon className="mr-1 h-3 w-3" />
                                <span>{consultation.date}</span>
                                <span className="mx-1">•</span>
                                <Clock className="mr-1 h-3 w-3" />
                                <span>{consultation.time}</span>
                                <span className="mx-1">•</span>
                                <span>{consultation.duration}</span>
                              </div>
                              <p className="text-sm">{consultation.reason}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant={consultation.status === "confirmed" ? "default" : "secondary"}>
                              {consultation.status}
                            </Badge>
                            <Button onClick={startCall}>
                              <Video className="mr-2 h-4 w-4" />
                              Start Call
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <CalendarIcon className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                        <h3 className="mt-4 text-lg font-medium">No upcoming consultations</h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                          You don't have any telemedicine appointments scheduled.
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="past">
            <Card>
              <CardHeader>
                <CardTitle>Past Consultations</CardTitle>
                <CardDescription>Review your previous telemedicine appointments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pastConsultations.map((consultation) => (
                    <div
                      key={consultation.id}
                      className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg border"
                    >
                      <div className="flex items-center space-x-4 mb-4 md:mb-0">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src="/placeholder.svg" alt={consultation.patientName} />
                          <AvatarFallback>
                            {consultation.patientName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{consultation.patientName}</h4>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <CalendarIcon className="mr-1 h-3 w-3" />
                            <span>{consultation.date}</span>
                            <span className="mx-1">•</span>
                            <Clock className="mr-1 h-3 w-3" />
                            <span>{consultation.time}</span>
                            <span className="mx-1">•</span>
                            <span>{consultation.duration}</span>
                          </div>
                          <p className="text-sm">{consultation.reason}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">{consultation.status}</Badge>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline">View Summary</Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Consultation Summary</DialogTitle>
                              <DialogDescription>
                                {consultation.patientName} - {consultation.date}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-medium">Notes</h4>
                                <p className="text-sm text-muted-foreground">
                                  Patient reported improvement in symptoms. Discussed medication adjustments and
                                  lifestyle changes.
                                </p>
                              </div>
                              <div>
                                <h4 className="font-medium">Prescriptions</h4>
                                <ul className="text-sm text-muted-foreground list-disc pl-5">
                                  <li>Medication A - 10mg daily</li>
                                  <li>Medication B - 5mg twice daily</li>
                                </ul>
                              </div>
                              <div>
                                <h4 className="font-medium">Follow-up</h4>
                                <p className="text-sm text-muted-foreground">
                                  Scheduled for 2 weeks from consultation date
                                </p>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button>Download Report</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}

