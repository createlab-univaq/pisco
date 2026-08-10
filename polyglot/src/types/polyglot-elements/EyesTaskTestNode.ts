import { EyesTaskTestNodeData } from "./EyesTaskTestNodeData";
import { NODE_TYPE } from "./NodeType";
import { PolyglotNodeBase } from "./PolyglotNodeBase";

export type EyesTaskTestNode = PolyglotNodeBase & {
  type: typeof NODE_TYPE.EYES_TASK_TEST;
  data: EyesTaskTestNodeData;
};