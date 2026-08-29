import type { Degree } from "./Degree";

export interface Patient {
    id: string;
    firstName: string;
    lastName: string;
    gender: string;
    age: number;
    degree: Degree;
    createdAt: string;
}