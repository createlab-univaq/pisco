import { fail, error } from '@sveltejs/kit';
import { PATIENTS_PATH, GAME_EXECUTIONS_PATH, POLYGLOT_PATHS_PATH } from '$lib/server/api-paths';
import { apiFetch } from '$lib/server/apiClient';
import type { PageServerLoad, Actions } from './$types';
import type { Patient, PatientPath, Diagnosis, GameExecution, PolyglotPath } from '$lib/types';

export const load: PageServerLoad = async ({ params, fetch, locals }) => {
    const patientId = params.id;
    const token = locals.token;

    const [patientRes, pathsRes, diagnosesRes, executionsRes, polyglotRes] = await Promise.all([
        apiFetch(fetch, `${PATIENTS_PATH}/${patientId}`, { token }),
        apiFetch(fetch, `${PATIENTS_PATH}/${patientId}/paths`, { token }),
        apiFetch(fetch, `${PATIENTS_PATH}/${patientId}/diagnoses`, { token }),
        apiFetch(fetch, GAME_EXECUTIONS_PATH, { token }),
        apiFetch(fetch, POLYGLOT_PATHS_PATH, { token })
    ]);

    if (!patientRes.ok) {
        throw error(404, 'Paziente non trovato');
    }

    const patient = (await patientRes.json()) as Patient;
    const paths = pathsRes.ok ? ((await pathsRes.json()) as PatientPath[]) : [];
    const diagnoses = diagnosesRes.ok ? ((await diagnosesRes.json()) as Diagnosis[]) : [];
    const allExecutions = executionsRes.ok ? ((await executionsRes.json()) as GameExecution[]) : [];
    const polyglotPaths = polyglotRes.ok ? ((await polyglotRes.json()) as PolyglotPath[]) : [];

    const patientExecutions = allExecutions.filter(
        (exec) => exec.patientPath?.patient?.id === patientId
    );

    return { patient, paths, diagnoses, executions: patientExecutions, polyglotPaths };
};

export const actions: Actions = {
    deletePath: async ({ request, params, fetch, locals }) => {
        const data = await request.formData();
        const pathId = data.get('pathId')?.toString();
        const patientId = params.id;

        if (!pathId) return fail(400, { error: 'ID percorso non valido' });

        const response = await apiFetch(fetch, `${PATIENTS_PATH}/${patientId}/paths/${pathId}`, {
            method: 'DELETE',
            token: locals.token
        });

        if (!response.ok) {
            return fail(response.status, { error: 'Impossibile eliminare il percorso' });
        }

        return { success: true };
    },

    assignPath: async ({ request, params, fetch, locals }) => {
        const data = await request.formData();
        const polyglotPathId = data.get('polyglotPathId')?.toString();
        const patientId = params.id;

        if (!polyglotPathId) {
            return fail(400, { error: 'Seleziona un protocollo valido' });
        }

        const response = await apiFetch(fetch, `${PATIENTS_PATH}/${patientId}/paths`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ polyglotPathId }),
            token: locals.token
        });

        if (!response.ok) {
            return fail(response.status, { error: 'Impossibile assegnare il percorso' });
        }

        return { success: true };
    },

    addDiagnosis: async ({ request, params, fetch, locals }) => {
        const data = await request.formData();
        const diagnosisDate = data.get('diagnosisDate')?.toString() || new Date().toISOString();
        const diagnosisText = data.get('diagnosisText')?.toString();
        const notes = data.get('notes')?.toString() || '';
        const medications = data.get('medications')?.toString() || '';
        const patientId = params.id;

        if (!diagnosisText) {
            return fail(400, { error: 'Il testo della diagnosi è obbligatorio' });
        }

        const response = await apiFetch(fetch, `${PATIENTS_PATH}/${patientId}/diagnoses`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ diagnosisDate, diagnosisText, notes, medications }),
            token: locals.token
        });

        if (!response.ok) {
            return fail(response.status, { error: 'Impossibile salvare la diagnosi' });
        }

        return { success: true };
    }
};