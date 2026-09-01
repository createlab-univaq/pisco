import type { ExecutionNode } from "./ExecutionNode";
import type { PatientPath } from "./PatientPath";

export interface GameExecution {
    id: string;
    runName: string;
    patientPath: PatientPath;
    startedAt: string;
    finishedAt: string;
    nodes: ExecutionNode[];
}