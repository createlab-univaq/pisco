import { TeoriaDellaMenteQuestion } from "./TeoriaDellaMenteQuestion";

export type TeoriaDellaMenteQuizItem = {
    qid: string;
    narration: string;
    questions: TeoriaDellaMenteQuestion[];
};