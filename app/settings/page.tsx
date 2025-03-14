import { MainNav } from "@/components/main-nav"
import { SettingsPages } from "@/hooks/SettingsPages"

export default function SettingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <SettingsPages />
    </div>
  )
}

