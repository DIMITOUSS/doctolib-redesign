import type React from "react"
import "@/app/globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { LocalizationProvider } from "@/components/localization/localization-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Doctolib 2.0",
  description: "A redesigned healthcare platform",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>

          <LocalizationProvider>{children}</LocalizationProvider>
        </ThemeProvider>


      </body>
    </html>
  )
}



import './globals.css'
import { AuthProvider } from "@/lib/auth-provider"
