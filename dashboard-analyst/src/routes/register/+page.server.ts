import { fail, redirect } from '@sveltejs/kit';
import { REGISTER_PATH } from '$lib/server/api-paths';
import { apiFetch } from '$lib/server/apiClient';
import type { Actions } from './$types';

export const actions: Actions = {
    default: async ({ request, fetch }) => {
        const data = await request.formData();
        const firstName = data.get('firstName')?.toString();
        const lastName = data.get('lastName')?.toString();
        const email = data.get('email')?.toString();
        const password = data.get('password')?.toString();

        if (!firstName || !lastName || !email || !password) {
            return fail(400, { error: 'Tutti i campi sono obbligatori' });
        }

        const response = await apiFetch(fetch, REGISTER_PATH, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ firstName, lastName, email, password })
        });

        if (!response.ok) {
            return fail(400, { error: 'Registrazione fallita. Riprova.' });
        }

        throw redirect(303, '/login');
    }
};