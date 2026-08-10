import { EDGE_TYPE } from "./EdgeType";
import { PassFailEdgeData } from "./PassFailEdgeData";
import { PolyglotEdgeBase } from "./PolyglotEdgeBase";

export type PassFailEdge = PolyglotEdgeBase & {
  type: typeof EDGE_TYPE.PASS_FAIL;
  data: PassFailEdgeData;
};