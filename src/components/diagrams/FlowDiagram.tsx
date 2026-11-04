import { memo, useEffect, useId, useMemo, type ReactNode } from "react";
import { motion } from "motion/react";
import type { LucideIcon } from "lucide-react";
import {
  ReactFlow,
  Handle,
  Position,
  MarkerType,
  useReactFlow,
  useStore,
  type Node,
  type NodeProps,
  type Edge,
} from "@xyflow/react";
import {
  DIAGRAM_NODE_HEIGHT as HEIGHT,
  DIAGRAM_NODE_WIDTH as WIDTH,
  layoutDiagram,
} from "./layout.mjs";

export interface DiagramNode {
  id: string;
  label: string;
  detail?: string;
  icon?: LucideIcon;
  tone?: "default" | "active" | "complete" | "muted" | "error";
  badge?: string;
  body?: ReactNode;
  position?: { x: number; y: number };
}
type DiagramSide = "left" | "right" | "top" | "bottom";
export interface DiagramEdge {
  id?: string;
  source: string;
  target: string;
  label?: string;
  active?: boolean;
  muted?: boolean;
  error?: boolean;
  animated?: boolean;
  sourceSide?: DiagramSide;
  targetSide?: DiagramSide;
}
interface NodeData extends Record<string, unknown>, DiagramNode {
  enabled: boolean;
}
type LessonNode = Node<NodeData, "lesson">;
const TONES = {
  default: {
    background: "#ffffff",
    color: "#111827",
    border: "#111827",
    opacity: 1,
  },
  active: {
    background: "#2247eb",
    color: "#ffffff",
    border: "#2247eb",
    opacity: 1,
  },
  complete: {
    background: "#e7eaff",
    color: "#1735b7",
    border: "#2247eb",
    opacity: 1,
  },
  muted: {
    background: "#f8fafc",
    color: "#64748b",
    border: "#cbd5e1",
    opacity: 0.6,
  },
  error: {
    background: "#fff0e9",
    color: "#9a3412",
    border: "#f05b28",
    opacity: 1,
  },
};
const DiagramNodeView = memo(function DiagramNodeView({
  data,
}: NodeProps<LessonNode>) {
  const tone = TONES[data.tone ?? "default"];
  const Icon = data.icon;
  return (
    <motion.div
      className="diagram-node"
      initial={false}
      animate={{
        backgroundColor: tone.background,
        color: tone.color,
        borderColor: tone.border,
        opacity: tone.opacity,
        scale: data.tone === "active" ? 1.025 : 1,
      }}
      transition={{
        duration: data.enabled ? 0.24 : 0,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {SIDES.flatMap((side) =>
        ["source", "target"].map((type) => (
          <Handle
            key={`${type}-${side}`}
            type={type as "source" | "target"}
            id={`${type}-${side}`}
            position={
              Position[
                side === "left"
                  ? "Left"
                  : side === "right"
                    ? "Right"
                    : side === "top"
                      ? "Top"
                      : "Bottom"
              ]
            }
            className="diagram-handle"
          />
        )),
      )}
      <div className="diagram-node-heading">
        {Icon && <Icon size={26} strokeWidth={1.6} aria-hidden="true" />}
        <strong>{data.label}</strong>
      </div>
      {data.detail && <span className="diagram-detail">{data.detail}</span>}
      {data.badge && <span className="diagram-badge">{data.badge}</span>}
      {data.body && <div className="diagram-body">{data.body}</div>}
    </motion.div>
  );
});
const NODE_TYPES = { lesson: DiagramNodeView };
const SIDES = ["left", "right", "top", "bottom"] as const;
const FIT_OPTIONS = { padding: 0.08, minZoom: 0.08, maxZoom: 1.3 };

// React Flow measures its own container. Refit through its API when that size changes.
function ResponsiveFit() {
  const width = useStore((state) => state.width);
  const height = useStore((state) => state.height);
  // Watch committed library geometry, rather than fitting before new nodes reach the store.
  const geometry = useStore((state) =>
    [...state.nodeLookup.values()]
      .map(
        (node) =>
          `${node.id}:${node.internals.positionAbsolute.x},${node.internals.positionAbsolute.y},${node.measured.width},${node.measured.height}`,
      )
      .join("|"),
  );
  const { fitView } = useReactFlow();
  useEffect(() => {
    if (width > 0 && height > 0) void fitView({ ...FIT_OPTIONS, duration: 0 });
  }, [width, height, geometry, fitView]);
  return null;
}

export function FlowDiagram({
  id,
  label,
  nodes,
  edges,
  direction = "LR",
  enabled = true,
  className = "",
}: {
  id: string;
  label: string;
  nodes: readonly DiagramNode[];
  edges: readonly DiagramEdge[];
  direction?: "LR" | "TB";
  enabled?: boolean;
  className?: string;
}) {
  // Outgoing and incoming stages briefly coexist; their SVG marker namespaces must differ.
  const instanceId = useId().replace(/[^a-zA-Z0-9_-]/g, "_");
  const layout = useMemo(
    () => layoutDiagram(nodes, edges, direction),
    [nodes, edges, direction],
  );
  const handles = SIDES.flatMap((side) =>
    ["source", "target"].map((type) => ({
      id: `${type}-${side}`,
      type: type as "source" | "target",
      position:
        side === "left"
          ? Position.Left
          : side === "right"
            ? Position.Right
            : side === "top"
              ? Position.Top
              : Position.Bottom,
      x: side === "left" ? 0 : side === "right" ? WIDTH : WIDTH / 2,
      y: side === "top" ? 0 : side === "bottom" ? HEIGHT : HEIGHT / 2,
    })),
  );
  const flowNodes: LessonNode[] = nodes.map((node) => ({
    id: node.id,
    type: "lesson",
    position: layout.positions[node.id],
    width: WIDTH,
    height: HEIGHT,
    data: { ...node, enabled },
    handles,
    draggable: false,
    selectable: false,
    focusable: false,
  }));
  const flowEdges: Edge[] = edges.map((edge, index) => {
    const source = layout.positions[edge.source];
    const target = layout.positions[edge.target];
    const reverse =
      direction === "LR" ? source.x > target.x : source.y > target.y;
    const color = edge.error ? "#f05b28" : edge.active ? "#2247eb" : "#94a3b8";
    return {
      id: edge.id ?? `${edge.source}-${edge.target}-${index}`,
      source: edge.source,
      target: edge.target,
      sourceHandle: `source-${edge.sourceSide ?? (reverse ? (direction === "LR" ? "top" : "right") : direction === "LR" ? "right" : "bottom")}`,
      targetHandle: `target-${edge.targetSide ?? (reverse ? (direction === "LR" ? "top" : "right") : direction === "LR" ? "left" : "top")}`,
      type: "smoothstep",
      className: "diagram-edge",
      label: edge.label,
      animated: enabled && Boolean(edge.animated && edge.active),
      selectable: false,
      focusable: false,
      style: {
        stroke: color,
        strokeWidth: edge.active ? 3 : 2,
        opacity: edge.muted ? 0.22 : 1,
      },
      labelStyle: {
        fill: edge.error ? "#9a3412" : "#334155",
        fontWeight: 600,
        fontSize: 13,
      },
      labelBgStyle: { fill: "#f8f9fc" },
      labelBgPadding: [6, 4],
      labelBgBorderRadius: 6,
      markerEnd: { type: MarkerType.ArrowClosed, color, width: 18, height: 18 },
    };
  });
  const summary = nodes
    .map(
      (node) =>
        `${node.label}${node.detail ? `: ${node.detail}` : ""}${node.badge ? ` (${node.badge})` : ""}${node.tone === "active" ? ", etkin" : ""}`,
    )
    .join("; ");
  const nodeLabels = new Map(nodes.map((node) => [node.id, node.label]));
  const relationships = edges
    .map(
      (edge) =>
        `${nodeLabels.get(edge.source)} → ${nodeLabels.get(edge.target)}${edge.label ? `: ${edge.label}` : ""}${edge.active ? ", etkin bağlantı" : ""}`,
    )
    .join("; ");
  return (
    <figure
      className={`flow-diagram ${className}`}
      role="img"
      aria-label={`${label}. ${summary}. Bağlantılar: ${relationships}`}
      data-diagram-library="react-flow-dagre"
    >
      <ReactFlow
        id={`flow-${id}-${instanceId}`}
        nodes={flowNodes}
        edges={flowEdges}
        nodeTypes={NODE_TYPES}
        width={1000}
        height={420}
        fitView
        fitViewOptions={FIT_OPTIONS}
        minZoom={0.08}
        maxZoom={1.3}
        nodesDraggable={false}
        nodesConnectable={false}
        nodesFocusable={false}
        edgesFocusable={false}
        elementsSelectable={false}
        edgesReconnectable={false}
        disableKeyboardA11y
        deleteKeyCode={null}
        selectionKeyCode={null}
        multiSelectionKeyCode={null}
        panActivationKeyCode={null}
        zoomActivationKeyCode={null}
        panOnDrag={false}
        panOnScroll={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        preventScrolling={false}
        autoPanOnNodeFocus={false}
        autoPanOnConnect={false}
        autoPanOnNodeDrag={false}
        proOptions={{ hideAttribution: true }}
        aria-hidden="true"
        style={{ background: "transparent" }}
      >
        <ResponsiveFit />
      </ReactFlow>
    </figure>
  );
}
