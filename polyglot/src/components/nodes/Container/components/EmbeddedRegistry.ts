import type React from 'react';
import { NODE_TYPE } from '@/types/NodeType';

// Using standard alias paths for public assets
import emotion_icon from '@public/emotion_icon.png';
import eyes_icon from '@public/eyes_icon.png';
import people_icon from '@public/people_icon.png';

import EmotionAttributionExerciseAEmbedded from '../../EmotionAttributionExerciseA/components/EmotionAttributionExerciseANodeEmbedded';
import EmotionAttributionExerciseBEmbedded from '../../EmotionAttributionExerciseB/components/EmotionAttributionExerciseBEmbedded';
import EmotionRecognitionExerciseANodeEmbedded from '../../EmotionRecognitionExerciseA/components/EmotionRecognitionExerciseANodeEmbedded';
import SocialSituationExerciseANodeEmbedded from '../../SocialSituationsExerciseA/components/SocialSituationsExerciseANodeEmbedded';
import FauxPasExerciseAEmbedded from '../../FauxPasExerciseA/components/FauxPasExerciseAEmbedded';
import TheoryOfMindExerciseAEmbedded from '../../TheoryOfMindExerciseA/components/TheoryOfMindExerciseAEmbedded';
import { theoryOfMindExerciseANodeConfig } from '../../TheoryOfMindExerciseA';
import { fauxPasExerciseANodeConfig } from '../../FauxPasExerciseA';
import { socialSituationsExerciseANodeConfig } from '../../SocialSituationsExerciseA';
import { emotionRecognitionExerciseANodeConfig } from '../../EmotionRecognitionExerciseA';
import { emotionAttributionExerciseBNodeConfig } from '../../EmotionAttributionExerciseB';
import { emotionAttributionExerciseANodeConfig } from '../../EmotionAttributionExerciseA';

export type EmbeddedProps<T = any> = {
    data: T;
    onDataChange: (newData: T) => void;
    parentNodeId?: string;
    parentItemId?: string;
    isDisabled?: boolean;
};

export type EmbeddedDefinition = {
    type: string;
    label: string;
    icon?: string;
    component: React.ComponentType<EmbeddedProps>;
    createDefaultData: () => any;
};

export const embeddedRegistry: EmbeddedDefinition[] = [
    {
        type: emotionAttributionExerciseANodeConfig.elementType,
        label: emotionAttributionExerciseANodeConfig.name,
        icon: emotionAttributionExerciseANodeConfig.icon,
        component: EmotionAttributionExerciseAEmbedded,
        createDefaultData: () => (emotionAttributionExerciseANodeConfig.defaultData),
    },
    {
        type: emotionAttributionExerciseBNodeConfig.elementType,
        label: emotionAttributionExerciseBNodeConfig.name,
        icon: emotionAttributionExerciseBNodeConfig.icon,
        component: EmotionAttributionExerciseBEmbedded,
        createDefaultData: () => (emotionAttributionExerciseBNodeConfig.defaultData),
    },
    {
        type: fauxPasExerciseANodeConfig.elementType,
        label: fauxPasExerciseANodeConfig.name,
        icon: fauxPasExerciseANodeConfig.icon,
        component: FauxPasExerciseAEmbedded,
        createDefaultData: () => (fauxPasExerciseANodeConfig.defaultData),
    },
    {
        type: socialSituationsExerciseANodeConfig.elementType,
        label: socialSituationsExerciseANodeConfig.name,
        icon: socialSituationsExerciseANodeConfig.icon,
        component: SocialSituationExerciseANodeEmbedded,
        createDefaultData: () => (socialSituationsExerciseANodeConfig.defaultData),
    },
    {
        type: emotionRecognitionExerciseANodeConfig.elementType,
        label: emotionRecognitionExerciseANodeConfig.name,
        icon: emotionRecognitionExerciseANodeConfig.icon,
        component: EmotionRecognitionExerciseANodeEmbedded,
        createDefaultData: () => (emotionRecognitionExerciseANodeConfig.defaultData),
    },
    {
        type: theoryOfMindExerciseANodeConfig.elementType,
        label: theoryOfMindExerciseANodeConfig.name,
        icon: theoryOfMindExerciseANodeConfig.icon,
        component: TheoryOfMindExerciseAEmbedded,
        createDefaultData: () => (theoryOfMindExerciseANodeConfig.defaultData),
    },
];

export const embeddedByType = Object.fromEntries(
    embeddedRegistry.map((d) => [d.type, d])
) as Record<string, EmbeddedDefinition>;