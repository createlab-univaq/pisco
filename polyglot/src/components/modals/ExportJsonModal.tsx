'use client';

import Editor from '@monaco-editor/react';
import styles from './ExportJsonModal.module.css';
import { PolyglotFlow } from '@/types/PolyglotFlow';

export type ExportJsonModalProps = {
    isOpen: boolean;
    onClose: () => void;
    // Replaced custom Nullable<T> with standard TypeScript T | null
    flow: PolyglotFlow | null;
};

// Inline SVG replacing Chakra's ModalCloseButton icon
const CloseIcon = () => (
    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const ExportJsonModal = ({ isOpen, onClose, flow }: ExportJsonModalProps) => {
    if (!isOpen) return null;

    const flowJsonString = JSON.stringify(flow, null, 2);

    // Added actual download functionality
    const handleDownload = () => {
        if (!flowJsonString) return;

        const blob = new Blob([flowJsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `${flow?.title ? flow.title.replace(/\s+/g, '_') : 'flow'}_export.json`;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div className={styles.overlay} onMouseDown={onClose}>
            {/* onMouseDown={...stopPropagation} prevents closing when clicking inside the modal */}
            <div className={styles.modal} onMouseDown={(e) => e.stopPropagation()}>

                <div className={styles.header}>
                    <span>Download JSON flow:</span>
                    <button className={styles.closeBtn} onClick={onClose} aria-label="Close modal">
                        <CloseIcon />
                    </button>
                </div>

                <div className={styles.body}>
                    <Editor
                        height="100%"
                        value={flowJsonString}
                        language="json"
                        options={{
                            readOnly: true, // Prevent accidental edits during export
                            minimap: { enabled: false }
                        }}
                    />
                </div>

                <div className={styles.footer}>
                    <button className={styles.downloadBtn} onClick={handleDownload}>
                        Download
                    </button>
                </div>

            </div>
        </div>
    );
};

export default ExportJsonModal;