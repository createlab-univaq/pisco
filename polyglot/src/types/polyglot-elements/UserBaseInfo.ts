export type UserBaseInfo = {
    ctx: {
        flowId: string;
        username: string;
        currentNode: string;
        conditions: [{ edgeId: string; conditionKind: string }];
    };
    key: string;
};