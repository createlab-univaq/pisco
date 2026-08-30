import { cookies } from 'next/headers';
import { FLOWS_PATH, LOGIN_PATH, REGISTER_PATH } from './api-paths';
import { mockAnalyst, mockNewAnalyst, mockFlows, addMockFlow, updateMockAnalyst, deleteMockAnalyst } from './mocks/mockDatabase';

export async function apiFetch(
    path: string,
    options: RequestInit = {}
): Promise<Response> {
    const useMock = process.env.USE_MOCK_DATA === 'true';
    const baseUrl = process.env.API_BASE_URL || 'http://localhost:3000/api';
    const method = options.method || 'GET';

    // Safely extract just the path without query strings (e.g., '/flows?name=Test' -> '/flows')
    const basePath = path.split('?')[0];

    if (useMock) {
        const analystIdMatch = basePath.match(/\/analysts\/([a-zA-Z0-9-]+)$/);

        const jsonResponse = (data: unknown, status = 200) =>
            new Response(JSON.stringify(data), {
                status,
                headers: { 'Content-Type': 'application/json' }
            });

        if (analystIdMatch) {
            if (method === 'GET') {
                return jsonResponse(mockAnalyst);
            }

            if (method === 'PUT') {
                const body = JSON.parse(options.body as string);
                const updatedAnalyst = updateMockAnalyst(body);
                return jsonResponse(updatedAnalyst);
            }

            if (method === 'DELETE') {
                deleteMockAnalyst();
                return new Response(null, { status: 204 }); // 204 No Content
            }
        }

        if (basePath.endsWith(LOGIN_PATH) && method === 'POST') {
            return jsonResponse({
                token: 'mock-jwt-token-12345',
                expiresAt: new Date(Date.now() + 86400000).toISOString(),
                analyst: mockAnalyst
            });
        }

        if (basePath.endsWith(REGISTER_PATH) && method === 'POST') {
            return jsonResponse(mockNewAnalyst, 201); // 201 Created
        }

        // Mock POST /api/flows (Cleaned up!)
        if (basePath.endsWith(FLOWS_PATH) && method === 'POST') {
            const body = JSON.parse(options.body as string);
            const newFlow = addMockFlow(body); // Delegate generation to the database file
            return jsonResponse(newFlow, 201); // 201 Created
        }

        if (basePath.endsWith(FLOWS_PATH) && method === 'GET') {
            const urlParams = new URLSearchParams(path.split('?')[1] || '');
            const searchQuery = urlParams.get('name')?.toLowerCase();

            let returnedFlows = mockFlows;
            if (searchQuery) {
                returnedFlows = mockFlows.filter(f =>
                    f.name.toLowerCase().includes(searchQuery)
                );
            }

            return jsonResponse(returnedFlows);
        }

        if (basePath.startsWith(FLOWS_PATH + '/') && method === 'DELETE') {
            return new Response(null, { status: 204 }); // 204 No Content
        }
    }

    const headers = new Headers(options.headers || {});

    // Await the cookies() promise
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (token && !basePath.endsWith(LOGIN_PATH) && !basePath.endsWith(REGISTER_PATH)) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    return fetch(`${baseUrl}${path}`, {
        ...options,
        headers
    });
}