import { PolyglotEdge } from "./PolyglotEdge";
import { PolyglotFlowInfo } from "./PolyglotFlowInfo";
import { PolyglotNode } from "./PolyglotNode";

export type PolyglotFlow = PolyglotFlowInfo & {
    nodes: PolyglotNode[];
    edges: PolyglotEdge[];
};