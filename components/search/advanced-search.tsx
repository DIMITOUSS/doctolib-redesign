// components/AdvancedSearch.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Filter, MapPin, X, CalendarIcon, Clock } from "lucide-react";
import { doctorsApi } from "@/lib/api";
import { Doctor, PaginatedDoctorsResponse } from "@/types/auth";
import { AutocompleteInput } from "@/components/autocomplete-input";

export function AdvancedSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [maxDistance, setMaxDistance] = useState([10]);
  const [availabilityFilter, setAvailabilityFilter] = useState(false);
  const [telehealthFilter, setTelehealthFilter] = useState(false);
  const [insuranceFilter, setInsuranceFilter] = useState(false);
  const [genderFilter, setGenderFilter] = useState("");
  const [languageFilter, setLanguageFilter] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  // Fetch specialties and cities on mount
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const [specialtiesData, citiesData] = await Promise.all([
          doctorsApi.getSpecialties(),
          doctorsApi.getCities(),
        ]);
        console.log("Fetched specialties:", specialtiesData);
        console.log("Fetched cities:", citiesData);
        setSpecialties(specialtiesData);
        setCities(citiesData);
      } catch (err) {
        console.error("Error fetching filter options:", err);
        setError("Failed to load filter options");
      }
    };
    fetchFilterOptions();
  }, []);

  const handleAddFilter = (filterName: string, value: string) => {
    const filterKey = `${filterName}: ${value}`;
    if (!activeFilters.includes(filterKey)) {
      setActiveFilters([...activeFilters, filterKey]);
    }
  };

  const handleRemoveFilter = (filter: string) => {
    setActiveFilters(activeFilters.filter((f) => f !== filter));
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedSpecialty("");
    setSelectedDate(undefined);
    setSelectedLocation("");
    setMaxDistance([10]);
    setAvailabilityFilter(false);
    setTelehealthFilter(false);
    setInsuranceFilter(false);
    setGenderFilter("");
    setLanguageFilter("");
    setActiveFilters([]);
    setSearchResults([]);
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {
        name: searchQuery || undefined,
        specialty: selectedSpecialty || undefined,
        location: selectedLocation || undefined,
      };
      console.log("Search params sent:", params); // Log params before API call
      const response: PaginatedDoctorsResponse = await doctorsApi.search(params);
      console.log("Search results:", response);
      setSearchResults(response.doctors);
    } catch (err: any) {
      console.error("Search error:", err);
      setError(err.response?.data?.message || "Failed to search doctors");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Find the Right Doctor</CardTitle>
          <CardDescription>Use our advanced search to find the perfect healthcare provider</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
            <AutocompleteInput
              value={searchQuery}
              onChange={setSearchQuery}
              field="name"
              placeholder="Search by doctor name, specialty, or condition..."
            />
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
                          setSelectedSpecialty(value);
                          handleAddFilter("Specialty", value);
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
                              setSelectedDate(date);
                              if (date) handleAddFilter("Date", format(date, "PPP"));
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
                          setSelectedLocation(value);
                          handleAddFilter("Location", value);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                        <SelectContent>
                          {cities.map((city) => (
                            <SelectItem key={city} value={city}>
                              {city}
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
                          setMaxDistance(value);
                          handleAddFilter("Max Distance", `${value[0]} km`);
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
                            setAvailabilityFilter(!!checked);
                            if (checked) handleAddFilter("Availability", "Today");
                            else handleRemoveFilter("Availability: Today");
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
                            setTelehealthFilter(!!checked);
                            if (checked) handleAddFilter("Consultation", "Telehealth");
                            else handleRemoveFilter("Consultation: Telehealth");
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
                            setInsuranceFilter(!!checked);
                            if (checked) handleAddFilter("Insurance", "Accepted");
                            else handleRemoveFilter("Insurance: Accepted");
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
                          setGenderFilter(value);
                          handleAddFilter("Gender", value);
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
                          setLanguageFilter(value);
                          handleAddFilter("Language", value);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          {["Arabic", "French", "English", "Berber", "Spanish"].map((language) => (
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
              <Button onClick={handleSearch} disabled={loading}>
                {loading ? "Searching..." : "Search"}
              </Button>
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

          {error && (
            <div className="p-4 bg-destructive/10 text-destructive rounded">
              {error}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <p className="text-sm text-muted-foreground">Find from over {searchResults.length} doctors in our network</p>
        </CardFooter>
      </Card>

      {searchResults.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Search Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResults.map((doctor) => (
              <Card key={doctor.id}>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-xl font-bold text-primary">
                        {doctor.firstName?.[0] || "N"}{doctor.lastName?.[0] || "A"}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-bold">{doctor.firstName} {doctor.lastName}</h3>
                      <p className="text-sm text-muted-foreground">{doctor.specialty || "N/A"}</p>
                      <div className="flex items-center text-sm">
                        <MapPin className="mr-1 h-3 w-3 text-muted-foreground" />
                        <span>{doctor.city || "Unknown location"}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between">
                    <Button size="sm">Book Appointment</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}