import EmotionAttributionTestNodeProperties from '../../../components/Properties/Nodes/EmotionAttributionTestNodeProperties';
import { ReactFlowEmotionAttributionTestNode } from '../../../components/ReactFlowNode';
import icon from '../../../public/icona_emozioni.png';
import { polyglotNodeComponentMapping } from '../elementMapping';
import { defaultPolyglotNodeData, NodeData, PolyglotNode } from './Node';

export type EmotionAttributionQuestion = {
  qid: string;
  narration: string;
  question: string;
  correctAnswers: string[]; // lista
};

export type EmotionAttributionTestNodeData = NodeData & {
  questions: EmotionAttributionQuestion[];
};

export type EmotionAttributionTestNode = PolyglotNode & {
  type: 'EmotionAttributionTestNode';
  data: EmotionAttributionTestNodeData;
};

const newId = (prefix: string) =>
  globalThis.crypto?.randomUUID?.() ??
  `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;

polyglotNodeComponentMapping.registerMapping<EmotionAttributionTestNode>({
  elementType: 'EmotionAttributionTestNode',
  name: 'Attribuzione delle Emozioni',
  icon: icon.src,
  group: 'remember_assessment',
  platform: 'WebApp',
  propertiesComponent: EmotionAttributionTestNodeProperties,
  elementComponent: ReactFlowEmotionAttributionTestNode,
  defaultData: {
    ...defaultPolyglotNodeData,
    questions: [
      {
        qid: newId('q'),
        narration: '',
        question: '',
        correctAnswers: [''],
      },
    ],
  },
});
