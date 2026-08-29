import { env } from '$env/dynamic/private';
import { fail, redirect } from '@sveltejs/kit';
import { REGISTER_PATH } from '$lib/server/api-paths';
import type { Actions } from './$types';

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
                // Attempt to parse the API's JSON error response
                let errorPayload;
                try {
                    errorPayload = await response.json();
                } catch {
                    // Fallback if the server returns HTML or a non-JSON error
                    return fail(response.status, {
                        globalError: 'Registration failed due to a server error.',
                        values: { firstName, lastName, email }
                    });
                }

                // Return the specific field errors, the global detail message, and the user's input
                return fail(response.status, {
                    globalError: errorPayload.detail || errorPayload.title || 'Registration failed',
                    fieldErrors: errorPayload.errors as Record<string, string> | undefined,
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