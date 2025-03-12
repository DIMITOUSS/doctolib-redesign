import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { UserProfile } from "@/types/auth"; // Import UserProfile type

interface DoctorFieldsProps {
    profile: {
        specialty: string | null | undefined;
        bio: string | null | undefined;
        street: string | null | undefined;
        city: string | null | undefined;
        zipCode: string | null | undefined;
    };
    onChange: (field: keyof UserProfile, value: string | null) => void; // Updated to keyof UserProfile
}

export function DoctorFields({ profile, onChange }: DoctorFieldsProps) {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="specialty">Specialty</Label>
                <Input
                    id="specialty"
                    value={profile.specialty || ""}
                    onChange={(e) => onChange("specialty", e.target.value)}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                    id="bio"
                    value={profile.bio || ""}
                    onChange={(e) => onChange("bio", e.target.value)}
                    className="min-h-[100px]"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="street">Street</Label>
                <Input
                    id="street"
                    value={profile.street || ""}
                    onChange={(e) => onChange("street", e.target.value)}
                />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                        id="city"
                        value={profile.city || ""}
                        onChange={(e) => onChange("city", e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="zipCode">Postal Code</Label>
                    <Input
                        id="zipCode"
                        value={profile.zipCode || ""}
                        onChange={(e) => onChange("zipCode", e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
}