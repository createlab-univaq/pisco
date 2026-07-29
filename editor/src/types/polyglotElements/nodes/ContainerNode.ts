import ContainerNodeProperties from '../../../components/Properties/Nodes/ContainerNodeProperties';
import { ReactFlowContainerNode } from '../../../components/ReactFlowNode';
import icon from '../../../public/icona_scatola.png';
import { polyglotNodeComponentMapping } from '../elementMapping';
import { defaultPolyglotNodeData, NodeData, PolyglotNode } from './Node';

export type ContainerItem = {
  id: string;
  type: string; // es: EmotionAttributionANode
  title?: string; // titolo card
  data: any; // payload embedded
};

export type ContainerSection = {
  id: string;
  items: ContainerItem[];
};

export type ContainerNodeData = NodeData & {
  sections: ContainerSection[];
};

export type ContainerNode = PolyglotNode & {
  type: 'ContainerNode';
  data: ContainerNodeData;
};

export const CONTAINER_NODE_ALLOWED_TYPES = [
  'EmotionAttributionANode',
  'EmotionAttributionBNode',
  'SocialSituationExerciseANode',
  'RiconoscimentoEmozioniNode',
] as const;

polyglotNodeComponentMapping.registerMapping<ContainerNode>({
  elementType: 'ContainerNode',
  name: 'Container',
  icon: icon.src,
  group: 'concept',
  platform: 'WebApp',
  propertiesComponent: ContainerNodeProperties,
  elementComponent: ReactFlowContainerNode,
  defaultData: {
    ...defaultPolyglotNodeData,
    sections: [],
  },
});
