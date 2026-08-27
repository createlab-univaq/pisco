'use client';

import { useState } from 'react';
import { FilesAPI } from '@/data/api';
import styles from './EyesTaskNodeProperties.module.css';
import { PolyglotNodePropertiesProps } from '@/types/polyglot-elements/ElementMappingTypes';
import { EyesTaskNode, EyesTaskQuestion } from './types';
import NodeProperties from '../NodeProperties';
import SingleSelectAnswersField from '@/components/forms/SingleSelectAnswersField';
import QuestionImageUploadField from '@/components/forms/QuestionImageUploadField';
import { useNodeSync } from '@/hooks/useNodeSync';

const newId = (prefix: string) =>
    globalThis.crypto?.randomUUID?.() ??
    `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;

// Reusable SVGs replacing Chakra Icons
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

const EyesTaskNodeProperties = ({ element, onUpdateElement }: PolyglotNodePropertiesProps) => {
    const [isDeleting, setIsDeleting] = useState<number | null>(null);

    // Cast to specific node type
    const node = element as EyesTaskNode;
    const data = node.data || {};
    const questions = data.questions || [];
    const nodeId = node._id;

    const { handleBaseChange, handleDataChange } = useNodeSync(node, onUpdateElement);

    const handleAddQuestion = () => {
        handleDataChange({
            questions: [
                ...questions,
                {
                    qid: newId('q'),
                    imageId: undefined,
                    answers: ['', ''],
                    correctIndex: 0,
                },
            ],
        });
    };

    const handleRemoveQuestion = async (index: number) => {
        const questionToDelete = questions[index];
        const imageIdToDelete = questionToDelete?.imageId;

        setIsDeleting(index);

        // Se c'è un'immagine, prova a cancellarla prima
        if (imageIdToDelete) {
            try {
                // UPDATED: Now calling the refactored FilesAPI.delete
                await FilesAPI.delete(imageIdToDelete);
            } catch (e) {
                console.error('Delete image failed', e);
                window.alert('Immagine non eliminata: Non sono riuscito a eliminare l’immagine associata. Riprova o elimina più tardi.');
                setIsDeleting(null);
                // Non rimuovo il quesito per non perdere il riferimento
                return;
            }
        }

        // Delete ok (o nessuna immagine) → rimuovo il quesito
        handleDataChange({
            questions: questions.filter((_, i) => i !== index),
        });

        setIsDeleting(null);
    };

    const handleUpdateQuestion = (index: number, field: keyof EyesTaskQuestion, value: any) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index] = {
            ...updatedQuestions[index],
            [field]: value,
        };
        handleDataChange({ questions: updatedQuestions });
    };

    return (
        <div className={styles.container}>
            <NodeProperties
                activityDescription="Crea una lista di quesiti con un’immagine per ciascuno. Ogni quesito ha più risposte: seleziona quella corretta."
                title={node.title}
                description={node.description}
                onUpdateTitle={(val) => handleBaseChange({ title: val })}
                onUpdateDescription={(val) => handleBaseChange({ description: val })}
            />

            <hr className={styles.divider} />

            <div className={styles.headerFlex}>
                <h3 className={styles.sectionTitle}>Quesiti</h3>
                <button type="button" className={styles.addBtn} onClick={handleAddQuestion}>
                    <AddIcon />
                    <span>Aggiungi quesito</span>
                </button>
            </div>

            {questions.length === 0 && (
                <div className={styles.emptyState}>
                    <p className={styles.emptyText}>
                        Nessun quesito ancora. Clicca <b>Aggiungi quesito</b> per iniziare.
                    </p>
                </div>
            )}

            <div className={styles.questionsList}>
                {questions.map((q, index) => (
                    <div key={q.qid || index} className={styles.questionCard}>
                        <div className={styles.cardHeader}>
                            <h4 className={styles.cardTitle}>Quesito #{index + 1}</h4>

                            <button
                                type="button"
                                className={styles.removeBtn}
                                onClick={() => handleRemoveQuestion(index)}
                                disabled={isDeleting === index}
                                aria-label="Rimuovi quesito"
                                title="Rimuovi quesito"
                            >
                                {isDeleting === index ? '...' : <CloseIcon />}
                            </button>
                        </div>

                        {nodeId ? (
                            <QuestionImageUploadField
                                parentNodeId={nodeId}
                                imageId={q.imageId}
                                onImageIdChange={(newId: string | undefined) => handleUpdateQuestion(index, 'imageId', newId)}
                            />
                        ) : (
                            <p className={styles.hintText}>
                                Seleziona il nodo per caricare un’immagine.
                            </p>
                        )}

                        <hr className={styles.innerDivider} />

                        <SingleSelectAnswersField
                            label="Risposte (seleziona quella corretta)"
                            answers={q.answers || ['', '']}
                            correctIndex={q.correctIndex || 0}
                            onAnswersChange={(newAnswers: string[]) => handleUpdateQuestion(index, 'answers', newAnswers)}

                            // FIX: Change 'newIndex: number' to 'newIndex: number | null'
                            onCorrectIndexChange={(newIndex: number | null) => handleUpdateQuestion(index, 'correctIndex', newIndex)}

                            minAnswers={2}
                            allowNoCorrect={false}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EyesTaskNodeProperties;