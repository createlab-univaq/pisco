import type { ExecutionAnswer } from "./ExecutionAnswer";

export interface ExecutionNode {
    id: string;
    nodeId: string;
    nodeName: string;
    nodeType: string;
    isExercise: boolean;
    maxScore: number;
    score: number;
    percentageScore: number;
    averageReactionTimeInMilliseconds: number;
    averageResponseTimeInMilliseconds: number;
    averageMouseDistanceInCentimeters: number;
    answers: ExecutionAnswer[];
}