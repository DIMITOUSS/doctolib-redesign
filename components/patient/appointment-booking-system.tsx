"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ChevronDown, ChevronUp, Video, Check, ChevronLeft } from "lucide-react"
import { useAuthStore } from "@/stores/auth"
import { doctorsApi, appointmentApi } from "@/lib/api"
import { Doctor, PaginatedDoctorsResponse, Availability, UserProfile } from "@/types/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { AutocompleteInput } from "@/components/autocomplete-input"

interface AppointmentBookingSystemProps {
  patientId: string
}

export function AppointmentBookingSystem({ patientId }: AppointmentBookingSystemProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSpecialty, setSelectedSpecialty] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("")
  const [searchResults, setSearchResults] = useState<Doctor[]>([])
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null) // Changed to Doctor
  const [availability, setAvailability] = useState<Record<string, Availability[]>>({})
  const [selectedSlot, setSelectedSlot] = useState<string>("")
  const [expandedDay, setExpandedDay] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { token, role, clearAuth } = useAuthStore()
  const router = useRouter()

  const specialties = ["Cardiology", "Dermatology", "Neurology", "Pediatrics", "General Medicine"]
  const locations = ["Algiers", "Oran", "Constantine", "Annaba", "Blida"]

  useEffect(() => {
    if (!token || role !== "PATIENT") {
      clearAuth()
      router.push("/login")
      return
    }

    const fetchDoctors = async () => {
      try {
        setLoading(true)
        const response: PaginatedDoctorsResponse = await doctorsApi.search({
          name: searchQuery || undefined,
          specialty: selectedSpecialty || undefined,
          location: selectedLocation || undefined,
        })
        console.log("Fetched doctors:", response.doctors)
        setSearchResults(response.doctors)
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load doctors")
        console.error("Search doctors error:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchDoctors()
  }, [searchQuery, selectedSpecialty, selectedLocation, token, role, clearAuth, router])

  useEffect(() => {
    if (!selectedDoctor) return

    const fetchDoctorData = async () => {
      try {
        setLoading(true)
        // Skip getDoctorDetails, use selectedDoctor directly
        const slots = await doctorsApi.getAvailability(selectedDoctor.id)
        console.log("Fetched availability slots:", slots)

        if (!Array.isArray(slots) || slots.length === 0) {
          setError("No availability found for this doctor")
          setAvailability({})
          return
        }

        const groupedSlots = slots.reduce((acc: Record<string, Availability[]>, slot) => {
          const date = new Date(slot.startTime)
          const dayKey = date.toLocaleDateString("fr-FR", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })
          if (!acc[dayKey]) acc[dayKey] = []
          acc[dayKey].push(slot)
          return acc
        }, {})

        Object.keys(groupedSlots).forEach(day => {
          groupedSlots[day].sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
        })

        setAvailability(groupedSlots)
      } catch (error: any) {
        console.error("Fetch availability error:", error.response?.data || error.message)
        setError("Failed to load availability")
        toast({ title: "Error", description: "Failed to load availability.", variant: "destructive" })
      } finally {
        setLoading(false)
      }
    }

    fetchDoctorData()
  }, [selectedDoctor])

  const handleBookAppointment = async () => {
    if (!selectedSlot || !selectedDoctor || !patientId) {
      toast({
        title: "Error",
        description: "Please select a slot and ensure you’re logged in.",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)
      const appointment = await appointmentApi.book({
        doctorId: selectedDoctor.id,
        patientId,
        appointmentDate: selectedSlot,
        duration: 30,
        type: "Consultation",
      })

      toast({
        title: "Success",
        description: `Appointment booked for ${new Date(appointment.appointmentDate).toLocaleString()}`,
      })
      setSelectedSlot("")
      setSelectedDoctor(null)
      router.push("/patient/dashboard")
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to book appointment.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const toggleDay = (day: string) => {
    setExpandedDay(expandedDay === day ? null : day)
  }

  const selectSlot = (slot: string) => {
    setSelectedSlot(slot)
  }

  if (loading && !searchResults.length) return <div className="p-4">Loading...</div>

  return (
    <div className="container mx-auto py-6">
      {!selectedDoctor ? (
        <>
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Book an Appointment</h2>
            <p className="text-muted-foreground">Search for a doctor and choose an available time slot.</p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-destructive/10 text-destructive rounded">{error}</div>
          )}

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Find a Doctor</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
                <AutocompleteInput
                  value={searchQuery}
                  onChange={setSearchQuery}
                  field="name"
                  placeholder="Search by doctor name..."
                />
                <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Specialty" />
                  </SelectTrigger>
                  <SelectContent>
                    {specialties.map((specialty) => (
                      <SelectItem key={specialty} value={specialty}>{specialty}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location} value={location}>{location}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {searchResults.length > 0 && (
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-4">Search Results</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults.map((doctor) => (
                  <Card key={doctor.id}>
                    <CardContent className="p-6">
                      <div className="space-y-2">
                        <h3 className="font-bold">{doctor.firstName} {doctor.lastName}</h3>
                        <p className="text-sm text-muted-foreground">{doctor.specialty || "N/A"}</p>
                        <div className="flex items-center text-sm">
                          <MapPin className="mr-1 h-3 w-3 text-muted-foreground" />
                          <span>{doctor.city || "Unknown location"}</span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        className="mt-4"
                        onClick={() => setSelectedDoctor(doctor)}
                      >
                        Book Appointment
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
          <main className="flex-1 p-4 md:p-6 lg:p-8">
            <Button
              variant="ghost"
              className="mb-6 pl-0 text-gray-700 font-medium"
              onClick={() => setSelectedDoctor(null)}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Search
            </Button>

            <h1 className="text-xl font-bold mb-6 text-gray-800">Choisissez la date de consultation</h1>

            <div className="space-y-4">
              {Object.entries(availability)
                .sort(([dayA], [dayB]) => {
                  const earliestA = Math.min(...availability[dayA].map(slot => new Date(slot.startTime).getTime()))
                  const earliestB = Math.min(...availability[dayB].map(slot => new Date(slot.startTime).getTime()))
                  return earliestA - earliestB
                })
                .map(([day, slots]) => (
                  <Card key={day} className="overflow-hidden">
                    <div
                      className="p-4 border-b flex justify-between items-center cursor-pointer"
                      onClick={() => toggleDay(day)}
                    >
                      <h2 className="font-medium capitalize">{day}</h2>
                      {expandedDay === day ? (
                        <ChevronUp className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                    {expandedDay === day && (
                      <div className="p-4">
                        <div className="flex items-center mb-4">
                          <Video className="h-5 w-5 text-blue-500 mr-2" />
                          <span className="text-blue-500 font-medium">{slots.length} disponibilités</span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                          {slots.map((slot) => {
                            const time = new Date(slot.startTime).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                            const isSelected = selectedSlot === slot.startTime
                            return (
                              <Button
                                key={slot.id}
                                variant="outline"
                                className={`h-12 ${isSelected
                                  ? "bg-blue-100 text-blue-700 border-blue-200"
                                  : "bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-100"
                                  }`}
                                onClick={() => selectSlot(slot.startTime)}
                              >
                                {time}
                              </Button>
                            )
                          })}
                        </div>
                        {selectedSlot && (
                          <div className="mt-6 text-center">
                            <Button
                              onClick={handleBookAppointment}
                              disabled={loading}
                              className="bg-blue-500 text-white hover:bg-blue-600"
                            >
                              {loading ? "Processing..." : "Confirmer le rendez-vous"}
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </Card>
                ))}
              {Object.keys(availability).length === 0 && (
                <p className="text-gray-600">Aucune disponibilité pour ce médecin.</p>
              )}
            </div>
          </main>

          <aside className="w-full lg:w-96 flex-shrink-0 bg-blue-50 p-4 md:p-6 lg:p-8">
            <div className="flex items-center mb-6">
              <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
                {/* Add doctor image if available */}
              </div>
              <div>
                <h2 className="font-bold text-gray-800">
                  Dr. {selectedDoctor.firstName} {selectedDoctor.lastName}
                </h2>
                <p className="text-gray-600">{selectedDoctor.specialty || "Spécialité non spécifiée"}</p>
              </div>
            </div>

            <h3 className="text-lg font-bold mb-4 text-gray-800">Votre rendez-vous en détail</h3>

            <div className="space-y-4">
              <div className="flex">
                <Check className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-gray-700">{selectedDoctor.address || "Adresse non spécifiée"}</p>
              </div>
              <div className="flex">
                <Check className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-gray-700">Adulte - Consultation de médecine générale</p>
              </div>
              {selectedSlot && (
                <div className="flex">
                  <Check className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-700">
                    {new Date(selectedSlot).toLocaleString("fr-FR", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              )}
            </div>
          </aside>
        </div>
      )}
    </div>
  )
}