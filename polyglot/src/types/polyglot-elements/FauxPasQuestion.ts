import { FauxPasSkipIf } from "./FauxPasSkipIf";

export type FauxPasQuestion = {
    question: string;
    answers: string[];
    correctIndex: number;
    skipIf?: FauxPasSkipIf;
};