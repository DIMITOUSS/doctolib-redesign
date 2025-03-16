// src/lib/api.ts
import axios from 'axios';
import { useAuthStore } from '@/stores/auth';
import {
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    UserProfile,
    BookAppointmentRequest,
    MedicalRecord,
    SearchDoctorsRequest,
    Availability,
    Appointment,
    Patient,
    Doctor,
    PaginatedDoctorsResponse,
    CreateUserDto,
    NotificationPreference,
    Login2FASuccessResponse,
    AppNotification,
    BannedPatient
} from '@/types/auth';

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().token;
        console.log("Request to:", config.url, "with token:", token);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            useAuthStore.getState().clearAuth();
        }
        return Promise.reject(error);
    }
);

export const authApi = {
    login: (data: LoginRequest) =>
        api.post<LoginResponse>("/auth/login", data).then((res) => res.data),
    register: (data: CreateUserDto) =>
        api.post<UserProfile>("/users/register", data).then((res) => res.data),
    forgotPassword: (data: { email: string }) =>
        api.post('/auth/forgot-password', data).then((res) => res.data),
    loginWith2FA: (tempToken: string, code: string): Promise<Login2FASuccessResponse> =>
        api.post("/auth/2fa/login", { tempToken, code }).then((res) => res.data),
};

export const protectedApi = {
    getProfile: () =>
        api.get<UserProfile>('/users/me', {
            headers: { Authorization: `Bearer ${useAuthStore.getState().token}` },
        }).then((res) => res.data),
    updateProfile: (data: Partial<UserProfile>) => {
        const userId = useAuthStore.getState().userId;
        console.log('Sending update request to:', `/users/${userId}`, 'with data:', data);
        return api.put<UserProfile>(`/users/${userId}`, data).then((res) => res.data);
    },
    changePassword: (data: { currentPassword: string; newPassword: string }) =>
        api.post('/auth/change-password', data).then((res) => res.data),
    deleteAccount: () => api.delete('/users/me').then(() => true),
    enable2FA: (method: 'email' | 'sms') => api.post('/auth/2fa/enable', { method }).then((res) => res.data),
    verify2FA: (code: string) => api.post('/auth/2fa/verify', { code }).then((res) => res.data),
    getSessions: () => api.get<{ sessions: { id: string; createdAt: string }[] }>('/auth/sessions').then((res) => res.data.sessions),
    logoutSession: (sessionId: string) => api.delete(`/auth/sessions/${sessionId}`).then(() => true),
    updatePrivacy: (data: { visibility: 'public' | 'private' | 'doctors' }) =>
        api.put('/users/me/privacy', data).then((res) => res.data),
    disable2FA: () => api.post('/auth/2fa/disable'),
};

// src/lib/api.ts (only the appointmentApi section updated)
export const appointmentApi = {
    unbanPatient: (doctorId: string, patientId: string) =>
        api.patch<void>(`/appointments/doctors/${doctorId}/patients/${patientId}/unban`).then((res) => res.data),
    confirmAppointment: (appointmentId: string) =>
        api.patch<Appointment>(`/appointments/${appointmentId}/confirm`).then((res) => res.data),
    markAsMissed: (appointmentId: string) =>
        api.patch<Appointment>(`/appointments/${appointmentId}/miss`).then((res) => res.data),
    getMissedCount: (doctorId: string, patientId: string) =>
        api.get<{ missedCount: number }>(`/appointments/doctors/${doctorId}/patients/${patientId}/missed-count`).then((res) => res.data.missedCount),
    rejectAppointment: (appointmentId: string) =>
        api.patch<Appointment>(`/appointments/${appointmentId}/reject`).then((res) => res.data),
    book: (data: { doctorId: string; patientId: string; appointmentDate: string; duration: number; type: string }) =>
        api.post<Appointment>('/appointments', data).then((res) => res.data),
    getPatientAppointments: (filters: { status?: string; startDate?: string; endDate?: string; page?: number; limit?: number } = {}) =>
        api.get<{ appointments: Appointment[]; total: number }>('/patients/appointments', { params: filters }).then((res) => res.data),
    getDoctorAppointments: (doctorId: string) =>
        api.get<Appointment[]>(`/doctors/${doctorId}/appointments`).then((res) => res.data),
    deleteAppointment: (appointmentId: string) =>
        api.delete(`/appointments/${appointmentId}`).then((res) => res.data),
    updateAppointment: (id: string, data: Partial<Appointment>) =>
        api.put<Appointment>(`/appointments/${id}`, data).then((res) => res.data),
    getById: (appointmentId: string) =>
        api.get<{ data: Appointment }>(`/appointments/${appointmentId}`).then((res) => res.data.data),
    getBannedPatients: (doctorId: string) =>
        api.get<{ data: BannedPatient[] }>(`/appointments/doctors/${doctorId}/banned-patients`).then((res) => res.data.data),
};

export const medicalRecordsApi = {
    getPatientRecords: (patientId: string) =>
        api.get<MedicalRecord[]>(`/patients/${patientId}/medical-records`).then((res) => res.data),
    uploadFile: (patientId: string, file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        return api.post(`/patients/${patientId}/files`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }).then((res) => res.data);
    },
};

export const doctorsApi = {
    markSlotsAsUnavailable: (doctorId: string, startTime: string, endTime: string) =>
        api.patch(`/availability/doctor/${doctorId}/unavailable`, { startTime, endTime }).then((res) => res.data),
    deleteAllAvailability: (doctorId: string) =>
        api.delete(`/availability/doctor/${doctorId}`).then((res) => res.data),
    getAvailability: (doctorId: string, date?: string) =>
        api.get<Availability[]>(`/doctors/${doctorId}/availability`, { params: { date } }).then((res) => res.data),
    createAvailability: (data: { doctorId: string; startTime: string; endTime: string }) =>
        api.post<Availability>('/availability', data).then((res) => res.data),
    deleteAvailability: (slotId: string) =>
        api.delete(`/availability/${slotId}`).then((res) => res.data),
    createWeeklyAvailability: (doctorId: string, weeklyHours: { day: number; start: string; end: string }[]) =>
        api.post<Availability[]>(`/availability/weekly/${doctorId}`, weeklyHours).then((res) => res.data),
    search: (params: SearchDoctorsRequest) =>
        api.get<PaginatedDoctorsResponse>('/doctors/search', { params }).then((res) => res.data),
    autocomplete: (term: string, field: string) =>
        api.get<Doctor[]>('/doctors/autocomplete', { params: { term, field } }).then((res) => res.data),
    getDoctorDetails: (doctorId: string) =>
        api.get<Doctor>(`/doctors/${doctorId}`).then((res) => res.data),
    getUpcomingAppointments: (doctorId: string) =>
        api.get<{ data: Appointment[] }>(`/doctors/${doctorId}/upcoming-appointments`)
            .then((res) => res.data.data), // Properly extract nested data
    getSpecialties: () =>
        api.get<string[]>('/doctors/specialties').then((res) => res.data),
    getCities: () =>
        api.get<string[]>('/doctors/cities').then((res) => res.data),
};

export const patientsApi = {
    getAppointmentStats: () =>
        api.get<{ statusBreakdown: { status: string; count: number }[]; monthlyTrends: { month: string; count: number }[] }>('/patients/appointment-stats').then((res) => res.data),
    getPatients: () =>
        api.get<Patient[]>('/patients').then((res) => res.data),
    getPatientDetails: (patientId: string) =>
        api.get<UserProfile>(`/patients/${patientId}`).then((res) => res.data),
    grantConsent: (patientId: string, data: { doctorId: string }) =>
        api.post<void>(`/patients/${patientId}/consent`, data).then((res) => res.data),
};

export const adminApi = {
    getPendingDoctors: (page: number = 1, limit: number = 10) =>
        api.get<{ doctors: Doctor[]; total: number }>('/admins/doctors/pending', { params: { page, limit } }).then(res => res.data),
    updateDoctorStatus: (doctorId: string, status: 'APPROVED' | 'REJECTED') =>
        api.patch<Doctor>(`/admins/doctors/${doctorId}/status`, { status }).then(res => res.data),
    getUsers: (
        page: number = 1,
        limit: number = 10,
        role?: string,
        banned?: boolean,
        filter?: { id?: string }
    ) =>
        api.get<{ users: UserProfile[]; total: number }>('/admins/users', {
            params: { page, limit, role, banned, ...filter },
        }).then(res => res.data),
    banUser: (userId: string) =>
        api.patch<UserProfile>(`/admins/users/${userId}/ban`).then(res => res.data),
    unbanUser: (userId: string) =>
        api.patch<UserProfile>(`/admins/users/${userId}/unban`).then(res => res.data),
    deleteUser: (userId: string) =>
        api.delete(`/admins/users/${userId}`).then(() => true),
};

export const notificationApi = {
    getPreferences: (userId: string) =>
        api.get<{ notifications: AppNotification[]; total: number }>('/notifications', { params: { userId } }).then((res) => res.data),
    updatePreferences: (userId: string, preferences: Partial<NotificationPreference>) =>
        api.put(`/notification-preferences/${userId}`, preferences).then((res) => res.data),
};

export default api;