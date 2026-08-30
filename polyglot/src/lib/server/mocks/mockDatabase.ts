import { Analyst, Flow } from "@/types";
import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'mock-database.json');

interface MockDatabaseSchema {
    analysts: Analyst[];
    flows: Flow[];
}

const initialDatabase: MockDatabaseSchema = {
    analysts: [
        {
            id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            firstName: "Admin",
            lastName: "Analyst",
            email: "user@example.com",
            role: "ANALYST",
            createdAt: "2026-08-30T14:20:03.693Z"
        }
    ],
    flows: []
};

function readDB(): MockDatabaseSchema {
    try {
        if (!fs.existsSync(DB_PATH)) {
            fs.writeFileSync(DB_PATH, JSON.stringify(initialDatabase, null, 2), 'utf8');
        }
        return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
    } catch (e) {
        console.error("Failed to read mock DB:", e);
        return initialDatabase;
    }
}

function writeDB(data: MockDatabaseSchema): void {
    try {
        fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
    } catch (e) {
        console.error("Failed to write mock DB:", e);
    }
}

export function getMockAnalyst(id: string = "3fa85f64-5717-4562-b3fc-2c963f66afa6"): Analyst {
    const db = readDB();
    return db.analysts.find(a => a.id === id) || db.analysts[0];
}

export const mockNewAnalyst: Analyst = {
    id: "mock-new-analyst-id",
    firstName: "Nuovo",
    lastName: "Utente",
    email: "user@example.com",
    role: "ANALYST",
    createdAt: new Date().toISOString()
};

export function updateMockAnalyst(id: string, payload: Partial<Analyst>): Analyst {
    const db = readDB();
    let analyst = db.analysts.find(a => a.id === id);
    if (!analyst) {
        analyst = {
            id: id || crypto.randomUUID(),
            firstName: payload.firstName || "User",
            lastName: payload.lastName || "",
            email: payload.email || "user@example.com",
            role: "ANALYST",
            createdAt: new Date().toISOString()
        };
        db.analysts.push(analyst);
    } else {
        analyst.firstName = payload.firstName ?? analyst.firstName;
        analyst.lastName = payload.lastName ?? analyst.lastName;
        analyst.email = payload.email ?? analyst.email;
    }
    writeDB(db);
    return analyst;
}

export function deleteMockAnalyst(id: string): void {
    const db = readDB();
    db.analysts = db.analysts.filter(a => a.id !== id);
    writeDB(db);
}

export function getMockFlows(): Flow[] {
    return readDB().flows;
}

export function addMockFlow(payload: Partial<Flow>): Flow {
    const db = readDB();
    const newFlow: Flow = {
        id: payload.id || crypto.randomUUID(),
        name: payload.name || "Untitled Flow",
        description: payload.description || "",
        published: payload.published || false,
        flowJson: payload.flowJson || { nodes: [], edges: [] },
        analyst: db.analysts[0],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    db.flows.push(newFlow);
    writeDB(db);
    return newFlow;
}

export function getMockFlowById(id: string): Flow | undefined {
    return readDB().flows.find(f => f.id === id);
}

export function updateMockFlow(id: string, updatedFlow: Flow): Flow {
    const db = readDB();
    let flow = db.flows.find(f => f.id === id);
    if (!flow) {
        const partialFlow: Partial<Flow> = {
            ...updatedFlow,
            id: id,
        }
        flow = addMockFlow(partialFlow)
    } else {
        flow.name = updatedFlow.name;
        flow.description = updatedFlow.description;
        flow.published = updatedFlow.published;
        flow.flowJson = updatedFlow.flowJson;
        flow.updatedAt = new Date().toISOString();
        writeDB(db);
    }
    return flow;
}

export function deleteMockFlow(id: string): void {
    const db = readDB();
    db.flows = db.flows.filter(f => f.id !== id);
    writeDB(db);
}

export function storeMockImage(mimeType: string, base64Data: string): string {
    return `data:${mimeType || 'image/jpeg'};base64,${base64Data}`;
}

export function deleteMockImage(id: string): void {
    console.log(`Mock image deleted: ${id}`);
}