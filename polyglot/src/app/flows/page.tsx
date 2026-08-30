import { apiFetch } from '@/lib/server/apiClient';
import { FLOWS_PATH } from '@/lib/server/api-paths';
import { Flow } from '@/types';
import FlowsClient from './FlowsClient';
import Navbar from '@/components/navbars/NavBar';

export default async function FlowsPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string }>;
}) {
    const resolvedParams = await searchParams;
    const query = resolvedParams.q ? `?name=${encodeURIComponent(resolvedParams.q)}` : '';

    let flows: Flow[] = [];

    try {
        const res = await apiFetch(`${FLOWS_PATH}${query}`);

        if (res.ok) {
            // Safely parse JSON with a fallback if the body is empty
            const text = await res.text();
            flows = text ? JSON.parse(text) : [];
        } else {
            console.error("Failed to fetch flows. Status:", res.status);
        }
    } catch (error) {
        console.error("Error fetching flows:", error);
    }

    return (
        <>
            <Navbar />
            <FlowsClient initialFlows={flows} initialSearch={resolvedParams.q || ''} />
        </>
    );
}