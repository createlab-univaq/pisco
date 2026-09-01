import { NODE_TYPE } from "@/types/NodeType";
import { PolyglotNodeBase } from "@/types/PolyglotNodeBase";

export type TrueFalseNodeData = {
  nodeData: Record<string, any>;
  instructions: string;
  questions: string[];
  isQuestionCorrect: boolean[];
};

export type TrueFalseNode = PolyglotNodeBase & {
  type: typeof NODE_TYPE.TRUE_FALSE;
  data: TrueFalseNodeData;
};