'use client';

import { useState } from 'react';
import { deleteImageAction } from '@/lib/actions/images';
import styles from './TheoryOfMindExerciseANodeProperties.module.css';
import { PolyglotNodePropertiesProps } from '@/types/ElementMappingTypes';
import NodeProperties from '../NodeProperties';
import { TheoryOfMindExerciseANode, TheoryOfMindExerciseAItem } from './types';
import { useNodeSync } from '@/hooks/useNodeSync';
import { ItemEditor, createDefaultQuestions } from './components/ItemEditor';
import { validateTheoryOfMindExerciseANode } from './validate';

const newId = (prefix: string) =>
    globalThis.crypto?.randomUUID?.() ??
    `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;

const AddIcon = () => (
    <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
);

const TheoryOfMindExerciseANodeProperties = ({ element, onUpdateElement }: PolyglotNodePropertiesProps) => {
    const [deletingIndex, setDeletingIndex] = useState<number | null>(null);

    const node = element as TheoryOfMindExerciseANode;
    const data = node.data || {};
    const quizItems = data.quiz || [];
    const nodeId = node._id;

    const { handleBaseChange, handleDataChange } = useNodeSync(node, onUpdateElement);

    const validationErrors = validateTheoryOfMindExerciseANode(data);

    const handleQuizChange = (newQuiz: TheoryOfMindExerciseAItem[]) => {
        handleDataChange({ quiz: newQuiz });
    };

    const handleAddItem = () => {
        handleQuizChange([
            ...quizItems,
            {
                qid: newId('qid'),
                imageId: undefined,
                caption: '',
                questions: createDefaultQuestions(),
            }
        ]);
    };

    const handleUpdateItem = (index: number, updatedItem: TheoryOfMindExerciseAItem) => {
        const updatedQuiz = [...quizItems];
        updatedQuiz[index] = updatedItem;
        handleQuizChange(updatedQuiz);
    };

    const handleRemoveItem = async (index: number) => {
        const itemToDelete = quizItems[index];
        const imageIdToDelete = itemToDelete?.imageId;

        setDeletingIndex(index);

        if (imageIdToDelete) {
            try {
                await deleteImageAction(imageIdToDelete);
            } catch (e) {
                console.error('Delete image failed', e);
                window.alert('Immagine non eliminata: Non sono riuscito a eliminare l’immagine associata. Riprova più tardi.');
                setDeletingIndex(null);
                return;
            }
        }

        handleQuizChange(quizItems.filter((_, i) => i !== index));
        setDeletingIndex(null);
    };

    return (
        <div className={styles.container}>
            <NodeProperties
                activityDescription="Crea elementi visivi con didascalia ed esattamente 2 quesiti a risposta Sì/No con spiegazione."
                title={node.title}
                description={node.description}
                onUpdateTitle={(val) => handleBaseChange({ title: val })}
                onUpdateDescription={(val) => handleBaseChange({ description: val })}
            />

            <hr className={styles.divider} />

            {validationErrors.length > 0 && (
                <div style={{ padding: '0 0.5rem', marginBottom: '0.5rem', color: '#e53e3e', fontSize: '0.875rem' }}>
                    <strong>Validation Errors:</strong>
                    <ul style={{ margin: '4px 0 0 16px', padding: 0 }}>
                        {validationErrors.map((err, idx) => (
                            <li key={idx}>[{err.path}]: {err.message}</li>
                        ))}
                    </ul>
                </div>
            )}

            <div className={styles.headerFlex}>
                <h3 className={styles.sectionTitle}>Elementi Teoria della Mente</h3>
                <button type="button" className={styles.addBtn} onClick={handleAddItem}>
                    <AddIcon />
                    <span>Aggiungi elemento</span>
                </button>
            </div>

            {/* Root Empty State Feedback */}
            {quizItems.length === 0 && (
                <div className={styles.emptyState}>
                    <p className={styles.emptyText}>
                        Nessun elemento ancora. Clicca <b>Aggiungi elemento</b> per iniziare.
                    </p>
                </div>
            )}

            <div className={styles.storiesList}>
                {quizItems.map((item, i) => (
                    <ItemEditor
                        key={item.qid || i}
                        item={item}
                        index={i}
                        nodeId={nodeId}
                        isDeleting={deletingIndex === i}
                        onChange={(updated) => handleUpdateItem(i, updated)}
                        onRemove={() => handleRemoveItem(i)}
                    />
                ))}
            </div>

            {/* Root Bottom Action Button (Dual-Placement Standard) */}
            {quizItems.length > 0 && (
                <button
                    type="button"
                    className={`${styles.addBtn} ${styles.fullWidthBtn}`}
                    onClick={handleAddItem}
                >
                    <AddIcon />
                    <span>Aggiungi elemento</span>
                </button>
            )}
        </div>
    );
};

export default TheoryOfMindExerciseANodeProperties;