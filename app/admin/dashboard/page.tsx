import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { MainNav } from "@/components/main-nav"

export default function AdminDashboardPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <AdminDashboard />
    </div>
  )
}

