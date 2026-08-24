import icon from '@public/icona_emozioni.png';
import EmotionAttributionTestNodeProperties from './EmotionAttributionTestNodeProperties';
import ReactFlowEmotionAttributionTestNode from './ReactFlowEmotionAttributionTestNode';

const newId = (prefix: string) =>
    globalThis.crypto?.randomUUID?.() ??
    `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;

// Export the configuration object (do NOT call registerMapping here)
export const emotionAttributionTestNodeConfig = {
    elementType: 'EmotionAttributionTestNode',
    name: 'Attribuzione delle Emozioni',
    icon: icon.src,
    group: 'remember_assessment',
    platform: 'WebApp',
    propertiesComponent: EmotionAttributionTestNodeProperties,
    elementComponent: ReactFlowEmotionAttributionTestNode,
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