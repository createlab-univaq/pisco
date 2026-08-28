import icon from '@public/emotion_icon.png';
import EmotionAttributionBNodeProperties from './EmotionAttributionBNodeProperties';
import ReactFlowEmotionAttributionBNode from './ReactFlowEmotionAttributionBNode';

export * from './types';
export { EmotionAttributionBNodeProperties, ReactFlowEmotionAttributionBNode };

export const emotionAttributionBNodeConfig = {
    elementType: 'EmotionAttributionBNode',
    name: 'Attribuzione delle emozioni (B)',
    icon: icon.src,
    group: 'remember_assessment',
    propertiesComponent: EmotionAttributionBNodeProperties,
    elementComponent: ReactFlowEmotionAttributionBNode,
    defaultData: {
        nodeData: {},
        items: [],
    },
};