import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useNotificationPreferences } from "./useNotificationPreferences";

interface NotificationSettingsProps {
    userId: string;
}

export function NotificationSettings({ userId }: NotificationSettingsProps) {
    const { preferences, loading, error, updatePreferences } = useNotificationPreferences(userId);
    const [formData, setFormData] = useState(preferences);

    useEffect(() => {
        if (preferences) {
            setFormData(preferences);
        }
    }, [preferences]);

    const handleSwitchChange = (key: string) => (checked: boolean) => {
        setFormData((prev) => ({ ...prev, [key]: checked }));
    };

    const handleSave = async () => {
        await updatePreferences(formData);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Manage how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4">
                    <h3 className="font-medium">Email Notifications</h3>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="email-appointments">Appointment Reminders</Label>
                                <p className="text-sm text-muted-foreground">
                                    Receive email notifications about upcoming appointments
                                </p>
                            </div>
                            <Switch
                                id="email-appointments"
                                checked={formData.emailAppointments}
                                onCheckedChange={handleSwitchChange("emailAppointments")}
                            />
                        </div>
                        {/* Repeat for other email switches */}
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="email-messages">New Messages</Label>
                                <p className="text-sm text-muted-foreground">
                                    Receive email notifications when you get new messages
                                </p>
                            </div>
                            <Switch
                                id="email-messages"
                                checked={formData.emailMessages}
                                onCheckedChange={handleSwitchChange("emailMessages")}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="email-updates">System Updates</Label>
                                <p className="text-sm text-muted-foreground">
                                    Receive email notifications about system updates and new features
                                </p>
                            </div>
                            <Switch
                                id="email-updates"
                                checked={formData.emailUpdates}
                                onCheckedChange={handleSwitchChange("emailUpdates")}
                            />
                        </div>
                    </div>
                </div>
                <Separator />
                <div className="space-y-4">
                    <h3 className="font-medium">SMS Notifications</h3>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="sms-appointments">Appointment Reminders</Label>
                                <p className="text-sm text-muted-foreground">
                                    Receive SMS notifications about upcoming appointments
                                </p>
                            </div>
                            <Switch
                                id="sms-appointments"
                                checked={formData.smsAppointments}
                                onCheckedChange={handleSwitchChange("smsAppointments")}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="sms-messages">New Messages</Label>
                                <p className="text-sm text-muted-foreground">
                                    Receive SMS notifications when you get new messages
                                </p>
                            </div>
                            <Switch
                                id="sms-messages"
                                checked={formData.smsMessages}
                                onCheckedChange={handleSwitchChange("smsMessages")}
                            />
                        </div>
                    </div>
                </div>
                <Separator />
                <div className="space-y-4">
                    <h3 className="font-medium">In-App Notifications</h3>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="app-appointments">Appointment Reminders</Label>
                                <p className="text-sm text-muted-foreground">
                                    Receive in-app notifications about upcoming appointments
                                </p>
                            </div>
                            <Switch
                                id="app-appointments"
                                checked={formData.appAppointments}
                                onCheckedChange={handleSwitchChange("appAppointments")}
                            />
                        </div>
                        {/* Repeat for other in-app switches */}
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="app-messages">New Messages</Label>
                                <p className="text-sm text-muted-foreground">
                                    Receive in-app notifications when you get new messages
                                </p>
                            </div>
                            <Switch
                                id="app-messages"
                                checked={formData.appMessages}
                                onCheckedChange={handleSwitchChange("appMessages")}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="app-updates">System Updates</Label>
                                <p className="text-sm text-muted-foreground">
                                    Receive in-app notifications about system updates and new features
                                </p>
                            </div>
                            <Switch
                                id="app-updates"
                                checked={formData.appUpdates}
                                onCheckedChange={handleSwitchChange("appUpdates")}
                            />
                        </div>
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <Button onClick={handleSave} disabled={loading}>
                    {loading ? "Saving..." : "Save Preferences"}
                </Button>
            </CardFooter>
        </Card>
    );
}