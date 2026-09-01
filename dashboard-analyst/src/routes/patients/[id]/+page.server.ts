import { fail, error, redirect } from '@sveltejs/kit';
import { PATIENTS_PATH, GAME_EXECUTIONS_PATH, POLYGLOT_PATHS_PATH, DEGREES_PATH } from '$lib/server/api-paths';
import { apiFetch } from '$lib/server/apiClient';
import type { PageServerLoad, Actions } from './$types';
import type { Patient, PatientPath, Diagnosis, GameExecution, PolyglotPath, Degree } from '$lib/types';

export const load: PageServerLoad = async ({ params, fetch, locals }) => {
    const patientId = params.id;
    const token = locals.token;

    const [patientRes, pathsRes, diagnosesRes, executionsRes, polyglotRes, degreesRes] = await Promise.all([
        apiFetch(fetch, `${PATIENTS_PATH}/${patientId}`, { token }),
        apiFetch(fetch, `${PATIENTS_PATH}/${patientId}/paths`, { token }),
        apiFetch(fetch, `${PATIENTS_PATH}/${patientId}/diagnoses`, { token }),
        apiFetch(fetch, `${GAME_EXECUTIONS_PATH}?patientId=${patientId}`, { token }),
        apiFetch(fetch, POLYGLOT_PATHS_PATH, { token }),
        apiFetch(fetch, DEGREES_PATH, { token })
    ]);

    if (!patientRes.ok) {
        throw error(404, 'Paziente non trovato');
    }

    const patient = (await patientRes.json()) as Patient;
    const paths = pathsRes.ok ? ((await pathsRes.json()) as PatientPath[]) : [];
    const diagnoses = diagnosesRes.ok ? ((await diagnosesRes.json()) as Diagnosis[]) : [];
    const executions = executionsRes.ok ? ((await executionsRes.json()) as GameExecution[]) : [];
    const polyglotPaths = polyglotRes.ok ? ((await polyglotRes.json()) as PolyglotPath[]) : [];
    const degrees = degreesRes.ok ? ((await degreesRes.json()) as Degree[]) : [];

    return { patient, paths, diagnoses, executions, polyglotPaths, degrees };
};

export const actions: Actions = {
    editPatient: async ({ request, params, fetch, locals }) => {
        const data = await request.formData();
        const patientId = params.id;

        const degreesRes = await apiFetch(fetch, DEGREES_PATH, { token: locals.token });
        let degreeObj = null;
        if (degreesRes.ok) {
            const degrees = await degreesRes.json();
            degreeObj = degrees.find((d: any) => d.code === data.get('degreeCode')?.toString());
        }

        const body = {
            firstName: data.get('firstName')?.toString(),
            lastName: data.get('lastName')?.toString(),
            gender: data.get('gender')?.toString(),
            age: Number(data.get('age')),
            degree: degreeObj || { code: data.get('degreeCode')?.toString(), label: "", educationLevel: 0 }
        };

        const response = await apiFetch(fetch, `${PATIENTS_PATH}/${patientId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
            token: locals.token
        });

        if (!response.ok) return fail(response.status, { error: 'Impossibile aggiornare i dati del paziente' });
        return { success: true };
    },

    deletePatient: async ({ params, fetch, locals }) => {
        const response = await apiFetch(fetch, `${PATIENTS_PATH}/${params.id}`, {
            method: 'DELETE',
            token: locals.token
        });

        if (!response.ok) return fail(response.status, { error: 'Impossibile eliminare il paziente' });

        throw redirect(303, '/patients');
    },

    deletePath: async ({ request, params, fetch, locals }) => {
        const data = await request.formData();
        const pathId = data.get('pathId')?.toString();
        const patientId = params.id;

        if (!pathId) return fail(400, { error: 'ID percorso non valido' });

        const response = await apiFetch(fetch, `${PATIENTS_PATH}/${patientId}/paths/${pathId}`, {
            method: 'DELETE',
            token: locals.token
        });

        if (!response.ok) return fail(response.status, { error: 'Impossibile eliminare il percorso' });
        return { success: true };
    },

    assignPath: async ({ request, params, fetch, locals }) => {
        const data = await request.formData();
        const polyglotPathId = data.get('polyglotPathId')?.toString();
        const patientId = params.id;

        if (!polyglotPathId) return fail(400, { error: 'Seleziona un protocollo valido' });

        // Fetch polyglot paths to locate the matching full flow object
        const pathsRes = await apiFetch(fetch, POLYGLOT_PATHS_PATH, { token: locals.token });
        const polyglotPaths = pathsRes.ok ? ((await pathsRes.json()) as PolyglotPath[]) : [];
        const selectedPath = polyglotPaths.find((p) => p.id === polyglotPathId);

        if (!selectedPath) {
            return fail(400, { error: 'Percorso selezionato non trovato' });
        }

        // Send the full flow object as required by the backend
        const response = await apiFetch(fetch, `${PATIENTS_PATH}/${patientId}/paths`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ flow: selectedPath }),
            token: locals.token
        });

        if (!response.ok) {
            return fail(response.status, { error: 'Impossibile assegnare il percorso' });
        }

        return { success: true };
    },

    addDiagnosis: async ({ request, params, fetch, locals }) => {
        const data = await request.formData();
        const rawDate = data.get('diagnosisDate')?.toString();
        const diagnosisDate = rawDate ? new Date(rawDate).toISOString() : new Date().toISOString();
        const diagnosisText = data.get('diagnosisText')?.toString();
        const notes = data.get('notes')?.toString() || '';
        const medications = data.get('medications')?.toString() || '';
        const patientId = params.id;

        if (!diagnosisText) return fail(400, { error: 'Il testo della diagnosi è obbligatorio' });

        const response = await apiFetch(fetch, `${PATIENTS_PATH}/${patientId}/diagnoses`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ diagnosisDate, diagnosisText, notes, medications }),
            token: locals.token
        });

        if (!response.ok) return fail(response.status, { error: 'Impossibile salvare la diagnosi' });
        return { success: true };
    }
};