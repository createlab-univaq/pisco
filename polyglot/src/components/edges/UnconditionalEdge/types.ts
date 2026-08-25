import { EDGE_TYPE } from '@/types/polyglot-elements/EdgeType';
import { PolyglotEdge } from '@/types/polyglot-elements/PolyglotEdge'; // Adjust path if needed

export type UnconditionalEdgeData = {
    edgeData: Record<string, any>;
};

export type UnconditionalEdge = PolyglotEdge & {
    type: typeof EDGE_TYPE.UNCONDITIONAL;
    data: UnconditionalEdgeData;
};