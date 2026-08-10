import { NODE_TYPE } from "./NodeType";
import { PolyglotNodeBase } from "./PolyglotNodeBase";
import { TrueFalseNodeData } from "./TrueFalseNodeData";

export type TrueFalseNode = PolyglotNodeBase & {
  type: typeof NODE_TYPE.TRUE_FALSE;
  data: TrueFalseNodeData;
};