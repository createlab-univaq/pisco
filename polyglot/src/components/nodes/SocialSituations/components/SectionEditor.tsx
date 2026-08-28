'use client';

import TextField from '@/components/forms/TextField';
import MultiSelectAnswersField from '@/components/forms/MultiSelectAnswersField';
import styles from './SectionEditor.module.css';
import { SocialSituationSection } from '../types';

const CloseIcon = () => (
    <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

export type SectionEditorProps = {
    section: SocialSituationSection;
    sectionIndex: number;
    onChange: (updatedSection: SocialSituationSection) => void;
    onRemoveSection: () => void;
};

export const SectionEditor = ({ section, sectionIndex, onChange, onRemoveSection }: SectionEditorProps) => {
    return (
        <div className={styles.sectionCard}>
            <div className={styles.cardHeader}>
                <h5 className={styles.cardTitle}>Sezione #{sectionIndex + 1}</h5>
                <button type="button" className={styles.removeBtnSmall} onClick={onRemoveSection}>
                    <CloseIcon />
                    <span>Rimuovi sezione</span>
                </button>
            </div>

            <TextField
                label="Testo iniziale"
                name={`section-${sectionIndex}-before`}
                value={section.before || ''}
                onChange={(e) => onChange({ ...section, before: e.target.value })}
                isTextArea
            />
            <TextField
                label="Parte in grassetto"
                name={`section-${sectionIndex}-bold`}
                value={section.bold || ''}
                onChange={(e) => onChange({ ...section, bold: e.target.value })}
            />
            <TextField
                label="Testo finale"
                name={`section-${sectionIndex}-after`}
                value={section.after || ''}
                onChange={(e) => onChange({ ...section, after: e.target.value })}
                isTextArea
            />

            <hr className={styles.innerDivider} />

            <MultiSelectAnswersField
                label="Risposte"
                answers={section.answers || []}
                correctIndexes={section.correctIndexes || []}
                onAnswersChange={(newAnswers: any) => onChange({ ...section, answers: newAnswers })}
                onCorrectIndexesChange={(newIndexes: number[]) => onChange({ ...section, correctIndexes: newIndexes })}
            />
        </div>
    );
};