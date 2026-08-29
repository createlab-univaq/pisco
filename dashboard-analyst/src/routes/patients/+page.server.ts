import { env } from '$env/dynamic/private';
import { fail } from '@sveltejs/kit';
import { PATIENTS_PATH } from '$lib/server/api-paths';
import type { PageServerLoad, Actions } from './$types';
import type { Patient } from '$lib/types';

export const load: PageServerLoad = async ({ fetch }) => {
    const response = await fetch(`${env.API_BASE_URL}${PATIENTS_PATH}`);

    const patients = response.ok ? (await response.json() as Patient[]) : [];

    return { patients };
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
            // Create an array of fetch promises for each ID
            const deletionPromises = ids.map(id =>
                fetch(`${env.API_BASE_URL}${PATIENTS_PATH}/${id}`, {
                    method: 'DELETE'
                })
            );

            // Wait for all DELETE requests to finish concurrently
            const responses = await Promise.all(deletionPromises);

            // Check if any of the requests failed (e.g., returned 404 or 500)
            const failedResponses = responses.filter(res => !res.ok);

            if (failedResponses.length > 0) {
                return fail(500, {
                    error: `Errore: Impossibile eliminare ${failedResponses.length} paziente/i. Riprova.`
                });
            }

            return { success: true };
        } catch (err) {
            return fail(500, { error: 'Errore di rete durante l\'eliminazione' });
        }
    }
};