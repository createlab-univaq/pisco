import icon from '@public/emotion_icon.png';
import EmotionAttributionNodeProperties from './EmotionAttributionNodeProperties';
import ReactFlowEmotionAttributionNode from './ReactFlowEmotionAttributionNode';

export * from './types';
export { EmotionAttributionNodeProperties, ReactFlowEmotionAttributionNode };

const newId = (prefix: string) =>
    globalThis.crypto?.randomUUID?.() ??
    `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;

// Export the configuration object (do NOT call registerMapping here)
export const emotionAttributionNodeConfig = {
    elementType: 'EmotionAttributionNode',
    name: 'Attribuzione delle Emozioni',
    icon: icon.src,
    group: 'remember_assessment',
    platform: 'WebApp',
    propertiesComponent: EmotionAttributionNodeProperties,
    elementComponent: ReactFlowEmotionAttributionNode,
    defaultData: {
        nodeData: {},
        questions: [
            {
                qid: newId('q'),
                narration: '',
                question: '',
                correctAnswers: [''],
            },
        ],
    },
};