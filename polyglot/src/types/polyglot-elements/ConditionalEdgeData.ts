import { ConditionalOperator } from "./ConditionalOperator";

export type ConditionalEdgeData = {
  edgeData: Record<string, any>;
  operator?: ConditionalOperator;
  threshold?: number;
};