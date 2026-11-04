import test from "node:test";
import assert from "node:assert/strict";
import {
  calculateSchedule,
  cylinderMaximum,
  defaultSchedule,
  parseQueue,
  createFlashState,
  nextFlashStep,
  flashWriteAmplification,
  flashStateAtStage,
} from "../src/chapters/chapter-11-2-3/model.ts";

test("default FCFS / SCAN / C-SCAN paths and totals match the teaching contract", () => {
  const expected = {
    FCFS: {
      path: [53, 98, 183, 37, 122, 14, 124, 65, 67],
      order: [98, 183, 37, 122, 14, 124, 65, 67],
      total: 640,
    },
    SCAN: {
      path: [53, 37, 14, 0, 65, 67, 98, 122, 124, 183],
      order: [37, 14, 65, 67, 98, 122, 124, 183],
      total: 236,
    },
    "C-SCAN": {
      path: [53, 37, 14, 0, 199, 183, 124, 122, 98, 67, 65],
      order: [37, 14, 183, 124, 122, 98, 67, 65],
      total: 386,
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

test("upward SCAN visits the physical edge before reversing; C-SCAN charges the wrap", () => {
  const input = { ...defaultSchedule, direction: "up" };
  assert.deepEqual(
    calculateSchedule("SCAN", input).path,
    [53, 65, 67, 98, 122, 124, 183, 199, 37, 14],
  );
  assert.equal(calculateSchedule("SCAN", input).total, 331);
  const circular = calculateSchedule("C-SCAN", input);
  assert.deepEqual(
    circular.path,
    [53, 65, 67, 98, 122, 124, 183, 199, 0, 14, 37],
  );
  assert.equal(circular.total, 382);
  assert.equal(
    circular.events.find((event) => event.kind === "wrap").distance,
    199,
  );
});

test("downward SCAN includes the physical edge; stopping at the last request would be LOOK", () => {
  const result = calculateSchedule("SCAN", defaultSchedule);
  // SCAN reaches cylinder 0 before serving the opposite side: 53 + 183.
  assert.equal(result.total, 53 + 183);
  const turn = result.events.find((event) => event.kind === "turn");
  assert.equal(turn.position, 0);
  assert.equal(turn.distance, 14);
  // LOOK turns at 14: (53 - 14) + (183 - 14) = 208, not this SCAN path.
  assert.equal(53 - 14 + (183 - 14), 208);
  assert.notEqual(result.total, 208);
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
      queue: [35, 199, 199, 0, 35],
      direction: "up",
    });
    assert.equal(result.serviceOrder.length, 5);
    assert.equal(
      new Set(result.serviceOrder.map((request) => request.id)).size,
      5,
    );
    assert.equal(
      result.events.filter(
        (event) => event.kind === "service" && event.position === 199,
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
    calculateSchedule("SCAN", { head: 0, queue: [199], direction: "up" }).path,
    [0, 199],
  );
  assert.deepEqual(
    calculateSchedule("C-SCAN", { head: 35, queue: [199, 0], direction: "up" })
      .path,
    [35, 199, 0, 0],
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
  assert.equal(cylinderMaximum, 199);
  assert.deepEqual(parseQueue("0, 100, 199"), [0, 100, 199]);
  for (const input of [
    "-1",
    "1.2",
    "abc",
    "200",
    "1e1",
    Array(21).fill("1").join(","),
  ])
    assert.throws(() => parseQueue(input));
  assert.throws(() =>
    calculateSchedule("SCAN", { head: 200, queue: [], direction: "up" }),
  );
  assert.throws(() =>
    calculateSchedule("FCFS", { head: 35, queue: [1.5], direction: "up" }),
  );
});

test("every schedule services every request once, and cumulative totals match actual movement", () => {
  for (const head of [0, 53, 199])
    for (const direction of ["up", "down"])
      for (const queue of [[0, 199, 0, 53], [53, 53], [10, 120, 180], []])
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

test("selecting flash stages out of order replays mappings, reserves and counters exactly", () => {
  const expected = [];
  let state = createFlashState();
  expected.push(state);
  for (let stage = 1; stage <= 5; stage++) {
    state = nextFlashStep(state);
    expected.push(state);
  }
  for (const stage of [5, 4, 2, 0, 3, 1, 5]) {
    assert.deepEqual(flashStateAtStage(stage), expected[stage]);
  }
  const beforeErase = flashStateAtStage(3);
  assert.equal(beforeErase.erases, 0);
  assert.equal(beforeErase.reservedBlock, 2);
  assert.ok(beforeErase.blocks[0].every((page) => page.status === "invalid"));
  const afterErase = flashStateAtStage(4);
  assert.equal(afterErase.erases, 1);
  assert.equal(afterErase.reservedBlock, 0);
  assert.ok(afterErase.blocks[0].every((page) => page.status === "free"));
  afterErase.blocks[0][0].status = "invalid";
  assert.deepEqual(flashStateAtStage(4), expected[4]);
});
