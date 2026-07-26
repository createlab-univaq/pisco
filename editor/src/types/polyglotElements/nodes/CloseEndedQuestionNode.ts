import CloseEndedQuestionNodeProperties from '../../../components/Properties/Nodes/CloseEndedQuestionNodeProperties';
import { ReactFlowCloseEndedQuestionNode } from '../../../components/ReactFlowNode';
import icon from '../../../public/closeQuestion_icon.png';
import { polyglotNodeComponentMapping } from '../elementMapping';
import { defaultPolyglotNodeData, NodeData, PolyglotNode } from './Node';

export type CloseEndedQuestionNodeData = NodeData & {
  question: string;
  correctAnswers: string[];
  textToFill?: string;
  isAnswerCorrect: boolean[];
};

export type CloseEndedQuestionNode = PolyglotNode & {
  type: 'closeEndedQuestionNode';
  data: CloseEndedQuestionNodeData;
};

polyglotNodeComponentMapping.registerMapping<CloseEndedQuestionNode>({
  elementType: 'closeEndedQuestionNode',
  name: 'Close Ended Question',
  icon: icon.src,
  group: 'remember_assessment',
  platform: 'WebApp',
  propertiesComponent: CloseEndedQuestionNodeProperties,
  elementComponent: ReactFlowCloseEndedQuestionNode,
  defaultData: {
    ...defaultPolyglotNodeData,
    question: '',
    correctAnswers: [],
    isAnswerCorrect: [],
  },
});
