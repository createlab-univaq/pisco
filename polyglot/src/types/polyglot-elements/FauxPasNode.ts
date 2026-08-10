import { FauxPasNodeData } from "./FauxPasNodeData";
import { NODE_TYPE } from "./NodeType";
import { PolyglotNodeBase } from "./PolyglotNodeBase";

export type FauxPasNode = PolyglotNodeBase & {
  type: typeof NODE_TYPE.FAUX_PAS;
  data: FauxPasNodeData;
};