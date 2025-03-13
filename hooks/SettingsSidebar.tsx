import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { User, Bell, Shield, CreditCard, Globe, HelpCircle, AtomIcon, WholeWordIcon } from "lucide-react";

interface SettingsSidebarProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

export function SettingsSidebar({ activeTab, onTabChange }: SettingsSidebarProps) {
    const tabs = [
        { id: "profile", label: "Profile", icon: User },
        { id: "notifications", label: "Notifications", icon: Bell },
        { id: "security", label: "Security", icon: Shield },
        { id: "billing", label: "Billing", icon: CreditCard },
        { id: "language", label: "Language", icon: Globe },
        { id: "help", label: "Help & Support", icon: HelpCircle },
        { id: "account", label: "Account", icon: AtomIcon },
        { id: "privacy", label: "Privacy", icon: WholeWordIcon },
    ];

    return (
        <Card className="md:w-64 flex-shrink-0">
            <CardContent className="p-4">
                <nav className="flex flex-col space-y-1">
                    {tabs.map((tab) => (
                        <Button
                            key={tab.id}
                            variant={activeTab === tab.id ? "default" : "ghost"}
                            className="justify-start"
                            onClick={() => onTabChange(tab.id)}
                        >
                            <tab.icon className="mr-2 h-4 w-4" />
                            {tab.label}
                        </Button>
                    ))}
                </nav>
            </CardContent>
        </Card>
    );
}