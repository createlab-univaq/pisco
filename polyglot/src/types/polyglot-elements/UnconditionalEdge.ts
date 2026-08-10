import { EDGE_TYPE } from "./EdgeType";
import { PolyglotEdgeBase } from "./PolyglotEdgeBase";
import { UnconditionalEdgeData } from "./UnconditionalEdgeData";

export type UnconditionalEdge = PolyglotEdgeBase & {
    type: typeof EDGE_TYPE.UNCONDITIONAL;
    data: UnconditionalEdgeData;
};