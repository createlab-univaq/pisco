import { NODE_TYPE } from '@/types/polyglot-elements/NodeType';
import { PolyglotNodeBase } from '@/types/polyglot-elements/PolyglotNodeBase';

export type SocialSituationsExerciseAItem = {
    answer: string;
    explanation: string;
};

export type SocialSituationsExerciseANodeData = {
    nodeData: Record<string, any>;
    scenario: string;
    items: SocialSituationsExerciseAItem[];
    /** 0-based index in `items` */
    correctIndex: number;
};

export type SocialSituationsExerciseANode = PolyglotNodeBase & {
    type: typeof NODE_TYPE.SOCIAL_SITUATIONS_EXERCISE_A;
    data: SocialSituationsExerciseANodeData;
};