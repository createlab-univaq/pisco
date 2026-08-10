import { FauxPasQuestion } from "./FauxPasQuestion";

export type FauxPasQuizItem = {
    qid: string;
    narration: string;
    questions: FauxPasQuestion[];
};