import dagre from "@dagrejs/dagre";

export const DIAGRAM_NODE_WIDTH = 208;
export const DIAGRAM_NODE_HEIGHT = 144;
export const DIAGRAM_EDGE_LABEL_WIDTH = 180;
export const DIAGRAM_EDGE_LABEL_HEIGHT = 28;

/** Deterministic library layout. Nodes are flat; semantic grouping stays in their labels.
 * @param {readonly {id:string,position?:{x:number,y:number}}[]} nodes
 * @param {readonly {source:string,target:string,id?:string,label?:string}[]} edges
 * @param {'LR'|'TB'} direction */
export function layoutDiagram(nodes, edges, direction = "LR") {
  if (!nodes.length) throw new RangeError("Diyagram en az bir düğüm içermeli.");
  if (!["LR", "TB"].includes(direction))
    throw new RangeError("Geçersiz diyagram yönü.");
  const ids = new Set(nodes.map((node) => node.id));
  if (ids.size !== nodes.length)
    throw new RangeError("Diyagram düğüm kimlikleri benzersiz olmalı.");
  if (nodes.some((node) => node.position)) {
    const positions = Object.fromEntries(
      nodes.map((node) => {
        const position = node.position;
        if (
          !position ||
          !Number.isFinite(position.x) ||
          !Number.isFinite(position.y)
        )
          throw new RangeError(
            "Sabit yerleşimde bütün düğümler sonlu konum taşımalı.",
          );
        return [node.id, { x: position.x, y: position.y }];
      }),
    );
    for (const edge of edges)
      if (!ids.has(edge.source) || !ids.has(edge.target))
        throw new RangeError("Sabit yerleşimde bağlantı düğümü bulunamadı.");
    return {
      width: Math.max(
        ...Object.values(positions).map(
          (position) => position.x + DIAGRAM_NODE_WIDTH,
        ),
      ),
      height: Math.max(
        ...Object.values(positions).map(
          (position) => position.y + DIAGRAM_NODE_HEIGHT,
        ),
      ),
      positions,
    };
  }
  const graph = new dagre.graphlib.Graph({ multigraph: true });
  graph.setGraph({
    rankdir: direction,
    nodesep: 48,
    ranksep: 74,
    marginx: 32,
    marginy: 54,
  });
  graph.setDefaultEdgeLabel(() => ({}));
  for (const node of nodes)
    graph.setNode(node.id, {
      width: DIAGRAM_NODE_WIDTH,
      height: DIAGRAM_NODE_HEIGHT,
    });
  for (const [index, edge] of edges.entries()) {
    if (!ids.has(edge.source) || !ids.has(edge.target))
      throw new RangeError(
        `Diyagram bağlantısının düğümü bulunamadı: ${edge.source} → ${edge.target}`,
      );
    graph.setEdge(
      edge.source,
      edge.target,
      edge.label
        ? {
            width: DIAGRAM_EDGE_LABEL_WIDTH,
            height: DIAGRAM_EDGE_LABEL_HEIGHT,
            labelpos: "c",
          }
        : {},
      edge.id ?? `edge-${index}`,
    );
  }
  dagre.layout(graph);
  return {
    width: graph.graph().width,
    height: graph.graph().height,
    positions: Object.fromEntries(
      nodes.map(({ id }) => {
        const node = graph.node(id);
        return [
          id,
          {
            x: node.x - DIAGRAM_NODE_WIDTH / 2,
            y: node.y - DIAGRAM_NODE_HEIGHT / 2,
          },
        ];
      }),
    ),
  };
}
