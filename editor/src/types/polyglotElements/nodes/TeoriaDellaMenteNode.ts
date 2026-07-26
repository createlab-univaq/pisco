import TeoriaDellaMenteNodeProperties from '../../../components/Properties/Nodes/TeoriaDellaMenteNodeProperties';
import { ReactFlowTeoriaDellaMenteNode } from '../../../components/ReactFlowNode';
import icon from '../../../public/icona_cervello.png';
import { polyglotNodeComponentMapping } from '../elementMapping';
import { defaultPolyglotNodeData, NodeData, PolyglotNode } from './Node';

export type TeoriaDellaMenteQuestion = {
  question: string;
  answers: string[];
  correctIndex: number | null;
};

export type TeoriaDellaMenteQuizItem = {
  qid: string;
  narration: string;
  questions: TeoriaDellaMenteQuestion[];
};

export type TeoriaDellaMenteNodeData = NodeData & {
  quiz: TeoriaDellaMenteQuizItem[];
};

export type TeoriaDellaMenteNode = PolyglotNode & {
  type: 'TeoriaDellaMenteNode';
  data: TeoriaDellaMenteNodeData;
};

polyglotNodeComponentMapping.registerMapping<TeoriaDellaMenteNode>({
  elementType: 'TeoriaDellaMenteNode',
  name: 'Teoria Della Mente',
  icon: icon.src,
  group: 'remember_assessment',
  platform: 'WebApp',
  propertiesComponent: TeoriaDellaMenteNodeProperties,
  elementComponent: ReactFlowTeoriaDellaMenteNode,
  defaultData: {
    ...defaultPolyglotNodeData,
    quiz: [],
  },
});
