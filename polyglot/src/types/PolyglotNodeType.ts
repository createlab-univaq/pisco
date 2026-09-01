import { NODE_TYPE } from "./NodeType";

export type PolyglotNodeType = typeof NODE_TYPE[keyof typeof NODE_TYPE];