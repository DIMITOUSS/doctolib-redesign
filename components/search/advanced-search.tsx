"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { Search, Filter, MapPin, X, CalendarIcon, Clock } from "lucide-react"

export function AdvancedSearch() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSpecialty, setSelectedSpecialty] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedLocation, setSelectedLocation] = useState("")
  const [maxDistance, setMaxDistance] = useState([10])
  const [availabilityFilter, setAvailabilityFilter] = useState(false)
  const [telehealthFilter, setTelehealthFilter] = useState(false)
  const [insuranceFilter, setInsuranceFilter] = useState(false)
  const [genderFilter, setGenderFilter] = useState("")
  const [languageFilter, setLanguageFilter] = useState("")
  const [activeFilters, setActiveFilters] = useState<string[]>([])

  const specialties = [
    "Cardiology",
    "Dermatology",
    "Neurology",
    "Pediatrics",
    "General Medicine",
    "Orthopedics",
    "Ophthalmology",
    "Gynecology",
    "Dentistry",
    "Psychiatry",
  ]

  const locations = ["Algiers", "Oran", "Constantine", "Annaba", "Blida"]

  const languages = ["Arabic", "French", "English", "Berber", "Spanish"]

  const handleAddFilter = (filterName: string, value: string) => {
    if (!activeFilters.includes(`${filterName}: ${value}`)) {
      setActiveFilters([...activeFilters, `${filterName}: ${value}`])
    }
  }

  const handleRemoveFilter = (filter: string) => {
    setActiveFilters(activeFilters.filter((f) => f !== filter))
  }

  const clearAllFilters = () => {
    setSelectedSpecialty("")
    setSelectedDate(undefined)
    setSelectedLocation("")
    setMaxDistance([10])
    setAvailabilityFilter(false)
    setTelehealthFilter(false)
    setInsuranceFilter(false)
    setGenderFilter("")
    setLanguageFilter("")
    setActiveFilters([])
  }

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Find the Right Doctor</CardTitle>
          <CardDescription>Use our advanced search to find the perfect healthcare provider</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by doctor name, specialty, or condition..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex space-x-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">
                    <Filter className="mr-2 h-4 w-4" />
                    Filters
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-4" align="end">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium">Specialty</h4>
                      <Select
                        value={selectedSpecialty}
                        onValueChange={(value) => {
                          setSelectedSpecialty(value)
                          handleAddFilter("Specialty", value)
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select specialty" />
                        </SelectTrigger>
                        <SelectContent>
                          {specialties.map((specialty) => (
                            <SelectItem key={specialty} value={specialty}>
                              {specialty}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium">Date</h4>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={(date) => {
                              setSelectedDate(date)
                              if (date) {
                                handleAddFilter("Date", format(date, "PPP"))
                              }
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium">Location</h4>
                      <Select
                        value={selectedLocation}
                        onValueChange={(value) => {
                          setSelectedLocation(value)
                          handleAddFilter("Location", value)
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                        <SelectContent>
                          {locations.map((location) => (
                            <SelectItem key={location} value={location}>
                              {location}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Distance</h4>
                        <span className="text-sm text-muted-foreground">{maxDistance[0]} km</span>
                      </div>
                      <Slider
                        defaultValue={[10]}
                        max={50}
                        step={1}
                        value={maxDistance}
                        onValueChange={(value) => {
                          setMaxDistance(value)
                          handleAddFilter("Max Distance", `${value[0]} km`)
                        }}
                      />
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium">Availability</h4>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="available-today"
                          checked={availabilityFilter}
                          onCheckedChange={(checked) => {
                            setAvailabilityFilter(!!checked)
                            if (checked) {
                              handleAddFilter("Availability", "Today")
                            } else {
                              handleRemoveFilter("Availability: Today")
                            }
                          }}
                        />
                        <Label htmlFor="available-today">Available today</Label>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium">Consultation Type</h4>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="telehealth"
                          checked={telehealthFilter}
                          onCheckedChange={(checked) => {
                            setTelehealthFilter(!!checked)
                            if (checked) {
                              handleAddFilter("Consultation", "Telehealth")
                            } else {
                              handleRemoveFilter("Consultation: Telehealth")
                            }
                          }}
                        />
                        <Label htmlFor="telehealth">Telehealth available</Label>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium">Insurance</h4>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="accepts-insurance"
                          checked={insuranceFilter}
                          onCheckedChange={(checked) => {
                            setInsuranceFilter(!!checked)
                            if (checked) {
                              handleAddFilter("Insurance", "Accepted")
                            } else {
                              handleRemoveFilter("Insurance: Accepted")
                            }
                          }}
                        />
                        <Label htmlFor="accepts-insurance">Accepts insurance</Label>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium">Doctor Gender</h4>
                      <Select
                        value={genderFilter}
                        onValueChange={(value) => {
                          setGenderFilter(value)
                          handleAddFilter("Gender", value)
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Any gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium">Languages</h4>
                      <Select
                        value={languageFilter}
                        onValueChange={(value) => {
                          setLanguageFilter(value)
                          handleAddFilter("Language", value)
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          {languages.map((language) => (
                            <SelectItem key={language} value={language}>
                              {language}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              <Button>Search</Button>
            </div>
          </div>

          {activeFilters.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {activeFilters.map((filter) => (
                <Badge key={filter} variant="secondary" className="flex items-center gap-1">
                  {filter}
                  <button
                    onClick={() => handleRemoveFilter(filter)}
                    className="ml-1 rounded-full outline-none focus:ring-2 focus:ring-primary"
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">Remove {filter} filter</span>
                  </button>
                </Badge>
              ))}
              <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                Clear all
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <p className="text-sm text-muted-foreground">Find from over 1,000+ doctors in our network</p>
        </CardFooter>
      </Card>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Search Results</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Sample search result cards */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xl font-bold text-primary">DB</span>
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold">Dr. Bilal Dahmani</h3>
                  <p className="text-sm text-muted-foreground">Cardiology</p>
                  <div className="flex items-center text-sm">
                    <MapPin className="mr-1 h-3 w-3 text-muted-foreground" />
                    <span>Algiers Medical Center</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="mr-1 h-3 w-3 text-muted-foreground" />
                    <span>Next available: Today, 2:30 PM</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex justify-between">
                <Badge variant="outline">Telehealth</Badge>
                <Button size="sm">Book Appointment</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xl font-bold text-primary">SK</span>
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold">Dr. Samira Khelifi</h3>
                  <p className="text-sm text-muted-foreground">Dermatology</p>
                  <div className="flex items-center text-sm">
                    <MapPin className="mr-1 h-3 w-3 text-muted-foreground" />
                    <span>Oran Clinic</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="mr-1 h-3 w-3 text-muted-foreground" />
                    <span>Next available: Tomorrow, 10:00 AM</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex justify-between">
                <Badge variant="outline">Insurance Accepted</Badge>
                <Button size="sm">Book Appointment</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xl font-bold text-primary">MB</span>
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold">Dr. Mohamed Benali</h3>
                  <p className="text-sm text-muted-foreground">General Medicine</p>
                  <div className="flex items-center text-sm">
                    <MapPin className="mr-1 h-3 w-3 text-muted-foreground" />
                    <span>Constantine Health Center</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="mr-1 h-3 w-3 text-muted-foreground" />
                    <span>Next available: Friday, 9:15 AM</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex justify-between">
                <Badge variant="outline">Speaks Arabic, French</Badge>
                <Button size="sm">Book Appointment</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

