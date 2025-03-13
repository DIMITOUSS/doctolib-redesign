// hooks/SecuritySettings.tsx
"use client";

import React, { useState, useEffect } from "react";
import { protectedApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SecuritySettings() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
    const [twoFactorCode, setTwoFactorCode] = useState("");
    const [twoFactorMethod, setTwoFactorMethod] = useState<"email" | "sms">("email");

    useEffect(() => {
        // Fetch current 2FA status (assume backend returns it with profile)
        protectedApi.getProfile().then((profile) => setTwoFactorEnabled(profile.twoFactorEnabled || false));
    }, []);

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        try {
            await protectedApi.changePassword({ currentPassword, newPassword });
            setSuccess("Password changed successfully");
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to change password");
        }
    };

    const handleEnable2FA = async () => {
        try {
            await protectedApi.enable2FA(twoFactorMethod);
            setSuccess("2FA code sent. Please verify.");
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to enable 2FA");
        }
    };

    const handleVerify2FA = async () => {
        try {
            await protectedApi.verify2FA(twoFactorCode);
            setTwoFactorEnabled(true);
            setSuccess("2FA enabled successfully");
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to verify 2FA");
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Security Settings</h2>
            <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                    <label>Current Password</label>
                    <Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                </div>
                <div>
                    <label>New Password</label>
                    <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                </div>
                <Button type="submit">Change Password</Button>
            </form>
            <div className="mt-6">
                <h3 className="text-xl font-semibold">Two-Factor Authentication</h3>
                {!twoFactorEnabled ? (
                    <div className="space-y-2">
                        <select value={twoFactorMethod} onChange={(e) => setTwoFactorMethod(e.target.value as "email" | "sms")}>
                            <option value="email">Email</option>
                            <option value="sms">SMS</option>
                        </select>
                        <Button onClick={handleEnable2FA}>Enable 2FA</Button>
                        <Input
                            placeholder="Enter 2FA Code"
                            value={twoFactorCode}
                            onChange={(e) => setTwoFactorCode(e.target.value)}
                        />
                        <Button onClick={handleVerify2FA}>Verify</Button>
                    </div>
                ) : (
                    <p>2FA is enabled</p>
                )}
            </div>
            {error && <p className="text-red-500 mt-4">{error}</p>}
            {success && <p className="text-green-500 mt-4">{success}</p>}
        </div>
    );
}