import FauxPasNodeProperties from '../../../components/Properties/Nodes/FauxPasNodeProperties';
import { ReactFlowFauxPasNode } from '../../../components/ReactFlowNode';
import icon from '../../../public/icona_passo.png';
import { polyglotNodeComponentMapping } from '../elementMapping';
import { defaultPolyglotNodeData, NodeData, PolyglotNode } from './Node';

export type FauxPasSkipIf = {
  enabled: boolean;
  questionIndex: number | null;
  answerIndex: number | null;
};

export type FauxPasQuestion = {
  question: string;
  answers: string[];
  correctIndex: number;
  skipIf?: FauxPasSkipIf;
};

export type FauxPasQuizItem = {
  qid: string;
  narration: string;
  questions: FauxPasQuestion[];
};

export type FauxPasNodeData = NodeData & {
  quiz: FauxPasQuizItem[];
};

export type FauxPasNode = PolyglotNode & {
  type: 'FauxPasNode';
  data: FauxPasNodeData;
};

polyglotNodeComponentMapping.registerMapping<FauxPasNode>({
  elementType: 'FauxPasNode',
  name: 'Faux Pas',
  icon: icon.src,
  group: 'remember_assessment',
  platform: 'WebApp',
  propertiesComponent: FauxPasNodeProperties,
  elementComponent: ReactFlowFauxPasNode,
  defaultData: {
    ...defaultPolyglotNodeData,
    quiz: [],
  },
});
