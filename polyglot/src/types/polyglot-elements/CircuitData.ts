export type CircuitData = {
    nodeData: Record<string, any>;
    instructions: string;
    pinsList: { pin: string; value: string }[];
};