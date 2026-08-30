'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import FlowEditor from '@/components/editor/FlowEditor';
import { getFlowAction, saveFlowAction } from '@/lib/actions/flows';
import { PolyglotFlow } from '@/types/PolyglotFlow';
import styles from './FlowEditorClient.module.css';

type ToastType = {
    id: number;
    title: string;
    description: string;
    status: 'success' | 'warning' | 'error';
};

type FlowEditorClientProps = {
    flowId: string;
};

export default function FlowEditorClient({ flowId }: FlowEditorClientProps) {
    const router = useRouter();

    const [flow, setFlow] = useState<PolyglotFlow | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Custom Toast State
    const [toasts, setToasts] = useState<ToastType[]>([]);

    const showToast = (title: string, description: string, status: 'success' | 'warning' | 'error') => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, title, description, status }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 4000);
    };

    // Flow Fetching & Rescue Logic
    useEffect(() => {
        if (!flowId) return;

        const loadFlowData = async () => {
            setLoading(true);
            setError(null);

            // 1. Check for a rescued/unsaved flow in local storage
            const rescueKey = `rescue_flow_${flowId}`;
            const rescuedFlowStr = typeof window !== 'undefined' ? localStorage.getItem(rescueKey) : null;

            if (rescuedFlowStr) {
                try {
                    const parsedRescue = JSON.parse(rescuedFlowStr);
                    setFlow(parsedRescue);
                    setLoading(false);
                    showToast('Draft Recovered', 'Loaded your unsaved changes.', 'warning');
                    return;
                } catch (e) {
                    console.warn('Failed to parse rescued flow', e);
                    localStorage.removeItem(rescueKey);
                }
            }

            // 2. Otherwise, load from server via Server Action
            try {
                const result = await getFlowAction(flowId);

                if (result.error) {
                    if (result.status === 404) {
                        setError('Flow not found');
                    } else {
                        setError('Error loading flow elements');
                    }
                } else if (result.data) {
                    // Set ONLY the flowJson attribute of the response as requested
                    setFlow(result.data.flowJson);
                }
            } catch (err: any) {
                console.error(err);
                setError('Error loading flow elements');
            } finally {
                setLoading(false);
            }
        };

        loadFlowData();
    }, [flowId]);

    // Save Logic via Server Action
    const handleSaveFlow = async (updatedFlow: PolyglotFlow, outputToast = true, returnPath?: string) => {
        try {
            const result = await saveFlowAction(flowId, updatedFlow);

            if (result.success && result.data) {
                localStorage.removeItem(`rescue_flow_${flowId}`);
                // Update state with the returned flowJson
                setFlow(result.data.flowJson);

                if (outputToast) {
                    showToast('Flow saved', 'The save was successful', 'success');
                }
                if (returnPath) router.push(returnPath);
            } else {
                if (outputToast) {
                    showToast('Internal Error', 'Unexpected error, try again. ' + (result.error || ''), 'error');
                }
            }
        } catch (err: any) {
            if (outputToast) {
                showToast('Internal Error', 'Unexpected error, try again. ' + err.message, 'error');
            }
        }
    };

    return (
        <>
            {/* Toast Container */}
            <div className={styles.toastContainer}>
                {toasts.map((t) => (
                    <div
                        key={t.id}
                        className={`${styles.toast} ${t.status === 'success'
                            ? styles.toastSuccess
                            : t.status === 'warning'
                                ? styles.toastWarning
                                : styles.toastError
                            }`}
                    >
                        <div className={styles.toastTitle}>{t.title}</div>
                        <div className={styles.toastDesc}>{t.description}</div>
                    </div>
                ))}
            </div>

            {/* Editor rendered only when data is ready */}
            {!loading && flow && (
                <FlowEditor
                    mode="write"
                    initialFlow={flow}
                    saveFlow={(updated) => handleSaveFlow(updated)}
                />
            )}

            {/* Error Modal */}
            {error !== null && (
                <div className={styles.overlay}>
                    <div className={styles.modal}>
                        <div className={styles.modalHeader}>Error:</div>
                        <div className={styles.modalBody}>{error}</div>
                        <div className={styles.modalFooter}>
                            <button className={styles.btnDanger} onClick={() => router.refresh()}>
                                Refresh page
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Loading Modal */}
            {loading && (
                <div className={styles.overlay}>
                    <div className={styles.modal} style={{ maxWidth: 'fit-content' }}>
                        <div className={styles.modalBody}>
                            <div className={styles.spinnerWrapper}>
                                <div className={styles.spinner}></div>
                                <div className={styles.loadingText}>Loading flow...</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}