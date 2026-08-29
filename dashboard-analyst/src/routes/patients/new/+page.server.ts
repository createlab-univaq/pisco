import { env } from '$env/dynamic/private';
import { fail, redirect } from '@sveltejs/kit';
import { PATIENTS_PATH, DEGREES_PATH } from '$lib/server/api-paths';
import type { PageServerLoad, Actions } from './$types';
import type { Degree, ApiError } from '$lib/types';

export const load: PageServerLoad = async ({ fetch }) => {
    const response = await fetch(`${env.API_BASE_URL}${DEGREES_PATH}`);
    const degrees = response.ok ? (await response.json() as Degree[]) : [];

    return { degrees };
};

export const actions: Actions = {
    default: async ({ request, fetch }) => {
        const data = await request.formData();

        const firstName = data.get('firstName')?.toString();
        const lastName = data.get('lastName')?.toString();
        const gender = data.get('gender')?.toString();
        const ageString = data.get('age')?.toString();
        const degreeCode = data.get('degreeCode')?.toString();

        // Group values to keep the fail returns clean
        const values = { firstName, lastName, gender, age: ageString, degreeCode };

        if (!firstName || !lastName || !gender || !ageString || !degreeCode) {
            return fail(400, {
                globalError: 'Tutti i campi sono obbligatori',
                fieldErrors: undefined, // explicitly declare undefined to satisfy TypeScript
                values
            });
        }

        const age = parseInt(ageString, 10);

        try {
            const degreesRes = await fetch(`${env.API_BASE_URL}${DEGREES_PATH}`);
            const degrees = degreesRes.ok ? (await degreesRes.json() as Degree[]) : [];
            const selectedDegree = degrees.find(d => d.code === degreeCode);

            if (!selectedDegree) {
                return fail(400, {
                    globalError: 'Titolo di studio non valido',
                    fieldErrors: undefined,
                    values
                });
            }

            const payload = {
                firstName,
                lastName,
                gender,
                age,
                degree: selectedDegree
            };

            const response = await fetch(`${env.API_BASE_URL}${PATIENTS_PATH}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                let errorPayload: ApiError;
                try {
                    errorPayload = await response.json() as ApiError;
                } catch {
                    return fail(response.status, {
                        globalError: 'Errore di connessione al server',
                        fieldErrors: undefined,
                        values
                    });
                }

                return fail(response.status, {
                    globalError: errorPayload.detail || errorPayload.title || 'Creazione fallita',
                    fieldErrors: errorPayload.errors, // This is the only one that has the actual errors
                    values
                });
            }

        } catch (err) {
            return fail(500, {
                globalError: 'Errore di rete',
                fieldErrors: undefined,
                values
            });
        }

        throw redirect(303, '/patients');
    }
};