import type { Edge } from 'reactflow';

export type PolyglotEdgeBase = {
  _id: string;
  title: string;
  description?: string;
  code?: string;
  reactFlow?: Edge<unknown>;
};