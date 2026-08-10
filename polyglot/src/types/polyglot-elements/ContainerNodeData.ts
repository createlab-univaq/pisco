import { ContainerSection } from "./ContainerSection";

export type ContainerNodeData = {
    nodeData: Record<string, any>;
    sections: ContainerSection[];
};