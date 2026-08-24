import { NODE_TYPE } from "@/types/polyglot-elements/NodeType";
import { PolyglotNodeBase } from "@/types/polyglot-elements/PolyglotNodeBase";

export type TrueFalseNodeData = {
    nodeData: Record<string, any>;
    instructions: string;
    questions: string[];
    isQuestionCorrect: boolean[];
    negativePoints?: number;
    positivePoints?: number;
};

export type TrueFalseNode = PolyglotNodeBase & {
  type: typeof NODE_TYPE.TRUE_FALSE;
  data: TrueFalseNodeData;
};