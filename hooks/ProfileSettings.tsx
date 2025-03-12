import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileFields } from "@/components/ProfileFields";
import { DoctorFields } from "@/components/DoctorFields";
import { useProfile } from "./useProfile";
import { SetUserProfile, UserProfile } from "@/types/auth";

export function ProfileSettings() {
    const { profile, loading, error, updateProfile } = useProfile();
    const [formData, setFormData] = useState<SetUserProfile | null>(null);

    useEffect(() => {
        if (profile) {
            setFormData(profile);
        }
    }, [profile]);

    const handleChange = (field: keyof UserProfile, value: string | null) => {
        setFormData((prev) => (prev ? { ...prev, [field]: value } : null));
    };

    const handleSave = async () => {
        if (formData) {
            await updateProfile(formData);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>; // Improved error display
    if (!formData) return null;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>Manage your personal information and profile details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <ProfileFields
                    profile={{
                        firstName: formData.firstName || null,
                        lastName: formData.lastName || null,
                        email: formData.email,
                        phone: formData.phone || null,
                        profilePicture: formData.image || null,
                    }}
                    onChange={handleChange}
                />
                {formData.role === "DOCTOR" && (
                    <DoctorFields
                        profile={{
                            specialty: formData.specialty || null,
                            bio: formData.bio || null,
                            street: formData.street || null,
                            city: formData.city || null,
                            zipCode: formData.zipCode || null,
                        }}
                        onChange={handleChange}
                    />
                )}
            </CardContent>
            <CardFooter>
                <Button onClick={handleSave} disabled={loading}>
                    {loading ? "Saving..." : "Save Changes"}
                </Button>
            </CardFooter>
        </Card>
    );
}