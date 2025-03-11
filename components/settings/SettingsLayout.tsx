import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { User, Bell, Shield, CreditCard, Globe, HelpCircle } from "lucide-react";

// Define tabs per role
const TABS = {
    doctor: ["profile", "notifications", "security", "billing", "language", "help"],
    patient: ["profile", "notifications", "security", "language", "help"],
    admin: ["profile", "security", "billing", "help"],
};

export function SettingsLayout({ user, children }) {
    const [activeTab, setActiveTab] = useState("profile");

    useEffect(() => {
        if (!TABS[user.role]?.includes(activeTab)) {
            setActiveTab(TABS[user.role][0]); // Default to first available tab
        }
    }, [user.role]);

    return (
        <div className="container mx-auto py-6">
            <h2 className="text-3xl font-bold mb-2">Settings</h2>
            <p className="text-muted-foreground">Manage your account settings</p>

            <div className="flex flex-col md:flex-row gap-6">
                {/* Sidebar Navigation */}
                <nav className="md:w-64 flex-shrink-0">
                    {TABS[user.role].map((tab) => (
                        <Button
                            key={tab}
                            variant={activeTab === tab ? "default" : "ghost"}
                            className="justify-start w-full mb-2"
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab === "profile" && <User className="mr-2 h-4 w-4" />}
                            {tab === "notifications" && <Bell className="mr-2 h-4 w-4" />}
                            {tab === "security" && <Shield className="mr-2 h-4 w-4" />}
                            {tab === "billing" && <CreditCard className="mr-2 h-4 w-4" />}
                            {tab === "language" && <Globe className="mr-2 h-4 w-4" />}
                            {tab === "help" && <HelpCircle className="mr-2 h-4 w-4" />}
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </Button>
                    ))}
                </nav>

                {/* Content Area */}
                <div className="flex-1">{children}</div>
            </div>
        </div>
    );
}
