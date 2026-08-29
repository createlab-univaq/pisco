import { fail, redirect } from '@sveltejs/kit';
import { dev } from '$app/environment';
import { LOGIN_PATH } from '$lib/server/api-paths';
import { apiFetch } from '$lib/server/apiClient';
import type { Actions } from './$types';
import type { LoginResponse, ApiError } from '$lib/types';

export const actions: Actions = {
    default: async ({ request, cookies, fetch }) => {
        const data = await request.formData();

        const email = data.get('email')?.toString();
        const password = data.get('password')?.toString();

        if (!email || !password) {
            return fail(400, {
                globalError: 'Email e password sono obbligatori',
                values: { email }
            });
        }

        try {
            // Replaced direct fetch with centralized apiFetch to support mock switching
            const response = await apiFetch(fetch, LOGIN_PATH, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                let errorPayload: ApiError;
                try {
                    errorPayload = await response.json() as ApiError;
                } catch {
                    return fail(response.status, {
                        globalError: 'Errore di connessione al server.',
                        values: { email }
                    });
                }

                return fail(response.status, {
                    globalError: errorPayload.detail || errorPayload.title || 'Credenziali non valide',
                    values: { email }
                });
            }

            const result = await response.json() as LoginResponse;

            cookies.set('session_token', result.token, {
                path: '/',
                httpOnly: true,
                secure: !dev,
                sameSite: 'strict',
                expires: new Date(result.expiresAt)
            });

        } catch (err) {
            return fail(500, {
                globalError: 'Errore di rete durante il login.',
                values: { email }
            });
        }

        throw redirect(303, '/');
    }
};