import * as t from 'io-ts';
import { Node } from 'reactflow';

// export type HandleData = {
//     handleProps: HandleProps;
// }

export const NodeData_IoTs = t.type({} as { [x: string]: any });
export type NodeData = t.TypeOf<typeof NodeData_IoTs>;
export const defaultPolyglotNodeData: NodeData = {};

export const PolyglotNode_IoTs = t.type(
  {
    _id: t.string,
    type: t.string,
    title: t.string,
    description: t.string,
    difficulty: t.number,
    data: NodeData_IoTs,
    platform: t.string,
  },
  'PolyglotNode'
);

/**
 * A node in the polyglot graph.
 * @param sas comment
 */
export type PolyglotNode = t.TypeOf<typeof PolyglotNode_IoTs> & {
  reactFlow: Node<unknown>;
};

// TODO: add type TextualQuestion or similar to standardize textual questions such as multiple choice, open questions, coding exercises, ecc.

export type ChallengeSetup = {};
export type ChallengeContent = {
  type: string;
  content: string;
  priority?: number;
};
