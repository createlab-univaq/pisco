'use client';

import styles from './TheoryOfMindNodeProperties.module.css';
import { PolyglotNodePropertiesProps } from '@/types/ElementMappingTypes';
import NodeProperties from '../NodeProperties';
import { TheoryOfMindNode, TheoryOfMindQuizItem } from './types';
import { useNodeSync } from '@/hooks/useNodeSync';
import { StoryEditor } from './components/StoryEditor';
import { validateTheoryOfMindNode } from './validate';

const newId = (prefix: string) =>
    globalThis.crypto?.randomUUID?.() ??
    `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;

const AddIcon = () => (
    <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
);

const TheoryOfMindNodeProperties = ({ element, onUpdateElement }: PolyglotNodePropertiesProps) => {
    const node = element as TheoryOfMindNode;
    const data = node.data || {};
    const quizItems = data.quiz || [];

    const { handleBaseChange } = useNodeSync(node, onUpdateElement);

    const validationErrors = validateTheoryOfMindNode(data);

    const getFieldError = (path: string) => validationErrors.find((e) => e.path === path)?.message;

    const handleQuizChange = (newQuiz: TheoryOfMindQuizItem[]) => {
        onUpdateElement({ ...node, data: { ...(node.data || {}), quiz: newQuiz } });
    };

    const handleAddStory = () => {
        handleQuizChange([
            ...quizItems,
            { qid: newId('qid'), narration: '', questions: [] }
        ]);
    };

    const handleUpdateStory = (index: number, updatedStory: TheoryOfMindQuizItem) => {
        const updatedQuiz = [...quizItems];
        updatedQuiz[index] = updatedStory;
        handleQuizChange(updatedQuiz);
    };

    const handleRemoveStory = (index: number) => {
        handleQuizChange(quizItems.filter((_, i) => i !== index));
    };

    return (
        <div className={styles.container}>
            <NodeProperties
                title={node.title}
                description={node.description}
                onUpdateTitle={(val) => handleBaseChange({ title: val })}
                onUpdateDescription={(val) => handleBaseChange({ description: val })}
                activityDescription="Theory of Mind: crea storie e relative domande per testare la comprensione delle intenzioni altrui."
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
                <h3 className={styles.sectionTitle}>Stories</h3>
                <button type="button" className={styles.addBtnPrimary} onClick={handleAddStory}>
                    <AddIcon />
                    <span>Add story</span>
                </button>
            </div>

            {/* Root Empty State Feedback */}
            {quizItems.length === 0 && (
                <div className={styles.emptyState}>
                    <p className={styles.emptyText}>
                        Nessuna storia ancora. Clicca <b>Add story</b> per iniziare.
                    </p>
                </div>
            )}

            <div className={styles.storiesList}>
                {quizItems.map((story, i) => (
                    <StoryEditor
                        key={story.qid || i}
                        story={story}
                        index={i}
                        onChange={(updated) => handleUpdateStory(i, updated)}
                        onRemove={() => handleRemoveStory(i)}
                        getFieldError={getFieldError}
                    />
                ))}
            </div>

            {/* Root Bottom Action Button (Dual-Placement Standard) */}
            {quizItems.length > 0 && (
                <button
                    type="button"
                    className={`${styles.addBtnPrimary} ${styles.fullWidthBtn}`}
                    onClick={handleAddStory}
                >
                    <AddIcon />
                    <span>Add story</span>
                </button>
            )}
        </div>
    );
};

export default TheoryOfMindNodeProperties;