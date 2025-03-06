import { AdvancedSearch } from "@/components/search/advanced-search"
import { MainNav } from "@/components/main-nav"

export default function SearchPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <AdvancedSearch />
    </div>
  )
}

