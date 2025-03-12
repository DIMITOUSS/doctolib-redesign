import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CreditCard } from "lucide-react";

export function BillingSettings() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Billing Settings</CardTitle>
                <CardDescription>Manage your subscription and payment methods</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4">
                    <h3 className="font-medium">Current Plan</h3>
                    <div className="rounded-md border p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Professional Plan</p>
                                <p className="text-sm text-muted-foreground">$49.99/month • Renews on November 15, 2023</p>
                            </div>
                            <Button variant="outline">Change Plan</Button>
                        </div>
                    </div>
                </div>
                <Separator />
                <div className="space-y-4">
                    <h3 className="font-medium">Payment Methods</h3>
                    <div className="space-y-2">
                        <div className="rounded-md border p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="h-10 w-16 rounded-md bg-muted flex items-center justify-center">
                                        <CreditCard className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Visa ending in 4242</p>
                                        <p className="text-sm text-muted-foreground">Expires 12/2025</p>
                                    </div>
                                </div>
                                <Badge>Default</Badge>
                            </div>
                        </div>
                    </div>
                    <Button variant="outline">Add Payment Method</Button>
                </div>
                {/* Billing History table omitted for brevity */}
            </CardContent>
        </Card>
    );
}