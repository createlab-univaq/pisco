export type TrueFalseNodeData = {
    instructions: string;
    questions: string[];
    isQuestionCorrect: boolean[];
    negativePoints?: number;
    positivePoints?: number;
};