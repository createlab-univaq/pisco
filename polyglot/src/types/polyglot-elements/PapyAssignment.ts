import { PapyTag } from "./PapyTag";

export type PapyAssignment = {
    projectId: string;
    assignmentText: string;
    assignmentTitle: string;
    tags: PapyTag[];
};