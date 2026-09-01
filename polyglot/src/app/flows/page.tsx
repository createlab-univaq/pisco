import { getFlowsAction } from '@/lib/actions/flows';
import FlowsClient from './FlowsClient';
import Navbar from '@/components/navbars/NavBar';
import { Flow } from '@/types';

export default async function FlowsPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string }>;
}) {
    const resolvedParams = await searchParams;
    const query = resolvedParams.q;

    let flows: Flow[] = [];

    const result = await getFlowsAction(query);
    if (result.success && result.data) {
        flows = result.data;
    } else {
        console.error("Failed to fetch flows:", result.error);
    }

    return (
        <>
            <Navbar />
            <FlowsClient flows={flows} initialSearch={query || ''} />
        </>
    );
}