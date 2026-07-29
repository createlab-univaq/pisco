import { MarkerType } from 'reactflow';
import { v4 as UUIDv4 } from 'uuid';
import {
  CloseEndedQuestionNode,
  LessonTextNode,
  MultipleChoiceQuestionNode,
  PassFailEdge,
  PolyglotEdge,
  PolyglotFlow,
  PolyglotNode,
  UnconditionalEdge,
} from '../types/polyglotElements';

const exampleFlows = new Map<string, PolyglotFlow>();

{
  const ids = [...Array(8).keys()].map(() => UUIDv4());

  /*
        NODE EXAMPLE DATA #1:
    
    
    */
  const multipleChoiceNodes: MultipleChoiceQuestionNode[] = [
    {
      _id: ids[0],
      platform: 'WebApp',
      type: 'multipleChoiceQuestionNode',
      title: 'Multiple Choice Question',
      description: 'Some description',
      difficulty: 1,
      data: {
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
    ...ids.map(
      (id, index) =>
        ({
          type: 'closeEndedQuestionNode',
          title: index % 2 ? 'To' : 'From',
          description: 'Some description',
          difficulty: 5,
          data: { question: 'domandona', correctAnswers: ['rispostona'] },
          reactFlow: {
            id: id,
            type: 'closeEndedQuestionNode',
            position: {
              x: index % 2 ? 600 : 250,
              y: 375 + Math.floor(index / 2) * 75,
            },
            data: { label: index % 2 ? 'To' : 'From' },
          },
        } as CloseEndedQuestionNode)
    ),
  ];

  const lessonNodes: LessonTextNode[] = [
    {
      _id: UUIDv4(),
      type: 'lessonTextNode',
      platform: 'WebApp',
      title: 'Lesson',
      description: 'Some description',
      difficulty: 1,
      data: { text: '' },
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

  /*
        EDGE EXAMPLE DATA #1:
    
    
    */

  const passFailEdges: PassFailEdge[] = [
    {
      _id: UUIDv4(),
      title: 'Pass/Fail',
      type: 'passFailEdge',
      data: {
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
      data: {},
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
    topicsAI: [],
    nodes: flowNodes,
    edges: flowEdges,
  });
}

export default exampleFlows;
