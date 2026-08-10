import { ConditionalEdge } from "./ConditionalEdge";
import { PassFailEdge } from "./PassFailEdge";
import { PolyglotEdgeBase } from "./PolyglotEdgeBase";
import { UnconditionalEdge } from "./UnconditionalEdge";

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