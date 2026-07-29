import EmotionAttributionBNodeProperties from '../../../components/Properties/Nodes/EmotionAttributionBNodeProperties';
import { ReactFlowEmotionAttributionBNode } from '../../../components/ReactFlowNode';
import icon from '../../../public/icona_emozioni.png';
import { polyglotNodeComponentMapping } from '../elementMapping';
import { defaultPolyglotNodeData, NodeData, PolyglotNode } from './Node';

/**
 * Esercitazione "Attribuzione delle Emozioni" - Tipo B
 *
 * Campi coerenti con backend (mongoose discriminator: EmotionAttributionBNode)
 */
export type EmotionAttributionBItem = {
  emotion: string;
  scenario: string;
  scenarioExplanation: string;
};

export type EmotionAttributionBNodeData = NodeData & {
  items: EmotionAttributionBItem[];
};

export type EmotionAttributionBNode = PolyglotNode & {
  type: 'EmotionAttributionBNode';
  data: EmotionAttributionBNodeData;
};

polyglotNodeComponentMapping.registerMapping<EmotionAttributionBNode>({
  elementType: 'EmotionAttributionBNode',
  name: 'Attribuzione delle emozioni (B)',
  icon: icon.src,
  group: 'remember_assessment',
  platform: 'WebApp',
  propertiesComponent: EmotionAttributionBNodeProperties,
  elementComponent: ReactFlowEmotionAttributionBNode,
  defaultData: {
    ...defaultPolyglotNodeData,
    items: [
      {
        emotion: '',
        scenario: '',
        scenarioExplanation: '',
      },
    ],
  },
});
