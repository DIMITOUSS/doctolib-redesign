import { NotificationsSystem } from "@/components/notifications/notifications-system"
import { MainNav } from "@/components/main-nav"

export default function NotificationsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <NotificationsSystem />
    </div>
  )
}

