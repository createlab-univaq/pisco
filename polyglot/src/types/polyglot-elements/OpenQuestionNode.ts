import { NODE_TYPE } from "./NodeType";
import { OpenQuestionNodeData } from "./OpenQuestionNodeData";
import { PolyglotNodeBase } from "./PolyglotNodeBase";

export type OpenQuestionNode = PolyglotNodeBase & {
  type: typeof NODE_TYPE.OPEN_QUESTION;
  data: OpenQuestionNodeData;
};