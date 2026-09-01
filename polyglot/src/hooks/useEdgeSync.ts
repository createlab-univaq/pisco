'use client';

export function useEdgeSync(edge: any, onUpdateElement: (updated: any) => void) {
    const handleBaseChange = (updatedBase: Record<string, any>) => {
        const newTitle = updatedBase.title !== undefined ? updatedBase.title : edge.title;

        onUpdateElement({
            ...edge,
            ...updatedBase,
            reactFlow: edge.reactFlow ? {
                ...edge.reactFlow,
                data: {
                    ...((edge.reactFlow.data || {}) as Record<string, any>),
                    title: newTitle,
                }
            } : undefined
        });
    };

    const handleDataChange = (updatedDataOrKey: Record<string, any> | string, value?: any) => {
        const updatedData = typeof updatedDataOrKey === 'string'
            ? { [updatedDataOrKey]: value }
            : updatedDataOrKey;

        const mergedData = { ...edge.data, ...updatedData };

        onUpdateElement({
            ...edge,
            data: mergedData,
            reactFlow: edge.reactFlow ? {
                ...edge.reactFlow,
                data: {
                    ...((edge.reactFlow.data || {}) as Record<string, any>),
                    ...mergedData,
                }
            } : undefined
        });
    };

    return { handleBaseChange, handleDataChange };
}