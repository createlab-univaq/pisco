import { NODE_TYPE } from '@/types/NodeType';
import { PolyglotNodeBase } from '@/types/PolyglotNodeBase';

export type SocialSituationSection = {
    before: string;
    bold: string;
    after: string;
    answers: string[];
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
    type: typeof NODE_TYPE.SOCIAL_SITUATIONS;
    data: SocialSituationsNodeData;
};