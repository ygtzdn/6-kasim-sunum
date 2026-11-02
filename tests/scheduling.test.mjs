import test from "node:test";
import assert from "node:assert/strict";
import {
  calculateSchedule,
  defaultSchedule,
  parseQueue,
  createFlashState,
  nextFlashStep,
  flashWriteAmplification,
} from "../src/chapters/chapter-11-2-3/model.ts";

test("default FCFS / SCAN / C-SCAN paths and totals match the teaching contract", () => {
  const expected = {
    FCFS: {
      path: [35, 42, 12, 76, 24, 60],
      order: [42, 12, 76, 24, 60],
      total: 189,
    },
    SCAN: {
      path: [35, 42, 60, 76, 99, 24, 12],
      order: [42, 60, 76, 24, 12],
      total: 151,
    },
    "C-SCAN": {
      path: [35, 42, 60, 76, 99, 0, 12, 24],
      order: [42, 60, 76, 12, 24],
      total: 187,
    },
  };
  for (const [algorithm, result] of Object.entries(expected)) {
    const actual = calculateSchedule(algorithm, defaultSchedule);
    assert.deepEqual(actual.path, result.path);
    assert.deepEqual(
      actual.serviceOrder.map((request) => request.cylinder),
      result.order,
    );
    assert.equal(actual.total, result.total);
    assert.equal(
      actual.events.reduce((total, event) => total + event.distance, 0),
      result.total,
    );
  }
});

test("SCAN visits the physical edge before reversing; C-SCAN charges the wrap", () => {
  const input = { head: 35, queue: [42, 12, 76, 24, 60], direction: "down" };
  assert.deepEqual(
    calculateSchedule("SCAN", input).path,
    [35, 24, 12, 0, 42, 60, 76],
  );
  const circular = calculateSchedule("C-SCAN", input);
  assert.deepEqual(circular.path, [35, 24, 12, 0, 99, 76, 60, 42]);
  assert.equal(circular.total, 191);
  assert.equal(
    circular.events.find((event) => event.kind === "wrap").distance,
    99,
  );
});

test("empty, repeated, current-head and endpoint requests preserve identities and terminate", () => {
  for (const algorithm of ["FCFS", "SCAN", "C-SCAN"]) {
    assert.equal(
      calculateSchedule(algorithm, { head: 35, queue: [], direction: "up" })
        .total,
      0,
    );
    const result = calculateSchedule(algorithm, {
      head: 35,
      queue: [35, 99, 99, 0, 35],
      direction: "up",
    });
    assert.equal(result.serviceOrder.length, 5);
    assert.equal(
      new Set(result.serviceOrder.map((request) => request.id)).size,
      5,
    );
    assert.equal(
      result.events.filter(
        (event) => event.kind === "service" && event.position === 99,
      ).length,
      2,
    );
    if (algorithm !== "FCFS")
      assert.deepEqual(
        result.serviceOrder.slice(0, 2).map((request) => request.id),
        [0, 4],
      );
    assert.equal(
      result.total,
      result.events.reduce((total, event) => total + event.distance, 0),
    );
  }
  assert.deepEqual(
    calculateSchedule("SCAN", { head: 0, queue: [99], direction: "up" }).path,
    [0, 99],
  );
  assert.deepEqual(
    calculateSchedule("C-SCAN", { head: 35, queue: [99, 0], direction: "up" })
      .path,
    [35, 99, 0, 0],
  );
  assert.deepEqual(
    calculateSchedule("FCFS", {
      head: 35,
      queue: [42, 35],
      direction: "up",
    }).serviceOrder.map((request) => request.id),
    [0, 1],
  );
});

test("queue parsing accepts separators and duplicates, rejects invalid bounds and fractions", () => {
  assert.deepEqual(parseQueue("42, 12 76,24\n60,42"), [42, 12, 76, 24, 60, 42]);
  assert.deepEqual(parseQueue("  "), []);
  for (const input of [
    "-1",
    "1.2",
    "abc",
    "100",
    "1e1",
    Array(21).fill("1").join(","),
  ])
    assert.throws(() => parseQueue(input));
  assert.throws(() =>
    calculateSchedule("SCAN", { head: 100, queue: [], direction: "up" }),
  );
  assert.throws(() =>
    calculateSchedule("FCFS", { head: 35, queue: [1.5], direction: "up" }),
  );
});

test("every schedule services every request once, and cumulative totals match actual movement", () => {
  for (const head of [0, 35, 99])
    for (const direction of ["up", "down"])
      for (const queue of [[0, 99, 0, 35], [35, 35], [10, 20, 80], []])
        for (const algorithm of ["FCFS", "SCAN", "C-SCAN"]) {
          const result = calculateSchedule(algorithm, {
            head,
            queue,
            direction,
          });
          assert.deepEqual(
            result.serviceOrder
              .map((request) => request.id)
              .sort((a, b) => a - b),
            queue.map((_, index) => index),
          );
          assert.equal(
            result.total,
            result.path
              .slice(1)
              .reduce(
                (sum, position, index) =>
                  sum + Math.abs(position - result.path[index]),
                0,
              ),
          );
        }
});

test("GC preserves live mappings, then erases, ending at 3 host / 5 physical writes / 1 erase", () => {
  let state = createFlashState();
  const initial = JSON.stringify(state);
  assert.equal(flashWriteAmplification(state), null);
  const counters = [
    [1, 1, 0],
    [2, 2, 0],
    [2, 4, 0],
    [2, 4, 1],
    [3, 5, 1],
  ];
  for (const expected of counters) {
    const previous = state;
    state = nextFlashStep(state);
    assert.notEqual(state, previous);
    assert.deepEqual(
      [state.hostWrites, state.physicalWrites, state.erases],
      expected,
    );
    for (const [logical, location] of Object.entries(state.mapping)) {
      const page = state.blocks[location.block][location.page];
      assert.equal(page.status, "valid");
      assert.equal(page.logical, Number(logical));
      assert.equal(
        state.blocks
          .flat()
          .filter(
            (item) =>
              item.status === "valid" && item.logical === Number(logical),
          ).length,
        1,
      );
    }
  }
  assert.equal(flashWriteAmplification(state), 5 / 3);
  assert.equal(state.reservedBlock, 0);
  assert.ok(state.blocks[0].every((page) => page.status === "free"));
  assert.equal(state.blocks[2][0].status, "invalid");
  assert.deepEqual(state.mapping[2], { block: 2, page: 2 });
  assert.equal(nextFlashStep(state), state);
  assert.equal(JSON.stringify(createFlashState()), initial);
});

test("flash transitions are immutable and refuse to erase a block with live data", () => {
  const initial = createFlashState();
  const snapshot = JSON.stringify(initial);
  nextFlashStep(initial);
  assert.equal(JSON.stringify(initial), snapshot);
  assert.throws(() => nextFlashStep({ ...initial, step: 3 }), /korunmadan/);
});
