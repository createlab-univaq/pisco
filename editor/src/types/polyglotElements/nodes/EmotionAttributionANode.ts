import EmotionAttributionANodeProperties from '../../../components/Properties/Nodes/EmotionAttributionANodeProperties';
import { ReactFlowEmotionAttributionANode } from '../../../components/ReactFlowNode';
import icon from '../../../public/icona_emozioni.png';
import { polyglotNodeComponentMapping } from '../elementMapping';
import { defaultPolyglotNodeData, NodeData, PolyglotNode } from './Node';

/**
 * Esercitazione "Attribuzione delle Emozioni" - Tipo A
 *
 * NOTE: i nomi dei campi seguono il backend (mongoose discriminator: EmotionAttributionANode)
 */
export type EmotionAttributionANodeData = NodeData & {
  scenario: string;
  domanda: string;
  risposteCorrette: string[];
  spiegazioneS: string;
  spiegazioneR: string;
};

export type EmotionAttributionANode = PolyglotNode & {
  type: 'EmotionAttributionANode';
  data: EmotionAttributionANodeData;
};

polyglotNodeComponentMapping.registerMapping<EmotionAttributionANode>({
  elementType: 'EmotionAttributionANode',
  name: 'Attribuzione delle emozioni (A)',
  icon: icon.src,
  group: 'remember_assessment',
  platform: 'WebApp',
  propertiesComponent: EmotionAttributionANodeProperties,
  elementComponent: ReactFlowEmotionAttributionANode,
  defaultData: {
    ...defaultPolyglotNodeData,
    scenario: '',
    domanda: '',
    risposteCorrette: [],
    spiegazioneS: '',
    spiegazioneR: '',
  },
});
