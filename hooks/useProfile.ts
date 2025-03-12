import { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios for error checking
import { protectedApi } from '@/lib/api';
import { SetUserProfile } from '@/types/auth';
import { useAuthStore } from '@/stores/auth';

export function useProfile() {
    const [profile, setProfile] = useState<SetUserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await protectedApi.getProfile();
                setProfile({
                    role: data.role,
                    email: data.email,
                    createdAt: data.createdAt,
                    updatedAt: data.updatedAt,
                    gender: data.gender,
                    licenseNumber: data.licenseNumber ?? undefined,
                    street: data.street ?? undefined,
                    city: data.city ?? undefined,
                    zipCode: data.zipCode ?? undefined,
                    country: data.country ?? undefined,
                    googleTokens: data.googleTokens ?? undefined,
                    specialty: data.specialty ?? undefined,
                    skills: data.skills ?? undefined,
                    firstName: data.firstName ?? undefined,
                    lastName: data.lastName ?? undefined,
                    phone: data.phone ?? undefined,
                    address: data.address ?? undefined,
                    password: data.password ?? undefined,
                    emergencyContact: data.emergencyContact ?? undefined,
                    bloodType: data.bloodType ?? undefined,
                    allergies: data.allergies ?? undefined,
                    medicalConditions: data.medicalConditions ?? undefined,
                    bio: data.bio ?? undefined,
                    education: data.education ?? undefined,
                    experience: data.experience ?? undefined,
                });
            } catch (err: any) {
                setError('Failed to load profile data');
                console.error('Profile fetch error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const updateProfile = async (updatedProfile: SetUserProfile) => {
        try {
            setLoading(true);
            const userId = useAuthStore.getState().userId;
            console.log('Updating profile for userId:', userId);
            if (!userId) {
                throw new Error('User ID is missing');
            }

            // Define allowed fields to prevent sending unexpected data
            const updatableFields = [
                'firstName', 'lastName', 'email', 'phone', 'gender', 'specialty', 'bio',
                'street', 'city', 'zipCode', 'country', 'licenseNumber', 'skills',
                'emergencyContact', 'bloodType', 'allergies', 'medicalConditions',
                'education', 'experience'
            ];
            const cleanProfile = Object.fromEntries(
                Object.entries(updatedProfile)
                    .filter(([key, value]) => updatableFields.includes(key) && value !== undefined)
            );

            const response = await protectedApi.updateProfile(cleanProfile);
            setProfile({ ...updatedProfile, ...response });
            setError(null);
        } catch (err: any) {
            console.error('Profile update error:', err);
            if (axios.isAxiosError(err) && err.response) {
                const status = err.response.status;
                const message = err.response.data?.message || err.response.statusText;
                setError(`Failed to save profile: ${message} (Status: ${status})`);
            } else if (err.request) {
                setError('No response received from server');
            } else {
                setError(`Error: ${err.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    return { profile, loading, error, updateProfile };
}