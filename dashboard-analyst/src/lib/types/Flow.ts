import type { Analyst } from "./Analyst";

export interface Flow {
    id: string;
    name: string;
    description: string;
    published: boolean;
    flowJson: Record<string, any>;
    analyst: Analyst;
    createdAt: string;
    updatedAt: string;
}