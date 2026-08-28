import type { Edge } from 'reactflow';

export type PolyglotEdgeBase = {
  _id: string;
  reactFlow?: Edge<unknown>;
};