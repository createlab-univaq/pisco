'use server';

import { cookies } from 'next/headers';
import { LOGIN_PATH, REGISTER_PATH } from '../server/api-paths';
import { apiFetch } from '../server/apiClient';
import { LoginResponse } from '@/types';
import { redirect } from 'next/navigation';

export async function loginAction(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
        const res = await apiFetch(LOGIN_PATH, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        // Handle API Errors
        if (!res.ok) {
            let errorMessage = 'Credenziali non valide.'; // Default fallback

            try {
                // Parse the structured error response from the API
                const errorData = await res.json();

                // Prioritize 'detail', fallback to 'title', then generic message
                errorMessage = errorData.detail || errorData.title || errorMessage;
            } catch (parseError) {
                // If the response wasn't valid JSON (e.g., 502 Bad Gateway HTML), it falls back safely
                console.error('Failed to parse error response:', parseError);
            }

            return { error: errorMessage };
        }

        const data: LoginResponse = await res.json();

        // Set HTTP-only cookie
        const cookieStore = await cookies();

        cookieStore.set('token', data.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            expires: new Date(data.expiresAt),
            path: '/',
        });

        cookieStore.set('userId', data.analyst.id, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            expires: new Date(data.expiresAt),
            path: '/',
        });

        return { success: true };
    } catch (error) {
        // This catches network failures (e.g., API is completely down)
        console.error('Login network error:', error);
        return { error: 'Si è verificato un errore di rete. Riprova più tardi.' };
    }
}

export async function logoutAction() {
    const cookieStore = await cookies();
    cookieStore.delete('token');
    cookieStore.delete('userId');

    redirect('/login');
}
export async function registerAction(formData: FormData) {
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
        const res = await apiFetch(REGISTER_PATH, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ firstName, lastName, email, password })
        });

        if (!res.ok) {
            let errorMessage = 'Registrazione fallita. Verifica i dati inseriti.';

            try {
                const errorData = await res.json();
                errorMessage = errorData.detail || errorData.title || errorMessage;
            } catch (parseError) {
                console.error('Failed to parse error response:', parseError);
            }

            return { error: errorMessage };
        }

        // We don't need to save the response data here because 
        // the user still needs to log in to get their token.
        return { success: true };
    } catch (error) {
        console.error('Register network error:', error);
        return { error: 'Si è verificato un errore di rete. Riprova più tardi.' };
    }
}