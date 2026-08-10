import { NODE_TYPE } from "./NodeType";
import { PolyglotNodeBase } from "./PolyglotNodeBase";
import { SocialSituationsNodeData } from "./SocialSituationsNodeData";

export type SocialSituationsNode = PolyglotNodeBase & {
  type: typeof NODE_TYPE.SOCIAL_SITUATIONS;
  data: SocialSituationsNodeData;
};