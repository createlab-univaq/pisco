'use client';

import styles from './FauxPasNodeProperties.module.css';
import { PolyglotNodePropertiesProps } from '@/types/polyglot-elements/ElementMappingTypes';
import { FauxPasNode, FauxPasQuizItem } from './types';
import NodeProperties from '../NodeProperties';
import { useNodeSync } from '@/hooks/useNodeSync';
import { StoryEditor } from './components/StoryEditor';

const newId = (prefix: string) =>
    globalThis.crypto?.randomUUID?.() ??
    `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;

const AddIcon = () => (
    <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
);

const FauxPasNodeProperties = ({ element, onUpdateElement }: PolyglotNodePropertiesProps) => {
    const node = element as FauxPasNode;
    const data = node.data || {};
    const quizItems = data.quiz || [];

    const { handleBaseChange } = useNodeSync(node, onUpdateElement);

    const handleQuizChange = (newQuiz: FauxPasQuizItem[]) => {
        onUpdateElement({ ...node, data: { ...node.data, quiz: newQuiz } });
    };

    const handleAddStory = () => {
        handleQuizChange([
            ...quizItems,
            { qid: newId('qid'), narration: '', questions: [] }
        ]);
    };

    const handleUpdateStory = (index: number, updatedStory: FauxPasQuizItem) => {
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
                activityDescription="Esercitazione Faux Pas: crea storie e relative domande per testare il riconoscimento delle gaffe sociali."
                title={node.title}
                description={node.description}
                onUpdateTitle={(val) => handleBaseChange({ title: val })}
                onUpdateDescription={(val) => handleBaseChange({ description: val })}
            />

            <hr className={styles.divider} />

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

export default FauxPasNodeProperties;