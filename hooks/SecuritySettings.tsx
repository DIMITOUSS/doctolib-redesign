import { useState } from 'react';
import { protectedApi } from '@/lib/api';
import { useAuthStore } from '@/stores/auth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const SecuritySettings = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const userId = useAuthStore((state) => state.userId);

    const handleChangePassword = async () => {
        try {
            await protectedApi.changePassword({ currentPassword, newPassword });
            setMessage('Password changed successfully!');
            setCurrentPassword('');
            setNewPassword('');
        } catch (error) {
            setMessage('Failed to change password. Please check your current password.');
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen bg-black p-8">
            <div className="max-w-md mx-auto bg-white rounded-xl shadow-2xl p-6 space-y-6">
                <h2 className="text-3xl font-bold text-black mb-8 border-b-2 border-gray-200 pb-4">
                    Security Settings
                </h2>

                <div className="space-y-8">
                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-gray-700">
                            Current Password
                            <Input
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="mt-2 block w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent focus:outline-none transition-all"
                                placeholder="••••••••"
                            />
                        </label>

                        <label className="block text-sm font-medium text-gray-700">
                            New Password
                            <Input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="mt-2 block w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent focus:outline-none transition-all"
                                placeholder="••••••••"
                            />
                        </label>
                    </div>

                    <Button
                        onClick={handleChangePassword}
                        className="w-full py-3 px-4 bg-black text-black font-semibold rounded-lg hover:bg-gray-900 transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
                    >
                        Update Security Credentials
                    </Button>

                    {message && (
                        <div className={`p-4 rounded-lg ${message.includes('successfully') ? 'bg-gray-100' : 'bg-gray-100 border-2 border-gray-300'} flex items-center space-x-3`}>
                            <svg
                                className={`w-5 h-5 ${message.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                {message.includes('successfully') ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                )}
                            </svg>
                            <span className="text-sm text-gray-700">{message}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SecuritySettings;