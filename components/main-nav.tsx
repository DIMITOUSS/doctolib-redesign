import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { AccessibilityControls } from "@/components/accessibility/accessibility-controls"
import { LanguageSwitcher } from "@/components/localization/language-switcher"
import { Bell } from "lucide-react"

export function MainNav() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center">
          <span className="text-2xl font-bold text-primary">Doctolib</span>
          <span className="ml-1 text-2xl font-bold">2.0</span>
        </Link>
        <nav className="ml-auto flex items-center gap-4">
          <Link href="/patient/dashboard">
            <Button variant="ghost">Dashboard</Button>
          </Link>
          <Link href="/doctor/dashboard">
            <Button variant="ghost">Doctor</Button>
          </Link>
          <Link href="/telemedicine">
            <Button variant="ghost">Telemedicine</Button>
          </Link>
          <Link href="/search">
            <Button variant="ghost">Search</Button>
          </Link>
          <Link href="/reviews">
            <Button variant="ghost">Reviews</Button>
          </Link>
          <Link href="/payment">
            <Button variant="ghost">Payment</Button>
          </Link>
          <Link href="/admin/dashboard">
            <Button variant="ghost">Admin</Button>
          </Link>
          <Link href="/notifications">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
          </Link>
          <Link href="/animations">
            <Button variant="ghost">Animations</Button>
          </Link>
          <Link href="/settings">
            <Button variant="ghost">Settings</Button>
          </Link>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <AccessibilityControls />
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </header>
  )
}

