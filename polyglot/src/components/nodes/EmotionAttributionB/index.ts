import icon from '@public/icona_emozioni.png';
import EmotionAttributionBNodeProperties from './EmotionAttributionBNodeProperties';
import ReactFlowEmotionAttributionBNode from './ReactFlowEmotionAttributionBNode';

export const emotionAttributionBNodeConfig = {
    elementType: 'EmotionAttributionBNode',
    name: 'Attribuzione delle emozioni (B)',
    icon: icon.src,
    group: 'remember_assessment',
    platform: 'WebApp',
    propertiesComponent: EmotionAttributionBNodeProperties,
    elementComponent: ReactFlowEmotionAttributionBNode,
    defaultData: {
        nodeData: {},
        items: [
            {
                emotion: '',
                scenario: '',
                scenarioExplanation: '',
            },
        ],
    },
};