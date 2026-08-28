import { NODE_TYPE } from '@/types/NodeType';
import { PolyglotNodeBase } from '@/types/PolyglotNodeBase';

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
    type: typeof NODE_TYPE.EYES_TASK;
    data: EyesTaskNodeData;
};