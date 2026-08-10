import { SocialSituationExerciseAItem } from "./SocialSituationExerciseAItem";

export type SocialSituationExerciseANodeData = {
    nodeData: Record<string, any>;
    scenario: string;
    items: SocialSituationExerciseAItem[];
    correctIndex: number;
};