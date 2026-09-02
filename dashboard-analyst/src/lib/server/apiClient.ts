// Dynamic, not static: $env/static/private is substituted at build time, which would
// bake the API URL into the image and make it a build argument on Coolify. Read at
// runtime the same image can be promoted between environments.
import { env } from '$env/dynamic/private';
import {
    LOGIN_PATH,
    REGISTER_PATH,
    PATIENTS_PATH,
    DEGREES_PATH,
    GAME_EXECUTIONS_PATH,
    POLYGLOT_PATHS_PATH,
    ANALYSTS_PATH
} from '$lib/server/api-paths';
import { getDb, saveDb } from './mockDb';
import { mockAnalyst } from './mocks/mockDatabase';

export async function apiFetch(
    nativeFetch: typeof globalThis.fetch,
    path: string,
    options: RequestInit & { token?: string } = {}
): Promise<Response> {
    const useMock = env.USE_MOCK_DATA === 'true';
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

        const db = await getDb();
        const body = options.body ? JSON.parse(options.body as string) : {};

        // --- AUTH ---
        if (pathname.endsWith(LOGIN_PATH) && method === 'POST') {
            if (body.email === db.analyst?.email) {
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
        if (pathname.includes(DEGREES_PATH)) return jsonResponse(db.degrees);
        if (pathname.includes(POLYGLOT_PATHS_PATH)) return jsonResponse(db.polyglotPaths);

        // --- ANALYST PROFILE ---
        if (pathname.includes(ANALYSTS_PATH) && !pathname.endsWith(REGISTER_PATH)) {
            const parts = pathname.split('/').filter(Boolean);
            // Expected format: /api/analysts/{id}
            if (parts.length === 2 && parts[0] === 'analysts') {
                // GET /api/analysts/{id}
                if (method === 'GET') {
                    if (!db.analyst) {
                        db.analyst = mockAnalyst;
                        await saveDb(db);
                    }
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
            const patientId = parts.length > 1 ? parts[1] : null;

            // POST /patients/{id}/paths
            if (parts.length === 3 && parts[2] === 'paths' && method === 'POST') {
                const patient = db.patients.find((p: any) => p.id === patientId);
                const newPath = {
                    id: `path-${Date.now()}`,
                    patient,
                    flow: body.flow,
                    uniqueCode: `CODE-${Math.floor(Math.random() * 10000)}`,
                    assignedAt: new Date().toISOString()
                };
                db.patientPaths.push(newPath);
                await saveDb(db);
                return jsonResponse(newPath, 201);
            }

            // DELETE /patients/{id}/paths/{pathId}
            if (parts.length === 4 && parts[2] === 'paths' && method === 'DELETE') {
                const pathId = parts[3];
                db.patientPaths = db.patientPaths.filter((p: any) => p.id !== pathId);
                await saveDb(db);
                return new Response(null, { status: 204 });
            }

            // GET /patients/{id}/paths
            if (parts.length === 3 && parts[2] === 'paths' && method === 'GET') {
                const assignedPaths = db.patientPaths.filter((p: any) => p.patient?.id === patientId);
                return jsonResponse(assignedPaths);
            }

            // POST /patients/{id}/diagnoses
            if (parts.length === 3 && parts[2] === 'diagnoses' && method === 'POST') {
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

            // GET /patients/{id}/diagnoses
            if (parts.length === 3 && parts[2] === 'diagnoses' && method === 'GET') {
                const patientDiags = db.diagnoses.filter((d: any) => d.patient?.id === patientId);
                return jsonResponse(patientDiags);
            }

            // DELETE /patients/{id}
            if (method === 'DELETE' && parts.length === 2) {
                db.patients = db.patients.filter((p: any) => p.id !== patientId);
                db.patientPaths = db.patientPaths.filter((p: any) => p.patient?.id !== patientId);
                db.diagnoses = db.diagnoses.filter((d: any) => d.patient?.id !== patientId);
                db.executions = db.executions.filter((e: any) => e.patientPath?.patient?.id !== patientId);
                await saveDb(db);
                return new Response(null, { status: 204 });
            }

            // PUT /patients/{id}
            if (method === 'PUT' && parts.length === 2) {
                const pIndex = db.patients.findIndex((p: any) => p.id === patientId);
                if (pIndex !== -1) {
                    db.patients[pIndex] = {
                        ...db.patients[pIndex],
                        firstName: body.firstName,
                        lastName: body.lastName,
                        gender: body.gender,
                        age: body.age,
                        degree: body.degree
                    };
                    await saveDb(db);
                    return jsonResponse(db.patients[pIndex]);
                }
                return jsonResponse({ error: 'Not found' }, 404);
            }

            // GET /patients/{id}
            if (method === 'GET' && parts.length === 2) {
                const patient = db.patients.find((p: any) => p.id === patientId);
                return patient ? jsonResponse(patient) : jsonResponse({ error: 'Not found' }, 404);
            }

            // POST /patients
            if (method === 'POST' && parts.length === 1) {
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

            // GET /patients
            if (method === 'GET' && parts.length === 1) {
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

    const headers = new Headers(options.headers || {});
    if (options.token && !pathname.endsWith(LOGIN_PATH) && !pathname.endsWith(REGISTER_PATH)) {
        headers.set('Authorization', `Bearer ${options.token}`);
    }

    return nativeFetch(`${env.API_BASE_URL}${path}`, {
        ...options,
        headers
    });
}