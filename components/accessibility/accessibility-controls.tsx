"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Accessibility, ZoomIn, Type, Sun, Contrast } from "lucide-react"

export function AccessibilityControls() {
  const [fontSize, setFontSize] = useState(100)
  const [highContrast, setHighContrast] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [dyslexicFont, setDyslexicFont] = useState(false)

  useEffect(() => {
    // Apply font size
    document.documentElement.style.fontSize = `${fontSize}%`

    // Apply high contrast
    if (highContrast) {
      document.documentElement.classList.add("high-contrast")
    } else {
      document.documentElement.classList.remove("high-contrast")
    }

    // Apply reduced motion
    if (reducedMotion) {
      document.documentElement.classList.add("reduced-motion")
    } else {
      document.documentElement.classList.remove("reduced-motion")
    }

    // Apply dyslexic font
    if (dyslexicFont) {
      document.documentElement.classList.add("dyslexic-font")
    } else {
      document.documentElement.classList.remove("dyslexic-font")
    }
  }, [fontSize, highContrast, reducedMotion, dyslexicFont])

  const resetSettings = () => {
    setFontSize(100)
    setHighContrast(false)
    setReducedMotion(false)
    setDyslexicFont(false)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" aria-label="Accessibility Options">
          <Accessibility className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <h3 className="font-medium">Accessibility Settings</h3>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ZoomIn className="h-4 w-4" />
                <Label htmlFor="font-size">Text Size</Label>
              </div>
              <span className="text-sm">{fontSize}%</span>
            </div>
            <Slider
              id="font-size"
              min={75}
              max={200}
              step={5}
              value={[fontSize]}
              onValueChange={(value) => setFontSize(value[0])}
            />
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Contrast className="h-4 w-4" />
                <Label htmlFor="high-contrast">High Contrast</Label>
              </div>
              <Switch id="high-contrast" checked={highContrast} onCheckedChange={setHighContrast} />
            </div>
            <p className="text-xs text-muted-foreground">Increases contrast for better readability</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Type className="h-4 w-4" />
                <Label htmlFor="dyslexic-font">Dyslexia-friendly Font</Label>
              </div>
              <Switch id="dyslexic-font" checked={dyslexicFont} onCheckedChange={setDyslexicFont} />
            </div>
            <p className="text-xs text-muted-foreground">Uses a font designed for readers with dyslexia</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sun className="h-4 w-4" />
                <Label htmlFor="reduced-motion">Reduced Motion</Label>
              </div>
              <Switch id="reduced-motion" checked={reducedMotion} onCheckedChange={setReducedMotion} />
            </div>
            <p className="text-xs text-muted-foreground">Minimizes animations and transitions</p>
          </div>

          <Separator />

          <Button variant="outline" size="sm" onClick={resetSettings} className="w-full">
            Reset to Default
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

