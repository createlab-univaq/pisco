import { EDGE_TYPE } from '@/types/polyglot-elements/EdgeType';
import { PolyglotEdgeBase } from '@/types/polyglot-elements/PolyglotEdgeBase';

export type UnconditionalEdgeData = {
    edgeData: Record<string, any>;
};

export type UnconditionalEdge = PolyglotEdgeBase & {
    type: typeof EDGE_TYPE.UNCONDITIONAL;
    data: UnconditionalEdgeData;
};