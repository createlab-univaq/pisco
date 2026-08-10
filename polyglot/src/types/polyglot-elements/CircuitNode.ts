import { CircuitData } from "./CircuitData";
import { NODE_TYPE } from "./NodeType";
import { PolyglotNodeBase } from "./PolyglotNodeBase";

export type CircuitNode = PolyglotNodeBase & {
  type: typeof NODE_TYPE.CIRCUIT;
  data: CircuitData;
};