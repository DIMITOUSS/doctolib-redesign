// hooks/PrivacySettings.tsx
"use client";

import React, { useState, useEffect } from "react";
import { protectedApi } from "@/lib/api";
import { Button } from "@/components/ui/button";

export function PrivacySettings() {
    const [visibility, setVisibility] = useState<"public" | "private" | "doctors">("public");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        protectedApi.getProfile().then((profile) => {
            setVisibility(profile.visibility || "public");
        }).catch((err) => {
            setError("Failed to load privacy settings");
        });
    }, []);

    const handleUpdatePrivacy = async () => {
        try {
            await protectedApi.updatePrivacy({ visibility });
            setSuccess("Privacy settings updated");
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to update privacy");
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Privacy Settings</h2>
            <div className="space-y-4">
                <label>Data Visibility</label>
                <select
                    value={visibility}
                    onChange={(e) => setVisibility(e.target.value as "public" | "private" | "doctors")}
                >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                    <option value="doctors">Doctors Only</option>
                </select>
                <Button onClick={handleUpdatePrivacy}>Save</Button>
                {error && <p className="text-red-500">{error}</p>}
                {success && <p className="text-green-500">{success}</p>}
            </div>
        </div>
    );
}