import { NODE_TYPE } from '@/types/polyglot-elements/NodeType';
import { PolyglotNodeBase } from '@/types/polyglot-elements/PolyglotNodeBase';

export type SocialSituationsExerciseAAnswer = {
    text: string;
    explanation: string; // Independent explanation for this specific answer option[cite: 28]
};

export type SocialSituationsExerciseASection = {
    before: string;
    bold: string;
    after: string;
    answers: SocialSituationsExerciseAAnswer[]; // Strictly holds 4 answers[cite: 22, 28]
    correctIndex: number; // Single correct choice (0 to 3 index)[cite: 28]
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