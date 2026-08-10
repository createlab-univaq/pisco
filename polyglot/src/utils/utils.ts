import { useEffect, useState } from 'react';
import { MarkerType } from 'reactflow';
import { v4 as UUIDv4 } from 'uuid';
import { PolyglotFlow } from '@/types/polyglot-elements/PolyglotFlow';
import { PolyglotNode } from '@/types/polyglot-elements/PolyglotNode';
import { PolyglotEdge } from '@/types/polyglot-elements/PolyglotEdge';
import { polyglotNodeComponentMapping } from '@/components/ElementMapping';

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
        // topicsAI: [], <-- Removed since we stripped out AI types
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
        difficulty: 1,
        platform: polyglotNodeComponentMapping.defaultPlatformMapping[nodeType] || 'WebApp',
        data: polyglotNodeComponentMapping.defaultDataMapping[nodeType] || {},
        reactFlow: {
            id: id,
            type: nodeType,
            position: pos,
        },
    } as PolyglotNode;
    // We use `as PolyglotNode` here because we are dynamically generating 
    // the type string at runtime based on the component mapping.
};


const configUnconditionalEdge = [
    'lessonTextNode',
    'WatchVideoNode',
    'ScanningNode',
    'MindMapNode',
    'SummaryNode',
    'ProblemSolvingNode',
    'FindSolutionNode',
    'CreateKeywordsListNode',
    'MemoriseKeywordsListNode',
    'PromptEngineeringNode',
    'CodingQuestionNode',
    'ContainerNode',
];

const configConditionalDefaultTrueEdge = [
    'EmotionAttributionTestNode',
    'EyesTaskTestNode',
    'socialSituationsNode',
    'TeoriaDellaMenteNode',
    'FauxPasNode',
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
        ? 'unconditionalEdge'
        : isConditional
            ? 'conditionalEdge'
            : 'passFailEdge';

    const styleColor =
        type === 'unconditionalEdge'
            ? 'grey'
            : type === 'conditionalEdge'
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
    };

    // We return them explicitly so TypeScript's discriminated union works perfectly
    if (type === 'unconditionalEdge') {
        return {
            _id: id,
            type: 'unconditionalEdge',
            title: '',
            code: '',
            data: {
                edgeData: {}
            },
            reactFlow: baseReactFlowEdge,
        };
    }

    if (type === 'conditionalEdge') {
        return {
            _id: id,
            type: 'conditionalEdge',
            title: '',
            code: '',
            data: {
                edgeData: {},
                operator: '>=',
                threshold: 0
            },
            reactFlow: baseReactFlowEdge,
        };
    }

    return {
        _id: id,
        type: 'passFailEdge',
        title: '',
        code: '',
        data: {
            edgeData: {},
            conditionKind: 'pass'
        },
        reactFlow: baseReactFlowEdge,
    };
};