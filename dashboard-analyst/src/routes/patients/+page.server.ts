import { fail, redirect } from '@sveltejs/kit';
import { GAME_EXECUTIONS_PATH, PATIENTS_PATH } from '$lib/server/api-paths';
import { apiFetch } from '$lib/server/apiClient';
import type { PageServerLoad, Actions } from './$types';
import type { Patient, GameExecution, Diagnosis } from '$lib/types';
import { ANALYSTS_PATH } from '$lib/server/api-paths';

export const load: PageServerLoad = async ({ fetch, locals }) => {
    const token = locals.token;

    const analystId = locals.analystId;
    const analystPatientsPath = `${ANALYSTS_PATH}/${analystId}/patients`

    const [patientsRes, executionsRes] = await Promise.all([
        apiFetch(fetch, analystPatientsPath, { token }),
        apiFetch(fetch, GAME_EXECUTIONS_PATH, { token })
    ]);

    const patients = patientsRes.ok ? ((await patientsRes.json()) as Patient[]) : [];
    const executions = executionsRes.ok ? ((await executionsRes.json()) as GameExecution[]) : [];

    // Build diagnosesMap for all patients
    const diagnosesMap: Record<string, Diagnosis[]> = {};
    await Promise.all(
        patients.map(async (patient) => {
            const diagRes = await apiFetch(fetch, `${PATIENTS_PATH}/${patient.id}/diagnoses`, { token });
            if (diagRes.ok) {
                diagnosesMap[patient.id] = (await diagRes.json()) as Diagnosis[];
            } else {
                diagnosesMap[patient.id] = [];
            }
        })
    );

    return {
        patients,
        executions,
        diagnosesMap
    };
};

export const actions: Actions = {
    deletePatients: async ({ request, fetch, locals }) => {
        const data = await request.formData();
        const rawIds = data.get('ids')?.toString();

        if (!rawIds) {
            return fail(400, { error: 'Nessun paziente selezionato' });
        }

        const ids: string[] = JSON.parse(rawIds);

        for (const id of ids) {
            const response = await apiFetch(fetch, `${PATIENTS_PATH}/${id}`, {
                method: 'DELETE',
                token: locals.token
            });

            if (!response.ok) {
                return fail(response.status, { error: `Impossibile eliminare il paziente con ID ${id}` });
            }
        }

        return { success: true };
    }
};