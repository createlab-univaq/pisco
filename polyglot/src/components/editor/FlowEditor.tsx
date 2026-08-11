'use client';

import {
    DragEventHandler,
    MouseEventHandler,
    useCallback,
    useState,
} from 'react';
import ReactFlow, {
    applyEdgeChanges,
    applyNodeChanges,
    Background,
    BackgroundVariant,
    Controls,
    EdgeMouseHandler,
    NodeMouseHandler,
    OnEdgesChange,
    OnMoveStart,
    OnNodesChange,
    OnNodesDelete,
    OnSelectionChangeParams,
    ReactFlowProvider,
    useOnSelectionChange,
    useReactFlow,
    useStoreApi,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { v4 as UUIDv4 } from 'uuid';
import { createNewDefaultPolyglotNode } from '../../utils/utils';
import styles from './FlowEditor.module.css';
import { PolyglotFlow } from '@/types/polyglot-elements/PolyglotFlow';
import ContextMenu, { ContextMenuProps, ContextMenuTypes } from '../menus/ContextMenu';
import { PolyglotNode } from '@/types/polyglot-elements/PolyglotNode';
import { PolyglotEdge } from '@/types/polyglot-elements/PolyglotEdge';
import LateralMenu from '../menus/LateralMenu';
import ElementProperties from './ElementProperties';
import EditorNav from '../navbars/EditorNav';
import { polyglotEdgeComponentMapping, polyglotNodeComponentMapping } from '../ElementMapping';

type FlowEditorProps = {
    mode: 'read' | 'write';
    initialFlow: PolyglotFlow;
    saveFlow: (updatedFlow: PolyglotFlow) => Promise<void>;
    onSelectionChange?: (selection: OnSelectionChangeParams) => void;
};

const deleteKeyCodes = ['Backspace', 'Delete'];

const FlowEditor = ({ initialFlow, saveFlow, onSelectionChange }: FlowEditorProps) => {
    const { project } = useReactFlow();
    const { resetSelectedElements } = useStoreApi().getState();

    const [polyglotNodes, setPolyglotNodes] = useState<PolyglotNode[]>(initialFlow.nodes || []);
    const [polyglotEdges, setPolyglotEdges] = useState<PolyglotEdge[]>(initialFlow.edges || []);
    const [selectedElement, setSelectedElement] = useState<{ type: 'Node' | 'Edge'; id: string } | null>(null);

    const [isOpenPanel, setIsOpenPanel] = useState(false);
    const onOpenPanel = () => setIsOpenPanel(true);
    const onClosePanel = () => setIsOpenPanel(false);

    const [contextMenu, setContextMenu] = useState<ContextMenuProps>({
        show: false,
        type: ContextMenuTypes.DEFAULT,
        pos: { x: 0, y: 0 },
    });

    const hideContextMenu = () => {
        setContextMenu((prev) => ({ ...prev, show: false }));
    };

    const compoundClearSelection = useCallback(() => {
        resetSelectedElements();
        setSelectedElement(null);
    }, [resetSelectedElements]);

    // ============================================================================
    // REACT FLOW CHANGE HANDLERS (Keeps UI and Polyglot Data Synced)
    // ============================================================================

    const onNodesChange: OnNodesChange = (changes) => {
        setPolyglotNodes((prev) => {
            // FIXED: Safely extract reactFlow nodes, ignoring undefined
            const validNodes = prev.filter((p) => p.reactFlow !== undefined);
            const rfNodes = validNodes.map((p) => p.reactFlow!);

            const updatedRfNodes = applyNodeChanges(changes, rfNodes);

            return prev
                .filter((p) => p.reactFlow && updatedRfNodes.some((r) => r.id === p.reactFlow!.id))
                .map((p) => {
                    if (!p.reactFlow) return p;
                    const updatedRfNode = updatedRfNodes.find((r) => r.id === p.reactFlow!.id);
                    if (updatedRfNode && updatedRfNode !== p.reactFlow) {
                        return { ...p, reactFlow: updatedRfNode };
                    }
                    return p;
                });
        });
    };

    const onEdgesChange: OnEdgesChange = (changes) => {
        setPolyglotEdges((prev) => {
            // FIXED: Safely extract reactFlow edges, ignoring undefined
            const validEdges = prev.filter((p) => p.reactFlow !== undefined);
            const rfEdges = validEdges.map((p) => p.reactFlow!);

            const updatedRfEdges = applyEdgeChanges(changes, rfEdges);

            return prev
                .filter((p) => p.reactFlow && updatedRfEdges.some((r) => r.id === p.reactFlow!.id))
                .map((p) => {
                    if (!p.reactFlow) return p;
                    const updatedRfEdge = updatedRfEdges.find((r) => r.id === p.reactFlow!.id);
                    if (updatedRfEdge && updatedRfEdge !== p.reactFlow) {
                        return { ...p, reactFlow: updatedRfEdge };
                    }
                    return p;
                });
        });
    };

    const onNodesDelete: OnNodesDelete = (nodesToRemove) => {
        const idsToRemove = nodesToRemove.map((n) => n.id);
        // FIXED: Added safe optional chaining
        setPolyglotNodes((prev) => prev.filter((n) => n.reactFlow && !idsToRemove.includes(n.reactFlow.id)));
    };

    // ============================================================================
    // DRAG AND DROP HANDLERS
    // ============================================================================

    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop: DragEventHandler = (event) => {
        event.preventDefault();
        if (!event.dataTransfer) return;

        const type = event.dataTransfer.getData('application/reactflow');
        if (!type) return;

        const rect = event.currentTarget.getBoundingClientRect();
        const pos = project({
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
        });

        if (type === 'abstractNode') {
            const id = UUIDv4();
            const nodeToAdd: PolyglotNode = {
                _id: id,
                type: type,
                title: 'New Node',
                description: '',
                difficulty: 1,
                platform: 'Library',
                data: {
                    useFlowData: initialFlow?.sourceMaterial != null,
                    sourceMaterial: initialFlow?.sourceMaterial,
                } as any,
                reactFlow: {
                    id: id,
                    type: type,
                    position: pos,
                    data: { label: 'Abstract Node' },
                },
            };
            setPolyglotNodes((prev) => [...prev, nodeToAdd]);
            return;
        }

        const nodeToAdd = createNewDefaultPolyglotNode(pos, type);
        setPolyglotNodes((prev) => [...prev, nodeToAdd]);
    };

    // ============================================================================
    // EVENT HANDLERS
    // ============================================================================

    const onMoveStart: OnMoveStart = () => {
        hideContextMenu();
        compoundClearSelection();
    };

    const onClick: MouseEventHandler = (e) => {
        e.preventDefault();
        hideContextMenu();
    };

    const onNodeContextMenu: NodeMouseHandler = (e, node) => {
        e.preventDefault();
        setSelectedElement({ type: 'Node', id: node.id });
        setContextMenu({
            type: ContextMenuTypes.NODE,
            show: true,
            pos: { x: e.clientX, y: e.clientY },
        });
    };

    const onEdgeContextMenu: EdgeMouseHandler = (e, edge) => {
        e.preventDefault();
        setSelectedElement({ type: 'Edge', id: edge.id });
        setContextMenu({
            type: ContextMenuTypes.EDGE,
            show: true,
            pos: { x: e.clientX, y: e.clientY },
        });
    };

    useOnSelectionChange({
        onChange: (params) => {
            if (onSelectionChange) onSelectionChange(params);

            if (params.nodes.length !== 0) {
                setSelectedElement({ type: 'Node', id: params.nodes[0].id });
            } else if (params.edges.length !== 0) {
                setSelectedElement({ type: 'Edge', id: params.edges[0].id });
            } else {
                onClosePanel();
                compoundClearSelection();
            }
        },
    });

    // ============================================================================
    // HELPERS
    // ============================================================================

    const handleSave = async () => {
        await saveFlow({
            ...initialFlow,
            nodes: polyglotNodes,
            edges: polyglotEdges,
        });
    };

    // FIXED: Added safe optional chaining to find functions
    const activeElement = selectedElement?.type === 'Node'
        ? polyglotNodes.find(n => n.reactFlow?.id === selectedElement.id)
        : selectedElement?.type === 'Edge'
            ? polyglotEdges.find(e => e.reactFlow?.id === selectedElement.id)
            : null;

    return (
        <div className={styles.container}>
            <EditorNav saveFunc={handleSave} />

            <div className={styles.editorArea}>
                <ReactFlow
                    // FIXED: Filter out undefined elements safely before giving them to React Flow
                    nodes={polyglotNodes.filter((n) => n.reactFlow !== undefined).map((n) => n.reactFlow!)}
                    nodeTypes={polyglotNodeComponentMapping.componentMapping}
                    onNodesChange={onNodesChange}
                    onNodesDelete={onNodesDelete}
                    onNodeContextMenu={onNodeContextMenu}
                    onNodeDoubleClick={onOpenPanel}
                    onNodeDrag={onClosePanel}

                    // FIXED: Filter out undefined elements safely before giving them to React Flow
                    edges={polyglotEdges.filter((e) => e.reactFlow !== undefined).map((e) => e.reactFlow!)}
                    edgeTypes={polyglotEdgeComponentMapping.componentMapping}
                    onEdgesChange={onEdgesChange}
                    onEdgeContextMenu={onEdgeContextMenu}
                    onEdgeDoubleClick={onOpenPanel}

                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    deleteKeyCode={deleteKeyCodes}
                    multiSelectionKeyCode={null}
                    snapToGrid={true}
                    fitView={true}
                    fitViewOptions={{ padding: 0.2 }}
                    onClick={onClick}
                    onMoveStart={onMoveStart}
                    onPaneContextMenu={(e) => {
                        e.preventDefault();
                        const rect = e.currentTarget.getBoundingClientRect();
                        setContextMenu({
                            type: ContextMenuTypes.DEFAULT,
                            show: true,
                            pos: { x: e.clientX, y: e.clientY },
                            relativePos: project({
                                x: e.clientX - rect.left,
                                y: e.clientY - rect.top,
                            }),
                        });
                    }}
                >
                    <Background variant={BackgroundVariant.Dots} />
                    <Controls />
                </ReactFlow>

                <ContextMenu
                    {...contextMenu}
                    elementId={activeElement?._id}
                    onDismiss={hideContextMenu}
                    onRemoveElement={(type, id) => {
                        if (type === 'Node') {
                            setPolyglotNodes((prev) => prev.filter(n => n._id !== id));
                        } else if (type === 'Edge') {
                            setPolyglotEdges((prev) => prev.filter(e => e._id !== id));
                        }
                    }}
                />

                <LateralMenu isOpen={!isOpenPanel} />

                <ElementProperties
                    selectedElement={activeElement}
                    isOpen={isOpenPanel}
                    onClose={onClosePanel}
                    onUpdateElement={(updatedElement: any) => {
                        // FIXED: Added safe optional chaining
                        if (selectedElement?.type === 'Node') {
                            setPolyglotNodes(prev => prev.map(n => n.reactFlow?.id === selectedElement.id ? updatedElement : n));
                        } else if (selectedElement?.type === 'Edge') {
                            setPolyglotEdges(prev => prev.map(e => e.reactFlow?.id === selectedElement.id ? updatedElement : e));
                        }
                    }}
                />
            </div>
        </div>
    );
};

export default function FlowWithProvider(props: FlowEditorProps) {
    return (
        <ReactFlowProvider>
            <FlowEditor {...props} />
        </ReactFlowProvider>
    );
}