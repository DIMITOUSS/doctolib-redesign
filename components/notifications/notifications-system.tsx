"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Bell,
  Calendar,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  Clock,
  Info,
  MoreVertical,
  X,
  Settings,
  Mail,
  Smartphone,
} from "lucide-react"

export function NotificationsSystem() {
  const [activeTab, setActiveTab] = useState("all")
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Appointment Confirmed",
      message: "Your appointment with Dr. Samira Khelifi has been confirmed for November 5, 2023 at 10:00 AM.",
      type: "appointment",
      read: false,
      date: "2023-11-01T10:30:00",
      icon: Calendar,
    },
    {
      id: 2,
      title: "New Message",
      message: "You have a new message from Dr. Bilal Dahmani regarding your recent appointment.",
      type: "message",
      read: false,
      date: "2023-10-31T15:45:00",
      icon: MessageSquare,
    },
    {
      id: 3,
      title: "Prescription Ready",
      message: "Your prescription from Dr. Mohamed Benali is ready for pickup or digital download.",
      type: "alert",
      read: true,
      date: "2023-10-30T09:15:00",
      icon: AlertCircle,
    },
    {
      id: 4,
      title: "Payment Successful",
      message: "Your payment of 3,500 DZD for the appointment with Dr. Samira Khelifi has been processed successfully.",
      type: "success",
      read: true,
      date: "2023-10-29T14:20:00",
      icon: CheckCircle,
    },
    {
      id: 5,
      title: "Appointment Reminder",
      message: "Reminder: You have an appointment with Dr. Bilal Dahmani tomorrow at 2:30 PM.",
      type: "reminder",
      read: false,
      date: "2023-10-28T11:00:00",
      icon: Clock,
    },
    {
      id: 6,
      title: "System Maintenance",
      message:
        "Doctolib will be undergoing maintenance on November 10, 2023 from 2:00 AM to 4:00 AM. Some services may be unavailable during this time.",
      type: "info",
      read: true,
      date: "2023-10-27T16:30:00",
      icon: Info,
    },
  ])

  const [notificationSettings, setNotificationSettings] = useState({
    email: {
      appointments: true,
      messages: true,
      reminders: true,
      system: false,
    },
    push: {
      appointments: true,
      messages: true,
      reminders: true,
      system: true,
    },
    sms: {
      appointments: true,
      messages: false,
      reminders: true,
      system: false,
    },
  })

  const markAsRead = (id: number) => {
    setNotifications(
      notifications.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((notification) => ({ ...notification, read: true })))
  }

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter((notification) => notification.id !== id))
  }

  const clearAll = () => {
    setNotifications([])
  }

  const filteredNotifications = notifications.filter((notification) => {
    if (activeTab === "all") return true
    if (activeTab === "unread") return !notification.read
    return notification.type === activeTab
  })

  const unreadCount = notifications.filter((notification) => !notification.read).length

  const getNotificationIcon = (notification: any) => {
    const IconComponent = notification.icon

    let iconColorClass = "text-primary"

    switch (notification.type) {
      case "appointment":
        iconColorClass = "text-blue-500"
        break
      case "message":
        iconColorClass = "text-indigo-500"
        break
      case "alert":
        iconColorClass = "text-red-500"
        break
      case "success":
        iconColorClass = "text-green-500"
        break
      case "reminder":
        iconColorClass = "text-yellow-500"
        break
      case "info":
        iconColorClass = "text-gray-500"
        break
    }

    return (
      <div className={`h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center ${iconColorClass}`}>
        <IconComponent className="h-5 w-5" />
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) {
      return `Today at ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
    } else if (diffInDays === 1) {
      return `Yesterday at ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  const updateNotificationSetting = (
    channel: "email" | "push" | "sms",
    type: "appointments" | "messages" | "reminders" | "system",
    value: boolean,
  ) => {
    setNotificationSettings({
      ...notificationSettings,
      [channel]: {
        ...notificationSettings[channel],
        [type]: value,
      },
    })
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Notifications</h2>
        <p className="text-muted-foreground">Stay updated with your appointments, messages, and system alerts</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-3/4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  Notifications
                  {unreadCount > 0 && <Badge className="ml-2 bg-primary">{unreadCount}</Badge>}
                </CardTitle>
                <CardDescription>Your recent notifications and alerts</CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={markAllAsRead}>
                  Mark All as Read
                </Button>
                <Button variant="outline" size="sm" onClick={clearAll}>
                  Clear All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-4 md:grid-cols-7">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="unread">Unread</TabsTrigger>
                  <TabsTrigger value="appointment">Appointments</TabsTrigger>
                  <TabsTrigger value="message">Messages</TabsTrigger>
                  <TabsTrigger value="reminder" className="hidden md:block">
                    Reminders
                  </TabsTrigger>
                  <TabsTrigger value="alert" className="hidden md:block">
                    Alerts
                  </TabsTrigger>
                  <TabsTrigger value="info" className="hidden md:block">
                    Info
                  </TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="mt-4">
                  {filteredNotifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium">No notifications</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        You don't have any {activeTab !== "all" ? activeTab : ""} notifications at the moment
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredNotifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`flex items-start space-x-4 p-4 rounded-lg ${
                            notification.read ? "bg-background" : "bg-primary/5"
                          }`}
                        >
                          {getNotificationIcon(notification)}
                          <div className="flex-1 space-y-1">
                            <div className="flex items-start justify-between">
                              <h4 className="font-medium">{notification.title}</h4>
                              <div className="flex items-center space-x-2">
                                <span className="text-xs text-muted-foreground">{formatDate(notification.date)}</span>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                      <span className="sr-only">Open menu</span>
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    {!notification.read && (
                                      <DropdownMenuItem onClick={() => markAsRead(notification.id)}>
                                        <CheckCircle className="mr-2 h-4 w-4" />
                                        Mark as read
                                      </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem onClick={() => deleteNotification(notification.id)}>
                                      <X className="mr-2 h-4 w-4" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                            <p className="text-sm">{notification.message}</p>
                            {notification.type === "appointment" && (
                              <Button variant="outline" size="sm" className="mt-2">
                                View Appointment
                              </Button>
                            )}
                            {notification.type === "message" && (
                              <Button variant="outline" size="sm" className="mt-2">
                                Read Message
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter>
              <div className="flex justify-between w-full">
                <Button variant="outline" disabled>
                  Previous
                </Button>
                <Button variant="outline">Next</Button>
              </div>
            </CardFooter>
          </Card>
        </div>

        <div className="md:w-1/4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="mr-2 h-5 w-5" />
                Notification Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <h4 className="font-medium flex items-center">
                  <Mail className="mr-2 h-4 w-4" />
                  Email Notifications
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-appointments">Appointments</Label>
                    <Switch
                      id="email-appointments"
                      checked={notificationSettings.email.appointments}
                      onCheckedChange={(checked) => updateNotificationSetting("email", "appointments", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-messages">Messages</Label>
                    <Switch
                      id="email-messages"
                      checked={notificationSettings.email.messages}
                      onCheckedChange={(checked) => updateNotificationSetting("email", "messages", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-reminders">Reminders</Label>
                    <Switch
                      id="email-reminders"
                      checked={notificationSettings.email.reminders}
                      onCheckedChange={(checked) => updateNotificationSetting("email", "reminders", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-system">System Updates</Label>
                    <Switch
                      id="email-system"
                      checked={notificationSettings.email.system}
                      onCheckedChange={(checked) => updateNotificationSetting("email", "system", checked)}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="font-medium flex items-center">
                  <Bell className="mr-2 h-4 w-4" />
                  Push Notifications
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="push-appointments">Appointments</Label>
                    <Switch
                      id="push-appointments"
                      checked={notificationSettings.push.appointments}
                      onCheckedChange={(checked) => updateNotificationSetting("push", "appointments", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="push-messages">Messages</Label>
                    <Switch
                      id="push-messages"
                      checked={notificationSettings.push.messages}
                      onCheckedChange={(checked) => updateNotificationSetting("push", "messages", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="push-reminders">Reminders</Label>
                    <Switch
                      id="push-reminders"
                      checked={notificationSettings.push.reminders}
                      onCheckedChange={(checked) => updateNotificationSetting("push", "reminders", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="push-system">System Updates</Label>
                    <Switch
                      id="push-system"
                      checked={notificationSettings.push.system}
                      onCheckedChange={(checked) => updateNotificationSetting("push", "system", checked)}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="font-medium flex items-center">
                  <Smartphone className="mr-2 h-4 w-4" />
                  SMS Notifications
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="sms-appointments">Appointments</Label>
                    <Switch
                      id="sms-appointments"
                      checked={notificationSettings.sms.appointments}
                      onCheckedChange={(checked) => updateNotificationSetting("sms", "appointments", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="sms-messages">Messages</Label>
                    <Switch
                      id="sms-messages"
                      checked={notificationSettings.sms.messages}
                      onCheckedChange={(checked) => updateNotificationSetting("sms", "messages", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="sms-reminders">Reminders</Label>
                    <Switch
                      id="sms-reminders"
                      checked={notificationSettings.sms.reminders}
                      onCheckedChange={(checked) => updateNotificationSetting("sms", "reminders", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="sms-system">System Updates</Label>
                    <Switch
                      id="sms-system"
                      checked={notificationSettings.sms.system}
                      onCheckedChange={(checked) => updateNotificationSetting("sms", "system", checked)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Save Settings</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

