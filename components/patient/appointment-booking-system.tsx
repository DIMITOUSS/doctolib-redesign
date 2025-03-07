"use client"

import { useState, useEffect } from "react"
import FullCalendar from "@fullcalendar/react"
import timeGridPlugin from "@fullcalendar/timegrid"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin } from "lucide-react"
import { appointmentApi, doctorsApi } from "@/lib/api"
import { Availability, Doctor, PaginatedDoctorsResponse } from "@/types/auth"
import { AutocompleteInput } from "@/components/autocomplete-input"

interface AppointmentBookingSystemProps {
  patientId: string
}

export function AppointmentBookingSystem({ patientId }: AppointmentBookingSystemProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSpecialty, setSelectedSpecialty] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("")
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [searchResults, setSearchResults] = useState<Doctor[]>([])
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null)
  const [availableSlots, setAvailableSlots] = useState<Availability[]>([])
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const specialties = ["Cardiology", "Dermatology", "Neurology", "Pediatrics", "General Medicine"]
  const locations = ["Algiers", "Oran", "Constantine", "Annaba", "Blida"]

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true)
        const response: PaginatedDoctorsResponse = await doctorsApi.search({})
        console.log("Initial doctors fetched:", response)
        setDoctors(response.doctors)
      } catch (err: any) {
        console.error("Fetch doctors error:", err)
        setError(err?.response?.data?.message || "Failed to load doctors")
      } finally {
        setLoading(false)
      }
    }
    fetchDoctors()
  }, [])

  const handleSearch = async () => {
    try {
      setLoading(true)
      setError(null)
      const response: PaginatedDoctorsResponse = await doctorsApi.search({
        name: searchQuery || undefined,
        specialty: selectedSpecialty || undefined,
        location: selectedLocation || undefined,
      })
      console.log("Search results:", response)
      setSearchResults(response.doctors)
    } catch (err: any) {
      console.error("Search error:", err)
      setError(err?.response?.data?.message || "Failed to search doctors")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!selectedDoctorId) return
    const fetchSlots = async () => {
      try {
        setLoading(true)
        const slots = await doctorsApi.getAvailability(selectedDoctorId)
        setAvailableSlots(slots.filter((slot) => slot.isAvailable))
        setSelectedSlotId(null)
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load slots")
      } finally {
        setLoading(false)
      }
    }
    fetchSlots()
  }, [selectedDoctorId])

  const handleEventClick = (clickInfo: any) => {
    setSelectedSlotId(clickInfo.event.id)
    setError(null)
  }
  const handleBookAppointment = async () => {
    if (!selectedSlotId || !selectedDoctorId) {
      setError("Please select a doctor and a slot");
      return;
    }

    try {
      setLoading(true);
      const slot = availableSlots.find((s) => s.id === selectedSlotId);
      if (!slot) throw new Error("Slot not found");

      const appointmentData = {
        doctorId: selectedDoctorId,
        patientId,
        appointmentDate: slot.startTime, // ISO string like "2025-03-06T07:00:18.005Z"
        duration: 30, // Default duration in minutes
      };

      console.log("Appointment data being sent:", appointmentData);

      const newAppointment = await appointmentApi.book(appointmentData);
      setAvailableSlots(availableSlots.filter((s) => s.id !== selectedSlotId));
      setSelectedSlotId(null);
      setError(null);
      setSuccessMessage(`Appointment booked successfully! ID: ${newAppointment.id}`);
    } catch (err: any) {
      console.error("Booking error:", err?.response?.data);
      setError(err?.response?.data?.message || "Failed to book appointment");
    } finally {
      setLoading(false);
    }
  };



  const events = availableSlots.map((slot) => ({
    id: slot.id,
    title: "Available",
    start: slot.startTime,
    end: slot.endTime,
    backgroundColor: "#e0f7fa",
    borderColor: "#00acc1",
  }))

  if (loading && !doctors.length) return <div className="p-4">Loading doctors...</div>

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Book an Appointment</h2>
        <p className="text-muted-foreground">Search for a doctor and choose an available time slot.</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-destructive/10 text-destructive rounded">
          {error}
        </div>
      )}
      {successMessage && (
        <div className="mb-4 p-4 bg-success/10 text-success rounded">
          {successMessage}
        </div>
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
                  <SelectItem key={specialty} value={specialty}>
                    {specialty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleSearch} disabled={loading}>
              {loading ? "Searching..." : "Search"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {searchResults.length === 0 && !loading && (
        <div className="p-4">No doctors found for your search criteria.</div>
      )}

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
                    onClick={() => setSelectedDoctorId(doctor.id)}
                  >
                    Select Doctor
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {selectedDoctorId && (
        <Card>
          <CardHeader>
            <CardTitle>Available Slots for {doctors.find((d) => d.id === selectedDoctorId)?.firstName} {doctors.find((d) => d.id === selectedDoctorId)?.lastName}</CardTitle>
            <CardDescription>Click a slot to book</CardDescription>
          </CardHeader>
          <CardContent>
            <FullCalendar
              plugins={[timeGridPlugin]}
              initialView="timeGridWeek"
              slotDuration="00:15:00"
              slotMinTime="08:00:00"
              slotMaxTime="18:00:00"
              events={events}
              eventClick={handleEventClick}
              height="auto"
              headerToolbar={{
                left: "prev,next",
                center: "title",
                right: "timeGridWeek,timeGridDay",
              }}
            />
            {selectedSlotId && (
              <div className="mt-4 space-y-4">

                <Button onClick={handleBookAppointment} disabled={loading}>
                  {loading ? "Booking..." : "Book Appointment"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

