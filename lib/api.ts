// /lib/api.ts
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
    NotificationPreference
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
        api.post<LoginResponse>("/users/login", data).then((res) => res.data),
    register: (data: CreateUserDto) =>
        api.post<UserProfile>("/users/register", data).then((res) => res.data),
};

export const protectedApi = {
    getProfile: () => api.get<UserProfile>('/users/me').then((res) => res.data),
    updateProfile: (data: Partial<UserProfile>) => {
        const userId = useAuthStore.getState().userId;
        console.log('Sending update request to:', `/users/${userId}`, 'with data:', data);
        return api.put<UserProfile>(`/users/${userId}`, data).then((res) => res.data);
    },
    changePassword: (data: { currentPassword: string; newPassword: string }) =>
        api.post('/users/change-password', data).then((res) => res.data),
};

export const appointmentApi = {
    book: (data: { doctorId: string; patientId: string; appointmentDate: string; duration: number; type: string }) =>
        api.post<Appointment>('/appointments', data).then((res) => res.data),
    getPatientAppointments: () =>
        api.get<Appointment[]>('/patients/appointments').then((res) => res.data),
    getDoctorAppointments: (doctorId: string) =>
        api.get<Appointment[]>(`/doctors/${doctorId}/appointments`).then((res) => res.data),
    deleteAppointment: (appointmentId: string) =>
        api.delete(`/appointments/${appointmentId}`).then((res) => res.data),
    updateAppointment: (id: string, data: Partial<Appointment>) =>
        api.put<Appointment>(`/appointments/${id}`, data).then((res) => res.data),
    getById: (appointmentId: string) =>
        api.get<{ data: Appointment }>(`/appointments/${appointmentId}`)
            .then((res) => res.data.data), // ✅ FIX: Return only `data`

};

export const medicalRecordsApi = {
    getPatientRecords: () =>
        api.get<MedicalRecord[]>('/patients/medical-records').then((res) => res.data),
    uploadFile: (patientId: string, file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        return api.post(`/patients/${patientId}/files`, formData).then((res) => res.data);
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
    getUpcomingAppointments: (doctorId: string) => // Fix: Use api instead of protectedApi
        api.get<Appointment[]>(`/doctors/${doctorId}/upcoming-appointments`).then((res) => res.data),
};

export const patientsApi = {
    getPatients: () =>
        api.get<Patient[]>('/patients').then((res) => res.data),
};
// Add this to lib/api.ts
export const notificationApi = {
    getPreferences: (userId: string) =>
        api.get(`/notification-preferences/${userId}`).then((res) => res.data),
    updatePreferences: (userId: string, preferences: Partial<NotificationPreference>) =>
        api.put(`/notification-preferences/${userId}`, preferences).then((res) => res.data),
};

export default api;