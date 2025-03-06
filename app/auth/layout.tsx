import type { ReactNode } from "react"
import { PageTransition } from "@/components/ui/animated-container"

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <PageTransition>{children}</PageTransition>
}

