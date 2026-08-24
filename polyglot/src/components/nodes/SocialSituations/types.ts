import { PolyglotNodeBase } from '@/types/polyglot-elements/PolyglotNodeBase';

export type SocialSituationAnswer = {
    text: string;
    score: number; // valutazione numerica associata alla risposta
};

export type SocialSituationSection = {
    before: string;
    bold: string;
    after: string;
    answers: SocialSituationAnswer[];
    correctIndexes: number[]; // multi-select (indici dentro answers)
};

export type SocialSituationItem = {
    sid: string;
    sections: SocialSituationSection[];
};

export type SocialSituationsNodeData = {
    nodeData: Record<string, any>;
    items: SocialSituationItem[];
};

export type SocialSituationsNode = PolyglotNodeBase & {
    type: 'socialSituationsNode';
    data: SocialSituationsNodeData;
};