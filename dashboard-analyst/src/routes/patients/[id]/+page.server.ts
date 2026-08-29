import { env } from '$env/dynamic/private';
import { fail, error } from '@sveltejs/kit';
import { PATIENTS_PATH, GAME_EXECUTIONS_PATH } from '$lib/server/api-paths';
import type { PageServerLoad, Actions } from './$types';
import type { Patient, PatientPath, Diagnosis, GameExecution } from '$lib/types';

export const load: PageServerLoad = async ({ params, fetch }) => {
    const patientId = params.id;

    const [patientRes, pathsRes, diagnosesRes, executionsRes] = await Promise.all([
        fetch(`${env.API_BASE_URL}${PATIENTS_PATH}/${patientId}`),
        fetch(`${env.API_BASE_URL}${PATIENTS_PATH}/${patientId}/paths`),
        fetch(`${env.API_BASE_URL}${PATIENTS_PATH}/${patientId}/diagnoses`),
        fetch(`${env.API_BASE_URL}${GAME_EXECUTIONS_PATH}`)
    ]);

    if (!patientRes.ok) {
        throw error(404, 'Paziente non trovato');
    }

    const patient = (await patientRes.json()) as Patient;
    const paths = pathsRes.ok ? ((await pathsRes.json()) as PatientPath[]) : [];
    const diagnoses = diagnosesRes.ok ? ((await diagnosesRes.json()) as Diagnosis[]) : [];
    const allExecutions = executionsRes.ok ? ((await executionsRes.json()) as GameExecution[]) : [];

    const patientExecutions = allExecutions.filter(
        (exec) => exec.patientPath?.patient?.id === patientId
    );

    return {
        patient,
        paths,
        diagnoses,
        executions: patientExecutions
    };
};

export const actions: Actions = {
    deletePath: async ({ request, params, fetch }) => {
        const data = await request.formData();
        const pathId = data.get('pathId')?.toString();
        const patientId = params.id;

        if (!pathId) return fail(400, { error: 'ID percorso non valido' });

        const response = await fetch(`${env.API_BASE_URL}${PATIENTS_PATH}/${patientId}/paths/${pathId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            return fail(response.status, { error: 'Impossibile eliminare il percorso' });
        }

        return { success: true };
    },

    addDiagnosis: async ({ request, params, fetch }) => {
        const data = await request.formData();
        const diagnosisDate = data.get('diagnosisDate')?.toString() || new Date().toISOString();
        const diagnosisText = data.get('diagnosisText')?.toString();
        const notes = data.get('notes')?.toString() || '';
        const medications = data.get('medications')?.toString() || '';
        const patientId = params.id;

        if (!diagnosisText) {
            return fail(400, { error: 'Il testo della diagnosi è obbligatorio' });
        }

        const response = await fetch(`${env.API_BASE_URL}${PATIENTS_PATH}/${patientId}/diagnoses`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ diagnosisDate, diagnosisText, notes, medications })
        });

        if (!response.ok) {
            return fail(response.status, { error: 'Impossibile salvare la diagnosi' });
        }

        return { success: true };
    }
};