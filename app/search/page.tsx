
import { MainNav } from "@/components/main-nav"
import { AdvancedSearch } from "@/components/search/advanced-search"

export default function SearchPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <AdvancedSearch />
    </div>
  )
}

