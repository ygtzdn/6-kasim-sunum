import test from "node:test";
import assert from "node:assert/strict";
import { presentationPosition } from "../src/presentation/position.mjs";

test("scene navigation atomically selects the new scene at its first stage without changing the outgoing snapshot", () => {
  const outgoing = { index: 4, stage: 5, direction: 1 };
  assert.deepEqual(
    presentationPosition(outgoing, { type: "scene", index: 5 }),
    { index: 5, stage: 0, direction: 1 },
  );
  assert.deepEqual(outgoing, { index: 4, stage: 5, direction: 1 });
  assert.deepEqual(
    presentationPosition(outgoing, { type: "scene", index: 2 }),
    { index: 2, stage: 0, direction: -1 },
  );
});
test("a delayed hash notification never resets an already-active scene's advanced stage", () => {
  let state = presentationPosition(
    { index: 0, stage: 2, direction: 1 },
    { type: "scene", index: 1 },
  );
  state = presentationPosition(state, {
    type: "stage",
    index: 1,
    value: 1,
    count: 5,
  });
  assert.equal(
    presentationPosition(state, { type: "scene", index: 1, sync: true }),
    state,
  );
  assert.deepEqual(state, { index: 1, stage: 1, direction: 1 });
});
test("stale events from an exiting scene cannot advance or reset the incoming scene", () => {
  const state = { index: 8, stage: 2, direction: 1 };
  assert.equal(
    presentationPosition(state, {
      type: "stage",
      index: 7,
      value: 0,
      count: 6,
    }),
    state,
  );
});
test("queued forward and backward commands use the latest stage rather than a stale event closure", () => {
  let state = { index: 2, stage: 0, direction: 1 };
  for (const delta of [1, 1, 1, -1, -1])
    state = presentationPosition(state, {
      type: "step",
      index: 2,
      delta,
      count: 8,
    });
  assert.deepEqual(state, { index: 2, stage: 1, direction: -1 });
});
test("stage direction follows forward, backward and direct selections; boundaries keep the same state", () => {
  const first = { index: 3, stage: 0, direction: 1 };
  const last = presentationPosition(first, {
    type: "stage",
    index: 3,
    value: 99,
    count: 6,
  });
  assert.deepEqual(last, { index: 3, stage: 5, direction: 1 });
  assert.equal(
    presentationPosition(last, { type: "stage", index: 3, value: 6, count: 6 }),
    last,
  );
  const back = presentationPosition(last, {
    type: "stage",
    index: 3,
    value: 2,
    count: 6,
  });
  assert.deepEqual(back, { index: 3, stage: 2, direction: -1 });
  assert.deepEqual(presentationPosition(back, { type: "scene", index: 3 }), {
    index: 3,
    stage: 0,
    direction: -1,
  });
  assert.equal(
    presentationPosition(first, { type: "scene", index: 3, sync: true }),
    first,
  );
});
