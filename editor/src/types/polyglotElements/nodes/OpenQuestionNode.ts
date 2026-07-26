import OpenQuestionNodeProperties from '../../../components/Properties/Nodes/OpenQuestionNodeProperties';
import { ReactFlowOpenQuestionNode } from '../../../components/ReactFlowNode';
import icon from '../../../public/simulation_icon.png';
import { polyglotNodeComponentMapping } from '../elementMapping';
import { defaultPolyglotNodeData, NodeData, PolyglotNode } from './Node';

export type OpenQuestionNodeData = NodeData & {
  question: string;
  material: string;
  possibleAnswer: string;
};

export type OpenQuestionNode = PolyglotNode & {
  type: 'OpenQuestionNode';
  data: OpenQuestionNodeData;
};

polyglotNodeComponentMapping.registerMapping<OpenQuestionNode>({
  elementType: 'OpenQuestionNode',
  name: 'Open Question',
  icon: icon.src,
  group: 'remember_assessment',
  platform: 'WebApp',
  propertiesComponent: OpenQuestionNodeProperties,
  elementComponent: ReactFlowOpenQuestionNode,
  defaultData: {
    ...defaultPolyglotNodeData,
    question: '',
    material: '',
    possibleAnswer: '',
  },
});
