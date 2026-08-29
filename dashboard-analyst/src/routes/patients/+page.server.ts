import { fail } from '@sveltejs/kit';
import { PATIENTS_PATH, GAME_EXECUTIONS_PATH } from '$lib/server/api-paths';
import { apiFetch } from '$lib/server/apiClient';
import type { PageServerLoad, Actions } from './$types';
import type { Patient, GameExecution } from '$lib/types';

export const load: PageServerLoad = async ({ fetch, locals }) => {
    const [patientsRes, executionsRes] = await Promise.all([
        apiFetch(fetch, PATIENTS_PATH, { token: locals.token }),
        apiFetch(fetch, GAME_EXECUTIONS_PATH, { token: locals.token })
    ]);

    const patients = patientsRes.ok ? ((await patientsRes.json()) as Patient[]) : [];
    const executions = executionsRes.ok ? ((await executionsRes.json()) as GameExecution[]) : [];

    return { patients, executions };
};

export const actions: Actions = {
    deletePatients: async ({ request, fetch, locals }) => {
        const data = await request.formData();
        const idsString = data.get('ids')?.toString();
        if (!idsString) return fail(400, { error: 'Nessun paziente selezionato' });

        let ids: string[];
        try {
            ids = JSON.parse(idsString);
        } catch {
            return fail(400, { error: 'Dati non validi' });
        }

        try {
            const deletionPromises = ids.map((id) =>
                apiFetch(fetch, `${PATIENTS_PATH}/${id}`, { method: 'DELETE', token: locals.token })
            );
            const responses = await Promise.all(deletionPromises);
            const failed = responses.filter((r) => !r.ok);

            if (failed.length > 0) {
                return fail(500, { error: `Impossibile eliminare ${failed.length} paziente/i` });
            }

            return { success: true };
        } catch {
            return fail(500, { error: "Errore di rete durante l'eliminazione" });
        }
    }
};