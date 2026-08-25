import { EDGE_TYPE } from '@/types/polyglot-elements/EdgeType';
import { PolyglotEdgeBase } from '@/types/polyglot-elements/PolyglotEdgeBase';

export type PassFailConditionKind = 'pass' | 'fail';

export type PassFailEdgeData = {
    edgeData: Record<string, any>;
    conditionKind: PassFailConditionKind;
};

export type PassFailEdge = PolyglotEdgeBase & {
    type: typeof EDGE_TYPE.PASS_FAIL;
    data: PassFailEdgeData;
};