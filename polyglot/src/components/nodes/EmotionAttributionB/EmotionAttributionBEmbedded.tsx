'use client';

import styles from './EmotionAttributionBEmbedded.module.css';
import TextField from '@/components/forms/TextField';
import { EmotionAttributionBNodeData } from './types'; // Import the type we created in the previous step

type Props = {
    data: EmotionAttributionBNodeData;
    onChange: (updatedData: Partial<EmotionAttributionBNodeData>) => void;
    isDisabled?: boolean;
};

const EmotionAttributionBEmbedded = ({ data, onChange, isDisabled }: Props) => {
    // Ensure items is always an array to prevent mapping errors
    const items = data.items || [];

    const handleAddItem = () => {
        onChange({
            items: [
                ...items,
                { emotion: '', scenario: '', scenarioExplanation: '' },
            ],
        });
    };

    const handleRemoveItem = (indexToRemove: number) => {
        onChange({
            items: items.filter((_, index) => index !== indexToRemove),
        });
    };

    const handleUpdateItem = (index: number, field: keyof typeof items[0], value: string) => {
        const updatedItems = [...items];
        updatedItems[index] = {
            ...updatedItems[index],
            [field]: value,
        };
        onChange({ items: updatedItems });
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
                                <h5 className={styles.itemTitle}>Elemento {index + 1}</h5>
                                <button
                                    type="button"
                                    className={styles.removeBtn}
                                    onClick={() => handleRemoveItem(index)}
                                    disabled={isDisabled}
                                >
                                    Rimuovi
                                </button>
                            </div>

                            <TextField
                                label="Emozione"
                                name={`items-${index}-emotion`}
                                value={item.emotion || ''}
                                onChange={(e) => handleUpdateItem(index, 'emotion', e.target.value)}
                                isDisabled={isDisabled}
                            />

                            <TextField
                                label="Scenario"
                                name={`items-${index}-scenario`}
                                value={item.scenario || ''}
                                onChange={(e) => handleUpdateItem(index, 'scenario', e.target.value)}
                                isTextArea
                                isDisabled={isDisabled}
                            />

                            <TextField
                                label="Spiegazione scenario"
                                name={`items-${index}-scenarioExplanation`}
                                value={item.scenarioExplanation || ''}
                                onChange={(e) => handleUpdateItem(index, 'scenarioExplanation', e.target.value)}
                                isTextArea
                                isDisabled={isDisabled}
                            />

                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default EmotionAttributionBEmbedded;