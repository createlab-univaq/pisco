import { env } from '$env/dynamic/private';
import { fail } from '@sveltejs/kit';
import { PATIENTS_PATH, GAME_EXECUTIONS_PATH } from '$lib/server/api-paths';
import type { PageServerLoad, Actions } from './$types';
import type { Patient, GameExecution } from '$lib/types';

export const load: PageServerLoad = async ({ fetch }) => {
    const [patientsRes, executionsRes] = await Promise.all([
        fetch(`${env.API_BASE_URL}${PATIENTS_PATH}`),
        fetch(`${env.API_BASE_URL}${GAME_EXECUTIONS_PATH}`)
    ]);

    const patients = patientsRes.ok ? ((await patientsRes.json()) as Patient[]) : [];
    const executions = executionsRes.ok ? ((await executionsRes.json()) as GameExecution[]) : [];

    return { patients, executions };
};

export const actions: Actions = {
    deletePatients: async ({ request, fetch }) => {
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
                fetch(`${env.API_BASE_URL}${PATIENTS_PATH}/${id}`, { method: 'DELETE' })
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