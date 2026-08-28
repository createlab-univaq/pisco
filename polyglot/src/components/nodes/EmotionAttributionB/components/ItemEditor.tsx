'use client';

import TextField from '@/components/forms/TextField';
import styles from './ItemEditor.module.css';

const CloseIcon = () => (
    <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

export type EmotionAttributionBItem = {
    qid: string;
    emotion: string;
    scenario: string;
    explanation: string;
};

export type ItemEditorProps = {
    item: EmotionAttributionBItem;
    index: number;
    onChange: (updated: EmotionAttributionBItem) => void;
    onRemove: () => void;
};

export const ItemEditor = ({ item, index, onChange, onRemove }: ItemEditorProps) => {
    return (
        <div className={styles.itemCard}>
            <div className={styles.cardHeader}>
                <span className={styles.cardTitle}>Elemento #{index + 1}</span>
                <button
                    type="button"
                    className={styles.removeBtn}
                    onClick={onRemove}
                    aria-label="Rimuovi elemento"
                    title="Rimuovi elemento"
                >
                    <CloseIcon />
                </button>
            </div>

            <TextField
                label="Emozione"
                name={`items-${index}-emotion`}
                value={item.emotion || ''}
                onChange={(e) => onChange({ ...item, emotion: e.target.value })}
            />

            <TextField
                label="Scenario"
                name={`items-${index}-scenario`}
                value={item.scenario || ''}
                onChange={(e) => onChange({ ...item, scenario: e.target.value })}
                isTextArea
            />

            <hr className={styles.innerDivider} />

            <TextField
                label="Spiegazione dello scenario"
                name={`items-${index}-explanation`}
                value={item.explanation || ''}
                onChange={(e) => onChange({ ...item, explanation: e.target.value })}
                isTextArea
            />
        </div>
    );
};