import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ cookies, locals }) => {
    // Delete the session cookie
    cookies.delete('session_token', { path: '/' });

    // Clear the locals
    locals.token = undefined;

    // 3. Redirect to the login page
    throw redirect(303, '/login');
};