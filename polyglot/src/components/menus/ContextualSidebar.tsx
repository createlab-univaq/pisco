'use client';

import Image from 'next/image';
import { DragEvent, useEffect, useRef, useState } from 'react';
import styles from './ContextualSidebar.module.css';
import { polyglotNodeComponentMapping } from '../ElementMapping';
import { PolyglotNode } from '@/types/polyglot-elements/PolyglotNode';
import { PolyglotEdge } from '@/types/polyglot-elements/PolyglotEdge';
import ElementProperties from '../editor/ElementProperties';

export type ContextualSidebarProps = {
    selectedElement?: PolyglotNode | PolyglotEdge | null;
    onUpdateElement?: (updatedElement: any) => void;
    onClearSelection: () => void;
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

const ContextualSidebar = ({
    selectedElement,
    onUpdateElement,
    onClearSelection
}: ContextualSidebarProps) => {
    const [openSections, setOpenSections] = useState<Record<string, boolean>>({
        Assessments: true,
        Exercises: true,
    });
    const [isCollapsed, setIsCollapsed] = useState(false);

    // --- RESIZER LOGIC ---
    const sidebarRef = useRef<HTMLElement>(null);
    const [width, setWidth] = useState(300);
    const [isResizing, setIsResizing] = useState(false);

    useEffect(() => {
        if (!isResizing) return;
        const handleMouseMove = (e: MouseEvent) => {
            if (!sidebarRef.current) return;
            const rect = sidebarRef.current.getBoundingClientRect();
            const newWidth = rect.right - e.clientX;
            setWidth(Math.max(200, Math.min(newWidth, 800)));
        };
        const handleMouseUp = () => {
            setIsResizing(false);
            document.body.style.cursor = 'default';
            document.body.style.userSelect = '';
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
        document.body.style.userSelect = 'none';
    };

    // FAB Button if completely collapsed
    if (isCollapsed && !selectedElement) {
        return (
            <button className={styles.fab} onClick={() => setIsCollapsed(false)} title="Open Sidebar">
                <svg className={styles.fabIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
        );
    }

    // Toolbox logic
    const toggleSection = (label: string) => setOpenSections(p => ({ ...p, [label]: !p[label] }));
    const onDragStart = (e: DragEvent<HTMLDivElement>, nodeType: string) => {
        if (!e.dataTransfer) return;
        e.dataTransfer.setData('application/reactflow', nodeType);
        e.dataTransfer.effectAllowed = 'move';
    };

    const allNodes = Object.keys(polyglotNodeComponentMapping.nameMapping).map((index, id) => ({
        key: id.toString(),
        text: polyglotNodeComponentMapping.nameMapping[index],
        icon: polyglotNodeComponentMapping.iconMapping[index] ?? '',
        index,
    }));
    const pickNodesInOrder = (types: string[]) => types.map((t) => allNodes.find((n) => n.index === t)).filter(Boolean) as any[];

    // THE MAGIC SWAP: Are we showing Properties or Toolbox?
    const isShowingProperties = !!selectedElement;

    return (
        <aside ref={sidebarRef} className={styles.container} style={{ width: `${width}px` }}>
            <div className={`${styles.resizer} ${isResizing ? styles.resizerActive : ''}`} onMouseDown={startResizing} title="Drag to resize" />

            <div className={styles.content}>
                <div className={styles.header}>
                    <h2 className={styles.label}>
                        {isShowingProperties ? 'PROPERTIES' : 'TOOLBOX'}
                    </h2>

                    <button
                        className={styles.closeButton}
                        onClick={() => {
                            if (isShowingProperties) {
                                onClearSelection();
                            }
                            setIsCollapsed(true);
                        }}
                        title="Close"
                    >
                        <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className={styles.scrollArea}>
                    {isShowingProperties ? (
                        <ElementProperties
                            selectedElement={selectedElement}
                            onUpdateElement={onUpdateElement}
                        />
                    ) : (
                        MENU_SECTIONS.map((section) => {
                            const sectionNodes = pickNodesInOrder(section.nodes);
                            const isExpanded = openSections[section.label];
                            return (
                                <div key={section.label} className={styles.accordionItem}>
                                    <button
                                        className={`${styles.accordionButton} ${isExpanded ? styles.accordionButtonExpanded : ''}`}
                                        onClick={() => toggleSection(section.label)}
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
                                                        className={styles.nodeItem}
                                                        style={{ borderLeftColor: bgColor }}
                                                        draggable
                                                        onDragStart={(e) => onDragStart(e, node.index)}
                                                    >
                                                        {node.icon && <Image alt="" src={node.icon} width={20} height={20} className={styles.nodeIcon} />}
                                                        <span className={styles.nodeText}>{node.text}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </aside>
    );
};

export default ContextualSidebar;