import { VideoConsultation } from "@/components/telemedicine/video-consultation"
import { MainNav } from "@/components/main-nav"

export default function TelemedicinePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <VideoConsultation />
    </div>
  )
}

