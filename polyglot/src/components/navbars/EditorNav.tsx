'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import brandLogo from '@public/solo_logo.png';
import styles from './EditorNav.module.css';
import { validateNodeData } from '@/lib/validation/nodeValidator';
import { validateConditionalEdges } from '@/lib/validation/conditionalEdgeValidator';
import { useToast } from '@/components/providers/ToastProvider';
import ExportJsonModal from '../modals/ExportJsonModal';
import SaveFlowModal from '../modals/SaveFlowModal';
import ViewCodeModal from '../modals/ViewCodeModal';
import FlowSettingsModal from '../modals/FlowSettingsModal';
import { useHasHydrated } from '@/hooks/useHasHydrated';
import { Flow } from '@/types';

const ArrowBackIcon = () => <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>;
const ArrowForwardIcon = () => <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>;
const CopyIcon = () => <svg className={`${styles.icon} ${styles.iconMargin}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>;
const ExternalLinkIcon = () => <svg className={`${styles.icon} ${styles.iconMargin}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>;
const CheckIcon = () => <svg className={styles.iconSmall} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>;
const CloseIcon = () => <svg className={styles.iconSmall} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>;
const CodeIcon = () => <svg className={`${styles.icon} ${styles.iconMargin}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>;
const EditPenIcon = () => <svg className={styles.editPenIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>;
const SettingsIcon = () => <svg className={`${styles.icon} ${styles.iconMargin}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;

export type EditorNavProps = {
    flow: Flow;
    saveFunc: () => Promise<void>;
    onUpdateFlowInfo?: (updates: Partial<Flow>) => void;
    onApplyLocalFlow?: (updates: Partial<Flow>) => void;
    hasUnsavedChanges?: boolean;
    canUndo?: boolean;
    canRedo?: boolean;
    onUndo?: () => void;
    onRedo?: () => void;
    onShowMessage?: (title: string, desc: string, status: 'warning' | 'error' | 'success') => void;
};

export default function EditorNav({
    flow,
    saveFunc,
    onUpdateFlowInfo,
    onApplyLocalFlow,
    hasUnsavedChanges = false,
    canUndo = false,
    canRedo = false,
    onUndo,
    onRedo,
    onShowMessage,
}: EditorNavProps) {
    const hydrated = useHasHydrated();
    const router = useRouter();
    const { showToast } = useToast();

    const [saveLoading, setSaveLoading] = useState(false);
    const [publishLoading, setPublishLoading] = useState(false);
    const [publish, setPublish] = useState(false);

    const [localTitle, setLocalTitle] = useState(flow?.name || '');

    const [isOpenExport, setIsOpenExport] = useState(false);
    const [isOpenSave, setIsOpenSave] = useState(false);
    const [isOpenCode, setIsOpenCode] = useState(false);
    const [isOpenSettings, setIsOpenSettings] = useState(false);

    useEffect(() => {
        if (flow != null) {
            setPublish(flow.published || false);
            setLocalTitle(flow.name || '');
        }
    }, [flow]);

    useEffect(() => {
        const isMac = typeof window !== 'undefined' ? navigator.platform.toUpperCase().indexOf('MAC') >= 0 : false;
        async function onKeyDown(e: KeyboardEvent) {
            if (e.key.toLowerCase() === 's' && (isMac ? e.metaKey : e.ctrlKey)) {
                e.preventDefault();
                setSaveLoading(true);
                await saveFunc();
                setSaveLoading(false);
            }
        }
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [saveFunc]);

    const notify = (title: string, desc: string, status: 'warning' | 'error' | 'success') => {
        showToast(title, desc, status);
        if (onShowMessage) onShowMessage(title, desc, status);
    };

    const handleTitleSubmit = () => {
        if (localTitle.trim() !== '' && localTitle !== (flow?.name || '')) {
            if (onUpdateFlowInfo) {
                onUpdateFlowInfo({ name: localTitle.trim() });
            }
        } else {
            setLocalTitle(flow?.name || '');
        }
    };

    const checkPublish = (): boolean => {
        if (flow == null) return false;

        if (!flow.flowJson.nodes || flow.flowJson.nodes.length === 0) {
            notify('Flow not published', 'Something is off with your flow! Error: no nodes found', 'warning');
            return false;
        }

        let missingData = '';
        if (!flow.description || flow.description.trim() === '') missingData += 'description; ';

        let startingNode = 0;

        for (const node of flow.flowJson.nodes) {
            let infoCheck = true;
            if (!node.description) infoCheck = false;

            const res = validateNodeData(node.type, node.data);
            if (!res.ok) infoCheck = false;

            if (!infoCheck) {
                missingData += node.title + '; ';
                continue;
            }

            const hasIncomingEdge = flow.flowJson.edges.some((edge: any) => edge.reactFlow?.target === node._id);
            if (!hasIncomingEdge) startingNode++;
        }

        // Validate conditional edges universally across all nodes
        const conditionalErrors = validateConditionalEdges(flow.flowJson.nodes, flow.flowJson.edges);
        if (conditionalErrors.length > 0) {
            notify('Flow not published', 'Conditional Edge Error: ' + conditionalErrors[0], 'error');
            return false;
        }

        if (missingData !== '') {
            notify('Flow not published', 'Missing data for: ' + missingData, 'warning');
            return false;
        }

        if (startingNode !== 1) {
            notify('Flow not published', `Detected ${startingNode} starting nodes, exactly 1 must have no incoming edges.`, 'warning');
            return false;
        }

        return true;
    };

    const handlePublishToggle = async () => {
        setPublishLoading(true);
        if (!publish) {
            const isValid = checkPublish();
            setPublish(isValid);
            if (onUpdateFlowInfo) onUpdateFlowInfo({ published: isValid });
        } else {
            setPublish(false);
            if (onUpdateFlowInfo) onUpdateFlowInfo({ published: false });
        }
        setPublishLoading(false);
    };

    return (
        <nav className={styles.nav}>
            <div className={styles.logoWrapper} onClick={() => router.push('/')}>
                <Image
                    src={brandLogo}
                    alt="Polyglot Logo"
                    className={styles.logo}
                    width={30}
                    height={30}
                    priority
                />
            </div>

            <button className={styles.actionBtn} disabled={hydrated ? !canUndo : true} onClick={onUndo} title="Undo">
                <ArrowBackIcon />
            </button>

            <button className={styles.actionBtn} disabled={hydrated ? !canRedo : true} onClick={onRedo} title="Redo">
                <ArrowForwardIcon />
            </button>

            <div className={styles.titleContainer}>
                <input
                    className={styles.titleInput}
                    value={localTitle}
                    onChange={(e) => setLocalTitle(e.target.value)}
                    onBlur={handleTitleSubmit}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.currentTarget.blur();
                        }
                    }}
                    title="Rename flow"
                    placeholder="Untitled Flow"
                />
                <EditPenIcon />
            </div>

            <div className={styles.spacer} />

            <button
                className={styles.textBtn}
                onClick={() => setIsOpenSettings(true)}
            >
                <SettingsIcon /> Settings
            </button>

            <button
                className={styles.textBtn}
                disabled={hydrated ? (!hasUnsavedChanges || saveLoading) : true}
                onClick={async () => {
                    setSaveLoading(true);
                    await saveFunc();
                    setSaveLoading(false);
                }}
                title="Save Flow (Ctrl+S)"
            >
                <CopyIcon /> Save
            </button>

            <button
                className={styles.textBtn}
                onClick={() => setIsOpenCode(true)}
            >
                <CodeIcon /> View Code
            </button>

            <button
                className={styles.textBtn}
                onClick={() => setIsOpenExport(true)}
            >
                <ExternalLinkIcon /> Export JSON
            </button>

            <button
                className={`${styles.publishBtn} ${publish ? styles.publishBtnOn : styles.publishBtnOff}`}
                onClick={handlePublishToggle}
                disabled={publishLoading}
                aria-label="Toggle publish status"
            >
                {publish ? <CheckIcon /> : <CloseIcon />}
                {publish ? 'Published' : 'Publish'}
            </button>

            <ExportJsonModal isOpen={isOpenExport} onClose={() => setIsOpenExport(false)} flow={flow} />
            <SaveFlowModal
                isOpen={isOpenSave}
                onClose={() => setIsOpenSave(false)}
                saveFunc={saveFunc}
            />
            <ViewCodeModal
                isOpen={isOpenCode}
                onClose={() => setIsOpenCode(false)}
                flow={flow}
                onApplyChanges={(updatedFlow) => {
                    if (onApplyLocalFlow) onApplyLocalFlow(updatedFlow);
                }}
            />
            <FlowSettingsModal
                isOpen={isOpenSettings}
                onClose={() => setIsOpenSettings(false)}
                flow={flow}
                onUpdateFlowInfo={onUpdateFlowInfo}
            />
        </nav>
    );
}