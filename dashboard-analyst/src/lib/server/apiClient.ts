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

    // Safely extract pathname and search params to handle query strings correctly
    let pathname = path;
    let searchParams = new URLSearchParams();
    if (path.includes('?')) {
        const [base, query] = path.split('?');
        pathname = base;
        searchParams = new URLSearchParams(query);
    }

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
        if (pathname.endsWith(LOGIN_PATH) && method === 'POST') {
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

        if (pathname.endsWith(REGISTER_PATH) && method === 'POST') {
            return jsonResponse({ success: true }, 201);
        }

        // --- STATIC COLLECTIONS ---
        if (pathname.includes(STATS_PATH)) return jsonResponse(db.stats);
        if (pathname.includes(DEGREES_PATH)) return jsonResponse(db.degrees);
        if (pathname.includes(POLYGLOT_PATHS_PATH)) return jsonResponse(db.polyglotPaths);

        // --- ANALYST PROFILE ---
        if (pathname.includes(ANALYSTS_PATH) && !pathname.endsWith(REGISTER_PATH)) {
            const parts = pathname.split('/').filter(Boolean);
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
        if (pathname.includes(PATIENTS_PATH)) {
            const parts = pathname.split('/').filter(Boolean);
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

            // PUT /api/patients/{id}
            if (method === 'PUT' && parts.length === 3) {
                const pIndex = db.patients.findIndex((p: any) => p.id === patientId);
                if (pIndex !== -1) {
                    db.patients[pIndex] = {
                        ...db.patients[pIndex],
                        firstName: body.firstName,
                        lastName: body.lastName,
                        gender: body.gender,
                        age: body.age,
                        degree: body.degree // Body expects the full degree object based on your schema
                    };
                    await saveDb(db);
                    return jsonResponse(db.patients[pIndex]);
                }
                return jsonResponse({ error: 'Not found' }, 404);
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
        if (pathname.includes(GAME_EXECUTIONS_PATH)) {
            if (method === 'POST') {
                const newExec = { ...body, id: `exec-${Date.now()}` };
                db.executions.push(newExec);
                await saveDb(db);
                return jsonResponse(newExec, 201);
            }

            // GET /api/game-executions?patientId=[id]
            if (method === 'GET') {
                let execs = db.executions;
                const filterPatientId = searchParams.get('patientId');

                if (filterPatientId) {
                    execs = execs.filter((exec: any) => exec.patientPath?.patient?.id === filterPatientId);
                }

                return jsonResponse(execs);
            }
        }
    }

    // --- FALLBACK TO REAL API ---
    const headers = new Headers(options.headers || {});
    if (options.token && !pathname.endsWith(LOGIN_PATH) && !pathname.endsWith(REGISTER_PATH)) {
        headers.set('Authorization', `Bearer ${options.token}`);
    }

    return nativeFetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers
    });
}