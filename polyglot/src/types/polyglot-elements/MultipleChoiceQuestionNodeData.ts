export type MultipleChoiceQuestionNodeData = {
    nodeData: Record<string, any>;
    question: string;
    choices: string[];
    isChoiceCorrect: boolean[];
};