'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation'; // Updated for Next.js App Router
import { ReactNode, useEffect, useState } from 'react';
import brandLogo from '@public/solo_logo.png';
import styles from './EditorNav.module.css';
import { validateNodeData } from '@/lib/validation/nodeValidator';
import { useHasHydrated } from '@/utils/utils';
import ExportJsonModal from '../modals/ExportJsonModal';
import EditFlowModal from '../modals/EditFlowModal';
import SaveFlowModal from '../modals/SaveFlowModal';

// ---------------------------------------------------------------------------
// INLINE SVGS (Replacing Chakra Icons)
// ---------------------------------------------------------------------------
const ArrowBackIcon = () => <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>;
const ArrowForwardIcon = () => <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>;
const CopyIcon = () => <svg className={`${styles.icon} ${styles.iconMargin}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>;
const ExternalLinkIcon = () => <svg className={`${styles.icon} ${styles.iconMargin}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>;
const EditIcon = () => <svg className={`${styles.icon} ${styles.iconMargin}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>;
const CheckIcon = () => <svg className={styles.iconSmall} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>;
const CloseIcon = () => <svg className={styles.iconSmall} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>;

// ---------------------------------------------------------------------------
// COMPONENT PROPS (Replaces global store)
// ---------------------------------------------------------------------------
export type EditorNavProps = {
    flow?: any; // Pass the active flow object from FlowEditor
    saveFunc: () => Promise<void>;
    onUpdateFlowInfo?: (updates: any) => void;
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
    hasUnsavedChanges = false,
    canUndo = false,
    canRedo = false,
    onUndo,
    onRedo,
    onShowMessage,
}: EditorNavProps) {
    const hydrated = useHasHydrated();
    const router = useRouter();

    const [saveLoading, setSaveLoading] = useState(false);
    const [publishLoading, setPublishLoading] = useState(false);
    const [publish, setPublish] = useState(false);

    // Modals state
    const [isOpenExport, setIsOpenExport] = useState(false);
    const [isOpenEdit, setIsOpenEdit] = useState(false);
    const [isOpenSave, setIsOpenSave] = useState(false);

    useEffect(() => {
        if (flow != null) setPublish(flow.publish);
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
        if (onShowMessage) onShowMessage(title, desc, status);
        else alert(`${title}: ${desc}`);
    };

    const checkPublish = (): boolean => {
        if (flow == null) return false;

        if (!flow.nodes || flow.nodes.length === 0) {
            notify('Flow not published', 'Something is off with your flow! Error: no nodes found', 'warning');
            return false;
        }

        let missingData = '';
        if (!flow.description || flow.description.trim() === '') missingData += 'description; ';

        let startingNode = 0;

        for (const node of flow.nodes) {
            let infoCheck = true;

            if (!node.description) infoCheck = false;

            const res = validateNodeData(node.type, node.data);
            if (!res.ok) infoCheck = false;

            if (!infoCheck) {
                missingData += node.title + '; ';
                continue;
            }

            const hasIncomingEdge = flow.edges.some((edge: any) => edge.reactFlow?.target === node._id);
            if (!hasIncomingEdge) startingNode++;
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
            if (onUpdateFlowInfo) onUpdateFlowInfo({ publish: isValid });
        } else {
            setPublish(false);
            if (onUpdateFlowInfo) onUpdateFlowInfo({ publish: false });
        }
        setPublishLoading(false);
    };

    const handleLeaveEditor = async () => {
        if (hasUnsavedChanges) {
            setIsOpenSave(true);
        } else {
            localStorage.removeItem('flow');
            router.push('/flows');
        }
    };

    return (
        <nav className={styles.nav}>
            <Image
                src={brandLogo}
                alt="Polyglot Logo"
                className={styles.logo}
                onClick={() => router.push('/flows')}
            />

            <button className={styles.actionBtn} disabled={hydrated ? !canUndo : true} onClick={onUndo} title="Undo">
                <ArrowBackIcon />
            </button>

            <button className={styles.actionBtn} disabled={hydrated ? !canRedo : true} onClick={onRedo} title="Redo">
                <ArrowForwardIcon />
            </button>

            <button
                className={styles.actionBtn}
                disabled={hydrated ? !hasUnsavedChanges : true}
                onClick={async () => {
                    setSaveLoading(true);
                    await saveFunc();
                    setSaveLoading(false);
                }}
                title="Save"
            >
                <CopyIcon />
            </button>

            <DropDown
                name="File"
                options={[
                    {
                        name: 'Save',
                        shortcut: 'Ctrl+S',
                        icon: <CopyIcon />,
                        onClick: async () => {
                            setSaveLoading(true);
                            await saveFunc();
                            setSaveLoading(false);
                        },
                    },
                    {
                        name: 'Export JSON',
                        icon: <ExternalLinkIcon />,
                        onClick: () => setIsOpenExport(true),
                    },
                ]}
            />

            <DropDown
                name="Project"
                options={[
                    {
                        name: 'Edit Flow',
                        icon: <EditIcon />,
                        onClick: () => setIsOpenEdit(true),
                    },
                ]}
            />

            <div className={styles.publishBadge}>
                <strong>{publish ? 'Published' : 'Not published'}</strong>
                <button
                    className={`${styles.publishBtn} ${publish ? styles.publishBtnOn : styles.publishBtnOff}`}
                    onClick={handlePublishToggle}
                    disabled={publishLoading}
                    aria-label="Toggle publish status"
                >
                    {publish ? <CheckIcon /> : <CloseIcon />}
                </button>
            </div>

            <div className={styles.spacer} />

            <button className={styles.leaveBtn} onClick={handleLeaveEditor}>
                <CloseIcon />
                Leave editor
            </button>

            {/* Modals (assuming they've been refactored or accept standard isOpen/onClose props) */}
            <ExportJsonModal isOpen={isOpenExport} onClose={() => setIsOpenExport(false)} flow={flow} />
            {flow && (
                <EditFlowModal
                    isOpen={isOpenEdit}
                    onClose={() => setIsOpenEdit(false)}
                    flow={flow}
                    updateInfo={onUpdateFlowInfo ?? (() => { })}
                />
            )}
            <SaveFlowModal
                isOpen={isOpenSave}
                onClose={() => setIsOpenSave(false)}
                saveFunc={saveFunc}
            />
        </nav>
    );
}

// ---------------------------------------------------------------------------
// CUSTOM DROPDOWN COMPONENT
// ---------------------------------------------------------------------------
const DropDown = ({
    name,
    options,
}: {
    name: string;
    options: {
        name: string;
        shortcut?: string;
        icon?: ReactNode;
        onClick?: () => void;
    }[];
}) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={styles.dropdownWrapper}>
            {isOpen && (
                <div className={styles.dropdownBackdrop} onClick={() => setIsOpen(false)} />
            )}
            <button
                className={`${styles.dropdownBtn} ${isOpen ? styles.dropdownBtnActive : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                {name}
            </button>

            {isOpen && (
                <div className={styles.dropdownMenu}>
                    {options.map((val, id) => (
                        <button
                            key={id}
                            className={styles.dropdownItem}
                            onClick={() => {
                                val.onClick?.();
                                setIsOpen(false);
                            }}
                        >
                            {val.icon}
                            <span className={styles.dropdownItemText}>{val.name}</span>
                            {val.shortcut && <span className={styles.dropdownItemShortcut}>{val.shortcut}</span>}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};