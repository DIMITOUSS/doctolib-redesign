import { useState } from 'react';
import { protectedApi } from '@/lib/api';
import { useAuthStore } from '@/stores/auth';

const SecuritySettings = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const userId = useAuthStore((state) => state.userId);

    const handleChangePassword = async () => {
        try {
            await protectedApi.changePassword({ currentPassword, newPassword });
            setMessage('CREDENTIALS ROTATED • SECURE');
            setCurrentPassword('');
            setNewPassword('');
        } catch (error) {
            setMessage('AUTH FAILURE • INTRUSION DETECTED');
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-[#0a0a0a] to-black p-8 flex items-center justify-center">
            <div className="w-full max-w-2xl border-2 border-white/10 bg-black/50 backdrop-blur-xl">
                <div className="grid grid-cols-5 divide-x-2 divide-white/5">
                    {/* Left Panel - Security Matrix */}
                    <div className="col-span-2 p-8 space-y-6 border-r-2 border-white/5">
                        <div className="animate-pulse">
                            <div className="text-sm font-mono text-white/50 tracking-widest">
                                {Array(6).fill(null).map((_, i) => (
                                    <div key={i} className="flex justify-between">
                                        <span>{'◼◼◼◼◼◼◼◼'}</span>
                                        <span className="text-white/20">{Math.floor(Math.random() * 100)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="h-1 bg-white/5 animate-glow-pulse" />
                        <div className="font-mono text-xs text-white/30 tracking-wider">
                            <div>SECURE ENCLAVE v4.2</div>
                            <div>QUANTUM-RESISTANT</div>
                            <div>FIDO2 CERTIFIED</div>
                        </div>
                    </div>

                    {/* Right Panel - Controls */}
                    <div className="col-span-3 p-8 space-y-8">
                        <div className="font-mono text-2xl text-white border-b-2 border-white/10 pb-4">
                            CRYPTOGRAPHIC ROTATION
                        </div>

                        <div className="space-y-6">
                            <div className="relative group">
                                <input
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="w-full bg-transparent border-2 border-white/10 px-4 py-3 font-mono 
                                               focus:border-white/30 focus:ring-0 focus:outline-none 
                                               transition-all duration-300 placeholder-transparent"
                                    placeholder=" "
                                />
                                <label className="absolute left-4 -top-2.5 px-1 bg-black text-xs font-mono text-white/50 
                                                  group-focus-within:text-white/80 transition-all duration-300">
                                    CURRENT CIPHER
                                </label>
                                <div className="absolute right-4 top-3.5 text-white/20 group-focus-within:hidden">••••••••</div>
                            </div>

                            <div className="relative group">
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full bg-transparent border-2 border-white/10 px-4 py-3 font-mono 
                                               focus:border-white/30 focus:ring-0 focus:outline-none 
                                               transition-all duration-300 placeholder-transparent"
                                    placeholder=" "
                                />
                                <label className="absolute left-4 -top-2.5 px-1 bg-black text-xs font-mono text-white/50 
                                                  group-focus-within:text-white/80 transition-all duration-300">
                                    NEW TURING PATTERN
                                </label>
                                <div className="absolute right-4 top-3.5 text-white/20 group-focus-within:hidden">§§§§§§§§</div>
                            </div>
                        </div>

                        <button
                            onClick={handleChangePassword}
                            className="w-full py-4 border-2 border-white/10 bg-white/5 font-mono uppercase 
                                    tracking-widest hover:bg-white/10 hover:border-white/30 
                                    active:bg-black active:text-white/80 transition-all duration-200
                                    flex items-center justify-center gap-2 group"
                        >
                            <span>INITIATE ROTATION</span>
                            <span className="text-white/50 group-hover:text-white/80 transition-all">⌘</span>
                        </button>

                        {message && (
                            <div className="border-2 border-white/10 p-4 font-mono text-sm 
                                        animate-terminal-in">
                                <div className="flex items-center gap-2">
                                    <div className={`h-2 w-2 ${message.includes('SECURE') ? 'bg-green-500' : 'bg-red-500'}`} />
                                    <div className="text-white/80">{message}</div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Background Matrix Pattern */}
            <div className="fixed inset-0 -z-10 opacity-10 [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_70%)]">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOCIgaGVpZ2h0PSI4IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0wIDBoOHY4SDB6IiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTggMEgwdjgiIGZpbGw9IiNmZmYiIHN0cm9rZS13aWR0aD0iMC41IiBzdHJva2U9IiNmZmYiLz48L3N2Zz4=')]" />
            </div>
        </div>
    );
};

export default SecuritySettings;