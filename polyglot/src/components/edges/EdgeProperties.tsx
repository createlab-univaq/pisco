'use client';

import EnumField from '@/components/forms/EnumField';
import TextField from '@/components/forms/TextField';
import { EDGE_TYPE } from '@/types/EdgeType';
import styles from './EdgeProperties.module.css';
import { PolyglotEdge } from '@/types/PolyglotEdge';

export type EdgePropertiesProps = {
    element: PolyglotEdge;
    onUpdateElement: (updatedElement: PolyglotEdge) => void;
};

const EdgeProperties = ({ element, onUpdateElement }: EdgePropertiesProps) => {
    const currentData = (element.reactFlow?.data || {}) as Record<string, any>;

    const handleTypeChange = (newType: string) => {
        let newData: Record<string, any> = { edgeData: {} };
        if (newType === EDGE_TYPE.PASS_FAIL) newData = { edgeData: {}, conditionKind: 'pass' };
        if (newType === EDGE_TYPE.CONDITIONAL) newData = { edgeData: {}, operator: '>=', threshold: 0 };

        onUpdateElement({
            ...element,
            type: newType,
            reactFlow: element.reactFlow ? {
                ...element.reactFlow,
                type: newType,
                data: newData,
            } : undefined,
        });
    };

    const handleDataChange = (fields: Record<string, any>) => {
        if (!element.reactFlow) return;
        onUpdateElement({
            ...element,
            reactFlow: {
                ...element.reactFlow,
                data: {
                    ...currentData,
                    ...fields,
                },
            },
        });
    };

    return (
        <div className={styles.container}>
            <EnumField
                label="Edge Type"
                name="edgeType"
                value={element.type}
                onChange={(e) => handleTypeChange(e.target.value)}
                options={
                    <>
                        <option value={EDGE_TYPE.UNCONDITIONAL}>Unconditional</option>
                        <option value={EDGE_TYPE.PASS_FAIL}>Pass / Fail</option>
                        <option value={EDGE_TYPE.CONDITIONAL}>Conditional</option>
                    </>
                }
            />

            {element.type === EDGE_TYPE.CONDITIONAL && (
                <TextField
                    label="Threshold"
                    name="threshold"
                    value={currentData.threshold?.toString() || '0'}
                    onChange={(e) => handleDataChange({ threshold: Number(e.target.value) })}
                />
            )}
        </div>
    );
};

export default EdgeProperties;