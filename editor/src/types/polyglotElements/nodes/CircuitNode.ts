import CircuitNodeProperties from '../../../components/Properties/Nodes/CircuitNodeProperties';
import { ReactFlowCircuitNode } from '../../../components/ReactFlowNode';
import icon from '../../../public/circuitIcon.png';
import { polyglotNodeComponentMapping } from '../elementMapping';
import { defaultPolyglotNodeData, NodeData, PolyglotNode } from './Node';

export type CircuitData = NodeData & {
  instructions: string;
  pinsList: { pin: string; value: string }[];
};

export type CircuitNode = PolyglotNode & {
  type: 'CircuitNode';
  data: CircuitData;
};

polyglotNodeComponentMapping.registerMapping<CircuitNode>({
  elementType: 'CircuitNode',
  name: 'Circuit',
  icon: icon.src,
  group: 'apply_assessment',
  propertiesComponent: CircuitNodeProperties,
  elementComponent: ReactFlowCircuitNode,
  defaultData: {
    ...defaultPolyglotNodeData,
    pinsList: [],
    instructions: '',
  },
});
