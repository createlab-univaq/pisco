import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
    const token = event.cookies.get('session_token');

    if (token) {
        event.locals.token = token;
    }

    return await resolve(event);
};