'use client';

import { useRouter } from 'next/navigation'; // Updated to Next.js App Router
import styles from './SaveFlowModal.module.css';

export type ModaTemplateProps = {
    isOpen: boolean;
    onClose: () => void;
    saveFunc: (outputToast?: boolean, returnPath?: string) => Promise<void>;
};

const SaveFlowModal = ({ isOpen, onClose, saveFunc }: ModaTemplateProps) => {
    const router = useRouter();

    if (!isOpen) return null;

    const handleSave = async () => {
        await saveFunc(false, '/');
        localStorage.removeItem('flow');
    };

    const handleDontSave = () => {
        localStorage.removeItem('flow');
        router.push('/');
    };

    return (
        <div className={styles.overlay} onMouseDown={onClose}>
            <div
                className={styles.modal}
                onMouseDown={(e) => e.stopPropagation()} /* Prevent clicks inside from closing the modal */
            >
                <div className={styles.header}>
                    Do you want to save the current changes?
                </div>

                <div className={styles.body}>
                    <p>Your changes will be lost forever if you don&apos;t save</p>
                </div>

                <div className={styles.footer}>
                    <button className={`${styles.btn} ${styles.btnSave}`} onClick={handleSave}>
                        Save
                    </button>
                    <button className={`${styles.btn} ${styles.btnDanger}`} onClick={handleDontSave}>
                        Don&apos;t save
                    </button>
                    <button className={`${styles.btn} ${styles.btnCancel}`} onClick={onClose}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SaveFlowModal;