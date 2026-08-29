import type { Patient, Degree, Diagnosis, GameExecution, Stats, Analyst } from '$lib/types';
import type { PolyglotPath } from '$lib/types/PolyglotPath';

export const mockPolyglotPaths: PolyglotPath[] = [
    {
        id: 'poly-1',
        name: 'Protocollo Neurocognitivo Standard',
        description: 'Valutazione completa di teoria della mente e riconoscimento emotivo.'
    },
    {
        id: 'poly-2',
        name: 'Modulo Avanzato Faux Pas',
        description: 'Test mirato per interazioni sociali complesse e empatia cognitiva.'
    }
];

export const mockDegrees: Degree[] = [
    { code: 'DEG_LIC', label: 'Licenza Media', educationLevel: 1 },
    { code: 'DEG_DIP', label: 'Diploma Superiori', educationLevel: 2 },
    { code: 'DEG_LAU', label: 'Laurea Universitaria', educationLevel: 3 },
    { code: 'DEG_DOC', label: 'Dottorato di Ricerca', educationLevel: 4 }
];

export const mockPatients: Patient[] = [
    {
        id: 'mock-id-1',
        firstName: 'Mario',
        lastName: 'Rossi',
        gender: 'MASCHIO',
        age: 45,
        degree: mockDegrees[1],
        createdAt: '2026-01-10T10:00:00.000Z'
    },
    {
        id: 'mock-id-2',
        firstName: 'Giulia',
        lastName: 'Bianchi',
        gender: 'FEMMINA',
        age: 32,
        degree: mockDegrees[2],
        createdAt: '2026-02-14T11:30:00.000Z'
    },
    {
        id: 'mock-id-3',
        firstName: 'Marco',
        lastName: 'Verdi',
        gender: 'MASCHIO',
        age: 58,
        degree: mockDegrees[0],
        createdAt: '2026-03-01T09:15:00.000Z'
    },
    {
        id: 'mock-id-4',
        firstName: 'Sofia',
        lastName: 'Neri',
        gender: 'FEMMINA',
        age: 26,
        degree: mockDegrees[3],
        createdAt: '2026-03-10T14:20:00.000Z'
    },
    {
        id: 'mock-id-5',
        firstName: 'Luca',
        lastName: 'Gialli',
        gender: 'MASCHIO',
        age: 51,
        degree: mockDegrees[1],
        createdAt: '2026-04-05T16:45:00.000Z'
    }
];

export const mockStats: Stats = {
    pazienti: 5,
    maschi: 3,
    femmine: 2,
    percorsi: 14,
    testTable: [
        { nomeTest: 'Theory of Mind', percentualePre: 85.0, percentualePost: 95.0, tempoMedio: 420.5 },
        { nomeTest: 'Faux Pas Test', percentualePre: 70.0, percentualePost: 88.5, tempoMedio: 610.0 },
        { nomeTest: 'Eyes Task', percentualePre: 65.2, percentualePost: 81.0, tempoMedio: 390.2 },
        { nomeTest: 'Riconoscimento Emozioni', percentualePre: 78.4, percentualePost: 92.1, tempoMedio: 450.0 }
    ],
    chartData: [
        { x: 'Sess. 1', y: 72.5 },
        { x: 'Sess. 2', y: 79.0 },
        { x: 'Sess. 3', y: 84.5 },
        { x: 'Sess. 4', y: 91.2 }
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
            assignedAt: '2026-05-01T09:00:00.000Z'
        },
        startedAt: '2026-05-01T09:10:00.000Z',
        finishedAt: '2026-05-01T09:35:00.000Z',
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
            },
            {
                id: 'ans-2',
                polyglotNodeId: 'node-2',
                nodeType: { label: 'Eyes Task' },
                nodeName: 'Eyes Task',
                category: 'TEST',
                phase: 'POST',
                reactionTimeMs: 380,
                totalResponseTimeMs: 720,
                score: 10,
                maxScore: 10,
                mouseDistancePx: 95,
                sequenceNumber: 2
            },
            {
                id: 'ans-3',
                polyglotNodeId: 'node-3',
                nodeType: { label: 'Training Empatia' },
                nodeName: 'Training Empatia',
                category: 'ESERCITAZIONE',
                phase: 'NONE',
                reactionTimeMs: 510,
                totalResponseTimeMs: 1050,
                score: 42,
                maxScore: 50,
                mouseDistancePx: 310,
                sequenceNumber: 3
            }
        ]
    },
    {
        id: 'exec-2',
        patientPath: {
            id: 'path-2',
            patient: mockPatients[0],
            polyglotPathId: 'poly-1',
            uniqueCode: 'ABC-124',
            assignedAt: '2026-05-08T09:00:00.000Z'
        },
        startedAt: '2026-05-08T09:15:00.000Z',
        finishedAt: '2026-05-08T09:40:00.000Z',
        answers: [
            {
                id: 'ans-4',
                polyglotNodeId: 'node-1',
                nodeType: { label: 'Eyes Task' },
                nodeName: 'Eyes Task',
                category: 'TEST',
                phase: 'PRE',
                reactionTimeMs: 410,
                totalResponseTimeMs: 810,
                score: 9,
                maxScore: 10,
                mouseDistancePx: 110,
                sequenceNumber: 1
            },
            {
                id: 'ans-5',
                polyglotNodeId: 'node-2',
                nodeType: { label: 'Eyes Task' },
                nodeName: 'Eyes Task',
                category: 'TEST',
                phase: 'POST',
                reactionTimeMs: 350,
                totalResponseTimeMs: 680,
                score: 10,
                maxScore: 10,
                mouseDistancePx: 80,
                sequenceNumber: 2
            }
        ]
    },
    {
        id: 'exec-3',
        patientPath: {
            id: 'path-3',
            patient: mockPatients[1],
            polyglotPathId: 'poly-2',
            uniqueCode: 'XYZ-789',
            assignedAt: '2026-05-10T10:00:00.000Z'
        },
        startedAt: '2026-05-10T10:15:00.000Z',
        finishedAt: '2026-05-10T10:50:00.000Z',
        answers: [
            {
                id: 'ans-6',
                polyglotNodeId: 'node-4',
                nodeType: { label: 'Faux Pas Test' },
                nodeName: 'Faux Pas Test',
                category: 'TEST',
                phase: 'PRE',
                reactionTimeMs: 620,
                totalResponseTimeMs: 1200,
                score: 7,
                maxScore: 10,
                mouseDistancePx: 240,
                sequenceNumber: 1
            },
            {
                id: 'ans-7',
                polyglotNodeId: 'node-5',
                nodeType: { label: 'Faux Pas Test' },
                nodeName: 'Faux Pas Test',
                category: 'TEST',
                phase: 'POST',
                reactionTimeMs: 540,
                totalResponseTimeMs: 980,
                score: 9,
                maxScore: 10,
                mouseDistancePx: 180,
                sequenceNumber: 2
            }
        ]
    }
];

export const mockDiagnoses: Diagnosis[] = [
    {
        id: 'diag-1',
        patient: mockPatients[0],
        diagnosisDate: '2026-05-02T10:00:00.000Z',
        diagnosisText: 'Lieve miglioramento nelle capacità di riconoscimento emotivo visivo.',
        notes: 'Paziente molto collaborativo e puntuale.',
        medications: 'Nessuno',
        createdAt: '2026-05-02T10:00:00.000Z'
    },
    {
        id: 'diag-2',
        patient: mockPatients[0],
        diagnosisDate: '2026-05-09T10:00:00.000Z',
        diagnosisText: 'Stabilità nei tempi di reazione e incremento della accuratezza complessiva.',
        notes: 'Continuare con il protocollo di esercitazione standard.',
        medications: 'Nessuno',
        createdAt: '2026-05-09T10:00:00.000Z'
    },
    {
        id: 'diag-3',
        patient: mockPatients[1],
        diagnosisDate: '2026-05-11T11:00:00.000Z',
        diagnosisText: 'Buona risposta cognitiva al test Faux Pas. Ottima progressione.',
        notes: 'Consigliata sessione di mantenimento mensile.',
        medications: 'Vitamina B12',
        createdAt: '2026-05-11T11:00:00.000Z'
    }
];

export const mockAnalyst: Analyst = {
    id: 'analyst-1',
    firstName: 'Admin',
    lastName: 'Analyst',
    email: 'admin@gmail.com',
    role: 'ADMIN',
    createdAt: '2026-01-01T00:00:00.000Z'
};