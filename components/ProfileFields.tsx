import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import { useState } from "react";
import { UserProfile } from "@/types/auth"; // Import UserProfile type
import { Separator } from "./ui/separator";

interface ProfileFieldsProps {
    profile: {
        firstName: string | null | undefined;
        lastName: string | null | undefined;
        email: string | null | undefined;
        phone: string | null | undefined;
        profilePicture: string | null | undefined;
    };
    onChange: (field: keyof UserProfile, value: string | null) => void; // Updated to keyof UserProfile
}

export function ProfileFields({ profile, onChange }: ProfileFieldsProps) {
    const [pictureUrl, setPictureUrl] = useState(profile.profilePicture);

    const handleUpload = () => {
        setPictureUrl("/mock-profile.jpg"); // Mock upload
        onChange("image", "/mock-profile.jpg"); // Use "image" to match Doctor interface
    };

    const handleRemove = () => {
        setPictureUrl(null);
        onChange("image", null); // Use "image" to match Doctor interface
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                <Avatar className="h-24 w-24">
                    <AvatarImage src={pictureUrl || undefined} alt="Profile" />
                    <AvatarFallback>
                        {profile.firstName?.charAt(0) || "U"}{profile.lastName?.charAt(0) || "S"}
                    </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                    <h3 className="font-medium">Profile Picture</h3>
                    <p className="text-sm text-muted-foreground">Upload a new profile picture</p>
                    <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={handleUpload}>
                            <Upload className="mr-2 h-4 w-4" />
                            Upload
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleRemove} disabled={!pictureUrl}>
                            Remove
                        </Button>
                    </div>
                </div>
            </div>

            <Separator />

            <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="first-name">First Name</Label>
                    <Input
                        id="first-name"
                        value={profile.firstName || ""}
                        onChange={(e) => onChange("firstName", e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="last-name">Last Name</Label>
                    <Input
                        id="last-name"
                        value={profile.lastName || ""}
                        onChange={(e) => onChange("lastName", e.target.value)}
                    />
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value={profile.email || ""} readOnly />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                        id="phone"
                        value={profile.phone || ""}
                        onChange={(e) => onChange("phone", e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
}