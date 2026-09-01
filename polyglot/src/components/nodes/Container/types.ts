import { PolyglotNodeBase } from '@/types/PolyglotNodeBase';
// Import your central runtime constants!
import { NODE_TYPE } from '@/types/NodeType'; 

// 1. Define the runtime array using your constants (NO raw strings)
export const CONTAINER_NODE_ALLOWED_TYPES = [
    NODE_TYPE.EMOTION_ATTRIBUTION_EXERCISE_A,
    NODE_TYPE.EMOTION_ATTRIBUTION_EXERCISE_B,
    NODE_TYPE.FAUX_PAS_EXERCISE_A,
    NODE_TYPE.SOCIAL_SITUATIONS_EXERCISE_A,
    NODE_TYPE.EMOTION_RECOGNITION_EXERCISE_A,
    NODE_TYPE.THEORY_OF_MIND_EXERCISE_A
] as const;

// 2. DERIVE the type directly from the array!
// This automatically becomes: 'EmotionAttributionExerciseANode' | 'EmotionAttributionExerciseBNode' | ...
export type AllowedContainerNodeType = typeof CONTAINER_NODE_ALLOWED_TYPES[number];

export type ContainerItem = {
    id: string;
    type: AllowedContainerNodeType; // Derived automatically!
    title?: string;
    data: any; 
};

export type ContainerSection = {
    id: string;
    items: ContainerItem[];
};

export type ContainerNodeData = {
    nodeData: Record<string, any>;
    sections: ContainerSection[];
};

export type ContainerNode = PolyglotNodeBase & {
    type: 'ContainerNode';
    data: ContainerNodeData;
};