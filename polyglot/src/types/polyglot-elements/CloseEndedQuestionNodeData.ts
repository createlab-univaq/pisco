export type CloseEndedQuestionNodeData = {
    nodeData: Record<string, any>;
    question: string;
    correctAnswers: string[];
    textToFill?: string;
    isAnswerCorrect: boolean[];
};