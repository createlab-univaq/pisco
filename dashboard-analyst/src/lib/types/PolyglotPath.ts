import type { Analyst } from "./Analyst";

export interface PolyglotPath {
    id: string;
    name: string;
    description: string;
    published: boolean;
    flowJson: Record<string, any>;
    analyst: Analyst;
    createdAt: string;
    updatedAt: string;
}