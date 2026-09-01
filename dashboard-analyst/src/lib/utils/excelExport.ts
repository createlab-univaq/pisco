import * as XLSX from 'xlsx';
import type { GameExecution, Patient, Diagnosis } from '$lib/types';

export function exportSinglePatientExcel(
    patient: Patient,
    executions: GameExecution[],
    diagnoses: Diagnosis[],
    includeName: boolean
) {
    const sortedExecs = [...executions].sort((a, b) => new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime());
    const firstExec = sortedExecs[0];
    const latestDiag = diagnoses[diagnoses.length - 1];

    const baseRow: Record<string, string | number> = {
        'ID': patient.id,
        'Cognome': includeName ? patient.lastName : '***',
        'Nome ': includeName ? patient.firstName : '***',
        'Età': patient.age,
        'Genere ': patient.gender === 'MASCHIO' ? 1 : 0,
        'Data primo accesso': firstExec ? firstExec.startedAt.slice(0, 10) : '',
        'Scolarità': patient.degree?.educationLevel || 0,
        'Scuola frequentata': patient.degree?.label || '',
        'Diagnosi': latestDiag?.diagnosisText || '',
        'Altre note importanti': latestDiag?.notes || ''
    };

    // Dinamico: mappa i nodi senza stringhe hardcodate
    const typeCounters: Record<string, number> = {};

    sortedExecs.forEach((exec) => {
        (exec.nodes || []).forEach((node) => {
            if (node.isExercise) return;
            const cleanType = (node.nodeType || 'Test').replace(/\s+/g, '_');
            typeCounters[cleanType] = (typeCounters[cleanType] || 0) + 1;
            const idx = typeCounters[cleanType];

            const prefix = `Test_${cleanType}_${idx}`;
            const pct = node.maxScore > 0 ? ((node.score / node.maxScore) * 100).toFixed(1) : '0';

            baseRow[prefix] = node.score;
            baseRow[`reaction time ${prefix}`] = node.averageReactionTimeInMilliseconds || 0;
            baseRow[`response time ${prefix}`] = node.averageResponseTimeInMilliseconds || 0;
            baseRow[`% ${prefix}`] = `${pct}%`;
        });
    });

    const worksheet = XLSX.utils.json_to_sheet([baseRow]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    const fileName = includeName
        ? `Report_${patient.firstName}_${patient.lastName}.xlsx`
        : `Report_Paziente_${patient.id.slice(0, 8)}.xlsx`;

    XLSX.writeFile(workbook, fileName);
}

export function exportAllPatientsExcel(
    patients: Patient[],
    allExecutions: GameExecution[],
    diagnosesMap: Record<string, Diagnosis[]>,
    includeName: boolean
) {
    const rows = patients.map((patient) => {
        const patientExecs = allExecutions
            .filter((e) => e.patientPath?.patient?.id === patient.id)
            .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());

        const latestExec = patientExecs[0];
        const patientDiags = diagnosesMap[patient.id] || [];
        const latestDiag = patientDiags[patientDiags.length - 1];

        const row: Record<string, string | number> = {
            'ID': patient.id,
            'Cognome': includeName ? patient.lastName : '***',
            'Nome ': includeName ? patient.firstName : '***',
            'Età': patient.age,
            'Genere ': patient.gender === 'MASCHIO' ? 1 : 0,
            'Data primo accesso': patientExecs.length > 0 ? patientExecs[patientExecs.length - 1].startedAt.slice(0, 10) : '',
            'Scolarità': patient.degree?.educationLevel || 0,
            'Scuola frequentata': patient.degree?.label || '',
            'Diagnosi': latestDiag?.diagnosisText || '',
            'Altre note importanti': latestDiag?.notes || ''
        };

        if (latestExec) {
            const typeCounters: Record<string, number> = {};
            (latestExec.nodes || []).forEach((node) => {
                if (node.isExercise) return;
                const cleanType = (node.nodeType || 'Test').replace(/\s+/g, '_');
                typeCounters[cleanType] = (typeCounters[cleanType] || 0) + 1;
                const idx = typeCounters[cleanType];

                const prefix = `Test_${cleanType}_${idx}`;
                const pct = node.maxScore > 0 ? ((node.score / node.maxScore) * 100).toFixed(1) : '0';

                row[prefix] = node.score;
                row[`reaction time ${prefix}`] = node.averageReactionTimeInMilliseconds || 0;
                row[`response time ${prefix}`] = node.averageResponseTimeInMilliseconds || 0;
                row[`% ${prefix}`] = `${pct}%`;
            });
        }

        return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    XLSX.writeFile(workbook, `Report_Tutti_Pazienti_${new Date().toISOString().slice(0, 10)}.xlsx`);
}