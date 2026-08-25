import { EDGE_TYPE } from '@/types/polyglot-elements/EdgeType';
import { PolyglotEdge } from '@/types/polyglot-elements/PolyglotEdge';

export type PassFailEdgeData = {
    edgeData: Record<string, any>;
    conditionKind: 'pass' | 'fail';
};

export type PassFailEdge = PolyglotEdge & {
    type: typeof EDGE_TYPE.PASS_FAIL;
    data: PassFailEdgeData;
};