"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams, useSearchParams } from "next/navigation"
import Image from "next/image"
import { ChevronDown, ChevronLeft, ChevronUp, Video, Check } from "lucide-react"
import { useAuthStore } from "@/stores/auth"
import { doctorsApi, appointmentApi } from "@/lib/api"
import { UserProfile, Availability, Appointment } from "@/types/auth"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"

export default function DoctorProfilePage() {
    const [doctor, setDoctor] = useState<UserProfile | null>(null)
    const [availability, setAvailability] = useState<Record<string, Availability[]>>({})
    const [selectedSlot, setSelectedSlot] = useState<string>("")
    const [expandedDay, setExpandedDay] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const { token, userId, role, clearAuth } = useAuthStore()
    const router = useRouter()
    const params = useParams()
    const searchParams = useSearchParams()
    const doctorId = params.id as string
    const rescheduleAppointmentId = searchParams.get("reschedule")

    useEffect(() => {
        if (!token || role !== "PATIENT") {
            clearAuth()
            router.push("/login")
            return
        }

        const fetchData = async () => {
            try {
                setLoading(true)
                const profile = await doctorsApi.getDoctorDetails(doctorId)
                if (!profile) throw new Error("Doctor not found")
                setDoctor(profile)

                const slots = await doctorsApi.getAvailability(doctorId)
                console.log("Fetched availability slots:", slots)

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
                console.error("Failed to fetch data:", error.response?.data || error.message)
                toast({ title: "Error", description: "Failed to load doctor profile.", variant: "destructive" })
                router.push("/patient/dashboard")
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [token, userId, role, clearAuth, router, doctorId])


    const handleBookOrReschedule = async () => {
        if (!selectedSlot || !doctor || !userId) {
            toast({
                title: "Error",
                description: "Please select a slot and ensure you’re logged in.",
                variant: "destructive",
            })
            return
        }

        try {
            setLoading(true)

            if (rescheduleAppointmentId) {
                await appointmentApi.deleteAppointment(rescheduleAppointmentId)
                toast({
                    title: "Success",
                    description: "Old appointment cancelled.",
                })
            }

            const appointment = await appointmentApi.book({
                doctorId: doctor.id,
                patientId: userId,
                appointmentDate: selectedSlot,
                duration: 15,
                type: "Consultation",
            })

            toast({
                title: "Success",
                description: `New appointment booked for ${new Date(appointment.appointmentDate).toLocaleString()}`,
            })

            setSelectedSlot("")
            router.push("/patient/dashboard")
        } catch (error: any) {
            console.error("Failed to book/reschedule appointment:", error.response?.data || error.message)
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to book/reschedule appointment.",
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

    if (loading) return <div className="p-4">Loading...</div>
    if (!doctor) return <div className="p-4">Doctor not found.</div>

    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
            <main className="flex-1 p-4 md:p-6 lg:p-8">
                <Button
                    variant="ghost"
                    className="mb-6 pl-0 text-gray-700 font-medium"
                    onClick={() => router.push("/patient/dashboard")}
                >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Étape précédente
                </Button>

                <h1 className="text-xl font-bold mb-6 text-gray-800">
                    {rescheduleAppointmentId ? "Reschedule Appointment" : "Choisissez la date de consultation"}
                </h1>

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
                                                    onClick={handleBookOrReschedule}
                                                    disabled={loading}
                                                    className="bg-blue-500 text-white hover:bg-blue-600"
                                                >
                                                    {loading ? "Processing..." : rescheduleAppointmentId ? "Confirm Reschedule" : "Confirmer le rendez-vous"}
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
                            Dr. {doctor.firstName} {doctor.lastName}
                        </h2>
                        <p className="text-gray-600">{doctor.specialty || "Spécialité non spécifiée"}</p>
                    </div>
                </div>

                <h3 className="text-lg font-bold mb-4 text-gray-800">Votre rendez-vous en détail</h3>
                <h2 className="font-bold text-gray-800">
                    Dr. {doctor.firstName} {doctor.lastName}
                </h2>
                <div className="space-y-4">
                    <div className="flex">
                        <Check className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0 mt-0.5" />
                        <p className="text-gray-700">{doctor.lastName || "Adresse non spécifiée"}</p>
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
                    {rescheduleAppointmentId && (
                        <div className="flex">
                            <Check className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0 mt-0.5" />
                            <p className="text-gray-700">Rescheduling appointment ID: {rescheduleAppointmentId}</p>
                        </div>
                    )}
                </div>
            </aside>
        </div>
    )
}