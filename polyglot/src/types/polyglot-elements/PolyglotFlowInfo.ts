export type PolyglotFlowInfo = {
    _id?: string;
    title: string;
    author?: {
        _id?: string;
        username?: string;
    };
    description: string;
    tags: { name: string; color: string }[];
    publish: boolean;
    sourceMaterial?: string;
    language?: string;
    macro_subject?: string;
    context?: string;
};