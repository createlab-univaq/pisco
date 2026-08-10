import { ConceptEdge } from "./ConceptEdge";
import { ConceptNode } from "./ConceptNode";

export type ConceptMap = {
    _id?: string;
    nodes: ConceptNode[];
    edges: ConceptEdge[];
};