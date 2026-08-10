import { ConditionalEdgeData } from "./ConditionalEdgeData";
import { EDGE_TYPE } from "./EdgeType";
import { PolyglotEdgeBase } from "./PolyglotEdgeBase";

export type ConditionalEdge = PolyglotEdgeBase & {
  type: typeof EDGE_TYPE.CONDITIONAL;
  data: ConditionalEdgeData;
};