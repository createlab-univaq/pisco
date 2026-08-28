'use client';

import { PolyglotEdgePropertiesProps } from '@/types/ElementMappingTypes';
import EdgeProperties from '../EdgeProperties';

const UnconditionalEdgeProperties = ({ element, onUpdateElement }: PolyglotEdgePropertiesProps) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <EdgeProperties element={element} onUpdateElement={onUpdateElement} />
        </div>
    );
};

export default UnconditionalEdgeProperties;