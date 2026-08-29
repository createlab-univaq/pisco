import type { Patient } from "./Patient";

export interface Diagnosis {
    id: string;
    patient: Patient;
    diagnosisDate: string;
    diagnosisText: string;
    notes: string;
    medications: string;
    createdAt: string;
}