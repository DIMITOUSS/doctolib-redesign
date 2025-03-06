import { ReviewsSystem } from "@/components/reviews/reviews-system"
import { MainNav } from "@/components/main-nav"

export default function ReviewsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <ReviewsSystem />
    </div>
  )
}

