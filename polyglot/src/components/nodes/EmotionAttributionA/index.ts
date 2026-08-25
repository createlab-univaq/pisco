import icon from '@public/emotion_icon.png';
import EmotionAttributionANodeProperties from './EmotionAttributionANodeProperties';
import ReactFlowEmotionAttributionANode from './ReactFlowEmotionAttributionANode';

export * from './types';
export { EmotionAttributionANodeProperties, ReactFlowEmotionAttributionANode };

export const emotionAttributionANodeConfig = {
  elementType: 'EmotionAttributionANode',
  name: 'Attribuzione delle emozioni (A)',
  icon: icon.src,
  group: 'remember_assessment',
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