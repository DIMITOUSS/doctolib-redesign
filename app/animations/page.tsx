"use client"

import { useState } from "react"
import { MainNav } from "@/components/main-nav"
import { AnimatedCard } from "@/components/ui/animated-card"
import { AnimatedButton } from "@/components/ui/animated-button"
import { AnimatedContainer, AnimatedList } from "@/components/ui/animated-container"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AnimationsPage() {
  const [activeTab, setActiveTab] = useState("cards")

  const cardItems = [
    {
      title: "Card 1",
      description: "This is the first card with a fade animation",
      animation: "fade",
      hoverEffect: "lift",
    },
    {
      title: "Card 2",
      description: "This is the second card with a slide animation",
      animation: "slide",
      hoverEffect: "glow",
    },
    {
      title: "Card 3",
      description: "This is the third card with a scale animation",
      animation: "scale",
      hoverEffect: "border",
    },
    {
      title: "Card 4",
      description: "This is the fourth card with a flip animation",
      animation: "flip",
      hoverEffect: "none",
    },
  ]

  const buttonItems = [
    {
      text: "Pulse Button",
      animation: "pulse",
      clickAnimation: "scale",
    },
    {
      text: "Bounce Button",
      animation: "bounce",
      clickAnimation: "ripple",
    },
    {
      text: "Shake Button",
      animation: "shake",
      clickAnimation: "none",
    },
    {
      text: "No Animation",
      animation: "none",
      clickAnimation: "none",
    },
  ]

  const containerItems = [
    "This is the first item in the animated list",
    "This is the second item in the animated list",
    "This is the third item in the animated list",
    "This is the fourth item in the animated list",
    "This is the fifth item in the animated list",
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <div className="container mx-auto py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Animations & Transitions</h1>
          <p className="text-muted-foreground">
            Explore the various animations and transitions available in the application
          </p>
        </div>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="cards">Animated Cards</TabsTrigger>
            <TabsTrigger value="buttons">Animated Buttons</TabsTrigger>
            <TabsTrigger value="containers">Animated Containers</TabsTrigger>
          </TabsList>

          <TabsContent value="cards" className="space-y-4">
            <h2 className="text-2xl font-bold">Animated Cards</h2>
            <p className="text-muted-foreground mb-4">Cards with various entrance animations and hover effects</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {cardItems.map((item, index) => (
                <AnimatedCard
                  key={index}
                  animation={item.animation as any}
                  hoverEffect={item.hoverEffect as any}
                  delay={index * 0.1}
                >
                  <CardHeader>
                    <CardTitle>{item.title}</CardTitle>
                    <CardDescription>
                      Animation: {item.animation}, Hover: {item.hoverEffect}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>{item.description}</p>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">Action</Button>
                  </CardFooter>
                </AnimatedCard>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="buttons" className="space-y-4">
            <h2 className="text-2xl font-bold">Animated Buttons</h2>
            <p className="text-muted-foreground mb-4">Buttons with various animations and click effects</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {buttonItems.map((item, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>Button {index + 1}</CardTitle>
                    <CardDescription>
                      Animation: {item.animation}, Click: {item.clickAnimation}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AnimatedButton
                      animation={item.animation as any}
                      clickAnimation={item.clickAnimation as any}
                      delay={index * 0.1}
                      className="w-full"
                    >
                      {item.text}
                    </AnimatedButton>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="containers" className="space-y-4">
            <h2 className="text-2xl font-bold">Animated Containers</h2>
            <p className="text-muted-foreground mb-4">Containers with various animations and transitions</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Animated Container</CardTitle>
                  <CardDescription>Container with fade animation</CardDescription>
                </CardHeader>
                <CardContent>
                  <AnimatedContainer animation="fade" className="p-4 border rounded-lg">
                    <p>
                      This content fades in when the page loads. It uses the AnimatedContainer component to create a
                      smooth entrance animation.
                    </p>
                  </AnimatedContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Animated Container</CardTitle>
                  <CardDescription>Container with slide animation</CardDescription>
                </CardHeader>
                <CardContent>
                  <AnimatedContainer animation="slide" className="p-4 border rounded-lg">
                    <p>
                      This content slides in from the bottom when the page loads. It uses the AnimatedContainer
                      component to create a smooth entrance animation.
                    </p>
                  </AnimatedContainer>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Animated List</CardTitle>
                  <CardDescription>List with staggered animations</CardDescription>
                </CardHeader>
                <CardContent>
                  <AnimatedList animation="slide" className="space-y-2" itemClassName="p-4 border rounded-lg">
                    {containerItems.map((item, index) => (
                      <p key={index}>{item}</p>
                    ))}
                  </AnimatedList>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

