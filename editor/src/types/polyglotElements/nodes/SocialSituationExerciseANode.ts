import SocialSituationExerciseANodeProperties from '../../../components/Properties/Nodes/SocialSituationExerciseANodeProperties';
import { ReactFlowSocialSituationExerciseANode } from '../../../components/ReactFlowNode';
import icon from '../../../public/icona_persone.png';
import { polyglotNodeComponentMapping } from '../elementMapping';
import { defaultPolyglotNodeData, NodeData, PolyglotNode } from './Node';

export type SocialSituationExerciseAItem = {
  answer: string;
  explanation: string;
};

export type SocialSituationExerciseANodeData = NodeData & {
  scenario: string;
  items: SocialSituationExerciseAItem[];
  /** 0-based index in `items` */
  correctIndex: number;
};

export type SocialSituationExerciseANode = PolyglotNode & {
  type: 'SocialSituationExerciseANode';
  data: SocialSituationExerciseANodeData;
};

polyglotNodeComponentMapping.registerMapping<SocialSituationExerciseANode>({
  elementType: 'SocialSituationExerciseANode',
  name: 'Situazione Sociale (A)',
  icon: icon.src,
  group: 'apply_assessment',
  platform: 'WebApp',
  propertiesComponent: SocialSituationExerciseANodeProperties,
  elementComponent: ReactFlowSocialSituationExerciseANode,
  defaultData: {
    ...defaultPolyglotNodeData,
    scenario: '',
    items: [],
    correctIndex: 0,
  },
});
