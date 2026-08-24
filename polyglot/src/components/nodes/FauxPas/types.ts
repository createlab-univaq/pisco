import { PolyglotNodeBase } from '@/types/polyglot-elements/PolyglotNodeBase';

export type FauxPasSkipIf = {
    enabled: boolean;
    questionIndex: number | null;
    answerIndex: number | null;
};

export type FauxPasQuestion = {
    question: string;
    answers: string[];
    correctIndex: number | null; // allowNoCorrect sets this to null
    skipIf?: FauxPasSkipIf;
};

export type FauxPasQuizItem = {
    qid: string;
    narration: string;
    questions: FauxPasQuestion[];
};

export type FauxPasNodeData = {
    nodeData: Record<string, any>;
    quiz: FauxPasQuizItem[];
};

export type FauxPasNode = PolyglotNodeBase & {
    type: 'FauxPasNode';
    data: FauxPasNodeData;
};