// src/types/auth.ts

export type UserRole = 'PATIENT' | 'DOCTOR' | 'ADMIN';

// 🔹 Interface for User Information
export interface User {
    id: string

    role: UserRole;
    email: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    address?: string;
    birthDate: string
    password: string

    emergencyContact: string
    bloodType: string
    allergies: string
    medicalConditions: string
}

// 🔹 Interface for Register API Request
export interface RegisterRequest extends User {
    password: string;

    // Doctor-specific fields (optional for Patients & Admins)
    bio?: string;
    education?: string;
    experience?: string;
    specialization?: string;
    licenseNumber?: string;
    confirmPassword: string
}

// 🔹 Interface for Login API Request
export interface LoginRequest {
    email: string;
    password: string;
}

// 🔹 Interface for Login API Response
export interface LoginResponse {
    accessToken: string;
    user: User;
}

// 🔹 Interface for Protected User Profile Response
export interface UserProfile extends User {
    createdAt: string;
    updatedAt: string;
}

// 🔹 Interface for Appointments
// src/types/auth.ts

export interface Appointment {
    id: string;
    doctorId: string;
    patientId: string | null; // Nullable if no patient is associated
    date: string; // ISO Date format
    status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
    patient?: {
        id: string;
        email: string;
        createdAt: string;
        updatedAt: string;
        banned: boolean;
    } | null; // Nullable if patient info is not available
}



// 🔹 Interface for Booking an Appointment
export interface BookAppointmentRequest {
    doctorId: string;
    patientId: string;
    date: string;
}

// 🔹 Interface for Medical Records
export interface MedicalRecord {
    id: string;
    patientId: string;
    doctorId: string;
    diagnosis: string;
    treatment: string;
    prescriptions: string[];
    createdAt: string;
}

// 🔹 Interface for Uploading Medical Files
export interface UploadMedicalFileRequest {
    patientId: string;
    file: File;
}

// 🔹 Interface for Doctors API
export interface Doctor extends User {
    bio: string;
    education: string;
    experience: string;
    specialty: string;
    licenseNumber: string;
}

// 🔹 Interface for Searching Doctors
export interface SearchDoctorsRequest {
    specialty?: string;
    location?: string;
    name?: string;
}

// 🔹 Interface for Doctor Availability
export interface DoctorAvailability {
    doctorId: string;
    availableDates: string[];
}
