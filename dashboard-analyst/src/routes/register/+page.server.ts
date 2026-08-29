import { env } from '$env/dynamic/private';
import { fail, redirect } from '@sveltejs/kit';
import { REGISTER_PATH } from '$lib/server/api-paths';
import type { Actions } from './$types';
import type { ApiError } from '$lib/types';

export const actions: Actions = {
    default: async ({ request }) => {
        const data = await request.formData();

        const firstName = data.get('firstName')?.toString();
        const lastName = data.get('lastName')?.toString();
        const email = data.get('email')?.toString();
        const password = data.get('password')?.toString();

        if (!firstName || !lastName || !email || !password) {
            return fail(400, {
                globalError: 'All fields are required',
                values: { firstName, lastName, email }
            });
        }

        try {
            const response = await fetch(`${env.API_BASE_URL}${REGISTER_PATH}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ firstName, lastName, email, password })
            });

            if (!response.ok) {
                let errorPayload: ApiError;
                try {
                    errorPayload = await response.json() as ApiError;
                } catch {
                    return fail(response.status, {
                        globalError: 'Registration failed due to a server error.',
                        values: { firstName, lastName, email }
                    });
                }

                return fail(response.status, {
                    globalError: errorPayload.detail || errorPayload.title || 'Registration failed',
                    fieldErrors: errorPayload.errors,
                    values: { firstName, lastName, email }
                });
            }
        } catch (err) {
            return fail(500, {
                globalError: 'Network error occurred',
                values: { firstName, lastName, email }
            });
        }

        throw redirect(303, '/login');
    }
};