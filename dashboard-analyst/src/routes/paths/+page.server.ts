import { fail } from '@sveltejs/kit';
import { POLYGLOT_PATHS_PATH } from '$lib/server/api-paths';
import { apiFetch } from '$lib/server/apiClient';
import type { PageServerLoad, Actions } from './$types';
import type { PolyglotPath, Patient } from '$lib/types';
import { ANALYSTS_PATH } from '$lib/server/api-paths';
import { PATIENTS_PATH } from '$lib/server/api-paths';

const publishedFlowsPath = `${POLYGLOT_PATHS_PATH}?published=true`;

export const load: PageServerLoad = async ({ fetch, locals }) => {

    const analystId = locals.analystId;
    const analystPatientsPath = `${ANALYSTS_PATH}/${analystId}/patients`

    const [polyglotRes, patientsRes] = await Promise.all([
        apiFetch(fetch, publishedFlowsPath, { token: locals.token }),
        apiFetch(fetch, analystPatientsPath, { token: locals.token })
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

        // 1. Fetch the full list of paths to find the matching flow object
        const pathsRes = await apiFetch(fetch, publishedFlowsPath, { token: locals.token });
        const polyglotPaths = pathsRes.ok ? ((await pathsRes.json()) as PolyglotPath[]) : [];
        const selectedPath = polyglotPaths.find((p) => p.id === polyglotPathId);

        if (!selectedPath) {
            return fail(400, { error: 'Percorso selezionato non trovato' });
        }

        // 2. Send the exact request structure required: { flow: { ... } }
        const response = await apiFetch(fetch, `${PATIENTS_PATH}/${patientId}/paths`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ flow: selectedPath }),
            token: locals.token
        });

        if (!response.ok) {
            return fail(response.status, { error: "Impossibile assegnare il percorso al paziente" });
        }

        return { success: true };
    }
};