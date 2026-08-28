import { EDGE_TYPE } from "./EdgeType";

export type PolyglotEdgeType = typeof EDGE_TYPE[keyof typeof EDGE_TYPE];