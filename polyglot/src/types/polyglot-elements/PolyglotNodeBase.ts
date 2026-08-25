import type { Node } from 'reactflow';

export type PolyglotNodeBase = {
  _id: string;
  title: string;
  description: string;
  reactFlow?: Node<unknown>;
};