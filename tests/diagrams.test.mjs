import test from "node:test";
import assert from "node:assert/strict";
import {
  layoutDiagram,
  DIAGRAM_NODE_WIDTH as W,
  DIAGRAM_NODE_HEIGHT as H,
  DIAGRAM_EDGE_LABEL_WIDTH,
  DIAGRAM_EDGE_LABEL_HEIGHT,
} from "../src/components/diagrams/layout.mjs";

test("Dagre positions are finite, deterministic and non-overlapping for paths and branching SAN graphs", () => {
  const nodes = ["h0", "h1", "fabric", "a0", "a1", "lun"].map((id) => ({ id }));
  const edges = [
    ["h0", "fabric"],
    ["h1", "fabric"],
    ["fabric", "a0"],
    ["fabric", "a1"],
    ["a0", "lun"],
  ].map(([source, target]) => ({ source, target }));
  for (const direction of ["LR", "TB"]) {
    const result = layoutDiagram(nodes, edges, direction);
    assert.deepEqual(layoutDiagram(nodes, edges, direction), result);
    for (const a of nodes) {
      const p = result.positions[a.id];
      assert.ok(
        Number.isFinite(p.x) && Number.isFinite(p.y) && p.x >= 0 && p.y >= 0,
      );
      for (const b of nodes.filter((n) => n.id !== a.id)) {
        const q = result.positions[b.id];
        assert.ok(
          p.x + W <= q.x || q.x + W <= p.x || p.y + H <= q.y || q.y + H <= p.y,
          `${a.id}/${b.id} overlap`,
        );
      }
    }
    for (const edge of edges) {
      const a = result.positions[edge.source],
        b = result.positions[edge.target];
      assert.ok(direction === "LR" ? a.x < b.x : a.y < b.y);
    }
  }
});
test("bidirectional swap edges keep one deterministic pair of payload locations", () => {
  const nodes = [{ id: "ram" }, { id: "swap" }],
    edges = [
      { id: "write", source: "ram", target: "swap" },
      { id: "read", source: "swap", target: "ram" },
    ];
  assert.deepEqual(layoutDiagram(nodes, edges), layoutDiagram(nodes, edges));
  assert.notDeepEqual(
    layoutDiagram(nodes, edges).positions.ram,
    layoutDiagram(nodes, edges).positions.swap,
  );
  assert.deepEqual(nodes, [{ id: "ram" }, { id: "swap" }]);
});
test("Dagre reserves real space for edge labels between cards in both orientations", () => {
  const nodes = [{ id: "damaged" }, { id: "healthy" }];
  const edge = {
    source: "damaged",
    target: "healthy",
    label: "Sağlam bilgi gerekir",
  };
  for (const direction of ["LR", "TB"]) {
    const plain = layoutDiagram(
      nodes,
      [{ ...edge, label: undefined }],
      direction,
    );
    const labeled = layoutDiagram(nodes, [edge], direction);
    const gap = (layout) =>
      direction === "LR"
        ? layout.positions.healthy.x - layout.positions.damaged.x - W
        : layout.positions.healthy.y - layout.positions.damaged.y - H;
    assert.ok(
      gap(labeled) >=
        gap(plain) +
          (direction === "LR"
            ? DIAGRAM_EDGE_LABEL_WIDTH
            : DIAGRAM_EDGE_LABEL_HEIGHT),
    );
  }
});
test("invalid diagram identity or dangling edges fail clearly", () => {
  assert.throws(() => layoutDiagram([], []), RangeError);
  assert.throws(
    () => layoutDiagram([{ id: "a" }, { id: "a" }], []),
    RangeError,
  );
  assert.throws(
    () => layoutDiagram([{ id: "a" }], [{ source: "a", target: "b" }]),
    RangeError,
  );
});

test("fixed layouts reject intersecting cards while preserving intentional rows", () => {
  assert.throws(
    () =>
      layoutDiagram(
        [
          { id: "ram", position: { x: 0, y: 0 } },
          { id: "swap", position: { x: W - 1, y: H - 1 } },
        ],
        [],
      ),
    /kartları çakışıyor/,
  );
  const nodes = [
    { id: "ram", position: { x: 0, y: 0 } },
    { id: "swap", position: { x: W + 80, y: 0 } },
    { id: "device", position: { x: W + 80, y: H + 80 } },
  ];
  assert.deepEqual(layoutDiagram(nodes, []).positions.swap, {
    x: W + 80,
    y: 0,
  });
});
