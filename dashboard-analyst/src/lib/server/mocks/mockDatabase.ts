import type { Patient, Degree, Diagnosis, GameExecution, Stats, Analyst } from '$lib/types';

export const mockDegrees: Degree[] = [
    { code: 'DEG_LIC', label: 'Licenza Media', educationLevel: 1 },
    { code: 'DEG_DIP', label: 'Diploma Superiori', educationLevel: 2 },
    { code: 'DEG_LAU', label: 'Laurea Universitaria', educationLevel: 3 }
];

export const mockPatients: Patient[] = [
    {
        id: 'mock-id-1',
        firstName: 'Mario',
        lastName: 'Rossi',
        gender: 'MASCHIO',
        age: 45,
        degree: mockDegrees[1],
        createdAt: new Date().toISOString()
    },
    {
        id: 'mock-id-2',
        firstName: 'Giulia',
        lastName: 'Bianchi',
        gender: 'FEMMINA',
        age: 32,
        degree: mockDegrees[2],
        createdAt: new Date().toISOString()
    }
];

export const mockStats: Stats = {
    pazienti: 2,
    maschi: 1,
    femmine: 1,
    percorsi: 4,
    testTable: [
        { nomeTest: 'Theory of Mind', percentualePre: 85.0, percentualePost: 95.0, tempoMedio: 420.5 },
        { nomeTest: 'Faux Pas Test', percentualePre: 70.0, percentualePost: 88.5, tempoMedio: 610.0 }
    ],
    chartData: [
        { x: 'Test 1', y: 80 },
        { x: 'Test 2', y: 92 }
    ]
};

export const mockExecutions: GameExecution[] = [
    {
        id: 'exec-1',
        patientPath: {
            id: 'path-1',
            patient: mockPatients[0],
            polyglotPathId: 'poly-1',
            uniqueCode: 'ABC-123',
            assignedAt: new Date().toISOString()
        },
        startedAt: new Date().toISOString(),
        finishedAt: new Date().toISOString(),
        answers: [
            {
                id: 'ans-1',
                polyglotNodeId: 'node-1',
                nodeType: { label: 'Eyes Task' },
                nodeName: 'Eyes Task',
                category: 'TEST',
                phase: 'PRE',
                reactionTimeMs: 450,
                totalResponseTimeMs: 890,
                score: 9,
                maxScore: 10,
                mouseDistancePx: 120,
                sequenceNumber: 1
            }
        ]
    }
];

export const mockDiagnoses: Diagnosis[] = [
    {
        id: 'diag-1',
        patient: mockPatients[0],
        diagnosisDate: new Date().toISOString(),
        diagnosisText: 'Lieve miglioramento nelle capacità di riconoscimento emotivo.',
        notes: 'Paziente collaborativo.',
        medications: 'Nessuno',
        createdAt: new Date().toISOString()
    }
];

export const mockAnalyst: Analyst = {
    id: 'analyst-1',
    firstName: 'Admin',
    lastName: 'Analyst',
    email: 'admin@gmail.com',
    role: 'ADMIN',
    createdAt: new Date().toISOString()
};