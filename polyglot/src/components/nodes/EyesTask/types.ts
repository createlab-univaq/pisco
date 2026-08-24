import { PolyglotNodeBase } from '@/types/polyglot-elements/PolyglotNodeBase';

export type EyesTaskQuestion = {
    qid: string;
    imageId?: string;
    answers: string[]; // Array of exactly 4 strings expected
    correctIndex: number; // 0..3
};

export type EyesTaskNodeData = {
    nodeData: Record<string, any>;
    minCorrectToPass?: number;
    questions: EyesTaskQuestion[];
};

export type EyesTaskNode = PolyglotNodeBase & {
    type: 'EyesTaskTestNode';
    data: EyesTaskNodeData;
};