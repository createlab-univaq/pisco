export interface Degree {
    code: string;
    label: string;
    educationLevel: number;
}

export interface Patient {
    id: string;
    firstName: string;
    lastName: string;
    gender: string; // e.g., "MASCHIO", "FEMMINA"
    age: number;
    degree: Degree;
    createdAt: string;
}