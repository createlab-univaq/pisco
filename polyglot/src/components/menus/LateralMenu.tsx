'use client';

import Image from 'next/image';
import { DragEvent, useEffect, useRef, useState } from 'react';
import styles from './LateralMenu.module.css';
import { polyglotNodeComponentMapping } from '../ElementMapping';

interface NodeItem {
    key: string;
    text: string;
    icon: string;
    index: string;
}

export type LateralMenuProps = {
    isOpen: boolean;
};

const ITEM_COLORS = ['#FFCC49', '#FFF0C8'];

const MENU_SECTIONS: Array<{
    label: string;
    nodes: string[];
}> = [
        {
            label: 'Assessments',
            nodes: [
                'EmotionAttributionNode',
                'EyesTaskNode',
                'FauxPasNode',
                'SocialSituationsNode',
                'TheoryOfMindNode',
                'TrueFalseNode',
            ],
        },
        {
            label: 'Exercises',
            nodes: [
                'EmotionAttributionANode',
                'EmotionAttributionBNode',
                'ContainerNode',
                'SocialSituationExerciseANode',
                'EmotionRecognitionNode',
            ],
        },
    ];

// Reusable SVG Icons
const ChevronDown = () => (
    <svg className={styles.icon} fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
);

const ChevronRight = () => (
    <svg className={styles.icon} fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
    </svg>
);

const CloseIcon = () => (
    <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const ToolboxIcon = () => (
    <svg className={styles.fabIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
);

const LateralMenu = ({ isOpen }: LateralMenuProps) => {
    const [openSections, setOpenSections] = useState<Record<string, boolean>>({
        Assessments: true,
        Exercises: true,
    });

    const [isCollapsed, setIsCollapsed] = useState(false);

    // --- RESIZER LOGIC (Left Edge) ---
    const sidebarRef = useRef<HTMLElement>(null);
    const [width, setWidth] = useState(300);
    const [isResizing, setIsResizing] = useState(false);

    useEffect(() => {
        if (!isResizing) return;

        const handleMouseMove = (e: MouseEvent) => {
            if (!sidebarRef.current) return;
            const rect = sidebarRef.current.getBoundingClientRect();
            const newWidth = rect.right - e.clientX;

            setWidth(Math.max(200, Math.min(newWidth, 600)));
        };

        const handleMouseUp = () => {
            setIsResizing(false);
            // Revert globals
            document.body.style.cursor = 'default';
            document.body.style.userSelect = ''; // FIXED: Restores text selection
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isResizing]);

    const startResizing = () => {
        setIsResizing(true);
        document.body.style.cursor = 'ew-resize';
        document.body.style.userSelect = 'none'; // FIXED: Prevents text selection while dragging
    };
    // ---------------------------------

    // If the properties panel is open, the lateral menu disappears completely
    if (!isOpen) return null;

    // If the user manually collapsed the lateral menu, show the FAB instead
    if (isCollapsed) {
        return (
            <button
                className={styles.fab}
                onClick={() => setIsCollapsed(false)}
                title="Open Toolbox"
            >
                <ToolboxIcon />
            </button>
        );
    }

    const toggleSection = (label: string) => {
        setOpenSections((prev) => ({
            ...prev,
            [label]: !prev[label],
        }));
    };

    const onDragStart = (event: DragEvent<HTMLDivElement>, nodeType: string) => {
        if (!event.dataTransfer) return;
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    const allNodes: NodeItem[] = Object.keys(
        polyglotNodeComponentMapping.nameMapping
    ).map((index, id) => ({
        key: id.toString(),
        text: polyglotNodeComponentMapping.nameMapping[index],
        icon: polyglotNodeComponentMapping.iconMapping[index] ?? '',
        index,
    }));

    const pickNodesInOrder = (types: string[]) =>
        types
            .map((t) => allNodes.find((n) => n.index === t))
            .filter(Boolean) as NodeItem[];

    return (
        <aside
            ref={sidebarRef}
            className={styles.container}
            style={{ width: `${width}px` }}
        >
            <div
                className={`${styles.resizer} ${isResizing ? styles.resizerActive : ''}`}
                onMouseDown={startResizing}
                title="Drag to resize"
            />

            <div className={styles.content}>
                <div className={styles.header}>
                    <h2 className={styles.label}>TOOLBOX</h2>
                    <button className={styles.closeButton} onClick={() => setIsCollapsed(true)} title="Hide Toolbox">
                        <CloseIcon />
                    </button>
                </div>

                <div className={styles.scrollArea}>
                    {MENU_SECTIONS.map((section) => {
                        const sectionNodes = pickNodesInOrder(section.nodes);
                        const isExpanded = openSections[section.label];

                        return (
                            <div key={section.label} className={styles.accordionItem}>
                                <button
                                    className={`${styles.accordionButton} ${isExpanded ? styles.accordionButtonExpanded : ''}`}
                                    onClick={() => toggleSection(section.label)}
                                    aria-expanded={isExpanded}
                                >
                                    <span>{section.label}</span>
                                    {isExpanded ? <ChevronDown /> : <ChevronRight />}
                                </button>

                                {isExpanded && (
                                    <div className={styles.accordionPanel}>
                                        {sectionNodes.map((node, idx) => {
                                            const bgColor = ITEM_COLORS[idx % ITEM_COLORS.length];

                                            return (
                                                <div
                                                    key={`${section.label}-${node.index}`}
                                                    id={node.key}
                                                    className={styles.nodeItem}
                                                    style={{ borderLeftColor: bgColor }}
                                                    draggable
                                                    title="Drag the new Node type"
                                                    onDragStart={(event) => onDragStart(event, node.index)}
                                                >
                                                    {node.icon && (
                                                        <Image
                                                            alt={`${node.text} icon`}
                                                            src={node.icon}
                                                            width={20}
                                                            height={20}
                                                            className={styles.nodeIcon}
                                                        />
                                                    )}
                                                    <span className={styles.nodeText}>{node.text}</span>
                                                </div>
                                            );
                                        })}

                                        {sectionNodes.length === 0 && (
                                            <div className={styles.emptyMessage}>
                                                No nodes available.
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </aside>
    );
};

export default LateralMenu;