import { NODE_TYPE } from "./NodeType";
import { PolyglotNodeBase } from "./PolyglotNodeBase";
import { WatchVideoNodeData } from "./WatchVideoNodeData";

export type WatchVideoNode = PolyglotNodeBase & {
  type: typeof NODE_TYPE.WATCH_VIDEO;
  data: WatchVideoNodeData;
};