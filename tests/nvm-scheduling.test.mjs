import test from "node:test";
import assert from "node:assert/strict";
import {
  mergeAdjacentReads,
  nvmRequests,
  nvmSchedulingStateAtStage,
} from "../src/chapters/chapter-11-2-3/nvm-model.ts";

const read = (id, lba, blocks = 1) => ({
  id,
  operation: "read",
  lba,
  blocks,
  sourceIds: [id],
});

test("merging commands preserves every logical block and host request identity", () => {
  const frozen = structuredClone(nvmRequests);
  const merged = mergeAdjacentReads(nvmRequests);
  const blocks = (requests) =>
    requests.flatMap((request) =>
      Array.from(
        { length: request.blocks },
        (_, i) => `${request.operation}:${request.lba + i}`,
      ),
    );
  assert.equal(merged.length, 3);
  assert.deepEqual(blocks(merged), blocks(nvmRequests));
  assert.deepEqual(
    merged.flatMap((request) => request.sourceIds),
    nvmRequests.map((request) => request.id),
  );
  assert.deepEqual(nvmRequests, frozen);
  assert.deepEqual(mergeAdjacentReads(merged), merged);
  merged[0].sourceIds.push("changed-copy");
  assert.deepEqual(nvmRequests, frozen);
});

test("merging respects gaps, overlap, operation boundaries and multi-block reads", () => {
  const input = [
    read("a", 10, 2),
    read("b", 12),
    read("c", 14),
    { ...read("w", 15), operation: "write" },
    read("d", 16),
    read("e", 16),
  ];
  const result = mergeAdjacentReads(input);
  assert.deepEqual(
    result.map(({ lba, blocks, operation }) => [lba, blocks, operation]),
    [
      [10, 3, "read"],
      [14, 1, "read"],
      [15, 1, "write"],
      [16, 1, "read"],
      [16, 1, "read"],
    ],
  );
  assert.deepEqual(mergeAdjacentReads([]), []);
});

test("going backwards restores unmerged requests and the command location without losing data", () => {
  const snapshots = Array.from({ length: 6 }, (_, stage) =>
    nvmSchedulingStateAtStage(stage),
  );
  for (const stage of [5, 0, 3, 2, 1, 4, 0]) {
    const state = nvmSchedulingStateAtStage(stage);
    assert.deepEqual(state, snapshots[stage]);
    assert.equal(state.logicalBlocks, 4);
    assert.equal(state.hostRequests, 4);
    assert.equal(state.commandCount, stage >= 2 ? 3 : 4);
    assert.equal(
      state.location,
      stage >= 4 ? "device" : stage >= 3 ? "interface" : "host",
    );
  }
  snapshots[5].requests[0].sourceIds.length = 0;
  assert.equal(nvmSchedulingStateAtStage(5).requests[0].sourceIds.length, 2);
});
