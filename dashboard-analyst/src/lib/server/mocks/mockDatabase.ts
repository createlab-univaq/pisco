import type { Patient, Degree, Diagnosis, GameExecution, Stats, Analyst } from '$lib/types';
import type { PolyglotPath } from '$lib/types/PolyglotPath';

const MALE: string = 'MASCHIO';
const FEMALE: string = 'FEMMINA';

export const mockAnalyst: Analyst = {
    id: 'analyst-1',
    firstName: 'Admin',
    lastName: 'Analyst',
    email: 'admin@gmail.com',
    role: 'ADMIN',
    createdAt: '2026-01-01T00:00:00.000Z'
};

export const mockPolyglotPaths: PolyglotPath[] = [
    {
        id: 'poly-1',
        name: 'Protocollo Neurocognitivo Standard',
        description: 'Valutazione completa di teoria della mente e riconoscimento emotivo.',
        published: true,
        flowJson: {
            additionalProp1: 'config-1'
        },
        analyst: mockAnalyst,
        createdAt: '2026-09-01T17:50:02.264Z',
        updatedAt: '2026-09-01T17:50:02.264Z'
    },
    {
        id: 'poly-2',
        name: 'Modulo Avanzato Faux Pas',
        description: 'Test mirato per interazioni sociali complesse e empatia cognitiva.',
        published: true,
        flowJson: {
            additionalProp1: 'config-A'
        },
        analyst: mockAnalyst,
        createdAt: '2026-09-01T17:50:02.264Z',
        updatedAt: '2026-09-01T17:50:02.264Z'
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
        gender: MALE,
        age: 45,
        degree: mockDegrees[1],
        createdAt: '2026-01-10T10:00:00.000Z'
    },
    {
        id: 'mock-id-2',
        firstName: 'Giulia',
        lastName: 'Bianchi',
        gender: FEMALE,
        age: 32,
        degree: mockDegrees[2],
        createdAt: '2026-02-14T11:30:00.000Z'
    },
    {
        id: 'mock-id-3',
        firstName: 'Marco',
        lastName: 'Verdi',
        gender: MALE,
        age: 58,
        degree: mockDegrees[0],
        createdAt: '2026-03-01T09:15:00.000Z'
    },
    {
        id: 'mock-id-4',
        firstName: 'Sofia',
        lastName: 'Neri',
        gender: FEMALE,
        age: 26,
        degree: mockDegrees[3],
        createdAt: '2026-03-10T14:20:00.000Z'
    },
    {
        id: 'mock-id-5',
        firstName: 'Luca',
        lastName: 'Gialli',
        gender: MALE,
        age: 51,
        degree: mockDegrees[1],
        createdAt: '2026-04-05T16:45:00.000Z'
    }
];

export const mockStats: Stats = {
    pazienti: mockPatients.length,
    maschi: mockPatients.filter((p) => p.gender === MALE).length,
    femmine: mockPatients.filter((p) => p.gender === FEMALE).length,
    percorsi: mockPolyglotPaths.length,
    testTable: [
        {
            nodeType: 'Theory of Mind',
            percentualePre: 85.0,
            percentualePost: 95.0,
            tempoMedio: 420.5,
            tempoRispostaMedio: 1150.0,
            distanzaMouseMedia: 16.5
        },
        {
            nodeType: 'Faux Pas Test',
            percentualePre: 70.0,
            percentualePost: 88.5,
            tempoMedio: 610.0,
            tempoRispostaMedio: 1250.0,
            distanzaMouseMedia: 20.0
        },
        {
            nodeType: 'Eyes Task',
            percentualePre: 65.2,
            percentualePost: 81.0,
            tempoMedio: 390.2,
            tempoRispostaMedio: 950.0,
            distanzaMouseMedia: 14.2
        },
        {
            nodeType: 'Riconoscimento Emozioni',
            percentualePre: 78.4,
            percentualePost: 92.1,
            tempoMedio: 450.0,
            tempoRispostaMedio: 1020.0,
            distanzaMouseMedia: 12.8
        }
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
        runName: 'Run 1 - Baseline',
        patientPath: {
            id: 'path-1', patient: mockPatients[0], polyglotPathId: 'poly-1', uniqueCode: 'ABC-123', assignedAt: '2026-05-01T09:00:00.000Z', flow: mockPolyglotPaths[0]
        },
        startedAt: '2026-05-01T09:10:00.000Z',
        finishedAt: '2026-05-01T09:35:00.000Z',
        nodes: [
            { id: 'n1', nodeId: 'node-1', nodeName: 'ToM (Pre)', nodeType: 'Theory of Mind', isExercise: false, score: 4, maxScore: 10, percentageScore: 0.40, averageReactionTimeInMilliseconds: 650, averageResponseTimeInMilliseconds: 1200, averageMouseDistanceInCentimeters: 18, answers: [] },
            { id: 'n2', nodeId: 'node-2', nodeName: 'ToM Training', nodeType: 'Training', isExercise: true, score: 7, maxScore: 10, percentageScore: 0.70, averageReactionTimeInMilliseconds: 400, averageResponseTimeInMilliseconds: 800, averageMouseDistanceInCentimeters: 12, answers: [] },
            { id: 'n3', nodeId: 'node-3', nodeName: 'ToM (Post)', nodeType: 'Theory of Mind', isExercise: false, score: 5, maxScore: 10, percentageScore: 0.50, averageReactionTimeInMilliseconds: 600, averageResponseTimeInMilliseconds: 1100, averageMouseDistanceInCentimeters: 16, answers: [] },
            { id: 'n4', nodeId: 'node-4', nodeName: 'FauxPas (Singolo)', nodeType: 'FauxPas', isExercise: false, score: 3, maxScore: 10, percentageScore: 0.30, averageReactionTimeInMilliseconds: 700, averageResponseTimeInMilliseconds: 1300, averageMouseDistanceInCentimeters: 22, answers: [] }
        ]
    },
    {
        id: 'exec-2',
        runName: 'Run 2 - Follow up',
        patientPath: {
            id: 'path-1', patient: mockPatients[0], polyglotPathId: 'poly-1', uniqueCode: 'ABC-123', assignedAt: '2026-05-01T09:00:00.000Z', flow: mockPolyglotPaths[0]
        },
        startedAt: '2026-05-08T10:00:00.000Z',
        finishedAt: '2026-05-08T10:30:00.000Z',
        nodes: [
            { id: 'n5', nodeId: 'node-1', nodeName: 'ToM (Pre)', nodeType: 'Theory of Mind', isExercise: false, score: 5, maxScore: 10, percentageScore: 0.50, averageReactionTimeInMilliseconds: 580, averageResponseTimeInMilliseconds: 1050, averageMouseDistanceInCentimeters: 15, answers: [] },
            { id: 'n6', nodeId: 'node-2', nodeName: 'ToM Training', nodeType: 'Training', isExercise: true, score: 8, maxScore: 10, percentageScore: 0.80, averageReactionTimeInMilliseconds: 350, averageResponseTimeInMilliseconds: 750, averageMouseDistanceInCentimeters: 10, answers: [] },
            { id: 'n7', nodeId: 'node-3', nodeName: 'ToM (Post)', nodeType: 'Theory of Mind', isExercise: false, score: 7, maxScore: 10, percentageScore: 0.70, averageReactionTimeInMilliseconds: 520, averageResponseTimeInMilliseconds: 980, averageMouseDistanceInCentimeters: 13, answers: [] },
            { id: 'n8', nodeId: 'node-4', nodeName: 'FauxPas (Singolo)', nodeType: 'FauxPas', isExercise: false, score: 5, maxScore: 10, percentageScore: 0.50, averageReactionTimeInMilliseconds: 650, averageResponseTimeInMilliseconds: 1150, averageMouseDistanceInCentimeters: 19, answers: [] }
        ]
    },
    {
        id: 'exec-3',
        runName: 'Run 3 - Intermedia',
        patientPath: {
            id: 'path-1', patient: mockPatients[0], polyglotPathId: 'poly-1', uniqueCode: 'ABC-123', assignedAt: '2026-05-01T09:00:00.000Z', flow: mockPolyglotPaths[0]
        },
        startedAt: '2026-05-15T14:15:00.000Z',
        finishedAt: '2026-05-15T14:40:00.000Z',
        nodes: [
            { id: 'n9', nodeId: 'node-1', nodeName: 'ToM (Pre)', nodeType: 'Theory of Mind', isExercise: false, score: 6, maxScore: 10, percentageScore: 0.60, averageReactionTimeInMilliseconds: 500, averageResponseTimeInMilliseconds: 900, averageMouseDistanceInCentimeters: 12, answers: [] },
            { id: 'n10', nodeId: 'node-2', nodeName: 'ToM Training', nodeType: 'Training', isExercise: true, score: 9, maxScore: 10, percentageScore: 0.90, averageReactionTimeInMilliseconds: 320, averageResponseTimeInMilliseconds: 680, averageMouseDistanceInCentimeters: 8, answers: [] },
            { id: 'n11', nodeId: 'node-3', nodeName: 'ToM (Post)', nodeType: 'Theory of Mind', isExercise: false, score: 8, maxScore: 10, percentageScore: 0.80, averageReactionTimeInMilliseconds: 450, averageResponseTimeInMilliseconds: 820, averageMouseDistanceInCentimeters: 10, answers: [] },
            { id: 'n12', nodeId: 'node-4', nodeName: 'FauxPas (Singolo)', nodeType: 'FauxPas', isExercise: false, score: 7, maxScore: 10, percentageScore: 0.70, averageReactionTimeInMilliseconds: 580, averageResponseTimeInMilliseconds: 1020, averageMouseDistanceInCentimeters: 15, answers: [] }
        ]
    },
    {
        id: 'exec-4',
        runName: 'Run 4 - Finale',
        patientPath: {
            id: 'path-1', patient: mockPatients[0], polyglotPathId: 'poly-1', uniqueCode: 'ABC-123', assignedAt: '2026-05-01T09:00:00.000Z', flow: mockPolyglotPaths[0]
        },
        startedAt: '2026-05-22T09:30:00.000Z',
        finishedAt: '2026-05-22T09:55:00.000Z',
        nodes: [
            { id: 'n13', nodeId: 'node-1', nodeName: 'ToM (Pre)', nodeType: 'Theory of Mind', isExercise: false, score: 8, maxScore: 10, percentageScore: 0.80, averageReactionTimeInMilliseconds: 420, averageResponseTimeInMilliseconds: 780, averageMouseDistanceInCentimeters: 9, answers: [] },
            { id: 'n14', nodeId: 'node-2', nodeName: 'ToM Training', nodeType: 'Training', isExercise: true, score: 10, maxScore: 10, percentageScore: 1.00, averageReactionTimeInMilliseconds: 280, averageResponseTimeInMilliseconds: 600, averageMouseDistanceInCentimeters: 6, answers: [] },
            { id: 'n15', nodeId: 'node-3', nodeName: 'ToM (Post)', nodeType: 'Theory of Mind', isExercise: false, score: 10, maxScore: 10, percentageScore: 1.00, averageReactionTimeInMilliseconds: 390, averageResponseTimeInMilliseconds: 710, averageMouseDistanceInCentimeters: 7, answers: [] },
            { id: 'n16', nodeId: 'node-4', nodeName: 'FauxPas (Singolo)', nodeType: 'FauxPas', isExercise: false, score: 9, maxScore: 10, percentageScore: 0.90, averageReactionTimeInMilliseconds: 500, averageResponseTimeInMilliseconds: 890, averageMouseDistanceInCentimeters: 11, answers: [] }
        ]
    },
    {
        id: 'exec-5',
        runName: 'Run 1 - DFE',
        patientPath: {
            id: 'path-2', patient: mockPatients[0], polyglotPathId: 'poly-2', uniqueCode: 'DFE-567', assignedAt: '2026-06-01T09:00:00.000Z', flow: mockPolyglotPaths[1]
        },
        startedAt: '2026-06-05T10:15:00.000Z',
        finishedAt: '2026-06-05T10:40:00.000Z',
        nodes: [
            { id: 'n17', nodeId: 'node-5', nodeName: 'Riconoscimento Base', nodeType: 'Theory of Mind', isExercise: false, score: 5, maxScore: 10, percentageScore: 0.50, averageReactionTimeInMilliseconds: 410, averageResponseTimeInMilliseconds: 810, averageMouseDistanceInCentimeters: 11, answers: [] },
            { id: 'n18', nodeId: 'node-6', nodeName: 'FauxPas Node', nodeType: 'FauxPas', isExercise: false, score: 9, maxScore: 10, percentageScore: 0.90, averageReactionTimeInMilliseconds: 250, averageResponseTimeInMilliseconds: 680, averageMouseDistanceInCentimeters: 7, answers: [] },
            { id: 'n19', nodeId: 'node-7', nodeName: 'Riconoscimento Avanzato', nodeType: 'Theory of Mind', isExercise: false, score: 10, maxScore: 10, percentageScore: 1.0, averageReactionTimeInMilliseconds: 320, averageResponseTimeInMilliseconds: 580, averageMouseDistanceInCentimeters: 6, answers: [] }
        ]
    },
    {
        id: 'exec-6',
        runName: 'Run 2 - DFE',
        patientPath: {
            id: 'path-2', patient: mockPatients[0], polyglotPathId: 'poly-2', uniqueCode: 'DFE-567', assignedAt: '2026-06-01T09:00:00.000Z', flow: mockPolyglotPaths[1]
        },
        startedAt: '2026-06-12T11:00:00.000Z',
        finishedAt: '2026-06-12T11:25:00.000Z',
        nodes: [
            { id: 'n20', nodeId: 'node-5', nodeName: 'Riconoscimento Base', nodeType: 'Theory of Mind', isExercise: false, score: 6, maxScore: 10, percentageScore: 0.60, averageReactionTimeInMilliseconds: 380, averageResponseTimeInMilliseconds: 750, averageMouseDistanceInCentimeters: 9, answers: [] },
            { id: 'n21', nodeId: 'node-6', nodeName: 'FauxPas Node', nodeType: 'FauxPas', isExercise: false, score: 10, maxScore: 10, percentageScore: 1.00, averageReactionTimeInMilliseconds: 220, averageResponseTimeInMilliseconds: 600, averageMouseDistanceInCentimeters: 5, answers: [] },
            { id: 'n22', nodeId: 'node-7', nodeName: 'Riconoscimento Avanzato', nodeType: 'Theory of Mind', isExercise: false, score: 10, maxScore: 10, percentageScore: 1.0, averageReactionTimeInMilliseconds: 290, averageResponseTimeInMilliseconds: 520, averageMouseDistanceInCentimeters: 4, answers: [] }
        ]
    },
    {
        id: 'exec-7',
        runName: 'Sessione Iniziale',
        patientPath: {
            id: 'path-3', patient: mockPatients[1], polyglotPathId: 'poly-3', uniqueCode: 'XYZ-999', assignedAt: '2026-07-01T09:00:00.000Z', flow: mockPolyglotPaths[0]
        },
        startedAt: '2026-07-03T09:10:00.000Z',
        finishedAt: '2026-07-03T09:35:00.000Z',
        nodes: [
            { id: 'n23', nodeId: 'm-1', nodeName: 'Memoria a breve termine (Pre)', nodeType: 'Memory', isExercise: false, score: 3, maxScore: 10, percentageScore: 0.30, averageReactionTimeInMilliseconds: 800, averageResponseTimeInMilliseconds: 1500, averageMouseDistanceInCentimeters: 25, answers: [] },
            { id: 'n24', nodeId: 'm-2', nodeName: 'Esercizio Memoria Visiva', nodeType: 'Memory Training', isExercise: true, score: 6, maxScore: 10, percentageScore: 0.60, averageReactionTimeInMilliseconds: 600, averageResponseTimeInMilliseconds: 1200, averageMouseDistanceInCentimeters: 20, answers: [] },
            { id: 'n25', nodeId: 'm-3', nodeName: 'Memoria a breve termine (Post)', nodeType: 'Memory', isExercise: false, score: 5, maxScore: 10, percentageScore: 0.50, averageReactionTimeInMilliseconds: 700, averageResponseTimeInMilliseconds: 1300, averageMouseDistanceInCentimeters: 21, answers: [] },
            { id: 'n26', nodeId: 'a-1', nodeName: 'Test Attenzione Sostenuta', nodeType: 'Attention', isExercise: false, score: 6, maxScore: 10, percentageScore: 0.60, averageReactionTimeInMilliseconds: 400, averageResponseTimeInMilliseconds: 850, averageMouseDistanceInCentimeters: 14, answers: [] }
        ]
    },
    {
        id: 'exec-8',
        runName: 'Sessione Avanzata',
        patientPath: {
            id: 'path-3', patient: mockPatients[1], polyglotPathId: 'poly-3', uniqueCode: 'XYZ-999', assignedAt: '2026-07-01T09:00:00.000Z', flow: mockPolyglotPaths[0]
        },
        startedAt: '2026-07-10T10:00:00.000Z',
        finishedAt: '2026-07-10T10:30:00.000Z',
        nodes: [
            { id: 'n27', nodeId: 'm-1', nodeName: 'Memoria a breve termine (Pre)', nodeType: 'Memory', isExercise: false, score: 5, maxScore: 10, percentageScore: 0.50, averageReactionTimeInMilliseconds: 650, averageResponseTimeInMilliseconds: 1300, averageMouseDistanceInCentimeters: 20, answers: [] },
            { id: 'n28', nodeId: 'm-2', nodeName: 'Esercizio Memoria Visiva', nodeType: 'Memory Training', isExercise: true, score: 8, maxScore: 10, percentageScore: 0.80, averageReactionTimeInMilliseconds: 500, averageResponseTimeInMilliseconds: 1000, averageMouseDistanceInCentimeters: 15, answers: [] },
            { id: 'n29', nodeId: 'm-3', nodeName: 'Memoria a breve termine (Post)', nodeType: 'Memory', isExercise: false, score: 8, maxScore: 10, percentageScore: 0.80, averageReactionTimeInMilliseconds: 580, averageResponseTimeInMilliseconds: 1100, averageMouseDistanceInCentimeters: 17, answers: [] },
            { id: 'n30', nodeId: 'a-1', nodeName: 'Test Attenzione Sostenuta', nodeType: 'Attention', isExercise: false, score: 8, maxScore: 10, percentageScore: 0.80, averageReactionTimeInMilliseconds: 350, averageResponseTimeInMilliseconds: 750, averageMouseDistanceInCentimeters: 10, answers: [] }
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