import { env } from '$env/dynamic/private';
import { STATS_PATH } from '$lib/server/api-paths';
import type { PageServerLoad } from './$types';
import type { Stats } from '$lib/types'; // 1. Import the type

export const load: PageServerLoad = async ({ fetch }) => {
    const response = await fetch(`${env.API_BASE_URL}${STATS_PATH}`);
    
    const stats = response.ok ? (await response.json() as Stats) : null;

    return { stats };
};