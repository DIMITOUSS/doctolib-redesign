"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Search } from "lucide-react"
import { doctorsApi } from "@/lib/api"
import { Doctor } from "@/types/auth"

interface AutocompleteInputProps {
    value: string
    onChange: (value: string) => void
    field: string // e.g., "name", "specialty"
    placeholder?: string
}

export function AutocompleteInput({ value, onChange, field, placeholder }: AutocompleteInputProps) {
    const [suggestions, setSuggestions] = useState<Doctor[]>([])
    const [isOpen, setIsOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!value || value.length < 2) {
            setSuggestions([])
            setIsOpen(false)
            return
        }

        const fetchSuggestions = async () => {
            try {
                setLoading(true)
                const results = await doctorsApi.autocomplete(value, field)
                console.log(`Autocomplete suggestions for ${field}:`, results)
                setSuggestions(results)
                setIsOpen(true)
            } catch (err) {
                console.error("Autocomplete error:", err)
                setSuggestions([])
            } finally {
                setLoading(false)
            }
        }

        const debounce = setTimeout(fetchSuggestions, 300)
        return () => clearTimeout(debounce)
    }, [value, field])

    const handleSelect = (suggestion: Doctor) => {
        onChange(field === "name" ? `${suggestion.firstName} ${suggestion.lastName}` : suggestion[field] || "")
        setIsOpen(false)
    }

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder={placeholder || "Search..."}
                        className="pl-8"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        onFocus={() => value.length >= 2 && setIsOpen(true)}
                    />
                </div>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0" align="start">
                <div className="max-h-[200px] overflow-y-auto">
                    {loading && (
                        <div className="p-2 text-sm text-muted-foreground">Loading...</div>
                    )}
                    {!loading && suggestions.length === 0 && (
                        <div className="p-2 text-sm text-muted-foreground">No suggestions found</div>
                    )}
                    {!loading && suggestions.map((suggestion) => (
                        <div
                            key={suggestion.id}
                            className="p-2 hover:bg-accent cursor-pointer"
                            onClick={() => handleSelect(suggestion)}
                        >
                            <div className="font-medium">
                                {suggestion.firstName} {suggestion.lastName}
                            </div>
                            <div className="text-sm text-muted-foreground">
                                {suggestion.specialty || "N/A"} - {suggestion.city || "Unknown"}
                            </div>
                        </div>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    )
}