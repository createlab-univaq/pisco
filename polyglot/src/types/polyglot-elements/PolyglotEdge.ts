import { ConditionalEdge } from "@/components/edges/ConditionalEdge";
import { PassFailEdge } from "@/components/edges/PassFailEdge";
import { UnconditionalEdge } from "@/components/edges/UnconditionalEdge";
import { PolyglotEdgeBase } from "./PolyglotEdgeBase";

export type PolyglotEdge =
    | ConditionalEdge
    | PassFailEdge
    | UnconditionalEdge
    | (PolyglotEdgeBase & {
        type: string;
        data: {
            edgeData: Record<string, any>;
        }
    });