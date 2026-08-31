'use client';

import EnumField from '@/components/forms/EnumField';
import { EDGE_TYPE } from '@/types/EdgeType';
import styles from './EdgeProperties.module.css';
import { PolyglotEdge } from '@/types/PolyglotEdge';
import { polyglotEdgeComponentMapping } from '@/components/ElementMapping';

export type EdgePropertiesProps = {
    element: PolyglotEdge;
    onUpdateElement: (updatedElement: PolyglotEdge) => void;
};

const EdgeProperties = ({ element, onUpdateElement }: EdgePropertiesProps) => {

    const handleTypeChange = (newType: string) => {
        let newData: Record<string, any> = { edgeData: {} };

        // Reset conditional data when switching types
        if (newType === EDGE_TYPE.CONDITIONAL) {
            newData = { edgeData: {}, operator: '>=', threshold: 0 };
        }

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

    // Dynamically generate the options based on the edge name mapping!
    const edgeOptions = Object.values(EDGE_TYPE).map((type) => {

        const displayName = polyglotEdgeComponentMapping.nameMapping?.[type]
            ?? type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');

        return <option key={type} value={type}>{displayName}</option>;
    });

    return (
        <div className={styles.container}>
            <EnumField
                label="Edge Type"
                name="edgeType"
                value={element.type}
                onChange={(e) => handleTypeChange(e.target.value)}
                options={<>{edgeOptions}</>}
            />
        </div>
    );
};

export default EdgeProperties;