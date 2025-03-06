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
    DoctorAvailability
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
        api.post("/users/register", data).then((res) => res.data),

    logout: () => api.post("/users/logout"),
};

// Use /users/me endpoint to get the current user's profile.
export const protectedApi = {
    getProfile: () => api.get<UserProfile>('/users/me'),
    updateProfile: (data: Partial<UserProfile>) => api.put('/users/me', data),
};

export const appointmentApi = {
    book: (data: BookAppointmentRequest) => api.post('/appointments', data),
    getPatientAppointments: (patientId: string) => api.get(`/patients/${patientId}/appointments`),
    getDoctorAppointments: (doctorId: string) => api.get(`/doctors/${doctorId}/appointments`),
};

export const medicalRecordsApi = {
    // Assuming your backend expects GET /medical-records/patient/:patientId
    getPatientRecords: (patientId: string) => api.get<MedicalRecord[]>(`/medical-records/patient/${patientId}`),
    uploadFile: (patientId: string, file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        return api.post(`/patients/${patientId}/files`, formData);
    },
};

export const doctorsApi = {
    search: (params: SearchDoctorsRequest) => api.get('/doctors/search', { params }),
    getAvailability: (doctorId: string) => api.get<DoctorAvailability>(`/doctors/${doctorId}/availability`),
};

export default api;
