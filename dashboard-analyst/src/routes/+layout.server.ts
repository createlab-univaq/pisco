import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, url }) => {
    const token = locals.token;

    // Define paths that don't require authentication
    const isAuthRoute = url.pathname === '/login' || url.pathname === '/register';

    // If not logged in and trying to access a protected page -> kick to login
    if (!token && !isAuthRoute) {
        throw redirect(303, '/login');
    }

    // If already logged in and trying to access login/register -> push to home
    if (token && isAuthRoute) {
        throw redirect(303, '/');
    }

    // Pass data to the frontend (like the token or user info) so the UI can use it
    return {
        token
    };
};