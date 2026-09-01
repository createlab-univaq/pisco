import { Analyst } from "./Analyst";
import { PolyglotFlow } from "./PolyglotFlow";

export interface Flow {
    id: string;
    name: string;
    description: string;
    published: boolean;
    flowJson: PolyglotFlow;
    analyst: Analyst;
    createdAt: string;
    updatedAt: string;
}