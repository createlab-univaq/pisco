'use client';

import EnumField from '@/components/forms/EnumField';
import { EDGE_TYPE } from '@/types/EdgeType';
import styles from './EdgeProperties.module.css';
import { PolyglotEdge } from '@/types/PolyglotEdge';

export type EdgePropertiesProps = {
    element: PolyglotEdge;
    onUpdateElement: (updatedElement: any) => void;
};

const EdgeProperties = ({ element, onUpdateElement }: EdgePropertiesProps) => {
    // Safely read current data from reactFlow, NOT the root
    const currentData = element.reactFlow?.data || {};

    const handleTypeChange = (newType: string) => {
        let newData: any = { edgeData: {} };
        if (newType === EDGE_TYPE.PASS_FAIL) newData = { edgeData: {}, conditionKind: 'pass' };
        if (newType === EDGE_TYPE.CONDITIONAL) newData = { edgeData: {}, operator: '>=', threshold: 0 };

        onUpdateElement({
            ...element,
            type: newType,
            // REMOVED root data writing
            reactFlow: element.reactFlow ? {
                ...element.reactFlow,
                type: newType,
                data: newData // Only write to reactFlow.data
            } : undefined
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

            {/* Example of how to read the data correctly now: */}
            {/* {element.type === EDGE_TYPE.CONDITIONAL && (
                 <p>Current Operator is: {currentData.operator}</p> 
            )} */}
        </div>
    );
};

export default EdgeProperties;