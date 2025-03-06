'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth';

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const { initializeAuth, checkAuth, role } = useAuthStore();
    const [isLoading, setIsLoading] = useState(true);

    // Define public routes
    const publicRoutes = ['/login', '/register', '/'];
    const isPublicRoute = publicRoutes.includes(pathname);

    useEffect(() => {
        const verifyAuth = async () => {
            await initializeAuth();
            setIsLoading(false);

            const isAuthenticated = checkAuth();

            // Redirect logic for authenticated users
            if (isAuthenticated) {
                if (isPublicRoute) {
                    // If logged-in user tries to access login/register, redirect based on role
                    switch (role) {
                        case 'DOCTOR':
                            router.push('/doctor/dashboard');
                            break;
                        case 'PATIENT':
                            router.push('/patient/dashboard');
                            break;
                        case 'ADMIN':
                            router.push('/admin/dashboard');
                            break;
                        default:
                            router.push('/unauthorized'); // Redirect unknown roles
                    }
                }
            } else if (!isAuthenticated && !isPublicRoute) {
                // If unauthenticated user tries to access a protected route, send to login
                router.push('/login');
            }
        };

        verifyAuth();
    }, [pathname, checkAuth, router, initializeAuth, role, isPublicRoute]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-pulse text-blue-500">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full" />
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
