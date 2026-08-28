import React from 'react';
import { PolyglotNode } from '@/types/PolyglotNode';
import { PolyglotEdge } from '@/types/PolyglotEdge';

// ---------------------------------------------------------------------------
// UNIVERSAL PROPERTY PANEL PROPS
// ---------------------------------------------------------------------------
export type PolyglotNodePropertiesProps = {
    element: PolyglotNode;
    onUpdateElement: (updatedElement: PolyglotNode) => void;
};

export type PolyglotEdgePropertiesProps = {
    element: PolyglotEdge;
    onUpdateElement: (updatedElement: PolyglotEdge) => void;
};

// ---------------------------------------------------------------------------
// MAPPING CONFIGURATION TYPE
// ---------------------------------------------------------------------------
export type MappingType<T, U, K> = {
    elementType: string;
    name: string;
    icon?: string;
    group?: string;
    propertiesComponent: React.ComponentType<T>;
    elementComponent: React.ComponentType<U>;
    defaultData: any;
    transformData?: (data: K) => K;
};