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
    DoctorAvailability,
    Appointment,
    Patient,
    Availability,
    Doctor, // Add Patient type
} from '@/types/auth';

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Attach Token to Requests
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

// Response Interceptor: Handle Unauthorized Access
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
    register: (data: RegisterRequest) =>
        api.post<UserProfile>("/users/register", data).then((res) => res.data),
    // logout: () => api.post("/users/logout"), // Removed - no backend endpoint; add if implemented
};

export const protectedApi = {
    getProfile: () => api.get<UserProfile>('/users/me').then((res) => res.data),
    updateProfile: (data: Partial<UserProfile>) =>
        api.put<UserProfile>(`/users/${useAuthStore.getState().userId}`, data).then((res) => res.data),
};

export const appointmentApi = {
    book: (data: BookAppointmentRequest) =>
        api.post<Appointment>('/appointments', data).then((res) => res.data),
    getPatientAppointments: () => // Adjusted to use auth user ID
        api.get<Appointment[]>('/patients/appointments').then((res) => res.data),
    getDoctorAppointments: (doctorId: string) =>
        api.get<Appointment[]>(`/doctors/${doctorId}/appointments`).then((res) => res.data),
    deleteAppointment: (appointmentId: string) =>
        api.delete(`/appointments/${appointmentId}`).then((res) => res.data),
    // In api.ts
    updateAppointment: (id: string, data: Partial<Appointment>) =>
        api.put<Appointment>(`/appointments/${id}`, data).then((res) => res.data)
};

export const medicalRecordsApi = {
    getPatientRecords: () => // Adjusted to use auth user ID
        api.get<MedicalRecord[]>('/patients/medical-records').then((res) => res.data),
    uploadFile: (patientId: string, file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        return api.post(`/patients/${patientId}/files`, formData).then((res) => res.data);
    },
};

export const doctorsApi = {
    search: (params: SearchDoctorsRequest) =>
        api.get<Doctor[]>('/doctors/search', { params }).then((res) => res.data),
    getAvailability: (doctorId: string) =>
        api.get<Availability[]>(`/doctors/${doctorId}/availability`).then((res) => res.data),
    createAvailability: (data: { doctorId: string; startTime: string; endTime: string }) =>
        api.post<Availability>('/availability', data).then((res) => res.data),
    deleteAvailability: (slotId: string) =>
        api.delete(`/availability/${slotId}`).then((res) => res.data),
    createWeeklyAvailability: (doctorId: string, weeklyHours: { day: number; start: string; end: string }[]) =>
        api.post<Availability[]>(`/availability/weekly/${doctorId}`, weeklyHours).then((res) => res.data),
};

// New patientsApi for ScheduleManagement patient selection
export const patientsApi = {
    getPatients: () =>
        api.get<Patient[]>('/patients').then((res) => res.data),
};

export default api;