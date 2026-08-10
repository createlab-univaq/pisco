import { PapyTag } from "./PapyTag";

export type PapyAssignmentAPI = {
    project_id: string;
    assignment_text: string;
    assignment_title: string;
    tags: PapyTag[];
};