import type { Node } from 'reactflow';

export type PolyglotNodeBase = {
  _id: string;
  title: string;
  isExercise: boolean,
  description: string;
  reactFlow?: Node<unknown>;
};