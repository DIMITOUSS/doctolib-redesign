"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type LocaleContextType = {
  locale: string
  setLocale: (locale: string) => void
  t: (key: string) => string
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined)

// Sample translations
const translations: Record<string, Record<string, string>> = {
  en: {
    welcome: "Welcome to Doctolib 2.0",
    find_doctor: "Find a Doctor",
    book_appointment: "Book an Appointment",
    medical_records: "Medical Records",
    messages: "Messages",
    settings: "Settings",
    profile: "Profile",
    logout: "Logout",
  },
  fr: {
    welcome: "Bienvenue sur Doctolib 2.0",
    find_doctor: "Trouver un Médecin",
    book_appointment: "Prendre Rendez-vous",
    medical_records: "Dossiers Médicaux",
    messages: "Messages",
    settings: "Paramètres",
    profile: "Profil",
    logout: "Déconnexion",
  },
  ar: {
    welcome: "مرحبًا بك في دوكتوليب 2.0",
    find_doctor: "ابحث عن طبيب",
    book_appointment: "حجز موعد",
    medical_records: "السجلات الطبية",
    messages: "الرسائل",
    settings: "الإعدادات",
    profile: "الملف الشخصي",
    logout: "تسجيل الخروج",
  },
  ber: {
    welcome: "Ansuf ɣer Doctolib 2.0",
    find_doctor: "Af-d Aduktur",
    book_appointment: "Ṭṭef Asarag",
    medical_records: "Ikaramen n Teẓẓi",
    messages: "Iznan",
    settings: "Tisɣal",
    profile: "Amaɣnu",
    logout: "Tuffɣa",
  },
}

export function LocalizationProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState("en")

  useEffect(() => {
    // Initialize with browser language if available
    const browserLang = navigator.language.split("-")[0]
    if (translations[browserLang]) {
      setLocale(browserLang)
    }
  }, [])

  const t = (key: string): string => {
    if (translations[locale] && translations[locale][key]) {
      return translations[locale][key]
    }

    // Fallback to English
    if (translations.en[key]) {
      return translations.en[key]
    }

    // Return the key if no translation is found
    return key
  }

  return <LocaleContext.Provider value={{ locale, setLocale, t }}>{children}</LocaleContext.Provider>
}

export function useLocalization() {
  const context = useContext(LocaleContext)

  if (context === undefined) {
    throw new Error("useLocalization must be used within a LocalizationProvider")
  }

  return context
}

