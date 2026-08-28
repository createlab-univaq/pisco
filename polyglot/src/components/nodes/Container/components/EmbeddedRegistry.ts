import type React from 'react';
import { NODE_TYPE } from '@/types/NodeType'; // <-- Import your constants!

// Using standard alias paths for public assets
import emotion_icon from '@public/emotion_icon.png';
import eyes_icon from '@public/eyes_icon.png';
import people_icon from '@public/people_icon.png';

import EmotionAttributionAEmbedded from '../../EmotionAttributionA/components/EmotionAttributionANodeEmbedded';
import EmotionAttributionBEmbedded from '../../EmotionAttributionB/components/EmotionAttributionBEmbedded';
import EmotionRecognitionNodeEmbedded from '../../EmotionRecognition/components/EmotionRecognitionNodeEmbedded';
import SocialSituationExerciseANodeEmbedded from '../../SocialSituationsExerciseA/components/SocialSituationsExerciseANodeEmbedded';

export type EmbeddedProps<T = any> = {
    data: T;
    onDataChange: (newData: T) => void;
    parentNodeId?: string;
    parentItemId?: string;
    isDisabled?: boolean;
};

export type EmbeddedDefinition = {
    // We can now strictly type this to ensure only valid node types are registered
    type: string;
    label: string;
    icon?: string;
    component: React.ComponentType<EmbeddedProps>;
    createDefaultData: () => any;
};

export const embeddedRegistry: EmbeddedDefinition[] = [
    {
        type: NODE_TYPE.EMOTION_ATTRIBUTION_A,
        label: 'Attribuzione delle Emozioni (A)',
        icon: emotion_icon.src,
        component: EmotionAttributionAEmbedded,
        createDefaultData: () => ({
            scenario: '',
            domanda: '',
            risposteCorrette: [''],
            spiegazioneS: '',
            spiegazioneR: '',
        }),
    },
    {
        type: NODE_TYPE.EMOTION_ATTRIBUTION_B,
        label: 'Attribuzione delle Emozioni (B)',
        icon: emotion_icon.src,
        component: EmotionAttributionBEmbedded,
        createDefaultData: () => ({
            items: [
                {
                    emotion: '',
                    scenario: '',
                    scenarioExplanation: '',
                },
            ],
        }),
    },
    {
        type: NODE_TYPE.EMOTION_RECOGNITION,
        label: 'Riconoscimento Emozioni',
        icon: eyes_icon.src,
        component: EmotionRecognitionNodeEmbedded,
        createDefaultData: () => ({
            imageId: undefined,
            answers: ['', ''],
            correctIndex: 0,
        }),
    },
    {
        type: NODE_TYPE.SOCIAL_SITUATIONS_EXERCISE_A,
        label: 'Situazione Sociale (A)',
        icon: people_icon.src,
        component: SocialSituationExerciseANodeEmbedded,
        createDefaultData: () => ({
            scenario: '',
            items: [
                {
                    answer: '',
                    explanation: '',
                },
            ],
            correctIndex: 0,
        }),
    },
];

export const embeddedByType = Object.fromEntries(
    embeddedRegistry.map((d) => [d.type, d])
) as Record<string, EmbeddedDefinition>;