'use client';

import styles from './ContextMenu.module.css';

export enum ContextMenuTypes {
    DEFAULT,
    NODE,
    EDGE,
}

export type ContextMenuProps = {
    pos: {
        x: number;
        y: number;
    };
    show: boolean;
    elementId?: string;
    type: ContextMenuTypes;
    relativePos?: {
        x: number;
        y: number;
    };
    onDismiss?: () => void;

    // Golden Standard: Since we removed the global store, the parent component 
    // MUST pass down the deletion handler so this pure component knows what to trigger.
    onRemoveElement?: (type: 'Node' | 'Edge', id: string) => void;
};

const ContextMenu = ({
    pos,
    show,
    type,
    elementId,
    // relativePos, // Kept here just in case you restore the "Add Element" functionality
    onDismiss,
    onRemoveElement,
}: ContextMenuProps) => {

    // If the menu is hidden or triggered on an invalid target, render nothing
    if (!show || type === ContextMenuTypes.DEFAULT) {
        return null;
    }

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation();

        if (!elementId || !onRemoveElement) return;

        if (type === ContextMenuTypes.NODE) {
            onRemoveElement('Node', elementId);
        } else if (type === ContextMenuTypes.EDGE) {
            onRemoveElement('Edge', elementId);
        }

        if (onDismiss) onDismiss();
    };

    return (
        <div
            className={styles.menuContainer}
            style={{ top: pos.y, left: pos.x }}
            onContextMenu={(e) => e.preventDefault()} // Prevent native menu from opening over this one
        >
            <button className={styles.menuItem} onClick={handleRemove}>
                {/* Inline Trash SVG Icon */}
                <svg
                    className={styles.icon}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                </svg>
                Remove
            </button>
        </div>
    );
};

export default ContextMenu;