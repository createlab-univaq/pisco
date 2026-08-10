import { CloseEndedQuestionNode } from '@/types/polyglot-elements/CloseEndedQuestionNode';
import { LessonTextNode } from '@/types/polyglot-elements/LessonTextNode';
import { MultipleChoiceQuestionNode } from '@/types/polyglot-elements/MultipleChoiceQuestionNode';
import { PassFailEdge } from '@/types/polyglot-elements/PassFailEdge';
import { PolyglotEdge } from '@/types/polyglot-elements/PolyglotEdge';
import { PolyglotFlow } from '@/types/polyglot-elements/PolyglotFlow';
import { PolyglotNode } from '@/types/polyglot-elements/PolyglotNode';
import { UnconditionalEdge } from '@/types/polyglot-elements/UnconditionalEdge';
import { MarkerType } from 'reactflow';
import { v4 as UUIDv4 } from 'uuid';


const exampleFlows = new Map<string, PolyglotFlow>();

// Generate 8 UUIDs for our mock nodes
const ids = Array.from({ length: 8 }, () => UUIDv4());

// ============================================================================
// 1. MOCK NODES
// ============================================================================

const multipleChoiceNodes: MultipleChoiceQuestionNode[] = [
    {
        _id: ids[0],
        platform: 'WebApp',
        type: 'multipleChoiceQuestionNode',
        title: 'Multiple Choice Question',
        description: 'Some description',
        difficulty: 1,
        data: {
            nodeData: {},
            question: 'Test',
            isChoiceCorrect: [false],
            choices: ['Choice test'],
        },
        reactFlow: {
            id: UUIDv4(),
            type: 'multipleChoiceQuestionNode',
            position: { x: 250, y: 0 },
            data: { label: 'Multiple Choice Question' },
        },
    },
];

const closeEndedQuestionNodes: CloseEndedQuestionNode[] = [
    {
        _id: UUIDv4(),
        type: 'closeEndedQuestionNode',
        title: 'Close Ended Question',
        platform: 'WebApp',
        description: 'Some description',
        difficulty: 1,
        data: {
            nodeData: {}, // <-- You have it here
            question: 'domandona',
            correctAnswers: ['rispostona'],
            isAnswerCorrect: [true],
        },
        reactFlow: {
            id: UUIDv4(),
            type: 'closeEndedQuestionNode',
            position: { x: 250, y: 150 },
            data: { label: 'Close Ended Question' },
        },
    },
    // Generate additional Close Ended nodes dynamically
    ...ids.map((id, index) => ({
        _id: id,
        type: 'closeEndedQuestionNode' as const,
        title: index % 2 ? 'To' : 'From',
        platform: 'WebApp',
        description: 'Some description',
        difficulty: 5,
        data: {
            nodeData: {}, // FIXED: Added missing nodeData here!
            question: 'domandona',
            correctAnswers: ['rispostona'],
            isAnswerCorrect: [true],
        },
        reactFlow: {
            id: id,
            type: 'closeEndedQuestionNode',
            position: {
                x: index % 2 ? 600 : 250,
                y: 375 + Math.floor(index / 2) * 75,
            },
            data: { label: index % 2 ? 'To' : 'From' },
        },
    })),
];

const lessonNodes: LessonTextNode[] = [
    {
        _id: UUIDv4(),
        type: 'lessonTextNode',
        platform: 'WebApp',
        title: 'Lesson',
        description: 'Some description',
        difficulty: 1,
        data: {
            nodeData: {},
            text: ''
        },
        reactFlow: {
            id: UUIDv4(),
            type: 'lessonNode',
            position: { x: 250, y: 225 },
            data: { label: 'Lesson' },
        },
    },
];

const flowNodes: PolyglotNode[] = [
    ...multipleChoiceNodes,
    ...closeEndedQuestionNodes,
    ...lessonNodes,
];

// ============================================================================
// 2. MOCK EDGES
// ============================================================================

const passFailEdges: PassFailEdge[] = [
    {
        _id: UUIDv4(),
        title: 'Pass/Fail',
        type: 'passFailEdge',
        data: {
            edgeData: {},
            conditionKind: 'pass',
        },
        reactFlow: {
            id: UUIDv4(),
            source: ids[0],
            target: ids[1],
            type: 'passFailEdge',
            markerEnd: {
                color: 'grey',
                type: MarkerType.Arrow,
                width: 25,
                height: 25,
            },
        },
    },
];

const unconditionalEdge: UnconditionalEdge[] = [
    {
        _id: UUIDv4(),
        title: 'Unconditional',
        type: 'unconditionalEdge',
        data: {
            edgeData: {}
        },
        reactFlow: {
            id: UUIDv4(),
            source: ids[4],
            target: ids[5],
            type: 'unconditionalEdge',
            markerEnd: {
                color: 'grey',
                type: MarkerType.Arrow,
                width: 25,
                height: 25,
            },
        },
    },
];

const flowEdges: PolyglotEdge[] = [...passFailEdges, ...unconditionalEdge];

// ============================================================================
// 3. COMPILE AND EXPORT
// ============================================================================

exampleFlows.set('1', {
    _id: UUIDv4(),
    author: {
        _id: 'dasdas',
        username: 'Prova Utente',
    },
    title: 'Example Flow #1',
    description: 'This is an example flow',
    publish: false,
    tags: [],
    nodes: flowNodes,
    edges: flowEdges,
});

export default exampleFlows;