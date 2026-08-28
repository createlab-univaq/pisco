import { MarkerType } from 'reactflow';
import { v4 as UUIDv4 } from 'uuid';
import { PolyglotFlow } from '@/types/PolyglotFlow';
import { PolyglotNode } from '@/types/PolyglotNode';
import { PolyglotEdge } from '@/types/PolyglotEdge';
import { polyglotNodeComponentMapping } from '@/components/ElementMapping';
import { EDGE_TYPE } from '@/types/EdgeType';
import { NODE_TYPE } from '@/types/NodeType';

export const createNewDefaultPolyglotFlow = (): PolyglotFlow => ({
    _id: UUIDv4(),
    title: 'New Flow',
    description: '',
    publish: false,
    nodes: [],
    edges: [],
});

export const createNewDefaultPolyglotNode = (
    pos: { x: number; y: number },
    nodeType: string = NODE_TYPE.EMOTION_ATTRIBUTION_A
): PolyglotNode => {
    const id = UUIDv4();
    const defaultData = polyglotNodeComponentMapping.defaultDataMapping[nodeType] ?? {};

    return {
        _id: id,
        type: nodeType,
        title: 'New Node',
        description: '',
        data: defaultData,
        reactFlow: {
            id,
            type: nodeType,
            position: pos,
            data: defaultData,
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