'use client';

import { useMemo, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import FlowCard from '@/components/cards/FlowCard';
import CreateFlowModal from '@/components/modals/CreateFlowModal';
import SearchBar from '@/components/searchbars/SearchBar';
import { deleteFlowAction } from '@/lib/actions/flows';
import createIcon from '@public/plus-solid-full.svg';
import styles from './FlowsClient.module.css';
import { Flow } from '@/types';
import ConfirmModal from '@/components/modals/ConfirmModal';

interface FlowsClientProps {
    flows: Flow[];
    initialSearch: string;
}

export default function FlowsClient({ flows, initialSearch }: FlowsClientProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [searchValue, setSearchValue] = useState(initialSearch);
    const [selectedFlowId, setSelectedFlowId] = useState<string | undefined>();
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Get unique flow names for the search suggestions
    const suggestions = useMemo(() => {
        return Array.from(new Set(flows.map((flow) => flow.name)));
    }, [flows]);

    // Handle Search via URL (Triggering a server refetch)
    const handleSearch = (value: string) => {
        setSearchValue(value);
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set('q', value);
        } else {
            params.delete('q');
        }
        // Updates URL, which causes Next.js to re-run the server component seamlessly
        router.push(`${pathname}?${params.toString()}`);
    };

    const handleDeleteFlow = async (flowId: string) => {
        setIsDeleting(true);
        const result = await deleteFlowAction(flowId);

        if (result.error) {
            alert(result.error); // In production, use a toast notification here
        } else {
            setSelectedFlowId(undefined);
        }
        setIsDeleting(false);
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.pageTitle}>Learning Paths</h1>

            <SearchBar
                inputValue={searchValue}
                setInputValue={handleSearch}
                items={suggestions}
                placeholder="Search learning paths..."
            />

            <div className={styles.contentArea}>
                {flows.length ? (
                    <div className={styles.flowGrid}>
                        {flows.map((flow) => (
                            <FlowCard
                                key={flow.id}
                                flow={flow}
                                setSelected={setSelectedFlowId}
                            />
                        ))}
                    </div>
                ) : (
                    <div className={styles.emptyState}>
                        <h2>You have 0 Learning paths available!</h2>
                        <p>Create one with the + button</p>
                    </div>
                )}

                <button
                    className={styles.fab}
                    onClick={() => setIsCreateOpen(true)}
                    title="Create Flow"
                    aria-label="Create Flow"
                >
                    <img
                        src={createIcon.src}
                        alt="Create Flow icon"
                        className={styles.fabIcon}
                    />
                </button>
            </div>

            <CreateFlowModal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
            />

            {selectedFlowId && (
                <ConfirmModal
                    isOpen={!!selectedFlowId}
                    onClose={() => setSelectedFlowId(undefined)}
                    onConfirm={async () => {
                        if (selectedFlowId) await handleDeleteFlow(selectedFlowId);
                    }}
                    isProcessing={isDeleting}
                    title="Delete Learning Path"
                    message={<>Are you sure? <br /> This action is irreversible!</>}
                    confirmText="Delete"
                    processingText="Deleting..."
                />
            )}
        </div>
    );
}