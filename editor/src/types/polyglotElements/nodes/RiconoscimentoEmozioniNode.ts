import RiconoscimentoEmozioniNodeProperties from '../../../components/Properties/Nodes/RiconoscimentoEmozioniNodeProperties';
import { ReactFlowRiconoscimentoEmozioniNode } from '../../../components/ReactFlowNode';
import icon from '../../../public/icona_occhi.png';
import { polyglotNodeComponentMapping } from '../elementMapping';
import { defaultPolyglotNodeData, NodeData, PolyglotNode } from './Node';

// Se hai creato un index export per ReactFlowNode, importa da lì.
// Altrimenti importa direttamente il file del componente.

export type RiconoscimentoEmozioniNodeData = NodeData & {
  imageId?: string;
  answers: string[];
  correctIndex: number;
};

export type RiconoscimentoEmozioniNode = PolyglotNode & {
  type: 'RiconoscimentoEmozioniNode';
  data: RiconoscimentoEmozioniNodeData;
};

polyglotNodeComponentMapping.registerMapping<RiconoscimentoEmozioniNode>({
  elementType: 'RiconoscimentoEmozioniNode',
  name: 'Riconoscimento Emozioni',
  icon: icon.src,
  group: 'remember_assessment',
  platform: 'WebApp',
  propertiesComponent: RiconoscimentoEmozioniNodeProperties,
  elementComponent: ReactFlowRiconoscimentoEmozioniNode,
  defaultData: {
    ...defaultPolyglotNodeData,
    imageId: undefined,
    answers: [],
    correctIndex: 0,
  },
});
