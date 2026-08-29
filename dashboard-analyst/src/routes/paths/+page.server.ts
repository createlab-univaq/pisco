import { fail } from '@sveltejs/kit';
import { POLYGLOT_PATHS_PATH, PATIENTS_PATH } from '$lib/server/api-paths';
import { apiFetch } from '$lib/server/apiClient';
import type { PageServerLoad, Actions } from './$types';
import type { PolyglotPath, Patient } from '$lib/types';

export const load: PageServerLoad = async ({ fetch, locals }) => {
    const [polyglotRes, patientsRes] = await Promise.all([
        apiFetch(fetch, POLYGLOT_PATHS_PATH, { token: locals.token }),
        apiFetch(fetch, PATIENTS_PATH, { token: locals.token })
    ]);

    const polyglotPaths = polyglotRes.ok ? ((await polyglotRes.json()) as PolyglotPath[]) : [];
    const patients = patientsRes.ok ? ((await patientsRes.json()) as Patient[]) : [];

    return { polyglotPaths, patients };
};

export const actions: Actions = {
    assignPath: async ({ request, fetch, locals }) => {
        const data = await request.formData();
        const patientId = data.get('patientId')?.toString();
        const polyglotPathId = data.get('polyglotPathId')?.toString();

        if (!patientId || !polyglotPathId) {
            return fail(400, { error: 'Seleziona un paziente e un percorso valido' });
        }

        const response = await apiFetch(fetch, `${PATIENTS_PATH}/${patientId}/paths`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ polyglotPathId }),
            token: locals.token
        });

        if (!response.ok) {
            return fail(response.status, { error: "Impossibile assegnare il percorso al paziente" });
        }

        return { success: true };
    }
};