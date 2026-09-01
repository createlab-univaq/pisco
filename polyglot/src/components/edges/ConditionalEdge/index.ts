import ConditionalEdgeProperties from './ConditionalEdgeProperties';
import ReactFlowConditionalEdge from './ReactFlowConditionalEdge';
import { EDGE_TYPE } from '@/types/EdgeType';

export * from './types';
export { ConditionalEdgeProperties };

export const conditionalEdgeConfig = {
    elementType: EDGE_TYPE.CONDITIONAL,
    name: 'Conditional',
    propertiesComponent: ConditionalEdgeProperties,
    elementComponent: ReactFlowConditionalEdge,
    defaultData: {
        edgeData: {},
        operator: '>=',
        threshold: 0,
    },
};