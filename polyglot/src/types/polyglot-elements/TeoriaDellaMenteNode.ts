import { PolyglotNodeBase } from "./PolyglotNodeBase";
import { TeoriaDellaMenteNodeData } from "./TeoriaDellaMenteNodeData";

export type TeoriaDellaMenteNode = PolyglotNodeBase & {
  type: 'TeoriaDellaMenteNode';
  data: TeoriaDellaMenteNodeData;
};