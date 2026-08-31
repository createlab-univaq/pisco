import { ConditionalEdge } from "@/components/edges/ConditionalEdge";
import { UnconditionalEdge } from "@/components/edges/UnconditionalEdge";
import { PolyglotEdgeBase } from "./PolyglotEdgeBase";

export type PolyglotEdge =
    | ConditionalEdge
    | UnconditionalEdge
    | (PolyglotEdgeBase & {
        type: string;
        data: {
            edgeData: Record<string, any>;
        }
    });