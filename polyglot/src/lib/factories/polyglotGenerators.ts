import { MarkerType } from 'reactflow';
import { v4 as UUIDv4 } from 'uuid';
import { PolyglotNode } from '@/types/PolyglotNode';
import { PolyglotEdge } from '@/types/PolyglotEdge';
import { polyglotNodeComponentMapping } from '@/components/ElementMapping';
import { EDGE_TYPE } from '@/types/EdgeType';
import { NODE_TYPE } from '@/types/NodeType';
import { Analyst, Flow } from '@/types';

export const createNewDefaultPolyglotFlow = (): Flow => ({
    id: UUIDv4(),
    name: 'New Flow',
    description: '',
    published: false,
    flowJson: {
        nodes: [],
        edges: [],
    },
    analyst: {} as Analyst,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
});

export const createNewDefaultPolyglotNode = (
    pos: { x: number; y: number },
    nodeType: string = NODE_TYPE.EMOTION_ATTRIBUTION_EXERCISE_A
): PolyglotNode => {
    const id = UUIDv4();
    const defaultData = polyglotNodeComponentMapping.defaultDataMapping?.[nodeType] ?? {};

    const defaultTitle = polyglotNodeComponentMapping.nameMapping?.[nodeType]
        ?? nodeType.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')
        ?? 'New Node';

    const defaultIsExercise = polyglotNodeComponentMapping.isExerciseMapping?.[nodeType];

    return {
        _id: id,
        type: nodeType,
        title: defaultTitle,
        isExercise: defaultIsExercise,
        description: '',
        data: defaultData,
        reactFlow: {
            id,
            type: nodeType,
            position: pos,
            data: {
                ...defaultData,
                label: defaultTitle,
                title: defaultTitle,
            },
        },
    };
};

export const createNewDefaultPolyglotEdge = (
    sourceId: string,
    _sourceType: string,
    targetId: string
): PolyglotEdge => {
    const id = UUIDv4();
    const styleColor = 'grey';

    return {
        _id: id,
        type: EDGE_TYPE.UNCONDITIONAL,
        reactFlow: {
            id,
            source: sourceId,
            target: targetId,
            type: EDGE_TYPE.UNCONDITIONAL,
            style: { stroke: styleColor },
            markerEnd: {
                color: styleColor,
                type: MarkerType.Arrow,
                width: 25,
                height: 25,
            },
            data: { edgeData: {} },
        },
    } as PolyglotEdge;
};