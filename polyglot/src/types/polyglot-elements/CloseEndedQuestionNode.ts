import { CloseEndedQuestionNodeData } from "./CloseEndedQuestionNodeData";
import { NODE_TYPE } from "./NodeType";
import { PolyglotNodeBase } from "./PolyglotNodeBase";

export type CloseEndedQuestionNode = PolyglotNodeBase & {
    type: typeof NODE_TYPE.CLOSE_ENDED_QUESTION;
    data: CloseEndedQuestionNodeData;
};