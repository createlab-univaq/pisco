import fs from 'fs/promises';
import path from 'path';
import {
    mockPatients,
    mockDegrees,
    mockStats,
    mockExecutions,
    mockDiagnoses,
    mockAnalyst,
    mockPolyglotPaths
} from '$lib/server/mocks/mockDatabase';

// Resolve to the project root directory
const DB_PATH = path.resolve(process.cwd(), 'mock-database.json');

// Extract unique assigned paths from the mock executions to act as our Paths table
const initialPatientPaths = mockExecutions
    .map(ex => ex.patientPath)
    .filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);

export async function getDb() {
    try {
        const data = await fs.readFile(DB_PATH, 'utf-8');
        return JSON.parse(data);
    } catch (e) {
        // If file doesn't exist, seed it with the arrays from your mockDatabase.ts
        const initialDb = {
            patients: mockPatients,
            degrees: mockDegrees,
            stats: mockStats,
            executions: mockExecutions,
            diagnoses: mockDiagnoses,
            analyst: mockAnalyst,
            polyglotPaths: mockPolyglotPaths,
            patientPaths: initialPatientPaths
        };
        await fs.writeFile(DB_PATH, JSON.stringify(initialDb, null, 2));
        return initialDb;
    }
}

export async function saveDb(db: any) {
    await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2));
}