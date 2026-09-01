import type { Flow } from "./Flow";
import type { Patient } from "./Patient";

export interface PatientPath {
    id: string;
    patient: Patient;
    polyglotPathId: string;
    uniqueCode: string;
    assignedAt: string;
    flow?: Flow | any;
}