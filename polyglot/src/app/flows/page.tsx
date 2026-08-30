import { apiFetch } from '@/lib/server/apiClient';
import { FLOWS_PATH } from '@/lib/server/api-paths';
import { Flow } from '@/types';
import FlowsClient from './FlowsClient';
import Navbar from '@/components/navbars/NavBar';

export default async function FlowsPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string }>; // <-- Update type to Promise
}) {
    // 1. AWAIT the search params before using them
    const resolvedParams = await searchParams;

    // 2. Build the query string using the resolved params
    const query = resolvedParams.q ? `?name=${encodeURIComponent(resolvedParams.q)}` : '';

    // 3. Fetch data securely on the server
    const res = await apiFetch(`${FLOWS_PATH}${query}`);

    // 4. Handle data
    let flows: Flow[] = [];
    if (res.ok) {
        flows = await res.json();
    } else {
        console.error("Failed to fetch flows. Status:", res.status);
    }

    // 5. Pass the resolved query to the client
    return (
        <>
            <Navbar />
            <FlowsClient initialFlows={flows} initialSearch={resolvedParams.q || ''} />
        </>
    );
}