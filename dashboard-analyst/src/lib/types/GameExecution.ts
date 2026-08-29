import type { Answer } from "./Answer";
import type { PatientPath } from "./PatientPath";

export interface GameExecution {
    id: string;
    patientPath: PatientPath;
    startedAt: string;
    finishedAt: string;
    answers: Answer[];
}