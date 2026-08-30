'use client';

import {
    DragEventHandler,
    MouseEventHandler,
    useCallback,
    useEffect,
    useMemo,
    useState,
    useRef,
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
    SelectionMode,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { v4 as UUIDv4 } from 'uuid';
import styles from './FlowEditor.module.css';
import ContextMenu, { ContextMenuProps, ContextMenuTypes } from '../menus/ContextMenu';
import { PolyglotNode } from '@/types/PolyglotNode';
import { PolyglotEdge } from '@/types/PolyglotEdge';
import EditorNav from '../navbars/EditorNav';
import { edgeTypes, nodeTypes } from '../ElementMapping';
import ContextualSidebar from '../menus/ContextualSidebar';
import { createNewDefaultPolyglotEdge, createNewDefaultPolyglotNode } from '@/lib/factories/polyglotGenerators';
import { validateNodeData } from '@/lib/validation/nodeValidator';
import { Flow } from '@/types';
import { PolyglotFlow } from '@/types/PolyglotFlow';

// ==========================================
// CONFIGURABLE KEYBOARD SHORTCUTS
// ==========================================
const SHORTCUTS = {
    // CTRL+Z or CMD+Z
    isUndo: (e: KeyboardEvent) => (e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === 'z' || e.code === 'KeyZ') && !e.shiftKey,
    // CTRL+Y or CMD+Y or CTRL+SHIFT+Z or CMD+SHIFT+Z
    isRedo: (e: KeyboardEvent) => (e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === 'y' || e.code === 'KeyY' || ((e.key.toLowerCase() === 'z' || e.code === 'KeyZ') && e.shiftKey)),
};

type FlowEditorProps = {
    mode: 'read' | 'write';
    flow: Flow;
    saveFlow: (updatedFlow: Flow) => Promise<void>;
    onSelectionChange?: (selection: OnSelectionChangeParams) => void;
};

const deleteKeyCodes = ['Delete'];
const multiSelectionKeyCodes = ['Control', 'Meta'];
const panOnDragButton = [1];

const FlowEditor = ({ flow, saveFlow, onSelectionChange }: FlowEditorProps) => {
    const { screenToFlowPosition, getNodes, getEdges } = useReactFlow();
    const { resetSelectedElements } = useStoreApi().getState();

    const defaultEdgeOptions = useMemo(() => ({
        markerEnd: {
            type: MarkerType.ArrowClosed,
            color: '#b1b1b7',
        },
    }), []);

    const fitViewOptions = useMemo(() => ({
        padding: 0.2
    }), []);

    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    const [flowName, setFlowName] = useState<string>(flow.name || '');
    const [flowDescription, setFlowDescription] = useState<string>(flow.description || '');
    const [isFlowPublished, setIsFlowPublished] = useState<boolean>(flow.published || false);
    const [polyglotNodes, setPolyglotNodes] = useState<PolyglotNode[]>(flow.flowJson?.nodes || []);
    const [polyglotEdges, setPolyglotEdges] = useState<PolyglotEdge[]>(flow.flowJson?.edges || []);
    const [selectedElement, setSelectedElement] = useState<{ type: 'Node' | 'Edge'; id: string } | null>(null);

    const [isOpenPanel, setIsOpenPanel] = useState(false);
    const onOpenPanel = () => setIsOpenPanel(true);
    const onClosePanel = () => setIsOpenPanel(false);

    const [contextMenu, setContextMenu] = useState<ContextMenuProps>({
        show: false,
        type: ContextMenuTypes.DEFAULT,
        pos: { x: 0, y: 0 },
    });

    // ==========================================
    // UNDO / REDO HISTORY STACK
    // ==========================================
    const [past, setPast] = useState<{ nodes: PolyglotNode[]; edges: PolyglotEdge[] }[]>([]);
    const [future, setFuture] = useState<{ nodes: PolyglotNode[]; edges: PolyglotEdge[] }[]>([]);

    // Safely takes a snapshot of the current state BEFORE it gets mutated
    const takeSnapshot = useCallback(() => {
        setPast((p) => {
            const last = p[p.length - 1];
            // Prevent duplicate snapshots if state hasn't actually changed
            if (last && last.nodes === polyglotNodes && last.edges === polyglotEdges) {
                return p;
            }
            // Keep history to 50 steps to preserve memory
            return [...p, { nodes: polyglotNodes, edges: polyglotEdges }].slice(-50);
        });
        setFuture([]); // Editing clears the redo future
    }, [polyglotNodes, polyglotEdges]);

    const undo = useCallback(() => {
        if (past.length === 0) return;
        const previous = past[past.length - 1];
        setFuture((f) => [{ nodes: polyglotNodes, edges: polyglotEdges }, ...f]);
        setPast((p) => p.slice(0, p.length - 1));
        setPolyglotNodes(previous.nodes);
        setPolyglotEdges(previous.edges);
        setHasUnsavedChanges(true);
    }, [past, polyglotNodes, polyglotEdges]);

    const redo = useCallback(() => {
        if (future.length === 0) return;
        const next = future[0];
        setPast((p) => [...p, { nodes: polyglotNodes, edges: polyglotEdges }]);
        setFuture((f) => f.slice(1));
        setPolyglotNodes(next.nodes);
        setPolyglotEdges(next.edges);
        setHasUnsavedChanges(true);
    }, [future, polyglotNodes, polyglotEdges]);


    // ==========================================
    // KEYBOARD LISTENER (Copy, Paste, Undo, Redo)
    // ==========================================

    // 1. Keep a stable reference to the latest state/functions so the listener never has to unmount
    const stateRef = useRef({ polyglotNodes, polyglotEdges, undo, redo, takeSnapshot });
    useEffect(() => {
        stateRef.current = { polyglotNodes, polyglotEdges, undo, redo, takeSnapshot };
    }, [polyglotNodes, polyglotEdges, undo, redo, takeSnapshot]);

    useEffect(() => {
        const handleKeyDown = async (e: KeyboardEvent) => {
            if (
                e.target instanceof HTMLInputElement ||
                e.target instanceof HTMLTextAreaElement ||
                (e.target as HTMLElement).isContentEditable
            ) return;

            // Extract the freshest state from the ref
            const { undo, redo, takeSnapshot, polyglotNodes, polyglotEdges } = stateRef.current;

            // Trigger Undo
            if (SHORTCUTS.isUndo(e)) {
                e.preventDefault();
                undo();
                return;
            }

            // Trigger Redo
            if (SHORTCUTS.isRedo(e)) {
                e.preventDefault();
                redo();
                return;
            }

            // ==========================================
            // COPY: CTRL+C or CMD+C
            // ==========================================
            if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === 'c' || e.code === 'KeyC')) {
                const rfNodes = getNodes();
                const rfEdges = getEdges();

                const selectedNodeIds = rfNodes.filter(n => n.selected).map(n => n.id);
                const selectedEdgeIds = rfEdges.filter(e => e.selected).map(e => e.id);

                const nodesToCopy = polyglotNodes.filter(n => n.reactFlow && selectedNodeIds.includes(n.reactFlow.id));

                // CRITICAL RULE: Only copy edges if BOTH source and target nodes are in the copied set
                const edgesToCopy = polyglotEdges.filter(e =>
                    e.reactFlow &&
                    selectedEdgeIds.includes(e.reactFlow.id) &&
                    selectedNodeIds.includes(e.reactFlow.source) &&
                    selectedNodeIds.includes(e.reactFlow.target)
                );

                if (nodesToCopy.length === 0 && edgesToCopy.length === 0) return;

                const clipboardData = { type: 'polyglot-flow', nodes: nodesToCopy, edges: edgesToCopy };
                await navigator.clipboard.writeText(JSON.stringify(clipboardData));
            }

            // ==========================================
            // PASTE: CTRL+V or CMD+V
            // ==========================================
            if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
                try {
                    const text = await navigator.clipboard.readText();
                    const parsed = JSON.parse(text);

                    // Validate this is our specific JSON payload, not random text
                    if (parsed.type !== 'polyglot-flow') return;

                    takeSnapshot(); // Snapshot BEFORE pasting!

                    resetSelectedElements();
                    const idMap = new Map<string, string>();

                    const newNodes = parsed.nodes.map((oldNode: PolyglotNode) => {
                        const newId = UUIDv4();
                        idMap.set(oldNode._id, newId);

                        return {
                            ...oldNode,
                            _id: newId,
                            reactFlow: {
                                ...oldNode.reactFlow,
                                id: newId,
                                position: {
                                    x: oldNode.reactFlow!.position.x + 30,
                                    y: oldNode.reactFlow!.position.y + 30,
                                },
                                selected: true,
                            },
                        };
                    });

                    const newEdges = parsed.edges.map((oldEdge: PolyglotEdge) => {
                        const newId = UUIDv4();
                        return {
                            ...oldEdge,
                            _id: newId,
                            reactFlow: {
                                ...oldEdge.reactFlow,
                                id: newId,
                                source: idMap.get(oldEdge.reactFlow!.source) || oldEdge.reactFlow!.source,
                                target: idMap.get(oldEdge.reactFlow!.target) || oldEdge.reactFlow!.target,
                                selected: true,
                            },
                        };
                    });

                    setPolyglotNodes(prev => [...prev, ...newNodes]);
                    setPolyglotEdges(prev => [...prev, ...newEdges]);
                    setHasUnsavedChanges(true);
                } catch (err) {
                    // Ignore errors if clipboard contains generic text
                }
            }
        };

        // Attach listener ONCE with capture flag. The empty dependency array [] stops it from ever unmounting.
        document.addEventListener('keydown', handleKeyDown, { capture: true });
        return () => document.removeEventListener('keydown', handleKeyDown, { capture: true });
    }, [getNodes, getEdges, resetSelectedElements]);

    const hideContextMenu = () => {
        setContextMenu((prev) => ({ ...prev, show: false }));
    };

    const compoundClearSelection = useCallback(() => {
        resetSelectedElements();
        setSelectedElement(null);
    }, [resetSelectedElements]);

    // ============================================================================
    // REACT FLOW CHANGE HANDLERS
    // ============================================================================

    const onNodesChange: OnNodesChange = (changes) => {
        if (changes.some((c) => c.type === 'remove' || c.type === 'add')) {
            takeSnapshot(); // Snapshot before addition or deletion
            setHasUnsavedChanges(true);
        } else if (changes.some((c) => c.type === 'position')) {
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
            takeSnapshot(); // Snapshot before addition or deletion
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

        takeSnapshot(); // Snapshot BEFORE dropping a new node

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
                data: {} as any,
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
        if (!connection.source || !connection.target) return;

        takeSnapshot(); // Snapshot BEFORE drawing a new connection

        const sourceNode = polyglotNodes.find(
            (n) => n._id === connection.source || n.reactFlow?.id === connection.source
        );
        const sourceType = sourceNode?.type || '';

        const newEdge = createNewDefaultPolyglotEdge(
            connection.source,
            sourceType,
            connection.target
        );

        setHasUnsavedChanges(true);
        setPolyglotEdges((prev) => [...prev, newEdge]);
    }, [polyglotNodes, takeSnapshot]);

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

    const getCleanFlowJson = (): PolyglotFlow => {
        const cleanNodes = polyglotNodes.map((node) => {
            if (!node.reactFlow) return node;
            const { width, height, selected, dragging, positionAbsolute, resizing, ...cleanReactFlow } = node.reactFlow as any;
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
            nodes: cleanNodes,
            edges: cleanEdges,
        };
    };

    const handleSave = async (overrides?: Partial<Flow>) => {
        const cleanFlowJson = getCleanFlowJson();

        const invalidNodes = cleanFlowJson.nodes.filter((node) => {
            const result = validateNodeData(node.type, node.data);
            return !result.ok;
        });

        if (invalidNodes.length > 0) {
            window.alert(`Cannot save flow: ${invalidNodes.length} node(s) have validation errors.`);
            return;
        }

        await saveFlow({
            ...flow,
            name: flowName,
            description: flowDescription,
            published: isFlowPublished,
            ...overrides,
            flowJson: cleanFlowJson,
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
                flow={{
                    ...flow,
                    name: flowName,
                    description: flowDescription,
                    published: isFlowPublished,
                    flowJson: getCleanFlowJson(),
                }}
                saveFunc={() => handleSave()}
                hasUnsavedChanges={hasUnsavedChanges}
                canUndo={past.length > 0}
                canRedo={future.length > 0}
                onUndo={undo}
                onRedo={redo}
                onUpdateFlowInfo={async (updates: Partial<Flow>) => {
                    if (updates.name !== undefined) setFlowName(updates.name);
                    if (updates.description !== undefined) setFlowDescription(updates.description);
                    if (updates.published !== undefined) setIsFlowPublished(updates.published);
                    await handleSave(updates);
                }}
                onApplyLocalFlow={(updates: Partial<Flow>) => {
                    takeSnapshot();
                    if (updates.name !== undefined) setFlowName(updates.name);
                    // (Assuming you added flowDescription from our previous step)
                    if (updates.description !== undefined) setFlowDescription(updates.description);
                    if (updates.published !== undefined) setIsFlowPublished(updates.published);

                    if (updates.flowJson?.nodes !== undefined) {
                        const syncedNodes = updates.flowJson.nodes.map(node => {
                            if (!node.reactFlow) return node as PolyglotNode;

                            // Find the previous state of this node
                            const prevNode = polyglotNodes.find(pn => pn._id === node._id);

                            const rfData = node.reactFlow.data as any;
                            const prevRfData = prevNode?.reactFlow?.data as any;

                            let resolvedTitle = node.title;

                            // Detect exactly which title field the user changed
                            if (prevNode) {
                                if (rfData?.title !== prevRfData?.title) resolvedTitle = rfData?.title;
                                else if (rfData?.label !== prevRfData?.label) resolvedTitle = rfData?.label;
                                else if (node.title !== prevNode.title) resolvedTitle = node.title;
                            } else {
                                resolvedTitle = node.title || rfData?.title || rfData?.label || 'New Node';
                            }

                            // Sync all three fields to the newest value
                            return {
                                ...node,
                                title: resolvedTitle,
                                reactFlow: {
                                    ...node.reactFlow,
                                    data: {
                                        ...(rfData || {}),
                                        label: resolvedTitle,
                                        title: resolvedTitle
                                    }
                                }
                            } as PolyglotNode;
                        });
                        setPolyglotNodes(syncedNodes);
                    }

                    if (updates.flowJson?.edges !== undefined) setPolyglotEdges(updates.flowJson.edges);
                    setHasUnsavedChanges(true);
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

                    // Crucial: Snapshot the initial location before the user finishes dragging
                    onNodeDragStart={() => takeSnapshot()}

                    edges={polyglotEdges.filter((e) => e.reactFlow !== undefined).map((e) => e.reactFlow!)}
                    edgeTypes={edgeTypes}
                    onEdgesChange={onEdgesChange}
                    onEdgeContextMenu={onEdgeContextMenu}
                    onEdgeDoubleClick={onOpenPanel}

                    onConnect={onConnect}
                    defaultEdgeOptions={defaultEdgeOptions}

                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    deleteKeyCode={deleteKeyCodes}
                    multiSelectionKeyCode={multiSelectionKeyCodes}
                    snapToGrid={true}
                    fitView={true}
                    fitViewOptions={fitViewOptions}

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

                    panOnDrag={panOnDragButton}
                    panActivationKeyCode="Space" // Allows the user to hold Spacebar + Left Click to pan

                    // AREA SELECTION (LASSO) CONTROLS
                    selectionOnDrag={true}   // Makes Left Click + Drag on the background draw the lasso
                    selectionKeyCode={null} // CRITICAL: Removes the need to hold Shift to lasso, preventing input cross-talk
                    selectionMode={SelectionMode.Partial} // Selects elements even if the box only touches them partially (requires importing SelectionMode from 'reactflow')
                >
                    <Background variant={BackgroundVariant.Dots} />
                    <Controls />
                </ReactFlow>

                <ContextMenu
                    {...contextMenu}
                    elementId={activeElement?._id}
                    onDismiss={hideContextMenu}
                    onRemoveElement={(type, id) => {
                        takeSnapshot(); // Snapshot BEFORE deleting via context menu
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
                        takeSnapshot();
                        setHasUnsavedChanges(true);

                        if (selectedElement?.type === 'Node') {
                            setPolyglotNodes(prev => prev.map(n => {
                                if (n.reactFlow?.id === selectedElement.id) {

                                    const rfData = updatedElement.reactFlow?.data as any;
                                    const prevRfData = n.reactFlow?.data as any;

                                    let resolvedTitle = updatedElement.title;

                                    // Detect exactly which title field the user changed
                                    if (rfData?.title !== prevRfData?.title) resolvedTitle = rfData?.title;
                                    else if (rfData?.label !== prevRfData?.label) resolvedTitle = rfData?.label;
                                    else if (updatedElement.title !== n.title) resolvedTitle = updatedElement.title;

                                    // Sync all three fields to the newest value
                                    return {
                                        ...updatedElement,
                                        title: resolvedTitle,
                                        reactFlow: {
                                            ...updatedElement.reactFlow,
                                            data: {
                                                ...(rfData || {}),
                                                label: resolvedTitle,
                                                title: resolvedTitle
                                            }
                                        }
                                    } as PolyglotNode;
                                }
                                return n;
                            }));
                        } else if (selectedElement?.type === 'Edge') {
                            setPolyglotEdges(prev => prev.map(e => {
                                if (e.reactFlow?.id === selectedElement.id) {
                                    return {
                                        ...updatedElement,
                                        reactFlow: { ...updatedElement.reactFlow }
                                    };
                                }
                                return e;
                            }));
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