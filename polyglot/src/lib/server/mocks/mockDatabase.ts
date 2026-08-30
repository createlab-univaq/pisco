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

// NEW: Helper function to generate and store the mock flow
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

export function updateMockAnalyst(payload: Partial<Analyst>): Analyst {
    mockAnalyst.firstName = payload.firstName || mockAnalyst.firstName;
    mockAnalyst.lastName = payload.lastName || mockAnalyst.lastName;
    mockAnalyst.email = payload.email || mockAnalyst.email;
    return mockAnalyst;
}

export function deleteMockAnalyst(): void {
    // In a real mock scenario, you might clear out their flows or reset the object.
    console.log("Mock analyst deleted.");
}