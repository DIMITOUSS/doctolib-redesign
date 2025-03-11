"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
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
  Archive,
} from "lucide-react";
import { io, Socket } from "socket.io-client";
import { api } from "@/lib/api";
import { useAuthStore } from "@/stores/auth";
import { Notification, UserProfile } from "@/types/auth";

// Define frontend-specific notification type
interface FrontendNotification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  date: string;
  icon: any;
  metadata?: Record<string, any>;
  priority: "LOW" | "MEDIUM" | "HIGH";
  isArchived: boolean;
}

const inferNotificationType = (message: string): { type: string; title: string; icon: any } => {
  const lowercaseMessage = message.toLowerCase();
  if (lowercaseMessage.includes("appointment") && lowercaseMessage.includes("confirmed")) {
    return { type: "appointment", title: "Appointment Confirmed", icon: Calendar };
  } else if (lowercaseMessage.includes("message")) {
    return { type: "message", title: "New Message", icon: MessageSquare };
  } else if (lowercaseMessage.includes("prescription")) {
    return { type: "alert", title: "Prescription Ready", icon: AlertCircle };
  } else if (lowercaseMessage.includes("payment")) {
    return { type: "success", title: "Payment Successful", icon: CheckCircle };
  } else if (lowercaseMessage.includes("reminder")) {
    return { type: "reminder", title: "Appointment Reminder", icon: Clock };
  } else if (lowercaseMessage.includes("maintenance")) {
    return { type: "info", title: "System Maintenance", icon: Info };
  } else if (lowercaseMessage.includes("new_type")) {
    return { type: "info", title: "New Type Notification", icon: Info };
  }
  return { type: "info", title: "System Update", icon: Info };
};

const mapNotification = (notification: Notification): FrontendNotification => {
  const { type, title, icon } = inferNotificationType(notification.message);
  return {
    id: notification.id,
    title,
    message: notification.message,
    type,
    read: notification.isRead,
    date: notification.createdAt,
    icon,
    metadata: notification.metadata,
    priority: notification.priority,
    isArchived: notification.isArchived,
  };
};

export function NotificationsSystem() {
  const [activeTab, setActiveTab] = useState("all");
  const [notifications, setNotifications] = useState<FrontendNotification[]>([]);
  const [notificationSettings, setNotificationSettings] = useState<
    UserProfile["notificationSettings"]
  >({
    email: { appointments: true, messages: true, reminders: true, system: false },
    push: { appointments: true, messages: true, reminders: true, system: true },
    sms: { appointments: true, messages: false, reminders: true, system: false },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [page, setPage] = useState(1);
  const [totalNotifications, setTotalNotifications] = useState(0);
  const notificationsPerPage = 10;

  const userId = useAuthStore((state) => state.userId);
  const token = useAuthStore((state) => state.token);

  // Fetch notifications and settings on mount
  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const showArchived = activeTab === "archived";
        const notificationsData = await api.get<{ notifications: Notification[]; total: number }>(
          `/notifications?skip=${(page - 1) * notificationsPerPage}&take=${notificationsPerPage}&showArchived=${showArchived}`
        );
        console.log("API Response Data:", notificationsData.data);
        const notificationsArray = Array.isArray(notificationsData.data?.notifications)
          ? notificationsData.data.notifications
          : [];
        const mappedNotifications = notificationsArray.map(mapNotification);
        setNotifications(page === 1 ? mappedNotifications : (prev) => [...prev, ...mappedNotifications]);
        setTotalNotifications(notificationsData.data.total);

        const settingsData = await api.get<UserProfile["notificationSettings"]>("/users/me/settings");
        setNotificationSettings(settingsData.data);
      } catch (err) {
        setError("Failed to load data. Please try again.");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, page, activeTab]);

  // Initialize WebSocket
  useEffect(() => {
    if (!userId || !token) return;

    const socketInstance = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000", {
      auth: { token },
    });

    socketInstance.on("connect", () => {
      console.log("Connected to WebSocket");
      socketInstance.emit("join", userId);
    });

    socketInstance.on("newNotification", (data: { notification: Notification }) => {
      setNotifications((prev) => [mapNotification(data.notification), ...prev]);
    });

    socketInstance.on("notificationRead", (updatedNotification: Notification) => {
      setNotifications((prev) =>
        prev.map((n) => (n.id === updatedNotification.id ? mapNotification(updatedNotification) : n))
      );
    });

    socketInstance.on("notificationArchived", (updatedNotification: Notification) => {
      setNotifications((prev) =>
        prev.map((n) => (n.id === updatedNotification.id ? mapNotification(updatedNotification) : n))
      );
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [userId, token]);

  const markAsRead = async (id: string) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      if (socket) {
        socket.emit("markAsRead", id);
      }
    } catch (err) {
      setError("Failed to mark as read.");
      console.error("Mark as read error:", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter((n) => !n.read);
      await Promise.all(unreadNotifications.map((n) => api.patch(`/notifications/${n.id}/read`)));
      if (socket) {
        unreadNotifications.forEach((n) => socket.emit("markAsRead", n.id));
      }
    } catch (err) {
      setError("Failed to mark all as read.");
      console.error("Mark all as read error:", err);
    }
  };

  const archiveNotification = async (id: string) => {
    try {
      await api.patch(`/notifications/${id}/archive`);
      if (socket) {
        socket.emit("archiveNotification", id);
      }
    } catch (err) {
      setError("Failed to archive notification.");
      console.error("Archive error:", err);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications(notifications.filter((notification) => notification.id !== id));
    } catch (err) {
      setError("Failed to delete notification.");
      console.error("Delete notification error:", err);
    }
  };

  const clearAll = async () => {
    try {
      await api.delete("/notifications");
      setNotifications([]);
    } catch (err) {
      setError("Failed to clear notifications.");
      console.error("Clear notifications error:", err);
    }
  };

  const filteredNotifications = notifications.filter((notification) => {
    if (activeTab === "all") return !notification.isArchived;
    if (activeTab === "unread") return !notification.read && !notification.isArchived;
    if (activeTab === "archived") return notification.isArchived;
    if (activeTab === "highPriority") return notification.priority === "HIGH" && !notification.isArchived;
    return notification.type === activeTab && !notification.isArchived;
  });

  const unreadCount = notifications.filter((notification) => !notification.read && !notification.isArchived).length;

  const getNotificationIcon = (notification: FrontendNotification) => {
    const IconComponent = notification.icon;
    let iconColorClass = "text-primary";

    switch (notification.type) {
      case "appointment":
        iconColorClass = "text-blue-500";
        break;
      case "message":
        iconColorClass = "text-indigo-500";
        break;
      case "alert":
        iconColorClass = "text-red-500";
        break;
      case "success":
        iconColorClass = "text-green-500";
        break;
      case "reminder":
        iconColorClass = "text-yellow-500";
        break;
      case "info":
        iconColorClass = "text-gray-500";
        break;
    }

    return (
      <div className={`h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center ${iconColorClass}`}>
        <IconComponent className="h-5 w-5" />
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return `Today at ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    } else if (diffInDays === 1) {
      return `Yesterday at ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const updateNotificationSetting = (
    channel: "email" | "push" | "sms",
    type: "appointments" | "messages" | "reminders" | "system",
    value: boolean
  ) => {
    setNotificationSettings((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [channel]: {
          ...prev[channel],
          [type]: value,
        },
      };
    });
  };

  const saveNotificationSettings = async () => {
    setLoading(true);
    setError(null);
    try {
      await api.put("/users/me/settings", notificationSettings);
      setError("Settings saved successfully!");
    } catch (err) {
      setError("Failed to save settings.");
      console.error("Save settings error:", err);
    } finally {
      setLoading(false);
    }
  };

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
                <Button variant="outline" size="sm" onClick={markAllAsRead} disabled={loading}>
                  Mark All as Read
                </Button>
                <Button variant="outline" size="sm" onClick={clearAll} disabled={loading}>
                  Clear All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {error && <p className="text-red-500 mb-4">{error}</p>}
              <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-4 md:grid-cols-8">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="unread">Unread</TabsTrigger>
                  <TabsTrigger value="archived">Archived</TabsTrigger>
                  <TabsTrigger value="highPriority" className="hidden md:block">
                    High Priority
                  </TabsTrigger>
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
                  {loading && page === 1 ? (
                    <div className="flex justify-center py-12">
                      <p>Loading...</p>
                    </div>
                  ) : filteredNotifications.length === 0 ? (
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
                          className={`flex items-start space-x-4 p-4 rounded-lg ${notification.read ? "bg-background" : "bg-primary/5"}`}
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
                                    <DropdownMenuItem onClick={() => archiveNotification(notification.id)}>
                                      <Archive className="mr-2 h-4 w-4" />
                                      Archive
                                    </DropdownMenuItem>
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
                              <Button
                                variant="outline"
                                size="sm"
                                className="mt-2"
                                onClick={() => {
                                  const appointmentId = notification.metadata?.appointmentId;
                                  if (appointmentId) {
                                    window.location.href = `/appointments/${appointmentId}`;
                                  } else {
                                    console.error("Appointment ID not found in notification metadata");
                                  }
                                }}
                              >
                                View Appointment
                              </Button>
                            )}
                            {notification.type === "message" && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="mt-2"
                                onClick={() => {
                                  const messageId = notification.metadata?.messageId;
                                  if (messageId) {
                                    window.location.href = `/messages/${messageId}`;
                                  } else {
                                    console.error("Message ID not found in notification metadata");
                                  }
                                }}
                              >
                                Read Message
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                      {notifications.length < totalNotifications && (
                        <div className="flex justify-center mt-4">
                          <Button onClick={() => setPage((prev) => prev + 1)} disabled={loading}>
                            {loading ? "Loading..." : "Load More"}
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
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
                      checked={notificationSettings?.email.appointments}
                      onCheckedChange={(checked) => updateNotificationSetting("email", "appointments", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-messages">Messages</Label>
                    <Switch
                      id="email-messages"
                      checked={notificationSettings?.email.messages}
                      onCheckedChange={(checked) => updateNotificationSetting("email", "messages", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-reminders">Reminders</Label>
                    <Switch
                      id="email-reminders"
                      checked={notificationSettings?.email.reminders}
                      onCheckedChange={(checked) => updateNotificationSetting("email", "reminders", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-system">System Updates</Label>
                    <Switch
                      id="email-system"
                      checked={notificationSettings?.email.system}
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
                      checked={notificationSettings?.push.appointments}
                      onCheckedChange={(checked) => updateNotificationSetting("push", "appointments", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="push-messages">Messages</Label>
                    <Switch
                      id="push-messages"
                      checked={notificationSettings?.push.messages}
                      onCheckedChange={(checked) => updateNotificationSetting("push", "messages", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="push-reminders">Reminders</Label>
                    <Switch
                      id="push-reminders"
                      checked={notificationSettings?.push.reminders}
                      onCheckedChange={(checked) => updateNotificationSetting("push", "reminders", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="push-system">System Updates</Label>
                    <Switch
                      id="push-system"
                      checked={notificationSettings?.push.system}
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
                      checked={notificationSettings?.sms.appointments}
                      onCheckedChange={(checked) => updateNotificationSetting("sms", "appointments", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="sms-messages">Messages</Label>
                    <Switch
                      id="sms-messages"
                      checked={notificationSettings?.sms.messages}
                      onCheckedChange={(checked) => updateNotificationSetting("sms", "messages", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="sms-reminders">Reminders</Label>
                    <Switch
                      id="sms-reminders"
                      checked={notificationSettings?.sms.reminders}
                      onCheckedChange={(checked) => updateNotificationSetting("sms", "reminders", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="sms-system">System Updates</Label>
                    <Switch
                      id="sms-system"
                      checked={notificationSettings?.sms.system}
                      onCheckedChange={(checked) => updateNotificationSetting("sms", "system", checked)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={saveNotificationSettings} disabled={loading}>
                {loading ? "Saving..." : "Save Settings"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}