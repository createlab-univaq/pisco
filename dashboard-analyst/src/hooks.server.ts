import type { Handle, HandleFetch } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { LOGIN_PATH, REGISTER_PATH } from '$lib/server/api-paths';

export const handle: Handle = async ({ event, resolve }) => {
    const token = event.cookies.get('session_token');

    if (token) {
        event.locals.token = token;
    }

    return await resolve(event);
};

export const handleFetch: HandleFetch = async ({ event, request, fetch }) => {
    // Check if the request is going to your specific API
    if (request.url.startsWith(env.API_BASE_URL)) {

        // Parse the URL to safely check the path
        const requestUrl = new URL(request.url);

        // Define paths that should NOT have the bearer token
        const isAuthEndpoint = requestUrl.pathname.endsWith(LOGIN_PATH) || requestUrl.pathname.endsWith(REGISTER_PATH);

        // Only attach the token if it's NOT an auth endpoint
        if (!isAuthEndpoint) {
            const token = event.locals.token;

            if (token) {
                request.headers.set('Authorization', `Bearer ${token}`);
            }
        }
    }

    return fetch(request);
};