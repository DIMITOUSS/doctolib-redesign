import { SettingsPages } from "@/components/settings/settings-pages"
import { MainNav } from "@/components/main-nav"

export default function SettingsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <SettingsPages />
    </div>
  )
}

