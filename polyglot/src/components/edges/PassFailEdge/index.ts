import PassFailEdgeProperties from './PassFailEdgeProperties';
import { EDGE_TYPE } from '@/types/polyglot-elements/EdgeType';
import ReactFlowPassFailEdge from './ReactFlowPassFailEdge';

export * from './types';
export { PassFailEdgeProperties };

export const passFailEdgeConfig = {
    elementType: EDGE_TYPE.PASS_FAIL,
    name: 'Pass/Fail',
    propertiesComponent: PassFailEdgeProperties,
    elementComponent: ReactFlowPassFailEdge,
    defaultData: {
        edgeData: {},
        conditionKind: 'pass',
    },
};