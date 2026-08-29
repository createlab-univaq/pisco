import * as XLSX from 'xlsx';
import type { GameExecution, Patient } from '$lib/types';

export function exportSinglePatientExcel(
    patient: Patient,
    executions: GameExecution[],
    includeName: boolean
) {
    const rows = executions.map((exec, index) => {
        const sessionDate = new Date(exec.startedAt);
        const formattedDate = `${sessionDate.getDate().toString().padStart(2, '0')}${(sessionDate.getMonth() + 1).toString().padStart(2, '0')}${sessionDate.getFullYear()}_${index + 1}`;

        const row: Record<string, string | number> = {
            'Sessione': formattedDate,
            'ID Paziente': patient.id
        };

        if (includeName) {
            row['Nome'] = patient.firstName;
            row['Cognome'] = patient.lastName;
        }

        row['Genere'] = patient.gender;
        row['Età'] = patient.age;
        row['Titolo di Studio'] = patient.degree?.label || '';
        row['Inizio'] = exec.startedAt;
        row['Fine'] = exec.finishedAt;

        exec.answers.forEach((ans) => {
            const prefix = ans.nodeName || ans.nodeType?.label || `Node_${ans.sequenceNumber}`;
            const pct = ans.maxScore > 0 ? ((ans.score / ans.maxScore) * 100).toFixed(1) : '0';

            row[`${prefix} - Punteggio`] = ans.score;
            row[`${prefix} - Max Punteggio`] = ans.maxScore;
            row[`${prefix} - %`] = `${pct}%`;
            row[`${prefix} - Tempo Reazione (ms)`] = ans.reactionTimeMs;
            row[`${prefix} - Tempo Totale (ms)`] = ans.totalResponseTimeMs ?? ans.reactionTimeMs;
            row[`${prefix} - Distanza Mouse (px)`] = ans.mouseDistancePx;
        });

        return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sessioni Paziente');

    const fileName = includeName
        ? `Report_${patient.firstName}_${patient.lastName}.xlsx`
        : `Report_Paziente_${patient.id.slice(0, 8)}.xlsx`;

    XLSX.writeFile(workbook, fileName);
}

export function exportAllPatientsExcel(
    patients: Patient[],
    allExecutions: GameExecution[],
    includeName: boolean
) {
    const rows = patients.map((patient) => {
        const patientExecs = allExecutions
            .filter((e) => e.patientPath?.patient?.id === patient.id)
            .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());

        const latestExec = patientExecs[0];

        const row: Record<string, string | number> = {
            'ID Paziente': patient.id
        };

        if (includeName) {
            row['Nome'] = patient.firstName;
            row['Cognome'] = patient.lastName;
        }

        row['Genere'] = patient.gender;
        row['Età'] = patient.age;
        row['Titolo di Studio'] = patient.degree?.label || '';
        row['Totale Sessioni'] = patientExecs.length;

        if (latestExec) {
            row['Ultima Sessione'] = latestExec.startedAt;
            latestExec.answers.forEach((ans) => {
                const prefix = ans.nodeName || ans.nodeType?.label || `Node_${ans.sequenceNumber}`;
                const pct = ans.maxScore > 0 ? ((ans.score / ans.maxScore) * 100).toFixed(1) : '0';

                row[`${prefix} - Punteggio`] = ans.score;
                row[`${prefix} - %`] = `${pct}%`;
                row[`${prefix} - Tempo Reazione (ms)`] = ans.reactionTimeMs;
                row[`${prefix} - Distanza Mouse (px)`] = ans.mouseDistancePx;
            });
        }

        return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Tutti i Pazienti');

    XLSX.writeFile(workbook, `Report_Tutti_Pazienti_${new Date().toISOString().slice(0, 10)}.xlsx`);
}