import icon from '@public/icona_emozioni.png';
import EmotionAttributionANodeProperties from './EmotionAttributionANodeProperties';
import ReactFlowEmotionAttributionANode from './ReactFlowEmotionAttributionANode';

export const emotionAttributionANodeConfig = {
  elementType: 'EmotionAttributionANode',
  name: 'Attribuzione delle emozioni (A)',
  icon: icon.src,
  group: 'remember_assessment',
  platform: 'WebApp',
  propertiesComponent: EmotionAttributionANodeProperties,
  elementComponent: ReactFlowEmotionAttributionANode,
  defaultData: {
    nodeData: {},
    scenario: '',
    domanda: '',
    risposteCorrette: [],
    spiegazioneS: '',
    spiegazioneR: '',
  },
};