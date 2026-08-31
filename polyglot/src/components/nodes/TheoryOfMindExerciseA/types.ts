import { NODE_TYPE } from '@/types/NodeType';
import { PolyglotNodeBase } from '@/types/PolyglotNodeBase';

export type TheoryOfMindExerciseAData = {
    quiz?: TheoryOfMindExerciseAItem[];
};

export type TheoryOfMindExerciseAQuestion = {
    qid: string;
    question: string;
    answers: string[]; // Fixed to ['Si', 'No']
    correctIndex: number; // 0 for Si, 1 for No
    explanation: string; // Independent explanation per question
};

export type TheoryOfMindExerciseAItem = {
    qid: string;
    imageId?: string; // Production-ready image reference via FilesAPI
    caption: string; // Image caption
    questions: TheoryOfMindExerciseAQuestion[]; // Strictly fixed to 2 questions
};

export type TheoryOfMindExerciseANodeData = {
    nodeData: Record<string, any>;
    quiz: TheoryOfMindExerciseAItem[];
};

export type TheoryOfMindExerciseANode = PolyglotNodeBase & {
    type: typeof NODE_TYPE.THEORY_OF_MIND_EXERCISE_A;
    data: TheoryOfMindExerciseANodeData;
};