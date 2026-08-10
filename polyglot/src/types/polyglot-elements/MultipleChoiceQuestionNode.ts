import { MultipleChoiceQuestionNodeData } from "./MultipleChoiceQuestionNodeData";
import { NODE_TYPE } from "./NodeType";
import { PolyglotNodeBase } from "./PolyglotNodeBase";

export type MultipleChoiceQuestionNode = PolyglotNodeBase & {
  type: typeof NODE_TYPE.MULTIPLE_CHOICE_QUESTION;
  data: MultipleChoiceQuestionNodeData;
};