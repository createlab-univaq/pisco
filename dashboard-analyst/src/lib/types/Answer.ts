export interface Answer {
    id: string;
    polyglotNodeId: string;
    nodeType: {
        id?: string;
        label: string;
    };
    nodeName?: string;
    category?: 'TEST' | 'ESERCITAZIONE';
    phase?: 'PRE' | 'POST' | 'NONE';
    reactionTimeMs: number;
    totalResponseTimeMs?: number;
    score: number;
    maxScore: number;
    mouseDistancePx: number;
    sequenceNumber: number;
}