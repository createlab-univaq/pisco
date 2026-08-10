import { SocialSituationAnswer } from "./SocialSituationAnswer";

export type SocialSituationSection = {
    before: string;
    bold: string;
    after: string;
    answers: SocialSituationAnswer[];
    correctIndexes: number[];
};