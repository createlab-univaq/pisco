import UnconditionalEdgeProperties from './UnconditionalEdgeProperties';
import { EDGE_TYPE } from '@/types/polyglot-elements/EdgeType';
import ReactFlowUnconditionalEdge from './ReactFlowUnconditionalEdge';

export * from './types';
export { UnconditionalEdgeProperties };

export const unconditionalEdgeConfig = {
    elementType: EDGE_TYPE.UNCONDITIONAL,
    name: 'Unconditional',
    propertiesComponent: UnconditionalEdgeProperties,
    elementComponent: ReactFlowUnconditionalEdge,
    defaultData: {
        edgeData: {},
    },
};