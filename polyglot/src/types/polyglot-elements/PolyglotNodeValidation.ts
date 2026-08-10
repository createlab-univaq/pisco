import { PolyglotNode } from "./PolyglotNode";

export type PolyglotNodeValidation = PolyglotNode & {
    validation: {
        id: string;
        title: string;
        code: string;
        data: any;
        type: string;
    }[];
};