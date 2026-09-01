import { EDGE_TYPE } from '@/types/EdgeType';
import { PolyglotEdgeBase } from '@/types/PolyglotEdgeBase';

export type UnconditionalEdgeData = {
    edgeData: Record<string, any>;
};

export type UnconditionalEdge = PolyglotEdgeBase & {
    type: typeof EDGE_TYPE.UNCONDITIONAL;
    data: UnconditionalEdgeData;
};