import { cookies } from 'next/headers';
import { FLOWS_PATH, LOGIN_PATH, REGISTER_PATH, IMAGE_PATH, ANALYSTS_PATH } from './api-paths';
import {
    mockNewAnalyst,
    getMockFlows,
    addMockFlow,
    getMockFlowById,
    updateMockFlow,
    deleteMockFlow,
    updateMockAnalyst,
    deleteMockAnalyst,
    storeMockImage,
    deleteMockImage,
    login,
    getMockAnalyst
} from './mocks/mockDatabase';
import { Analyst } from '@/types';

export async function apiFetch(
    path: string,
    options: RequestInit = {}
): Promise<Response> {
    const useMock = process.env.USE_MOCK_DATA === 'true';
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';
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

        const imageIdMatch = basePath.match(new RegExp(`${IMAGE_PATH}/([a-zA-Z0-9-_:/.]+)$`));
        if (imageIdMatch && method === 'DELETE') {
            deleteMockImage(imageIdMatch[1]);
            return new Response(null, { status: 204 });
        }

        const analystIdMatch = basePath.match(new RegExp(`${ANALYSTS_PATH}/([a-zA-Z0-9-]+)$`));
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

        const flowIdMatch = basePath.match(new RegExp(`${FLOWS_PATH}/([a-zA-Z0-9-]+)$`));
        if (flowIdMatch) {
            const flowId = flowIdMatch[1];
            if (method === 'GET') {
                const flow = getMockFlowById(flowId);
                if (!flow) return jsonResponse({ detail: 'Flow not found' }, 404);
                return jsonResponse(flow);
            }
            if (method === 'PATCH') {
                const body = JSON.parse(options.body as string);
                return jsonResponse(updateMockFlow(flowId, body));
            }
            if (method === 'DELETE') {
                deleteMockFlow(flowId);
                return new Response(null, { status: 204 });
            }
        }

        if (basePath.endsWith(LOGIN_PATH) && method === 'POST') {
            const body = JSON.parse(options.body as string);

            // Call login and capture the specific matched user
            const matchedAnalyst: Analyst | undefined = login(body.email, body.password);

            // Return 401 Unauthorized with a clear error payload if it fails
            if (!matchedAnalyst) {
                return jsonResponse({ error: 'Invalid email or password' }, 401);
            }

            // Return the actual matched analyst, not the generic getMockAnalyst()
            return jsonResponse({
                token: 'mock-jwt-token-12345',
                expiresAt: new Date(Date.now() + 86400000).toISOString(),
                analyst: matchedAnalyst
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

    // --- [START] FULL SERVER CONSOLE LOG ---
    if (!basePath.endsWith(LOGIN_PATH)) {
        // Basic terminal colors for better readability
        const c_blue = '\x1b[34m';
        const c_yellow = '\x1b[33m';
        const c_cyan = '\x1b[36m';
        const c_dim = '\x1b[90m';
        const c_reset = '\x1b[0m';

        let formattedBody = `${c_dim}None${c_reset}`;
        if (options.body) {
            try {
                // Parse the body first
                const parsedBody = JSON.parse(options.body as string);
                
                // Safely check for and redact the password field
                if (parsedBody && typeof parsedBody === 'object' && 'password' in parsedBody) {
                    parsedBody.password = '[REDACTED]';
                }
                
                // Stringify the sanitized object for the log
                formattedBody = JSON.stringify(parsedBody, null, 2);
            } catch {
                formattedBody = String(options.body);
            }
        }

        const headersObj = Object.fromEntries(headers.entries());

        // Remove authorization header from logs for security/cleanliness
        delete headersObj['authorization'];

        const formattedHeaders = Object.keys(headersObj).length > 0
            ? JSON.stringify(headersObj, null, 2)
            : `${c_dim}None${c_reset}`;

        // Construct a single string to prevent interleaved logs from concurrent requests
        const logOutput =
            `\n${c_blue}═══ API REQUEST ══════════════════════════════════════════════${c_reset}\n` +
            `${c_yellow}[METHOD]${c_reset}  ${method}\n` +
            `${c_cyan}[URL]${c_reset}     ${baseUrl}${path}\n` +
            `${c_yellow}[HEADERS]${c_reset}\n${formattedHeaders}\n` +
            `${c_yellow}[BODY]${c_reset}\n${formattedBody}\n` +
            `${c_blue}══════════════════════════════════════════════════════════════${c_reset}\n`;

        console.log(logOutput);
    }
    // --- [END] FULL SERVER CONSOLE LOG ---

    return fetch(`${baseUrl}${path}`, { ...options, headers });
}