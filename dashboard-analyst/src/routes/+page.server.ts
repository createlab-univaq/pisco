import { STATS_PATH } from '$lib/server/api-paths';
import { apiFetch } from '$lib/server/apiClient';
import type { PageServerLoad } from './$types';
import type { Stats } from '$lib/types';

export const load: PageServerLoad = async ({ fetch, locals }) => {
    const response = await apiFetch(fetch, STATS_PATH, { token: locals.token });

    const stats = response.ok ? (await response.json() as Stats) : null;

    return { stats };
};