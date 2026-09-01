import { API_BASE_URL, USE_MOCK_DATA } from '$env/static/private';
import {
    LOGIN_PATH,
    REGISTER_PATH,
    PATIENTS_PATH,
    DEGREES_PATH,
    STATS_PATH,
    GAME_EXECUTIONS_PATH,
    POLYGLOT_PATHS_PATH,
    ANALYSTS_PATH
} from '$lib/server/api-paths';
import { getDb, saveDb } from './mockDb';

export async function apiFetch(
    nativeFetch: typeof globalThis.fetch,
    path: string,
    options: RequestInit & { token?: string } = {}
): Promise<Response> {
    const useMock = USE_MOCK_DATA === 'true';
    const method = options.method || 'GET';

    if (useMock) {
        const jsonResponse = (data: unknown, status = 200) =>
            new Response(JSON.stringify(data), {
                status,
                headers: { 'Content-Type': 'application/json' }
            });

        // 1. Load the DB from mock-database.json
        const db = await getDb();

        // 2. Safely parse JSON body for POST/PUT requests
        const body = options.body ? JSON.parse(options.body as string) : {};

        // --- AUTH ---
        if (path.endsWith(LOGIN_PATH) && method === 'POST') {
            // Verify credentials against the mock database analyst
            if (body.email === db.analyst.email) {
                return jsonResponse({
                    token: 'mock-jwt-token-12345',
                    expiresAt: new Date(Date.now() + 86400000).toISOString(),
                    analyst: db.analyst
                });
            }
            // Return 401 Unauthorized if credentials fail
            return jsonResponse({ globalError: 'Email o password errati. (Usa admin@gmail.com / password)' }, 401);
        }

        if (path.endsWith(REGISTER_PATH) && method === 'POST') {
            return jsonResponse({ success: true }, 201);
        }

        // --- STATIC COLLECTIONS ---
        if (path.includes(STATS_PATH)) return jsonResponse(db.stats);
        if (path.includes(DEGREES_PATH)) return jsonResponse(db.degrees);
        if (path.includes(POLYGLOT_PATHS_PATH)) return jsonResponse(db.polyglotPaths);

        // --- ANALYST PROFILE ---
        if (path.includes(ANALYSTS_PATH) && !path.endsWith(REGISTER_PATH)) {
            const parts = path.split('/').filter(Boolean);

            // Expected format: /api/analysts/{id}
            if (parts.length === 3) {
                // GET /api/analysts/{id}
                if (method === 'GET') {
                    return jsonResponse(db.analyst);
                }

                // PUT /api/analysts/{id}
                if (method === 'PUT') {
                    db.analyst = {
                        ...db.analyst,
                        firstName: body.firstName || db.analyst.firstName,
                        lastName: body.lastName || db.analyst.lastName,
                        email: body.email || db.analyst.email,
                        // Not storing password in plain text mock for security practice, but it passes through
                        updatedAt: new Date().toISOString()
                    };
                    await saveDb(db);
                    return jsonResponse(db.analyst);
                }

                // DELETE /api/analysts/{id}
                if (method === 'DELETE') {
                    // For mock purposes, just reset it to null or keep it as is since it logs out anyway
                    db.analyst = null;
                    await saveDb(db);
                    return new Response(null, { status: 204 });
                }
            }
        }

        // --- PATIENTS & RELATIONS ---
        if (path.includes(PATIENTS_PATH)) {
            const parts = path.split('/').filter(Boolean);
            const isBaseRoute = parts[parts.length - 1] === 'patients';
            const patientId = !isBaseRoute ? parts[2] : null;

            // POST /api/patients/{id}/paths
            if (parts.includes('paths') && method === 'POST') {
                const patient = db.patients.find((p: any) => p.id === patientId);
                const newPath = {
                    id: `path-${Date.now()}`,
                    patient,
                    polyglotPathId: body.polyglotPathId,
                    uniqueCode: `CODE-${Math.floor(Math.random() * 10000)}`,
                    assignedAt: new Date().toISOString(),
                    flow: {}
                };
                db.patientPaths.push(newPath);
                await saveDb(db);
                return jsonResponse(newPath);
            }

            // DELETE /api/patients/{id}/paths/{pathId}
            if (parts.includes('paths') && method === 'DELETE') {
                const pathId = parts[4];
                db.patientPaths = db.patientPaths.filter((p: any) => p.id !== pathId);
                await saveDb(db);
                return new Response(null, { status: 204 });
            }

            // GET /api/patients/{id}/paths
            if (parts.includes('paths') && method === 'GET') {
                const assignedPaths = db.patientPaths.filter((p: any) => p.patient.id === patientId);
                return jsonResponse(assignedPaths);
            }

            // POST /api/patients/{id}/diagnoses
            if (parts.includes('diagnoses') && method === 'POST') {
                const patient = db.patients.find((p: any) => p.id === patientId);
                const newDiag = {
                    id: `diag-${Date.now()}`,
                    patient,
                    ...body,
                    createdAt: new Date().toISOString()
                };
                db.diagnoses.push(newDiag);
                await saveDb(db);
                return jsonResponse(newDiag);
            }

            // GET /api/patients/{id}/diagnoses
            if (parts.includes('diagnoses') && method === 'GET') {
                const patientDiags = db.diagnoses.filter((d: any) => d.patient.id === patientId);
                return jsonResponse(patientDiags);
            }

            // DELETE /api/patients/{id} 
            if (method === 'DELETE' && parts.length === 3) {
                db.patients = db.patients.filter((p: any) => p.id !== patientId);
                await saveDb(db);
                return jsonResponse({ success: true });
            }

            // POST /api/patients (Create new patient)
            if (method === 'POST' && parts.length === 2) {
                const degree = db.degrees.find((d: any) => d.code === body.degreeCode);
                const newPatient = {
                    ...body,
                    id: `patient-${Date.now()}`,
                    createdAt: new Date().toISOString(),
                    degree
                };
                db.patients.push(newPatient);
                await saveDb(db);
                return jsonResponse(newPatient, 201);
            }

            // GET /api/patients/{id}
            if (method === 'GET' && parts.length === 3) {
                const patient = db.patients.find((p: any) => p.id === patientId);
                return patient ? jsonResponse(patient) : jsonResponse({ error: 'Not found' }, 404);
            }

            // GET /api/patients
            if (method === 'GET' && parts.length === 2) {
                return jsonResponse(db.patients);
            }
        }

        // --- EXECUTIONS ---
        if (path.includes(GAME_EXECUTIONS_PATH)) {
            if (method === 'POST') {
                const newExec = { ...body, id: `exec-${Date.now()}` };
                db.executions.push(newExec);
                await saveDb(db);
                return jsonResponse(newExec, 201);
            }
            // GET /api/game-executions
            return jsonResponse(db.executions);
        }
    }

    // --- FALLBACK TO REAL API ---
    const headers = new Headers(options.headers || {});
    if (options.token && !path.endsWith(LOGIN_PATH) && !path.endsWith(REGISTER_PATH)) {
        headers.set('Authorization', `Bearer ${options.token}`);
    }

    return nativeFetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers
    });
}