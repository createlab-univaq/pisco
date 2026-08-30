import { Analyst, Flow } from "@/types";

export const mockAnalyst: Analyst = {
    id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    firstName: "Admin",
    lastName: "Analyst",
    email: "user@example.com",
    role: "ANALYST",
    createdAt: "2026-08-30T14:20:03.693Z"
};

export const mockNewAnalyst: Analyst = {
    id: "mock-new-analyst-id",
    firstName: "Nuovo",
    lastName: "Utente",
    email: "user@example.com",
    role: "ANALYST",
    createdAt: new Date().toISOString()
};

export const mockFlows: Flow[] = [
    {
        id: "mock-flow-1",
        name: "Introduzione alla Teoria della Mente",
        description: "Percorso base per il riconoscimento emotivo.",
        published: true,
        flowJson: {},
        analyst: mockAnalyst,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: "mock-flow-2",
        name: "Test Faux Pas Avanzato",
        description: "Valutazione interazioni sociali complesse.",
        published: false,
        flowJson: {},
        analyst: mockAnalyst,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }
];

// Helper to convert uploaded base64 file payload into a usable Data URL for mock rendering
export function storeMockImage(mimeType: string, base64Data: string): string {
    const cleanMime = mimeType || 'image/jpeg';
    return `data:${cleanMime};base64,${base64Data}`;
}

export function deleteMockImage(id: string): void {
    console.log(`Mock image reference cleaned: ${id}`);
}

export function addMockFlow(payload: Partial<Flow>): Flow {
    const newFlow: Flow = {
        id: payload.id || crypto.randomUUID(),
        name: payload.name || "Untitled Flow",
        description: payload.description || "",
        published: payload.published || false,
        flowJson: payload.flowJson || {},
        analyst: mockAnalyst,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    mockFlows.push(newFlow);
    return newFlow;
}

export function getMockFlowById(id: string): Flow | undefined {
    return mockFlows.find(f => f.id === id) || mockFlows[0];
}

export function updateMockFlow(id: string, flowJson: any): Flow {
    let flow = mockFlows.find(f => f.id === id);
    if (!flow) {
        flow = {
            id,
            name: "Updated Flow",
            description: "",
            published: false,
            flowJson: flowJson,
            analyst: mockAnalyst,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        mockFlows.push(flow);
    } else {
        flow.flowJson = flowJson;
        flow.updatedAt = new Date().toISOString();
    }
    return flow;
}

export function updateMockAnalyst(payload: Partial<Analyst>): Analyst {
    mockAnalyst.firstName = payload.firstName || mockAnalyst.firstName;
    mockAnalyst.lastName = payload.lastName || mockAnalyst.lastName;
    mockAnalyst.email = payload.email || mockAnalyst.email;
    return mockAnalyst;
}

export function deleteMockAnalyst(): void {
    console.log("Mock analyst deleted.");
}