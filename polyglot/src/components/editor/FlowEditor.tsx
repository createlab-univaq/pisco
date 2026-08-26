'use client';

import {
    DragEventHandler,
    MouseEventHandler,
    useCallback,
    useMemo,
    useState,
} from 'react';
import ReactFlow, {
    applyEdgeChanges,
    applyNodeChanges,
    Background,
    BackgroundVariant,
    Connection,
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
    MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { v4 as UUIDv4 } from 'uuid';
import { createNewDefaultPolyglotNode } from '../../utils/utils';
import styles from './FlowEditor.module.css';
import { PolyglotFlow } from '@/types/polyglot-elements/PolyglotFlow';
import ContextMenu, { ContextMenuProps, ContextMenuTypes } from '../menus/ContextMenu';
import { PolyglotNode } from '@/types/polyglot-elements/PolyglotNode';
import { PolyglotEdge } from '@/types/polyglot-elements/PolyglotEdge';
import EditorNav from '../navbars/EditorNav';
import { polyglotEdgeComponentMapping, polyglotNodeComponentMapping } from '../ElementMapping';
import { EDGE_TYPE } from '@/types/polyglot-elements/EdgeType';
import ContextualSidebar from '../menus/ContextualSidebar';

type FlowEditorProps = {
    mode: 'read' | 'write';
    initialFlow: PolyglotFlow;
    saveFlow: (updatedFlow: PolyglotFlow) => Promise<void>;
    onSelectionChange?: (selection: OnSelectionChangeParams) => void;
};

const deleteKeyCodes = ['Backspace', 'Delete'];

const FlowEditor = ({ initialFlow, saveFlow, onSelectionChange }: FlowEditorProps) => {
    const { screenToFlowPosition } = useReactFlow();
    const { resetSelectedElements } = useStoreApi().getState();

    const nodeTypes = useMemo(() => polyglotNodeComponentMapping.componentMapping, []);
    const edgeTypes = useMemo(() => polyglotEdgeComponentMapping.componentMapping, []);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    // --- NEW: Track flow metadata changes directly ---
    const [flowTitle, setFlowTitle] = useState(initialFlow.title || 'Untitled Flow');
    const [flowPublish, setFlowPublish] = useState(initialFlow.publish || false);

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
        if (changes.some((c) => c.type === 'position' || c.type === 'remove' || c.type === 'add')) {
            setHasUnsavedChanges(true);
        }

        setPolyglotNodes((prev) => {
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
        if (changes.some((c) => c.type === 'remove' || c.type === 'add')) {
            setHasUnsavedChanges(true);
        }

        setPolyglotEdges((prev) => {
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

        const pos = screenToFlowPosition({
            x: event.clientX,
            y: event.clientY,
        });

        if (type === 'abstractNode') {
            const id = UUIDv4();
            const nodeToAdd: PolyglotNode = {
                _id: id,
                type: type,
                title: 'New Node',
                description: '',
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
            setHasUnsavedChanges(true);
            setPolyglotNodes((prev) => [...prev, nodeToAdd]);
            return;
        }

        const nodeToAdd = createNewDefaultPolyglotNode(pos, type);
        setPolyglotNodes((prev) => [...prev, nodeToAdd]);
    };

    const onConnect = useCallback((connection: Connection) => {
        const id = UUIDv4();
        const newEdge: PolyglotEdge = {
            _id: id,
            type: EDGE_TYPE.UNCONDITIONAL,
            data: {
                edgeData: {},
            },
            reactFlow: {
                id: id,
                type: EDGE_TYPE.UNCONDITIONAL,
                source: connection.source!,
                target: connection.target!,
            },
        };

        setHasUnsavedChanges(true);
        setPolyglotEdges((prev) => [...prev, newEdge]);
    }, []);

    // ============================================================================
    // EVENT HANDLERS
    // ============================================================================

    const onMoveStart: OnMoveStart = () => {
        hideContextMenu();
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

    const getCleanFlow = (): PolyglotFlow => {
        const cleanNodes = polyglotNodes.map((node) => {
            if (!node.reactFlow) return node;
            const {
                width, height, selected, dragging, positionAbsolute, resizing, ...cleanReactFlow
            } = node.reactFlow as any;
            return { ...node, reactFlow: cleanReactFlow };
        });

        const cleanEdges = polyglotEdges.map((edge) => {
            const { code, description, data, ...restEdge } = edge as any;
            if (!restEdge.reactFlow) return restEdge;

            const { selected, ...cleanReactFlow } = restEdge.reactFlow as any;
            if (cleanReactFlow.sourceHandle === null) delete cleanReactFlow.sourceHandle;
            if (cleanReactFlow.targetHandle === null) delete cleanReactFlow.targetHandle;

            return { ...restEdge, reactFlow: cleanReactFlow };
        });

        return {
            ...initialFlow,
            title: flowTitle,
            publish: flowPublish,
            nodes: cleanNodes,
            edges: cleanEdges,
        };
    };

    const handleSave = async (overrides?: Partial<PolyglotFlow>) => {
        const cleanFlow = getCleanFlow();

        await saveFlow({
            ...cleanFlow,
            ...overrides,
        });

        setHasUnsavedChanges(false);
    };

    const activeElement = selectedElement?.type === 'Node'
        ? polyglotNodes.find(n => n.reactFlow?.id === selectedElement.id)
        : selectedElement?.type === 'Edge'
            ? polyglotEdges.find(e => e.reactFlow?.id === selectedElement.id)
            : null;

    return (
        <div className={styles.container}>
            <EditorNav
                flow={getCleanFlow()}
                saveFunc={() => handleSave()}
                hasUnsavedChanges={hasUnsavedChanges}
                onUpdateFlowInfo={async (updates) => {
                    if (updates.title !== undefined) setFlowTitle(updates.title);
                    if (updates.publish !== undefined) setFlowPublish(updates.publish);
                    await handleSave(updates);
                }}
            />

            <div className={styles.editorArea}>
                <ReactFlow
                    nodes={polyglotNodes.filter((n) => n.reactFlow !== undefined).map((n) => n.reactFlow!)}
                    nodeTypes={nodeTypes}
                    onNodesChange={onNodesChange}
                    onNodesDelete={onNodesDelete}
                    onNodeContextMenu={onNodeContextMenu}
                    onNodeDoubleClick={onOpenPanel}

                    edges={polyglotEdges.filter((e) => e.reactFlow !== undefined).map((e) => e.reactFlow!)}
                    edgeTypes={edgeTypes}
                    onEdgesChange={onEdgesChange}
                    onEdgeContextMenu={onEdgeContextMenu}
                    onEdgeDoubleClick={onOpenPanel}

                    onConnect={onConnect}

                    defaultEdgeOptions={{
                        markerEnd: {
                            type: MarkerType.ArrowClosed,
                            color: '#b1b1b7',
                        },
                    }}

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
                        setContextMenu({
                            type: ContextMenuTypes.DEFAULT,
                            show: true,
                            pos: { x: e.clientX, y: e.clientY },
                            relativePos: screenToFlowPosition({
                                x: e.clientX,
                                y: e.clientY,
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
                        setHasUnsavedChanges(true);

                        if (type === 'Node') {
                            setPolyglotNodes((prev) => prev.filter(n => n._id !== id));
                        } else if (type === 'Edge') {
                            setPolyglotEdges((prev) => prev.filter(e => e._id !== id));
                        }
                    }}
                />

                <ContextualSidebar
                    selectedElement={activeElement}
                    onUpdateElement={(updatedElement: any) => {
                        setHasUnsavedChanges(true);

                        if (selectedElement?.type === 'Node') {
                            setPolyglotNodes(prev => prev.map(n => n.reactFlow?.id === selectedElement.id ? updatedElement : n));
                        } else if (selectedElement?.type === 'Edge') {
                            setPolyglotEdges(prev => prev.map(e => e.reactFlow?.id === selectedElement.id ? updatedElement : e));
                        }
                    }}
                    onClearSelection={compoundClearSelection}
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