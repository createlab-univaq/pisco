'use client';

export function useNodeSync(element: any, onUpdateElement: (updated: any) => void) {
    const handleBaseChange = (updatedBase: Record<string, any>) => {
        const newTitle = updatedBase.title !== undefined ? updatedBase.title : element.title;

        onUpdateElement({
            ...element,
            ...updatedBase,
            // Automatically sync title to reactFlow data for canvas labels
            reactFlow: element.reactFlow ? {
                ...element.reactFlow,
                data: {
                    ...((element.reactFlow.data || {}) as Record<string, any>),
                    title: newTitle,
                }
            } : undefined
        });
    };

    const handleDataChange = (updatedData: Record<string, any>) => {
        onUpdateElement({
            ...element,
            data: {
                ...element.data,
                ...updatedData,
            },
        });
    };

    return { handleBaseChange, handleDataChange };
}