"use client"

import React from "react"

import { useState, useEffect, type ReactNode } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

interface AnimatedCardProps {
  children: ReactNode
  className?: string
  headerClassName?: string
  contentClassName?: string
  footerClassName?: string
  delay?: number
  duration?: number
  animation?: "fade" | "slide" | "scale" | "flip" | "none"
  hoverEffect?: "lift" | "glow" | "border" | "none"
}

export function AnimatedCard({
  children,
  className,
  headerClassName,
  contentClassName,
  footerClassName,
  delay = 0,
  duration = 0.5,
  animation = "fade",
  hoverEffect = "none",
}: AnimatedCardProps) {
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false)

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    setShouldReduceMotion(mediaQuery.matches)

    const handleChange = () => setShouldReduceMotion(mediaQuery.matches)
    mediaQuery.addEventListener("change", handleChange)

    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  // Animation variants
  const variants = {
    fade: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    },
    slide: {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
    },
    scale: {
      hidden: { opacity: 0, scale: 0.9 },
      visible: { opacity: 1, scale: 1 },
    },
    flip: {
      hidden: { opacity: 0, rotateX: 90 },
      visible: { opacity: 1, rotateX: 0 },
    },
  }

  // Hover effects
  const getHoverClass = () => {
    switch (hoverEffect) {
      case "lift":
        return "transition-transform duration-300 hover:-translate-y-2"
      case "glow":
        return "transition-shadow duration-300 hover:shadow-lg hover:shadow-primary/20"
      case "border":
        return "transition-all duration-300 hover:border-primary"
      default:
        return ""
    }
  }

  // If reduced motion is preferred or animation is none, render without animation
  if (shouldReduceMotion || animation === "none") {
    return (
      <Card className={cn(getHoverClass(), className)}>
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            if (child.type === CardHeader) {
              return React.cloneElement(child, {
                className: cn(child.props.className, headerClassName),
              })
            }
            if (child.type === CardContent) {
              return React.cloneElement(child, {
                className: cn(child.props.className, contentClassName),
              })
            }
            if (child.type === CardFooter) {
              return React.cloneElement(child, {
                className: cn(child.props.className, footerClassName),
              })
            }
          }
          return child
        })}
      </Card>
    )
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={variants[animation]}
      transition={{ duration, delay, ease: "easeOut" }}
      className={getHoverClass()}
    >
      <Card className={className}>
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            if (child.type === CardHeader) {
              return React.cloneElement(child, {
                className: cn(child.props.className, headerClassName),
              })
            }
            if (child.type === CardContent) {
              return React.cloneElement(child, {
                className: cn(child.props.className, contentClassName),
              })
            }
            if (child.type === CardFooter) {
              return React.cloneElement(child, {
                className: cn(child.props.className, footerClassName),
              })
            }
          }
          return child
        })}
      </Card>
    </motion.div>
  )
}

