"use client"

import { useState, useEffect, type ReactNode } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import type { ButtonProps } from "@radix-ui/react-dropdown-menu"

interface AnimatedButtonProps extends ButtonProps {
  children: ReactNode
  className?: string
  animation?: "pulse" | "bounce" | "shake" | "none"
  clickAnimation?: "scale" | "ripple" | "none"
  delay?: number
  duration?: number
}

export function AnimatedButton({
  children,
  className,
  animation = "none",
  clickAnimation = "none",
  delay = 0,
  duration = 0.5,
  ...props
}: AnimatedButtonProps) {
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false)
  const [isClicked, setIsClicked] = useState(false)

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    setShouldReduceMotion(mediaQuery.matches)

    const handleChange = () => setShouldReduceMotion(mediaQuery.matches)
    mediaQuery.addEventListener("change", handleChange)

    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  // Animation variants
  const getAnimationProps = () => {
    if (shouldReduceMotion || animation === "none") {
      return {}
    }

    switch (animation) {
      case "pulse":
        return {
          animate: {
            scale: [1, 1.05, 1],
            transition: {
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
            },
          },
        }
      case "bounce":
        return {
          animate: {
            y: ["0%", "-15%", "0%"],
            transition: {
              duration: 1,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
            },
          },
        }
      case "shake":
        return {
          animate: {
            x: [0, -5, 5, -5, 5, 0],
            transition: {
              duration: 0.5,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
              repeatDelay: 2,
            },
          },
        }
      default:
        return {}
    }
  }

  const handleClick = () => {
    if (clickAnimation !== "none" && !shouldReduceMotion) {
      setIsClicked(true)
      setTimeout(() => setIsClicked(false), 300)
    }
  }

  const getClickAnimationClass = () => {
    if (shouldReduceMotion || clickAnimation === "none" || !isClicked) {
      return ""
    }

    switch (clickAnimation) {
      case "scale":
        return "animate-scale"
      case "ripple":
        return "animate-ripple"
      default:
        return ""
    }
  }

  // If reduced motion is preferred and no animation, render without motion
  if (shouldReduceMotion && animation === "none" && clickAnimation === "none") {
    return (
      <Button className={cn(className)} onClick={handleClick} {...props}>
        {children}
      </Button>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration, delay }}
      {...getAnimationProps()}
    >
      <Button className={cn(getClickAnimationClass(), className)} onClick={handleClick} {...props}>
        {children}
      </Button>
    </motion.div>
  )
}

