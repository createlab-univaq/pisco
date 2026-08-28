import { NODE_TYPE } from '@/types/NodeType';
import { PolyglotNodeBase } from '@/types/PolyglotNodeBase';

export type SocialSituationsExerciseAAnswer = {
    text: string;
    explanation: string;
};

export type SocialSituationsExerciseASection = {
    before: string;
    bold: string;
    after: string;
    answers: SocialSituationsExerciseAAnswer[];
    correctIndex: number;
};

export type SocialSituationsExerciseAItem = {
    sid: string;
    sections: SocialSituationsExerciseASection[];
};

export type SocialSituationsExerciseANodeData = {
    nodeData: Record<string, any>;
    items: SocialSituationsExerciseAItem[];
};

export type SocialSituationsExerciseANode = PolyglotNodeBase & {
    type: typeof NODE_TYPE.SOCIAL_SITUATIONS_EXERCISE_A;
    data: SocialSituationsExerciseANodeData;
};