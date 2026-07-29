import MultipleChoiceQuestionNodeProperties from '../../../components/Properties/Nodes/MultipleChoiceQuestionNodeProperties';
import { ReactFlowMultipleChoiceQuestionNode } from '../../../components/ReactFlowNode';
import icon from '../../../public/mult_choice_icon.png';
import { polyglotNodeComponentMapping } from '../elementMapping';
import { defaultPolyglotNodeData, NodeData, PolyglotNode } from './Node';

export type MultipleChoiceQuestionNodeData = NodeData & {
  question: string;
  choices: string[];
  isChoiceCorrect: boolean[];
};

export type MultipleChoiceQuestionNode = PolyglotNode & {
  type: 'multipleChoiceQuestionNode';
  data: MultipleChoiceQuestionNodeData;
};

polyglotNodeComponentMapping.registerMapping<MultipleChoiceQuestionNode>({
  elementType: 'multipleChoiceQuestionNode',
  name: 'Multiple Choice Question',
  icon: icon.src,
  group: 'remember_assessment',
  platform: 'WebApp',
  propertiesComponent: MultipleChoiceQuestionNodeProperties,
  elementComponent: ReactFlowMultipleChoiceQuestionNode,
  defaultData: {
    ...defaultPolyglotNodeData,
    choices: [],
    isChoiceCorrect: [],
    question: '',
  },
});
