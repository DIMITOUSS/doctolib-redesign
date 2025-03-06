import axios from 'axios'
import { useAuthStore } from '@/stores/auth'


export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
    headers: {
        'Content-Type': 'application/json',
    },
})

// Request interceptor
api.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().token
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => Promise.reject(error)
)

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            useAuthStore.getState().clearAuth()
        }
        return Promise.reject(error)
    }
)

// Auth API
export const authApi = {
    login: (email: string, password: string) =>
        api.post<{
            accessToken: string;
            user: {
                id: string;
                role: 'PATIENT' | 'DOCTOR' | 'ADMIN';
                email: string;
            };
        }>('/users/login', { email, password }),


    register: (data: {
        role: string
        email: string
        password: string
        firstName?: string
        lastName?: string
        phone?: string
        address?: string
    }) => api.post('/users/register', data),

    logout: () => api.post('/users/logout'),
}

// Protected API endpoints
export const protectedApi = {
    getProfile: () => api.get('/users/me'),
    updateProfile: (data: any) => api.patch('/users/me', data),
}

// Appointments API
export const appointmentApi = {
    book: (doctorId: string, patientId: string, date: string) =>
        api.post('/appointments', { doctorId, patientId, date }),

    getPatientAppointments: (patientId: string) =>
        api.get(`/patients/${patientId}/appointments`),

    getDoctorAppointments: (doctorId: string) =>
        api.get(`/doctors/${doctorId}/appointments`),
}

// Medical Records API
export const medicalRecordsApi = {
    getPatientRecords: (patientId: string) =>
        api.get(`/patients/${patientId}/medical-records`),

    uploadFile: (patientId: string, file: File) => {
        const formData = new FormData()
        formData.append('file', file)
        return api.post(`/patients/${patientId}/files`, formData)
    },
}

// Doctors API
export const doctorsApi = {
    search: (params: Record<string, string>) =>
        api.get('/doctors/search', { params }),

    getAvailability: (doctorId: string) =>
        api.get(`/doctors/${doctorId}/availability`),
}

export default api