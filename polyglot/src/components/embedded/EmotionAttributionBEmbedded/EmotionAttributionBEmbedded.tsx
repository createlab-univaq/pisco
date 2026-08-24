'use client';

import TextField from '@/components/forms/TextField';
import styles from './EmotionAttributionBNodeEmbedded.module.css';
import { EmotionAttributionBItem } from '@/components/nodes/EmotionAttributionB';

export type EmotionAttributionBData = {
    items: EmotionAttributionBItem[];
};

type Props = {
    data: EmotionAttributionBData;
    onDataChange: (newData: EmotionAttributionBData) => void;
    isDisabled?: boolean;
};

const EmotionAttributionBEmbedded = ({ data, onDataChange, isDisabled }: Props) => {
    // Safety fallback
    const items = data?.items || [];

    const handleAddItem = () => {
        onDataChange({
            ...data,
            items: [
                ...items,
                { emotion: '', scenario: '', scenarioExplanation: '' },
            ],
        });
    };

    const handleRemoveItem = (index: number) => {
        onDataChange({
            ...data,
            items: items.filter((_, i) => i !== index),
        });
    };

    const handleUpdateItem = (index: number, field: keyof EmotionAttributionBItem, value: string) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };

        onDataChange({
            ...data,
            items: newItems,
        });
    };

    return (
        <div className={styles.container}>
            <h4 className={styles.heading}>Elementi (lista)</h4>

            <p className={styles.description}>
                Ogni elemento è composto da Emozione, Scenario e Spiegazione dello scenario.
            </p>

            <button
                type="button"
                className={styles.addBtn}
                onClick={handleAddItem}
                disabled={isDisabled}
            >
                Aggiungi elemento
            </button>

            <hr className={styles.divider} />

            {items.length === 0 ? (
                <p className={styles.emptyText}>Nessun elemento inserito.</p>
            ) : (
                <div className={styles.itemsList}>
                    {items.map((item, index) => (
                        <div key={index} className={styles.itemCard}>
                            <div className={styles.itemHeader}>
                                <h5 className={styles.itemHeading}>Elemento {index + 1}</h5>
                                <button
                                    type="button"
                                    className={styles.removeBtn}
                                    onClick={() => handleRemoveItem(index)}
                                    disabled={isDisabled}
                                >
                                    Rimuovi
                                </button>
                            </div>

                            <div className={styles.fieldsStack}>
                                <TextField
                                    label="Emozione"
                                    name={`emotion-${index}`}
                                    value={item.emotion || ''}
                                    onChange={(e) => handleUpdateItem(index, 'emotion', e.target.value)}
                                    isDisabled={isDisabled}
                                />

                                <TextField
                                    label="Scenario"
                                    name={`scenario-${index}`}
                                    value={item.scenario || ''}
                                    onChange={(e) => handleUpdateItem(index, 'scenario', e.target.value)}
                                    isTextArea
                                    isDisabled={isDisabled}
                                />

                                <TextField
                                    label="Spiegazione scenario"
                                    name={`scenarioExplanation-${index}`}
                                    value={item.scenarioExplanation || ''}
                                    onChange={(e) => handleUpdateItem(index, 'scenarioExplanation', e.target.value)}
                                    isTextArea
                                    isDisabled={isDisabled}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default EmotionAttributionBEmbedded;