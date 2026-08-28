'use client';

import styles from './ItemEditor.module.css';
import { SocialSituationItem, SocialSituationSection } from '../types';
import { SectionEditor } from './SectionEditor';

const AddIcon = () => (
    <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
);

const CloseIcon = () => (
    <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

export type ItemEditorProps = {
    item: SocialSituationItem;
    itemIndex: number;
    onChange: (updatedItem: SocialSituationItem) => void;
    onRemoveItem: () => void;
};

export const ItemEditor = ({ item, itemIndex, onChange, onRemoveItem }: ItemEditorProps) => {
    const sections = item.sections || [];

    const handleUpdateSection = (index: number, updatedSection: SocialSituationSection) => {
        const updatedSections = [...sections];
        updatedSections[index] = updatedSection;
        onChange({ ...item, sections: updatedSections });
    };

    const handleRemoveSection = (index: number) => {
        onChange({ ...item, sections: sections.filter((_, i) => i !== index) });
    };

    const handleAddSection = () => {
        onChange({
            ...item,
            sections: [
                ...sections,
                {
                    before: '',
                    bold: '',
                    after: '',
                    answers: [{ text: '', score: 0 }],
                    correctIndexes: [],
                }
            ]
        });
    };

    return (
        <div className={styles.itemCard}>
            <div className={styles.cardHeader}>
                <h4 className={styles.itemTitle}>Quesito #{itemIndex + 1}</h4>
                <button type="button" className={styles.removeBtnMedium} onClick={onRemoveItem}>
                    <CloseIcon />
                    <span>Rimuovi quesito</span>
                </button>
            </div>

            <div className={styles.subHeaderFlex}>
                <h5 className={styles.cardTitle}>Sezioni</h5>
                <button type="button" className={styles.addBtnSmall} onClick={handleAddSection}>
                    <AddIcon />
                    <span>Aggiungi sezione</span>
                </button>
            </div>

            {/* Sections Empty State */}
            {sections.length === 0 && (
                <div className={styles.emptyState}>
                    <p className={styles.emptyText}>
                        Nessuna sezione presente. Clicca <b>Aggiungi sezione</b> per iniziare.
                    </p>
                </div>
            )}

            <div className={styles.sectionsList}>
                {sections.map((s, sectionIndex) => (
                    <SectionEditor
                        key={sectionIndex}
                        section={s}
                        sectionIndex={sectionIndex}
                        onChange={(updated) => handleUpdateSection(sectionIndex, updated)}
                        onRemoveSection={() => handleRemoveSection(sectionIndex)}
                    />
                ))}
            </div>

            {/* Sections Dual-Placement Action Button */}
            {sections.length > 0 && (
                <button
                    type="button"
                    className={`${styles.addBtnSmall} ${styles.fullWidthBtn}`}
                    onClick={handleAddSection}
                >
                    <AddIcon />
                    <span>Aggiungi sezione</span>
                </button>
            )}
        </div>
    );
};