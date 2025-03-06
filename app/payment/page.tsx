import { PaymentIntegration } from "@/components/payment/payment-integration"
import { MainNav } from "@/components/main-nav"

export default function PaymentPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <PaymentIntegration />
    </div>
  )
}

