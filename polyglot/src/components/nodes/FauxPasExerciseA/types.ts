import { NODE_TYPE } from '@/types/NodeType';
import { PolyglotNodeBase } from '@/types/PolyglotNodeBase';
import { FauxPasQuestion } from '../FauxPas/types';

export type FauxPasExerciseAQuizItem = {
    qid: string;
    narration: string;
    explanation: string; // <-- Independent explanation per story
    questions: FauxPasQuestion[];
};

export type FauxPasExerciseANodeData = {
    nodeData: Record<string, any>;
    quiz: FauxPasExerciseAQuizItem[];
};

export type FauxPasExerciseANode = PolyglotNodeBase & {
    type: typeof NODE_TYPE.FAUX_PAS_EXERCISE_A;
    data: FauxPasExerciseANodeData;
};