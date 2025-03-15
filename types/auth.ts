// src/types/auth.ts

export type UserRole = 'PATIENT' | 'DOCTOR' | 'ADMIN';

// 🔹 Interface for User Information


export interface UserProfile {
    id: string;
    email: string;
    createdAt: string;
    missedAppointments: number;
    updatedAt: string;
    banned: boolean;
    twoFactorEnabled: boolean;
    gender?: string;
    image?: string;
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
    birthDate: string;
    password?: string;
    emergencyContact?: string;
    bloodType?: string;
    allergies?: string;
    medicalConditions?: string;
    bio?: string;
    education?: string;
    experience?: string;
    notificationSettings?: {
        email: { appointments: boolean; messages: boolean; reminders: boolean; system: boolean };
        push: { appointments: boolean; messages: boolean; reminders: boolean; system: boolean };
        sms: { appointments: boolean; messages: boolean; reminders: boolean; system: boolean };
    };
    visibility?: 'public' | 'private' | 'doctors'; // Add this line
}
export interface SetUserProfile {

    email: string;
    createdAt: string;
    updatedAt: string;
    gender?: string;
    image?: string;
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
    password?: string;
    emergencyContact?: string;
    bloodType?: string;
    allergies?: string;
    medicalConditions?: string;
    bio?: string;
    education?: string;
    experience?: string;
    notificationSettings?: {
        email: { appointments: boolean; messages: boolean; reminders: boolean; system: boolean };
        push: { appointments: boolean; messages: boolean; reminders: boolean; system: boolean };
        sms: { appointments: boolean; messages: boolean; reminders: boolean; system: boolean };
    };
}
export interface Doctor extends UserProfile {
    bio: string; // Required for doctors
    education: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED'; // Added
    experience: string;
    specialty: string; // Required for doctors
    licenseNumber: string; // 
    // Required for doctors
    image?: string; // Added for profile picture
    availableToday?: boolean; // Added for availability filter

}

// In src/types/auth.ts
export interface BookAppointmentRequest {
    doctorId: string;
    patientId: string;
    date: string;
    appointmentDate: string; // Renamed from 'date' for consistency
    duration: number;
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
export interface LoginSuccessResponse {
    accessToken: string;
    refreshToken: string;
    user: UserProfile;
    message: string; // e.g., "Login successful"
}

export interface Login2FAResponse {
    tempToken: string;
    message: string; // e.g., "2FA required"
}

export type LoginResponse = LoginSuccessResponse | Login2FAResponse;

// Add Login2FAResponse for /auth/2fa/login (since it returns full tokens)
export interface Login2FASuccessResponse {
    accessToken: string;
    refreshToken: string;
    user: UserProfile;
}

// Keep other interfaces unchanged (for brevity)
export interface LoginRequest {
    email: string;
    password: string;
}

// 🔹 Interface for Protected User Profile Response


// 🔹 Interface for Appointments
// src/types/auth.ts

// Fully adjusted Appointment interface to match backend response and ScheduleManagement needs
export interface Appointment {
    id: string;
    createdAt: string;
    appointmentDate: string; // ISO string
    doctorId: string; // Added to match CreateAppointmentDto and entity relation
    patientId: string; // Non-nullable since patient is required in CreateAppointmentDto
    date: string; // ISO string (e.g., "2025-03-07T09:00:00.000Z")
    status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED"; // Matches backend status logic
    duration: number; // Added from backend adjustment (in minutes)
    type: string; // Added from backend adjustment (e.g., "Check-up", "Consultation")
    notes: string   // From User entity


    patient: { // Full patient object from relations: ['patient']
        id: string;
        email: string;
        firstName: string; // From Patient/User entity
        lastName: string;  // From Patient/User entity
        createdAt: string; // Assuming TypeORM adds these
        updatedAt: string; // Assuming TypeORM adds these
        banned: boolean;
        missedAppointments: number;

    };
    doctor: { // Minimal doctor info from relations: ['doctor']
        id: string;
        email: string;    // Included in findAll, likely in getAppointments too
        firstName: string; // From Doctor/User entity
        lastName: string;
        specialty: string;  // From Doctor/User entity
    };
}

export interface NotificationPreference {
    id: string;
    emailAppointments: boolean;

    emailMessages: boolean;

    emailUpdates: boolean;


    smsAppointments: boolean;


    smsMessages: boolean;


    appAppointments: boolean;

    appMessages: boolean;

    appUpdates: boolean;

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
    birthDate: string;   // Nullable from Patient entity
}

// Supporting Availability interface for ScheduleManagement
// src/types/auth.ts
// src/types/auth.ts
export interface Availability {
    id: string;
    doctorId: string;
    startTime: string; // ISO string or time string (e.g., "08:00:00")
    endTime: string;   // ISO string or time string (e.g., "18:00:00")
    dayOfWeek?: string; // Optional, e.g., "Mon", "Tue", etc., for weekly scheduling
    isAvailable?: boolean;
    breakSlots: string// Optional, defaults to true for defined slots
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
export interface Doctor {
    id: string;
    firstName: string;
    lastName: string;
    specialty: string;
    city?: string;
    // Add other fields as needed
}
export interface PaginatedDoctorsResponse {

    doctors: Doctor[];
    availableToday: boolean;
    total: number;
    page: number;
    limit: number;
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    image?: string;
    specialties: string[];
    cities: string[];


}

export interface SearchDoctorsRequest {
    ids?: string[];
    name?: string;
    specialty?: string;
    location?: string;
    term?: string;
    availableToday?: boolean; // Add if backend supports

    page?: number; // For pagination (optional)
    limit?: number; //
    // Add other filters as needed
}
// 🔹 Interface for Uploading Medical Files
export interface UploadMedicalFileRequest {
    patientId: string;
    file: File;
}
export interface CreateUserDto {
    email: string;
    password: string;
    confirmPassword: string;
    role: UserRole;
    firstName?: string;
    lastName?: string;
    gender?: string;
    birthDate?: string;
    phone?: string;
    specialty?: string; // Changed from specialization to match backend
    licenseNumber?: string;
    experience?: string;
    education?: string;
    bio?: string;
    emergencyContact?: string;
    bloodType?: string;
    allergies?: string;
    medicalConditions?: string;
    street?: string;
    city?: string;
    zipCode?: string;
    country?: string;
    skills?: string[];
}
// Add this to src/types/auth.ts
export interface PaginatedDoctorsResponse {
    doctors: Doctor[];
    total: number;
    page: number;
    limit: number;
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
export interface Notification {
    id: string;
    message: string;
    isRead: boolean;
    isArchived: boolean; // Added missing field
    type: "APPOINTMENT" | "MESSAGE" | "REMINDER" | "SYSTEM" | "NEW_TYPE"; // Added missing field
    priority: "LOW" | "MEDIUM" | "HIGH"; // Added missing field
    metadata?: Record<string, any>; // Added missing field (optional)
    createdAt: string;
    recipient: {
        id: string;
        email: string;
        firstName?: string;
        lastName?: string;
        role: UserRole;
    };
}
