import { API_BASE_URL, USE_MOCK_DATA } from '$env/static/private';
import {
    mockPatients,
    mockDegrees,
    mockStats,
    mockExecutions,
    mockDiagnoses,
    mockAnalyst,
    mockPolyglotPaths
} from '$lib/server/mocks/mockDatabase';
import {
    LOGIN_PATH,
    REGISTER_PATH,
    PATIENTS_PATH,
    DEGREES_PATH,
    STATS_PATH,
    GAME_EXECUTIONS_PATH,
    POLYGLOT_PATHS_PATH
} from '$lib/server/api-paths';

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

        if (path.endsWith(LOGIN_PATH) && method === 'POST') {
            return jsonResponse({
                token: 'mock-jwt-token-12345',
                expiresAt: new Date(Date.now() + 86400000).toISOString(),
                analyst: mockAnalyst
            });
        }

        if (path.endsWith(REGISTER_PATH) && method === 'POST') {
            return jsonResponse({ success: true }, 201);
        }

        if (path.includes(STATS_PATH)) return jsonResponse(mockStats);
        if (path.includes(DEGREES_PATH)) return jsonResponse(mockDegrees);
        if (path.includes(POLYGLOT_PATHS_PATH)) return jsonResponse(mockPolyglotPaths);

        if (path.includes(PATIENTS_PATH)) {
            const parts = path.split('/').filter(Boolean);

            // POST /api/patients/{patientId}/paths
            if (parts.includes('paths') && method === 'POST') {
                const patientId = parts[1];
                const patient = mockPatients.find(p => p.id === patientId) || mockPatients[0];
                return jsonResponse({
                    id: 'mock-patient-path-id',
                    patient,
                    polyglotPathId: 'poly-1',
                    uniqueCode: 'CODE-999',
                    assignedAt: new Date().toISOString()
                });
            }

            // DELETE /api/patients/{patientId}/paths/{pathId}
            if (parts.includes('paths') && method === 'DELETE') {
                return new Response(null, { status: 204 });
            }

            if (method === 'DELETE' && parts.length === 3) return jsonResponse({ success: true });
            if (method === 'POST' && parts.length === 2) return jsonResponse({ ...mockPatients[0], id: 'new-mock-id' });
            if (parts.length === 3) {
                const patient = mockPatients.find((p) => p.id === parts[2]) || mockPatients[0];
                return jsonResponse(patient);
            }
            if (parts.includes('paths') && method === 'GET') return jsonResponse([mockExecutions[0].patientPath]);
            if (parts.includes('diagnoses') && method === 'GET') return jsonResponse(mockDiagnoses);
            if (parts.includes('diagnoses') && method === 'POST') return jsonResponse(mockDiagnoses[0]);
            return jsonResponse(mockPatients);
        }

        if (path.includes(GAME_EXECUTIONS_PATH)) {
            if (method === 'POST') return jsonResponse(mockExecutions[0]);
            return jsonResponse(mockExecutions);
        }
    }

    const headers = new Headers(options.headers || {});
    if (options.token && !path.endsWith(LOGIN_PATH) && !path.endsWith(REGISTER_PATH)) {
        headers.set('Authorization', `Bearer ${options.token}`);
    }

    return nativeFetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers
    });
}