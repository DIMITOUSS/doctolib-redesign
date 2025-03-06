"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { AnimatedContainer } from "@/components/ui/animated-container"
import { MainNav } from "@/components/main-nav"
import { Eye, EyeOff, ArrowLeft, ArrowRight, Check, User, Stethoscope } from "lucide-react"
import { authApi } from "@/lib/api"
import { RegisterRequest } from "@/types/auth"

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [role, setRole] = useState<"patient" | "doctor" | "">("")
  const RegistrationForm = () => {
    const [formData, setFormData] = useState<RegisterRequest>({

      role: 'PATIENT', // Default role
      id: "",
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      birthDate: '',
      phone: '',
      address: '',
      emergencyContact: '',
      bloodType: '',
      allergies: '',
      medicalConditions: '',
      // Doctor-specific fields
      bio: '',
      education: '',
      experience: '',
      specialization: '',
      licenseNumber: '',
    })


    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [agreeToTerms, setAgreeToTerms] = useState(false)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target
      setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSelectChange = (name: string, value: string) => {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const validateStep = () => {
      switch (step) {
        case 1:
          if (!formData.role) {
            setError("Please select a role")
            return false
          }
          break
        case 2:
          if (!formData.firstName || !formData.lastName || !formData.email) {
            setError("Please fill in all required fields")
            return false
          }
          if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match")
            return false
          }
          if (formData.password.length < 8) {
            setError("Password must be at least 8 characters long")
            return false
          }
          break
        case 3:
          if (role === "doctor" && (!formData.specialization || !formData.licenseNumber)) {
            setError("Please fill in all required fields")
            return false
          }
          if (role === "patient" && !formData.birthDate) {
            setError("Please fill in all required fields")
            return false
          }
          break
        case 4:
          if (!agreeToTerms) {
            setError("You must agree to the terms and conditions")
            return false
          }
          break
      }
      setError("")
      return true
    }

    const nextStep = () => {
      if (validateStep()) {
        setStep((prev) => prev + 1)
      }
    }

    const prevStep = () => {
      setStep((prev) => prev - 1)
    }

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      if (!validateStep()) return

      setIsLoading(true)

      try {
        // Construct the data to send to the API
        const dataToSubmit: RegisterRequest = {
          id: formData.id,
          role: formData.role,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          firstName: formData.firstName,
          lastName: formData.lastName,
          birthDate: formData.birthDate,
          phone: formData.phone,
          address: formData.address,
          emergencyContact: formData.emergencyContact,
          bloodType: formData.bloodType,
          allergies: formData.allergies,
          medicalConditions: formData.medicalConditions,
          // Doctor-specific fields
          bio: formData.bio,
          education: formData.education,
          experience: formData.experience,
          specialization: formData.specialization,
          licenseNumber: formData.licenseNumber,
        }

        // Make the API call to your backend for registration
        const response = await authApi.register(dataToSubmit)

        console.log('Registration successful:', response)

        // Redirect based on role after successful registration
        if (formData.role === 'DOCTOR') {
          router.push('/doctor/dashboard')
        } else {
          router.push('/patient/dashboard')
        }
      } catch (err) {
        setError('An error occurred during registration. Please try again.')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }


    const renderStepContent = () => {
      switch (step) {
        case 1:
          return (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-lg font-medium">Choose your role</h3>
                <p className="text-sm text-muted-foreground">Select whether you are a patient or a healthcare provider</p>
              </div>
              <RadioGroup
                value={role}
                onValueChange={(value) => setRole(value as "patient" | "doctor")}
                className="grid grid-cols-2 gap-4"
              >
                <div>
                  <RadioGroupItem value="patient" id="patient" className="peer sr-only" />
                  <Label
                    htmlFor="patient"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <User className="mb-3 h-6 w-6" />
                    <span className="font-medium">Patient</span>
                    <span className="text-xs text-muted-foreground">I am seeking healthcare services</span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="doctor" id="doctor" className="peer sr-only" />
                  <Label
                    htmlFor="doctor"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <Stethoscope className="mb-3 h-6 w-6" />
                    <span className="font-medium">Doctor</span>
                    <span className="text-xs text-muted-foreground">I am a healthcare provider</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          )
        case 2:
          return (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-lg font-medium">Personal Information</h3>
                <p className="text-sm text-muted-foreground">Enter your basic personal information</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-10 w-10 text-muted-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">Password must be at least 8 characters long</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-10 w-10 text-muted-foreground"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    <span className="sr-only">{showConfirmPassword ? "Hide password" : "Show password"}</span>
                  </Button>
                </div>
              </div>
            </div>
          )
        case 3:
          return role === "doctor" ? (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-lg font-medium">Professional Information</h3>
                <p className="text-sm text-muted-foreground">Enter your professional details</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="specialization">Specialization *</Label>
                <Select
                  value={formData.specialization}
                  onValueChange={(value) => handleSelectChange("specialization", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select specialization" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cardiology">Cardiology</SelectItem>
                    <SelectItem value="dermatology">Dermatology</SelectItem>
                    <SelectItem value="neurology">Neurology</SelectItem>
                    <SelectItem value="orthopedics">Orthopedics</SelectItem>
                    <SelectItem value="pediatrics">Pediatrics</SelectItem>
                    <SelectItem value="psychiatry">Psychiatry</SelectItem>
                    <SelectItem value="general">General Medicine</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="licenseNumber">License Number *</Label>
                <Input
                  id="licenseNumber"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="experience">Years of Experience</Label>
                <Input
                  id="experience"
                  name="experience"
                  type="number"
                  min="0"
                  value={formData.experience}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="education">Education</Label>
                <Textarea
                  id="education"
                  name="education"
                  value={formData.education}
                  onChange={handleInputChange}
                  placeholder="e.g., MD from University of Algiers, 2010"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Professional Bio</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Brief description of your professional background"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-lg font-medium">Medical Information</h3>
                <p className="text-sm text-muted-foreground">Enter your medical details</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <Input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.birthDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+213 555 123 456"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Your full address"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyContact">Emergency Contact</Label>
                <Input
                  id="emergencyContact"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleInputChange}
                  placeholder="Name and phone number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bloodType">Blood Type</Label>
                <Select value={formData.bloodType} onValueChange={(value) => handleSelectChange("bloodType", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select blood type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="allergies">Allergies</Label>
                <Textarea
                  id="allergies"
                  name="allergies"
                  value={formData.allergies}
                  onChange={handleInputChange}
                  placeholder="List any allergies you have"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="medicalConditions">Medical Conditions</Label>
                <Textarea
                  id="medicalConditions"
                  name="medicalConditions"
                  value={formData.medicalConditions}
                  onChange={handleInputChange}
                  placeholder="List any pre-existing medical conditions"
                />
              </div>
            </div>
          )
        case 4:
          return (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-lg font-medium">Review & Submit</h3>
                <p className="text-sm text-muted-foreground">Please review your information before submitting</p>
              </div>
              <div className="space-y-4 border rounded-md p-4">
                <div>
                  <h4 className="font-medium">Account Type</h4>
                  <p className="text-sm capitalize">{role}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium">First Name</h4>
                    <p className="text-sm">{formData.firstName}</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Last Name</h4>
                    <p className="text-sm">{formData.lastName}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium">Email</h4>
                  <p className="text-sm">{formData.email}</p>
                </div>
                {role === "doctor" ? (
                  <>
                    <div>
                      <h4 className="font-medium">Specialization</h4>
                      <p className="text-sm capitalize">{formData.specialization}</p>
                    </div>
                    <div>
                      <h4 className="font-medium">License Number</h4>
                      <p className="text-sm">{formData.licenseNumber}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <h4 className="font-medium">Date of Birth</h4>
                      <p className="text-sm">{formData.birthDate}</p>
                    </div>
                    {formData.bloodType && (
                      <div>
                        <h4 className="font-medium">Blood Type</h4>
                        <p className="text-sm">{formData.bloodType}</p>
                      </div>
                    )}
                  </>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="terms" checked={agreeToTerms} onCheckedChange={(checked) => setAgreeToTerms(!!checked)} />
                <Label htmlFor="terms" className="text-sm">
                  I agree to the{" "}
                  <Link href="/terms" className="text-primary underline-offset-4 hover:underline">
                    terms and conditions
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-primary underline-offset-4 hover:underline">
                    privacy policy
                  </Link>
                </Label>
              </div>
            </div>
          )
        default:
          return null
      }
    }

    return (
      <div className="flex min-h-screen flex-col">
        <MainNav />
        <div className="flex flex-1 items-center justify-center p-4">
          <AnimatedContainer animation="fade" className="w-full max-w-2xl">
            <Card>
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-center">Create an Account</CardTitle>
                <CardDescription className="text-center">Register to access healthcare services</CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  {/* Stepper */}
                  <div className="flex justify-between mb-8">
                    {[1, 2, 3, 4].map((stepNumber) => (
                      <div key={stepNumber} className="flex flex-col items-center">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${step === stepNumber
                            ? "border-primary bg-primary text-primary-foreground"
                            : step > stepNumber
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-muted bg-background"
                            }`}
                        >
                          {step > stepNumber ? <Check className="h-5 w-5" /> : <span>{stepNumber}</span>}
                        </div>
                        <span className="mt-2 text-xs text-muted-foreground">
                          {stepNumber === 1
                            ? "Role"
                            : stepNumber === 2
                              ? "Basic Info"
                              : stepNumber === 3
                                ? role === "doctor"
                                  ? "Professional"
                                  : "Medical"
                                : "Review"}
                        </span>
                      </div>
                    ))}
                  </div>

                  {error && <div className="p-3 text-sm bg-destructive/10 text-destructive rounded-md">{error}</div>}

                  {renderStepContent()}
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <div className="flex w-full justify-between">
                    <Button type="button" variant="outline" onClick={prevStep} disabled={step === 1}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    {step < 4 ? (
                      <Button type="button" onClick={nextStep}>
                        Next
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    ) : (
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Registering..." : "Complete Registration"}
                      </Button>
                    )}
                  </div>
                  <div className="text-center text-sm">
                    Already have an account?{" "}
                    <Link href="/auth/login" className="text-primary underline-offset-4 hover:underline">
                      Login
                    </Link>
                  </div>
                </CardFooter>
              </form>
            </Card>
          </AnimatedContainer>
        </div>
      </div>
    )
  }

}