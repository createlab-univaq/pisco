import { EDGE_TYPE } from '@/types/polyglot-elements/EdgeType';
import { PolyglotEdgeBase } from '@/types/polyglot-elements/PolyglotEdgeBase';

export type ConditionalOperator = '>' | '>=' | '<' | '<=' | '==';

export type ConditionalEdgeData = {
    edgeData: Record<string, any>;
    operator: ConditionalOperator;
    threshold: number;
};

export type ConditionalEdge = PolyglotEdgeBase & {
    type: typeof EDGE_TYPE.CONDITIONAL;
    data: ConditionalEdgeData;
};