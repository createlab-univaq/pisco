import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
    const token = event.cookies.get('session_token');

    if (token) {
        event.locals.token = token;
    }

    const analystId = event.cookies.get('analyst_id')

    if (analystId) {
        event.locals.analystId = analystId
    }

    return await resolve(event);
};