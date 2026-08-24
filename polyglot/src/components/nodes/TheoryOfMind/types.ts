import { NODE_TYPE } from '@/types/polyglot-elements/NodeType';
import { PolyglotNodeBase } from '@/types/polyglot-elements/PolyglotNodeBase';

export type TheoryOfMindQuestion = {
    question: string;
    answers: string[];
    correctIndex: number | null;
};

export type TheoryOfMindQuizItem = {
    qid: string;
    narration: string;
    questions: TheoryOfMindQuestion[];
};

export type TheoryOfMindNodeData = {
    nodeData: Record<string, any>;
    quiz: TheoryOfMindQuizItem[];
};

export type TheoryOfMindNode = PolyglotNodeBase & {
    type: typeof NODE_TYPE.THEORY_OF_MIND;
    data: TheoryOfMindNodeData;
};