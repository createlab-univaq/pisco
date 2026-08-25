import { EDGE_TYPE } from '@/types/polyglot-elements/EdgeType';
import { PolyglotEdge } from '@/types/polyglot-elements/PolyglotEdge';

export type ConditionalOperator = '>' | '>=' | '<' | '<=' | '==';

export type ConditionalEdgeData = {
    edgeData: Record<string, any>;
    operator: ConditionalOperator;
    threshold: number;
};

export type ConditionalEdge = PolyglotEdge & {
    type: typeof EDGE_TYPE.CONDITIONAL;
    data: ConditionalEdgeData;
};