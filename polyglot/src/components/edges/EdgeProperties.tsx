'use client';

import TextField from '@/components/forms/TextField';
import EnumField from '@/components/forms/EnumField';
import { EDGE_TYPE } from '@/types/polyglot-elements/EdgeType';
import styles from './EdgeProperties.module.css';

export type EdgePropertiesProps = {
    element: any;
    onUpdateElement: (updatedElement: any) => void;
};

const EdgeProperties = ({ element, onUpdateElement }: EdgePropertiesProps) => {
    const handleTypeChange = (newType: string) => {
        let newData: any = { edgeData: {} };
        if (newType === EDGE_TYPE.PASS_FAIL) newData = { edgeData: {}, conditionKind: 'pass' };
        if (newType === EDGE_TYPE.CONDITIONAL) newData = { edgeData: {}, operator: '>=', threshold: 0 };

        onUpdateElement({
            ...element,
            type: newType,
            data: newData,
            reactFlow: element.reactFlow ? {
                ...element.reactFlow,
                type: newType,
                data: newData
            } : undefined
        });
    };

    return (
        <div className={styles.container}>
            {/* THE TYPE DROPDOWN */}
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

            <TextField
                label="Title"
                name="title"
                value={element.title || ''}
                onChange={(e) => {
                    const newTitle = e.target.value;
                    onUpdateElement({
                        ...element,
                        title: newTitle,
                        // Sync the title to the canvas data so the edge can render it
                        reactFlow: element.reactFlow ? {
                            ...element.reactFlow,
                            data: {
                                ...element.reactFlow.data,
                                title: newTitle
                            }
                        } : undefined
                    });
                }}
            />
        </div>
    );
};

export default EdgeProperties;