import { LessonTextNodeData } from "./LessonTextNodeData";
import { NODE_TYPE } from "./NodeType";
import { PolyglotNodeBase } from "./PolyglotNodeBase";

export type LessonTextNode = PolyglotNodeBase & {
  type: typeof NODE_TYPE.LESSON_TEXT;
  data: LessonTextNodeData;
};