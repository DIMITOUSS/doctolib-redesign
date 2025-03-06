"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon, MapPin, Clock, Search } from "lucide-react"

export function AppointmentBookingSystem() {
  const [date, setDate] = useState<Date>()
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = () => {
    setIsSearching(true)
    // Simulate API call
    setTimeout(() => {
      setSearchResults([
        {
          id: 1,
          name: "Dr. Amina Benali",
          specialty: "Cardiologist",
          location: "Algiers Medical Center",
          rating: 4.9,
          availableTimes: ["09:00", "11:30", "14:00"],
          image: "/placeholder.svg?height=100&width=100",
        },
        {
          id: 2,
          name: "Dr. Karim Mensouri",
          specialty: "Dermatologist",
          location: "Oran Health Clinic",
          rating: 4.7,
          availableTimes: ["10:00", "13:30", "16:00"],
          image: "/placeholder.svg?height=100&width=100",
        },
        {
          id: 3,
          name: "Dr. Leila Hadj",
          specialty: "Pediatrician",
          location: "Constantine Children's Hospital",
          rating: 4.8,
          availableTimes: ["08:30", "12:00", "15:30"],
          image: "/placeholder.svg?height=100&width=100",
        },
      ])
      setIsSearching(false)
    }, 1000)
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Find and Book Appointments</h2>
        <p className="text-muted-foreground">
          Search for doctors by specialty, location, or name to book your next appointment.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search Criteria</CardTitle>
          <CardDescription>Fill in the details to find available doctors</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="specialty">Specialty</Label>
              <Select>
                <SelectTrigger id="specialty">
                  <SelectValue placeholder="Select specialty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cardiology">Cardiology</SelectItem>
                  <SelectItem value="dermatology">Dermatology</SelectItem>
                  <SelectItem value="pediatrics">Pediatrics</SelectItem>
                  <SelectItem value="orthopedics">Orthopedics</SelectItem>
                  <SelectItem value="neurology">Neurology</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Select>
                <SelectTrigger id="location">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="algiers">Algiers</SelectItem>
                  <SelectItem value="oran">Oran</SelectItem>
                  <SelectItem value="constantine">Constantine</SelectItem>
                  <SelectItem value="annaba">Annaba</SelectItem>
                  <SelectItem value="blida">Blida</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="doctor-name">Doctor Name (Optional)</Label>
              <Input id="doctor-name" placeholder="Enter doctor's name" />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSearch} disabled={isSearching} className="w-full">
            {isSearching ? "Searching..." : "Search for Doctors"}
            <Search className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>

      {searchResults.length > 0 && (
        <div className="mt-8">
          <h3 className="text-2xl font-bold mb-4">Available Doctors</h3>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {searchResults.map((doctor) => (
              <Card key={doctor.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center space-x-4">
                    <img
                      src={doctor.image || "/placeholder.svg"}
                      alt={doctor.name}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                    <div>
                      <CardTitle className="text-lg">{doctor.name}</CardTitle>
                      <CardDescription>{doctor.specialty}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <MapPin className="mr-1 h-4 w-4" />
                    <span>{doctor.location}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground mb-4">
                    <span className="font-medium text-primary">★ {doctor.rating}</span>
                    <span className="ml-1">rating</span>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Available Times:</p>
                    <div className="flex flex-wrap gap-2">
                      {doctor.availableTimes.map((time) => (
                        <Button key={time} variant="outline" size="sm" className="flex items-center">
                          <Clock className="mr-1 h-3 w-3" />
                          {time}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Book Appointment</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

