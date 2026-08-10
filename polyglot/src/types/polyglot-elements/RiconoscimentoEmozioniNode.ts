import { NODE_TYPE } from "./NodeType";
import { PolyglotNodeBase } from "./PolyglotNodeBase";
import { RiconoscimentoEmozioniNodeData } from "./RiconoscimentoEmozioniNodeData";

export type RiconoscimentoEmozioniNode = PolyglotNodeBase & {
  type: typeof NODE_TYPE.RICONOSCIMENTO_EMOZIONI;
  data: RiconoscimentoEmozioniNodeData;
};