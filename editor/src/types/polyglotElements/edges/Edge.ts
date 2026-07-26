import * as t from 'io-ts';
import { Edge } from 'reactflow';

export const EdgeData_IoTs = t.type({} as { [x: string]: any });
export type EdgeData = t.TypeOf<typeof EdgeData_IoTs>;
export const defaultPolyglotEdgeData: EdgeData = {};

export const PolyglotEdge_IoTs = t.intersection(
  [
    t.type({
      _id: t.string,
      type: t.string,
      title: t.string,
      data: EdgeData_IoTs,
    }),
    t.partial({
      code: t.string,
    }),
  ],
  'PolyglotEdge'
);

export type PolyglotEdge = t.TypeOf<typeof PolyglotEdge_IoTs> & {
  reactFlow: Edge<unknown>;
};
