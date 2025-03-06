"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Paperclip, Send, Search, Plus, MoreHorizontal, Phone, Video } from "lucide-react"

export function MessagingSystem() {
  const [activeConversation, setActiveConversation] = useState<number | null>(1)
  const [message, setMessage] = useState("")
  const [conversations, setConversations] = useState([
    {
      id: 1,
      doctor: {
        name: "Dr. Amina Benali",
        specialty: "Cardiologist",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "AB",
      },
      messages: [
        {
          id: 1,
          sender: "doctor",
          text: "Hello! How can I help you today?",
          time: "10:30 AM",
          date: "Today",
        },
        {
          id: 2,
          sender: "patient",
          text: "I've been experiencing some chest pain after exercising.",
          time: "10:32 AM",
          date: "Today",
        },
        {
          id: 3,
          sender: "doctor",
          text: "I see. How long has this been happening? And can you describe the pain?",
          time: "10:35 AM",
          date: "Today",
        },
        {
          id: 4,
          sender: "patient",
          text: "It started about a week ago. The pain is sharp and lasts for a few minutes.",
          time: "10:38 AM",
          date: "Today",
        },
        {
          id: 5,
          sender: "doctor",
          text: "Thank you for the information. I recommend scheduling an appointment for a proper examination. In the meantime, please avoid strenuous exercise.",
          time: "10:40 AM",
          date: "Today",
        },
      ],
      unread: 0,
    },
    {
      id: 2,
      doctor: {
        name: "Dr. Karim Mensouri",
        specialty: "Dermatologist",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "KM",
      },
      messages: [
        {
          id: 1,
          sender: "doctor",
          text: "Your test results are back. Everything looks normal.",
          time: "Yesterday",
          date: "Yesterday",
        },
      ],
      unread: 1,
    },
    {
      id: 3,
      doctor: {
        name: "Dr. Leila Hadj",
        specialty: "Pediatrician",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "LH",
      },
      messages: [
        {
          id: 1,
          sender: "doctor",
          text: "Don't forget to give your child the prescribed medication three times a day.",
          time: "2 days ago",
          date: "2 days ago",
        },
      ],
      unread: 0,
    },
  ])

  const handleSendMessage = () => {
    if (!message.trim() || !activeConversation) return

    const newMessage = {
      id: Date.now(),
      sender: "patient",
      text: message,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      date: "Today",
    }

    setConversations(
      conversations.map((conv) =>
        conv.id === activeConversation ? { ...conv, messages: [...conv.messages, newMessage] } : conv,
      ),
    )

    setMessage("")

    // Simulate doctor response
    setTimeout(() => {
      const doctorResponse = {
        id: Date.now() + 1,
        sender: "doctor",
        text: "Thank you for your message. I'll review it and get back to you soon.",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        date: "Today",
      }

      setConversations(
        conversations.map((conv) =>
          conv.id === activeConversation ? { ...conv, messages: [...conv.messages, newMessage, doctorResponse] } : conv,
        ),
      )
    }, 2000)
  }

  const getActiveConversation = () => {
    return conversations.find((conv) => conv.id === activeConversation)
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Messages</h2>
        <p className="text-muted-foreground">Communicate securely with your healthcare providers</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Conversations List */}
        <Card className="md:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle>Conversations</CardTitle>
            <CardDescription>Your message history with doctors</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="px-4 py-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search messages" className="pl-8" />
              </div>
            </div>
            <div className="px-4 py-2">
              <Button variant="outline" className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                New Message
              </Button>
            </div>
            <div className="divide-y">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`p-4 cursor-pointer hover:bg-muted/50 ${
                    activeConversation === conversation.id ? "bg-muted" : ""
                  }`}
                  onClick={() => setActiveConversation(conversation.id)}
                >
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={conversation.doctor.avatar} alt={conversation.doctor.name} />
                      <AvatarFallback>{conversation.doctor.initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium truncate">{conversation.doctor.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {conversation.messages[conversation.messages.length - 1].time}
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {conversation.messages[conversation.messages.length - 1].text}
                      </p>
                    </div>
                    {conversation.unread > 0 && <div className="h-2 w-2 bg-primary rounded-full"></div>}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Active Conversation */}
        <Card className="md:col-span-2">
          {activeConversation ? (
            <>
              <CardHeader className="pb-2 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage
                        src={getActiveConversation()?.doctor.avatar}
                        alt={getActiveConversation()?.doctor.name}
                      />
                      <AvatarFallback>{getActiveConversation()?.doctor.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{getActiveConversation()?.doctor.name}</CardTitle>
                      <CardDescription>{getActiveConversation()?.doctor.specialty}</CardDescription>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Video className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[400px] overflow-y-auto p-4 space-y-4">
                  {getActiveConversation()?.messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === "patient" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          msg.sender === "patient" ? "bg-primary text-primary-foreground" : "bg-muted"
                        }`}
                      >
                        <p>{msg.text}</p>
                        <p
                          className={`text-xs mt-1 ${
                            msg.sender === "patient" ? "text-primary-foreground/70" : "text-muted-foreground"
                          }`}
                        >
                          {msg.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="border-t p-4">
                <div className="flex w-full items-center space-x-2">
                  <Button variant="outline" size="icon">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Textarea
                    placeholder="Type your message..."
                    className="flex-1 resize-none"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                  />
                  <Button onClick={handleSendMessage} disabled={!message.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </>
          ) : (
            <CardContent className="flex items-center justify-center h-[500px]">
              <div className="text-center">
                <p className="text-muted-foreground">Select a conversation to start messaging</p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  )
}

