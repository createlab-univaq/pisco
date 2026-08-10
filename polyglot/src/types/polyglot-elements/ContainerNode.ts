import { ContainerNodeData } from "./ContainerNodeData";
import { NODE_TYPE } from "./NodeType";
import { PolyglotNodeBase } from "./PolyglotNodeBase";

export type ContainerNode = PolyglotNodeBase & {
  type: typeof NODE_TYPE.CONTAINER;
  data: ContainerNodeData;
};