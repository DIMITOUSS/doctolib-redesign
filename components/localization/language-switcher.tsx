"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Globe } from "lucide-react"

type Language = {
  code: string
  name: string
  nativeName: string
  flag: string
}

const languages: Language[] = [
  {
    code: "en",
    name: "English",
    nativeName: "English",
    flag: "🇬🇧",
  },
  {
    code: "fr",
    name: "French",
    nativeName: "Français",
    flag: "🇫🇷",
  },
  {
    code: "ar",
    name: "Arabic",
    nativeName: "العربية",
    flag: "🇩🇿",
  },
  {
    code: "ber",
    name: "Berber",
    nativeName: "Tamaziɣt",
    flag: "🇩🇿",
  },
]

export function LanguageSwitcher() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(languages[0])

  const changeLanguage = useCallback((language: Language) => {
    setCurrentLanguage(language)
    // In a real app, this would update the app's locale
    document.documentElement.lang = language.code

    // If using RTL languages like Arabic
    if (language.code === "ar") {
      document.documentElement.dir = "rtl"
    } else {
      document.documentElement.dir = "ltr"
    }
  }, [])

  useEffect(() => {
    // Initialize with browser language if available
    const browserLang = navigator.language.split("-")[0]
    const matchedLang = languages.find((lang) => lang.code === browserLang)

    if (matchedLang) {
      changeLanguage(matchedLang)
    }
  }, [changeLanguage])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-1">
          <Globe className="h-4 w-4 mr-1" />
          <span>{currentLanguage.flag}</span>
          <span>{currentLanguage.nativeName}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => changeLanguage(language)}
            className="flex items-center gap-2"
          >
            <span>{language.flag}</span>
            <span>{language.nativeName}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

