// SettingsPages.tsx
"use client";

import { useState } from "react";
import { useAuthStore } from "@/stores/auth";
import { SettingsSidebar } from "@/hooks/SettingsSidebar";
import { ProfileSettings } from "@/hooks/ProfileSettings";
import { NotificationSettings } from "@/hooks/NotificationSettings";
import { BillingSettings } from "@/hooks/BillingSettings";
import { AccountSettings } from "./AccountSettings";
import SecuritySettings from "./SecuritySettings";
import { PrivacySettings } from "./PrivacySettings";
export function SettingsPages() {
    const { userId } = useAuthStore();
    const [activeTab, setActiveTab] = useState("profile");

    return (

        <div className="container mx-auto py-6">
            <div className="mb-8">
                <h2 className="text-3xl font-bold mb-2">Settings</h2>
            </div>
            <div className="flex flex-col md:flex-row gap-6">
                <SettingsSidebar activeTab={activeTab} onTabChange={setActiveTab} />

                <div className="flex-1">
                    {activeTab === "profile" && <ProfileSettings />}
                    {activeTab === "notifications" && userId && <NotificationSettings userId={userId} />}
                    {activeTab === "security" && <SecuritySettings />}
                    {activeTab === "billing" && <BillingSettings />}
                    {activeTab === "account" && <AccountSettings />} {/* Fixed: Only AccountSettings */}
                    {activeTab === "privacy" && <PrivacySettings />} {/* Fixed: Privacy tab */

                    }

                </div>

            </div>
        </div>
    );
}