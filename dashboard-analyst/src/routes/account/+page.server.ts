import { fail, redirect } from '@sveltejs/kit';
import { ANALYSTS_PATH } from '$lib/server/api-paths';
import { apiFetch } from '$lib/server/apiClient';
import type { PageServerLoad, Actions } from './$types';
import type { Analyst } from '$lib/types';

export const load: PageServerLoad = async ({ fetch, locals }) => {
    // Rely on locals.token, which is already verified globally by the root layout
    const token = locals.token;
    const analystId = 'analyst-1';

    const response = await apiFetch(fetch, `${ANALYSTS_PATH}/${analystId}`, {
        token
    });

    if (!response.ok) {
        throw redirect(303, '/login');
    }

    const analyst = (await response.json()) as Analyst;
    return { analyst };
};

export const actions: Actions = {
    updateProfile: async ({ request, fetch, locals }) => {
        const data = await request.formData();
        const firstName = data.get('firstName')?.toString();
        const lastName = data.get('lastName')?.toString();
        const email = data.get('email')?.toString();
        const password = data.get('password')?.toString();

        const token = locals.token;
        const analystId = 'analyst-1';

        if (!firstName || !lastName || !email) {
            return fail(400, { error: 'I campi Nome, Cognome ed Email sono obbligatori.' });
        }

        const body: Record<string, string> = { firstName, lastName, email };
        if (password) {
            body.password = password;
        }

        const response = await apiFetch(fetch, `${ANALYSTS_PATH}/${analystId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
            token
        });

        if (!response.ok) {
            return fail(response.status, { error: "Impossibile aggiornare il profilo." });
        }

        return { success: true };
    },

    deleteAccount: async ({ fetch, locals, cookies }) => {
        const token = locals.token;
        const analystId = 'analyst-1';

        const response = await apiFetch(fetch, `${ANALYSTS_PATH}/${analystId}`, {
            method: 'DELETE',
            token
        });

        if (!response.ok) {
            return fail(response.status, { error: "Impossibile eliminare l'account." });
        }

        cookies.delete('session_token', { path: '/' });
        throw redirect(303, '/login');
    }
};