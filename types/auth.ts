// src/types/auth.ts

export type UserRole = 'PATIENT' | 'DOCTOR' | 'ADMIN';

// 🔹 Interface for User Information

export interface UserProfile {
    id: string;
    email: string;
    createdAt: string;
    updatedAt: string;
    banned: boolean;
    gender?: string;
    licenseNumber?: string;
    street?: string;
    city?: string;
    zipCode?: string;
    country?: string;
    googleTokens?: { access_token: string; refresh_token: string; expiry_date: number };
    specialty?: string;
    skills?: string[];
    role: UserRole;
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
// In src/types/auth.ts
export interface BookAppointmentRequest {
    doctorId: string;
    patientId: string;
    date: string;
    duration: number;
    type: string;
}
// 🔹 Interface for Register API Request
export interface RegisterRequest extends UserProfile {
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
    user: UserProfile;
}

// 🔹 Interface for Protected User Profile Response


// 🔹 Interface for Appointments
// src/types/auth.ts

// Fully adjusted Appointment interface to match backend response and ScheduleManagement needs
export interface Appointment {
    id: string;
    doctorId: string; // Added to match CreateAppointmentDto and entity relation
    patientId: string; // Non-nullable since patient is required in CreateAppointmentDto
    date: string; // ISO string (e.g., "2025-03-07T09:00:00.000Z")
    status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED"; // Matches backend status logic
    duration: number; // Added from backend adjustment (in minutes)
    type: string; // Added from backend adjustment (e.g., "Check-up", "Consultation")
    patient: { // Full patient object from relations: ['patient']
        id: string;
        email: string;
        firstName: string; // From Patient/User entity
        lastName: string;  // From Patient/User entity
        createdAt: string; // Assuming TypeORM adds these
        updatedAt: string; // Assuming TypeORM adds these
        banned: boolean;   // From User entity
    };
    doctor: { // Minimal doctor info from relations: ['doctor']
        id: string;
        email: string;    // Included in findAll, likely in getAppointments too
        firstName: string; // From Doctor/User entity
        lastName: string;  // From Doctor/User entity
    };
}

// Supporting Patient interface for consistency (used in GET /patients)
export interface Patient {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    createdAt: string;
    updatedAt: string;
    banned: boolean;
    address?: string;     // Nullable from Patient entity
    birthDate?: string;   // Nullable from Patient entity
}

// Supporting Availability interface for ScheduleManagement
export interface Availability {
    id: string;
    doctorId: string;
    startTime: string; // ISO string
    endTime: string;   // ISO string
    isAvailable: boolean;
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
export interface Doctor extends UserProfile {
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
