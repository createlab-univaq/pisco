'use client';

import { useEffect, useState } from 'react';

/**
 * Fixes Zustand persist hydration issues.
 * Use this hook to prevent "Extra attributes from the server" SSR mismatches.
 */
export const useHasHydrated = (): boolean => {
    const [hasHydrated, setHasHydrated] = useState<boolean>(false);

    useEffect(() => {
        setHasHydrated(true);
    }, []);

    return hasHydrated;
};