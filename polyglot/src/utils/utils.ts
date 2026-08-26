import { useEffect, useState } from 'react';
import { MarkerType } from 'reactflow';
import { v4 as UUIDv4 } from 'uuid';
import { PolyglotFlow } from '@/types/polyglot-elements/PolyglotFlow';
import { PolyglotNode } from '@/types/polyglot-elements/PolyglotNode';
import { PolyglotEdge } from '@/types/polyglot-elements/PolyglotEdge';
import { polyglotNodeComponentMapping } from '@/components/ElementMapping';
import { ConditionalOperator } from '@/components/edges/ConditionalEdge';
import { PassFailConditionKind } from '@/components/edges/PassFailEdge';
import { EDGE_TYPE } from '@/types/polyglot-elements/EdgeType';
import { NODE_TYPE } from '@/types/polyglot-elements/NodeType';

// ============================================================================
// 1. REACT HOOKS
// ============================================================================

/**
 * Fixes Zustand persist hydration issues.
 * Use this hook to prevent "Extra attributes from the server" SSR mismatches.
 */
export const useHasHydrated = () => {
    const [hasHydrated, setHasHydrated] = useState<boolean>(false);

    useEffect(() => {
        setHasHydrated(true);
    }, []);

    return hasHydrated;
};

/**
 * Cycles through an array of values and updates a CSS custom property (variable).
 */
export const useToggleCSSVariable = (variable: string, values: string[]) => {
    if (values.length <= 0) {
        throw new Error(
            'useToggleCSSVariable: values must be an array with at least one element'
        );
    }

    const [currentIndex, setIndex] = useState<number>(0);

    // Initial set (Note: in Next.js this will only run on the client)
    if (typeof document !== 'undefined') {
        document.documentElement.style.setProperty(variable, values[currentIndex]);
    }

    function handleChange() {
        const nextIndex = (currentIndex + 1) % values.length;
        setIndex(nextIndex); // Async state update

        // Immediately use the calculated next value (fixes the old bug!)
        document.documentElement.style.setProperty(variable, values[nextIndex]);
    }

    return {
        index: currentIndex,
        value: values[currentIndex],
        toggle: handleChange,
    };
};

// ============================================================================
// 2. DATA UTILS
// ============================================================================

export const isObject = (variable: unknown): variable is Record<string, any> => {
    return (
        typeof variable === 'object' &&
        !Array.isArray(variable) &&
        variable !== null
    );
};

export const zip = <T, K>(a: T[], b: K[]) =>
    a.map((k, i) => ({ first: k, second: b[i] }));

// ============================================================================
// 3. POLYGLOT GENERATORS
// ============================================================================

export const createNewDefaultPolyglotFlow = (): PolyglotFlow => {
    return {
        _id: UUIDv4(),
        title: 'New Flow',
        description: '',
        publish: false,
        tags: [],
        nodes: [],
        edges: [],
    };
};

export const createNewDefaultPolyglotNode = (
    pos: { x: number; y: number },
    nodeType: string = 'multipleChoiceQuestionNode'
): PolyglotNode => {
    const id = UUIDv4();

    return {
        _id: id,
        type: nodeType,
        title: 'New Node',
        description: '',
        data: polyglotNodeComponentMapping.defaultDataMapping[nodeType] || {},
        reactFlow: {
            id: id,
            type: nodeType,
            position: pos,
        },
    } as PolyglotNode;
};

const configUnconditionalEdge: string[] = [
    NODE_TYPE.CONTAINER,
];

const configConditionalDefaultTrueEdge: string[] = [
    NODE_TYPE.FAUX_PAS,
];

export const createNewDefaultPolyglotEdge = (
    sourceId: string,
    sourceType: string,
    targetId: string
): PolyglotEdge => {
    const id = UUIDv4();

    const isUnconditional = configUnconditionalEdge.includes(sourceType || '');
    const isConditional = configConditionalDefaultTrueEdge.includes(sourceType || '');

    const type = isUnconditional
        ? EDGE_TYPE.UNCONDITIONAL
        : isConditional
            ? EDGE_TYPE.CONDITIONAL
            : EDGE_TYPE.PASS_FAIL;

    const styleColor =
        type === EDGE_TYPE.UNCONDITIONAL
            ? 'grey'
            : type === EDGE_TYPE.CONDITIONAL
                ? 'blue'
                : 'green';

    const baseReactFlowEdge = {
        id: id,
        source: sourceId,
        target: targetId,
        type: type,
        style: { stroke: styleColor },
        markerEnd: {
            color: styleColor,
            type: MarkerType.Arrow,
            width: 25,
            height: 25,
        },

        data: type === EDGE_TYPE.CONDITIONAL 
            ? { edgeData: {}, operator: '>=', threshold: 0 }
            : type === EDGE_TYPE.PASS_FAIL
                ? { edgeData: {}, conditionKind: 'pass' }
                : { edgeData: {} }
    };

    if (type === EDGE_TYPE.UNCONDITIONAL) {
        return {
            _id: id,
            type: EDGE_TYPE.UNCONDITIONAL,
            reactFlow: baseReactFlowEdge,
        } as PolyglotEdge;
    }

    if (type === EDGE_TYPE.CONDITIONAL) {
        return {
            _id: id,
            type: EDGE_TYPE.CONDITIONAL,
            reactFlow: baseReactFlowEdge,
        } as PolyglotEdge;
    }

    return {
        _id: id,
        type: EDGE_TYPE.PASS_FAIL,
        reactFlow: baseReactFlowEdge,
    } as PolyglotEdge;
};