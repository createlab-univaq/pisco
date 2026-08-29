import { env } from '$env/dynamic/private';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
    try {
        // Notice we are using the special 'fetch' provided by SvelteKit's load function
        // handleFetch will automatically attach the Bearer token to this request!
        const response = await fetch(`${env.API_BASE_URL}/users`); // Adjust this endpoint to your actual API route

        if (!response.ok) {
            // Handle session expiration (e.g., 401 Unauthorized) gracefully
            if (response.status === 401) {
                throw error(401, 'Session expired');
            }
            throw error(response.status, 'Failed to fetch users');
        }

        const users = await response.json();

        // Return the data to your frontend
        return {
            users
        };
    } catch (err) {
        console.error("Error loading users:", err);
        // Fallback return if the API fails
        return {
            users: []
        };
    }
};