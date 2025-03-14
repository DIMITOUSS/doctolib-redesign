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
    const [is2FAPending, setIs2FAPending] = useState(false); // New state for 2FA setup flow

    useEffect(() => {
        // Fetch current 2FA status from profile
        protectedApi
            .getProfile()
            .then((profile) => setTwoFactorEnabled(profile.twoFactorEnabled || false))
            .catch(() => setError("Failed to load profile"));
    }, []);

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        try {
            await protectedApi.changePassword({ currentPassword, newPassword });
            setSuccess("Password changed successfully");
            setCurrentPassword("");
            setNewPassword("");
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to change password");
        }
    };

    const handleEnable2FA = async () => {
        setError("");
        setSuccess("");
        try {
            await protectedApi.enable2FA(twoFactorMethod);
            setIs2FAPending(true);
            setSuccess(`2FA code sent via ${twoFactorMethod}. Please verify.`);
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to enable 2FA");
        }
    };

    const handleVerify2FA = async () => {
        setError("");
        setSuccess("");
        try {
            await protectedApi.verify2FA(twoFactorCode);
            setTwoFactorEnabled(true);
            setIs2FAPending(false);
            setTwoFactorCode("");
            setSuccess("2FA enabled successfully");
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to verify 2FA");
        }
    };

    const handleDisable2FA = async () => {
        setError("");
        setSuccess("");
        try {
            await protectedApi.disable2FA();
            setTwoFactorEnabled(false);
            setSuccess("2FA disabled successfully");
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to disable 2FA");
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Security Settings</h2>

            {/* Password Change Form */}
            <form onSubmit={handleChangePassword} className="space-y-4 mb-6">
                <div>
                    <label className="block text-sm font-medium">Current Password</label>
                    <Input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="mt-1"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">New Password</label>
                    <Input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="mt-1"
                    />
                </div>
                <Button type="submit">Change Password</Button>
            </form>

            {/* 2FA Section */}
            <div className="mt-6">
                <h3 className="text-xl font-semibold mb-2">Two-Factor Authentication</h3>
                {!twoFactorEnabled && !is2FAPending ? (
                    <div className="space-y-2">
                        <label className="block text-sm font-medium">2FA Method</label>
                        <select
                            value={twoFactorMethod}
                            onChange={(e) => setTwoFactorMethod(e.target.value as "email" | "sms")}
                            className="border rounded p-2 w-full"
                        >
                            <option value="email">Email</option>
                            <option value="sms">SMS</option>
                        </select>
                        <Button onClick={handleEnable2FA}>Enable 2FA</Button>
                    </div>
                ) : is2FAPending ? (
                    <div className="space-y-2">
                        <Input
                            placeholder="Enter 2FA Code"
                            value={twoFactorCode}
                            onChange={(e) => setTwoFactorCode(e.target.value)}
                        />
                        <Button onClick={handleVerify2FA}>Verify Code</Button>
                    </div>
                ) : (
                    <div>
                        <p className="text-green-600">2FA is enabled via {twoFactorMethod}</p>
                        <Button variant="destructive" onClick={handleDisable2FA} className="mt-2">
                            Disable 2FA
                        </Button>
                    </div>
                )}
            </div>

            {/* Feedback Messages */}
            {error && <p className="text-red-500 mt-4">{error}</p>}
            {success && <p className="text-green-500 mt-4">{success}</p>}
        </div>
    );
}