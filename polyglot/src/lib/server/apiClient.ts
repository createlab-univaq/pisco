import { cookies } from 'next/headers';
import { FLOWS_PATH, LOGIN_PATH, REGISTER_PATH, IMAGE_PATH } from './api-paths';
import {
    mockNewAnalyst,
    getMockAnalyst,
    getMockFlows,
    addMockFlow,
    getMockFlowById,
    updateMockFlow,
    deleteMockFlow,
    updateMockAnalyst,
    deleteMockAnalyst,
    storeMockImage,
    deleteMockImage
} from './mocks/mockDatabase';

export async function apiFetch(
    path: string,
    options: RequestInit = {}
): Promise<Response> {
    const useMock = process.env.USE_MOCK_DATA === 'true';
    const baseUrl = process.env.API_BASE_URL || 'http://localhost:3000/api';
    const method = options.method || 'GET';
    const basePath = path.split('?')[0];

    if (useMock) {
        const jsonResponse = (data: unknown, status = 200) =>
            new Response(JSON.stringify(data), {
                status,
                headers: { 'Content-Type': 'application/json' }
            });

        if (basePath === IMAGE_PATH && method === 'POST') {
            const body = JSON.parse(options.body as string);
            return jsonResponse({ path: storeMockImage(body.mimeType, body.image) });
        }

        const imageIdMatch = basePath.match(/\/image\/([a-zA-Z0-9-_:/.]+)$/);
        if (imageIdMatch && method === 'DELETE') {
            deleteMockImage(imageIdMatch[1]);
            return new Response(null, { status: 204 });
        }

        const analystIdMatch = basePath.match(/\/analysts\/([a-zA-Z0-9-]+)$/);
        if (analystIdMatch) {
            const analystId = analystIdMatch[1];
            if (method === 'GET') return jsonResponse(getMockAnalyst(analystId));
            if (method === 'PUT') {
                const body = JSON.parse(options.body as string);
                return jsonResponse(updateMockAnalyst(analystId, body));
            }
            if (method === 'DELETE') {
                deleteMockAnalyst(analystId);
                return new Response(null, { status: 204 });
            }
        }

        const flowIdMatch = basePath.match(/\/flows\/([a-zA-Z0-9-]+)$/);
        if (flowIdMatch) {
            const flowId = flowIdMatch[1];
            if (method === 'GET') {
                const flow = getMockFlowById(flowId);
                if (!flow) return jsonResponse({ detail: 'Flow not found' }, 404);
                return jsonResponse(flow);
            }
            if (method === 'PUT' || method === 'POST') {
                const body = JSON.parse(options.body as string);
                return jsonResponse(updateMockFlow(flowId, body.flowJson || body));
            }
            if (method === 'DELETE') {
                deleteMockFlow(flowId);
                return new Response(null, { status: 204 });
            }
        }

        if (basePath.endsWith(LOGIN_PATH) && method === 'POST') {
            return jsonResponse({
                token: 'mock-jwt-token-12345',
                expiresAt: new Date(Date.now() + 86400000).toISOString(),
                analyst: getMockAnalyst()
            });
        }

        if (basePath.endsWith(REGISTER_PATH) && method === 'POST') {
            return jsonResponse(mockNewAnalyst, 201);
        }

        if (basePath.endsWith(FLOWS_PATH) && method === 'POST') {
            const body = JSON.parse(options.body as string);
            return jsonResponse(addMockFlow(body), 201);
        }

        if (basePath.endsWith(FLOWS_PATH) && method === 'GET') {
            const urlParams = new URLSearchParams(path.split('?')[1] || '');
            const searchQuery = urlParams.get('name')?.toLowerCase();
            const flows = getMockFlows();
            const returnedFlows = searchQuery
                ? flows.filter(f => f.name.toLowerCase().includes(searchQuery))
                : flows;
            return jsonResponse(returnedFlows);
        }
    }

    const headers = new Headers(options.headers || {});
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (token && !basePath.endsWith(LOGIN_PATH) && !basePath.endsWith(REGISTER_PATH)) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    return fetch(`${baseUrl}${path}`, { ...options, headers });
}