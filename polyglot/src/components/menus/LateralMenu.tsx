'use client';

import Image from 'next/image';
import { DragEvent, useState } from 'react';
import styles from './LateralMenu.module.css';
import { polyglotNodeComponentMapping } from '../ElementMapping';

interface NodeItem {
    key: string;
    text: string;
    icon: string;
    index: string; // nodeType
}

export type LateralMenuProps = {
    isOpen: boolean;
};

const ITEM_COLORS = ['#FFCC49', '#FFF0C8'];

/** Requested sections + visible nodes */
const MENU_SECTIONS: Array<{
    label: string;
    nodes: string[];
}> = [
        {
            label: 'Test',
            nodes: [
                'EmotionAttributionTestNode',
                'EyesTaskNode',
                'FauxPasNode',
                'SocialSituationsNode',
                'TheoryOfMindNode',
                'TrueFalseNode',
            ],
        },
        {
            label: 'Esercitazioni',
            nodes: [
                'EmotionAttributionANode',
                'EmotionAttributionBNode',
                'ContainerNode',
                'SocialSituationExerciseANode',
                'RiconoscimentoEmozioniNode',
            ],
        },
    ];

// Reusable SVG Icons replacing Chakra UI icons
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

const LateralMenu = ({ isOpen }: LateralMenuProps) => {
    // Local state to manage accordion panels (defaulting both to open)
    const [openSections, setOpenSections] = useState<Record<string, boolean>>({
        Test: true,
        Esercitazioni: true,
    });

    if (!isOpen) return null;

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

    // Extract all nodes defined in the mapping
    const allNodes: NodeItem[] = Object.keys(
        polyglotNodeComponentMapping.nameMapping
    ).map((index, id) => ({
        key: id.toString(),
        text: polyglotNodeComponentMapping.nameMapping[index],
        icon: polyglotNodeComponentMapping.iconMapping[index] ?? '',
        index,
    }));

    // Helper: given an array of nodeTypes, returns the NodeItem objects (in that order)
    const pickNodesInOrder = (types: string[]) =>
        types
            .map((t) => allNodes.find((n) => n.index === t))
            .filter(Boolean) as NodeItem[];

    return (
        <aside className={styles.container}>
            <div className={styles.label}>NEW ACTIVITY</div>

            <div className={styles.scrollArea}>
                {MENU_SECTIONS.map((section) => {
                    const sectionNodes = pickNodesInOrder(section.nodes);
                    const isExpanded = openSections[section.label];

                    return (
                        <div key={section.label} className={styles.accordionItem}>
                            <button
                                className={styles.accordionButton}
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
                                                style={{ backgroundColor: bgColor }}
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
                                                        style={{ pointerEvents: 'none' }}
                                                    />
                                                )}
                                                <span>{node.text}</span>
                                            </div>
                                        );
                                    })}

                                    {sectionNodes.length === 0 && (
                                        <div className={styles.emptyMessage}>
                                            Nessun nodo disponibile in questa sezione.
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </aside>
    );
};

export default LateralMenu;