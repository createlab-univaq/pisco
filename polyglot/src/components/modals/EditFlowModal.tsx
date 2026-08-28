'use client';

import { useEffect, useState } from 'react';
import styles from './EditFlowModal.module.css';
import { PolyglotFlowInfo } from '@/types/PolyglotFlowInfo';
import { PolyglotFlow } from '@/types/PolyglotFlow';

type EditFlowModalProps = {
    isOpen: boolean;
    onClose: () => void;
    flow: PolyglotFlow;
    updateInfo: (flowInfo: PolyglotFlowInfo) => void;
};

// SVGs replacing Chakra Icons
const CloseIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const AddIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
);

const CheckIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
    </svg>
);

const EditFlowModal = ({
    isOpen,
    onClose,
    flow,
    updateInfo,
}: EditFlowModalProps) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [tagName, setTagName] = useState('');
    const [publish, setPublish] = useState(false);


    useEffect(() => {
        if (!flow || !isOpen) return;
        setTitle(flow.title ?? '');
        setDescription(flow.description ?? '');
        setPublish(!!flow.publish);
        setTagName('');
    }, [flow, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (!title.trim() || !description.trim()) return;

        updateInfo({
            title: title.trim(),
            description: description.trim(),
            publish,
        });

        onClose();
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal} onMouseDown={(e) => e.stopPropagation()}>

                <div className={styles.header}>
                    <span>Edit Flow</span>
                    <button className={styles.closeIconBtn} onClick={onClose}>
                        <CloseIcon className={styles.icon} />
                    </button>
                </div>

                <div className={styles.body}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Title:</label>
                        <input
                            className={styles.input}
                            placeholder="Insert title..."
                            value={title}
                            onChange={(e) => setTitle(e.currentTarget.value)}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Description:</label>
                        <textarea
                            className={styles.textarea}
                            placeholder="Insert description..."
                            value={description}
                            onChange={(e) => setDescription(e.currentTarget.value)}
                        />
                    </div>

                </div>

                <div className={styles.footer}>
                    {/* Moved Publish toggle into the footer for cleaner layout than absolute positioning */}
                    <div className={styles.publishWrapper}>
                        {publish ? 'Published' : 'Not published'}:{' '}
                        <button
                            className={`${styles.publishBtn} ${publish ? styles.publishBtnOn : styles.publishBtnOff}`}
                            onClick={() => setPublish((p) => !p)}
                            title="Toggle publish"
                            type="button"
                        >
                            {publish ? <CheckIcon className={styles.iconSmall} /> : <CloseIcon className={styles.iconSmall} />}
                        </button>
                    </div>

                    <button className={styles.submitBtn} onClick={handleSubmit}>
                        Update
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditFlowModal;