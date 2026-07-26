import EyesTaskTestNodeProperties from '../../../components/Properties/Nodes/EyesTaskTestNodeProperties';
import { ReactFlowEyesTaskTest } from '../../../components/ReactFlowNode';
import icon from '../../../public/icona_occhi.png';
import { polyglotNodeComponentMapping } from '../elementMapping';
import { defaultPolyglotNodeData, NodeData, PolyglotNode } from './Node';

export type EyesTaskQuestion = {
  qid: string;
  imageId?: string;
  answers: string[]; // 4
  correctIndex: number; // 0..3
};

export type EyesTaskTestNodeData = NodeData & {
  questions: EyesTaskQuestion[];
};

export type EyesTaskTestNode = PolyglotNode & {
  type: 'EyesTaskTestNode';
  data: EyesTaskTestNodeData;
};

const newId = (prefix: string) =>
  globalThis.crypto?.randomUUID?.() ??
  `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;

polyglotNodeComponentMapping.registerMapping<EyesTaskTestNode>({
  elementType: 'EyesTaskTestNode',
  name: 'Eyes Task',
  icon: icon.src,
  group: 'remember_assessment',
  platform: 'WebApp',
  propertiesComponent: EyesTaskTestNodeProperties,
  elementComponent: ReactFlowEyesTaskTest,
  defaultData: {
    ...defaultPolyglotNodeData,
    minCorrectToPass: 0, // default
    questions: [
      {
        qid: newId('q'),
        answers: ['', '', '', ''],
        correctIndex: 0,
      },
    ],
  },
});
