import { useState, useEffect } from 'react';
import { notificationApi } from '@/lib/api';

export function useNotificationPreferences(userId: string) {
    const [preferences, setPreferences] = useState({
        emailAppointments: true,
        emailMessages: true,
        emailUpdates: false,
        smsAppointments: true,
        smsMessages: false,
        appAppointments: true,
        appMessages: true,
        appUpdates: false,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPreferences = async () => {
            try {
                const data = await notificationApi.getPreferences(userId);
                setPreferences(data);
            } catch (err) {
                setError('Failed to load notification preferences');
                console.error('Preferences fetch error:', err);
            } finally {
                setLoading(false);
            }
        };
        if (userId) fetchPreferences();
    }, [userId]);

    const updatePreferences = async (updatedPreferences: typeof preferences) => {
        try {
            setLoading(true);
            await notificationApi.updatePreferences(userId, updatedPreferences);
            setPreferences(updatedPreferences);
            setError(null);
        } catch (err) {
            setError('Failed to save preferences');
            console.error('Preferences update error:', err);
        } finally {
            setLoading(false);
        }
    };

    return { preferences, loading, error, updatePreferences };
}