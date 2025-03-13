// hooks/AccountSettings.tsx
"use client";

import React, { useState } from "react";
import { protectedApi } from "@/lib/api";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function AccountSettings() {
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const { clearAuth } = useAuthStore();
    const router = useRouter();

    const handleDeleteAccount = async () => {
        if (!confirm("Are you sure you want to delete your account? This cannot be undone.")) return;

        try {
            await protectedApi.deleteAccount();
            setSuccess("Account deleted successfully");
            clearAuth();
            router.push("/auth/login");
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to delete account");
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Account Settings</h2>
            <p className="text-muted-foreground mb-4">Manage your account</p>
            <div className="space-y-4">
                <Button variant="destructive" onClick={handleDeleteAccount}>
                    Delete Account
                </Button>
                {error && <p className="text-red-500">{error}</p>}
                {success && <p className="text-green-500">{success}</p>}
            </div>
        </div>
    );
}