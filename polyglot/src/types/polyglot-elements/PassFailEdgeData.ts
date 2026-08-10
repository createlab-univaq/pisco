import { PassFailEdgeConditionKind } from "./PassFailEdgeConditionKind";

export type PassFailEdgeData = {
    edgeData: Record<string, any>;
    conditionKind: PassFailEdgeConditionKind;
};