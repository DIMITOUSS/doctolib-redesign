import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MainNav } from "@/components/main-nav"
import { AnimatedContainer, AnimatedList } from "@/components/ui/animated-container"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Stethoscope, User, Calendar, Search, Star, CreditCard, ShieldCheck, Bell, Zap, Settings } from "lucide-react"

export default function HomePage() {
  const features = [
    {
      title: "Doctor Dashboard",
      description: "Manage appointments, patient records, and prescriptions",
      link: "/doctor/dashboard",
      icon: Stethoscope,
    },
    {
      title: "Telemedicine",
      description: "Conduct virtual consultations with patients",
      link: "/telemedicine",
      icon: Calendar,
    },
    {
      title: "Advanced Search",
      description: "Find doctors with advanced filtering options",
      link: "/search",
      icon: Search,
    },
    {
      title: "Reviews & Ratings",
      description: "Read and write reviews for healthcare providers",
      link: "/reviews",
      icon: Star,
    },
    {
      title: "Payment Integration",
      description: "Securely pay for medical services",
      link: "/payment",
      icon: CreditCard,
    },
    {
      title: "Admin Dashboard",
      description: "Manage users, appointments, and system settings",
      link: "/admin/dashboard",
      icon: ShieldCheck,
    },
    {
      title: "Notifications",
      description: "Stay updated with appointments and messages",
      link: "/notifications",
      icon: Bell,
    },
    {
      title: "Animations",
      description: "Explore the various animations and transitions",
      link: "/animations",
      icon: Zap,
    },
    {
      title: "Settings",
      description: "Configure your account and preferences",
      link: "/settings",
      icon: Settings,
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1">
        {/* Hero Section with Auth Options */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
          <AnimatedContainer animation="fade" className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-6 text-center">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Welcome to Doctolib 2.0
              </h1>
              <p className="max-w-[700px] text-lg md:text-xl">
                A redesigned healthcare platform for patients and doctors in Algeria
              </p>

              {/* Auth Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                <Button asChild size="lg" className="w-full">
                  <Link href="/auth/login">Login</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="w-full bg-background/20 hover:bg-background/30">
                  <Link href="/auth/register">Register</Link>
                </Button>
              </div>
            </div>
          </AnimatedContainer>
        </section>

        {/* User Type Selection */}
        <section className="w-full py-12 md:py-16">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
              <h2 className="text-3xl font-bold tracking-tighter">Choose Your Path</h2>
              <p className="max-w-[700px] text-muted-foreground">
                Whether you're seeking healthcare or providing it, we have the tools you need
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <Card className="border-2 hover:border-primary transition-colors">
                <CardHeader className="text-center">
                  <User className="w-12 h-12 mx-auto mb-2 text-primary" />
                  <CardTitle>For Patients</CardTitle>
                  <CardDescription>Find doctors and book appointments</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center space-y-4">
                  <ul className="text-left space-y-2">
                    <li className="flex items-center">
                      <span className="mr-2 text-primary">✓</span> Find the right specialist
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2 text-primary">✓</span> Book appointments online
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2 text-primary">✓</span> Access your medical records
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2 text-primary">✓</span> Virtual consultations
                    </li>
                  </ul>
                  <Button asChild className="w-full mt-4">
                    <Link href="/auth/register">Register as Patient</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary transition-colors">
                <CardHeader className="text-center">
                  <Stethoscope className="w-12 h-12 mx-auto mb-2 text-primary" />
                  <CardTitle>For Doctors</CardTitle>
                  <CardDescription>Manage your practice efficiently</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center space-y-4">
                  <ul className="text-left space-y-2">
                    <li className="flex items-center">
                      <span className="mr-2 text-primary">✓</span> Manage your schedule
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2 text-primary">✓</span> Access patient records
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2 text-primary">✓</span> Issue prescriptions online
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2 text-primary">✓</span> Conduct telemedicine sessions
                    </li>
                  </ul>
                  <Button asChild className="w-full mt-4">
                    <Link href="/auth/register">Register as Doctor</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter">Platform Features</h2>
              <p className="max-w-[700px] text-lg text-muted-foreground">
                Explore the various features of Doctolib 2.0
              </p>
            </div>
            <AnimatedList animation="slide" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {features.map((feature, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-2">
                      <div className="p-2 rounded-md bg-primary/10">
                        <feature.icon className="h-5 w-5 text-primary" />
                      </div>
                      <CardTitle>{feature.title}</CardTitle>
                    </div>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild variant="outline" className="w-full">
                      <Link href={feature.link}>Explore</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </AnimatedList>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 bg-primary text-primary-foreground">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter">Ready to Get Started?</h2>
              <p className="max-w-[700px] text-lg">
                Join thousands of patients and healthcare providers on Doctolib 2.0
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" variant="outline" className="bg-background/20 hover:bg-background/30">
                  <Link href="/auth/register">Create an Account</Link>
                </Button>
                <Button asChild size="lg">
                  <Link href="/users/login">Login</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

