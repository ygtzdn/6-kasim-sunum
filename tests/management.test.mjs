import test from "node:test";
import assert from "node:assert/strict";
import {
  ORIGINAL_BITS,
  STORED_PARITY,
  checkParity,
  flipBit,
  encodeSecded,
  decodeSecded,
  createDevice,
  partitionDevice,
  prepareDevice,
  remapBlock,
  createSwapState,
  beginPageOut,
  beginPageIn,
  completeTransfer,
  swapInvariant,
  deviceAtStage,
  swapJourneyAtStage,
  createPageJourney,
  advancePageJourney,
  pageJourneyAtStage,
} from "../src/chapters/chapter-11-4-6/model.mjs";

test("stored even parity detects the specified single-bit error and misses the specified pair", () => {
  const original = [...ORIGINAL_BITS];
  assert.deepEqual(checkParity(original), {
    ones: 4,
    storedParity: 0,
    detected: false,
  });
  const single = flipBit(original, 2);
  assert.equal(single.join(""), "1001001");
  assert.equal(checkParity(single, STORED_PARITY).detected, true);
  const pair = flipBit(flipBit(original, 0), 1);
  assert.equal(pair.join(""), "0111001");
  assert.equal(checkParity(pair, STORED_PARITY).detected, false);
  assert.deepEqual(original, ORIGINAL_BITS);
  assert.equal(STORED_PARITY, 0);
});

test("one stored parity bit catches every single flip but no two distinct flips", () => {
  for (let i = 0; i < 7; i += 1) {
    assert.equal(checkParity(flipBit([...ORIGINAL_BITS], i)).detected, true);
    for (let j = i + 1; j < 7; j += 1) {
      assert.equal(
        checkParity(flipBit(flipBit([...ORIGINAL_BITS], i), j)).detected,
        false,
      );
    }
  }
});

test("SECDED exhaustively corrects all eight single-bit errors for all sixteen payloads", () => {
  for (let value = 0; value < 16; value += 1) {
    const payload = value.toString(2).padStart(4, "0").split("").map(Number);
    const code = encodeSecded(payload);
    assert.equal(decodeSecded(code).kind, "clean");
    assert.deepEqual([code[2], code[4], code[5], code[6]], payload);
    for (let bit = 0; bit < 8; bit += 1) {
      const decoded = decodeSecded(flipBit(code, bit));
      assert.equal(decoded.kind, "corrected");
      assert.equal(decoded.position, bit + 1);
      assert.deepEqual(decoded.code, code);
    }
  }
});

test("SECDED detects every two-bit error without attempting a correction", () => {
  for (let value = 0; value < 16; value += 1) {
    const code = encodeSecded(
      value.toString(2).padStart(4, "0").split("").map(Number),
    );
    for (let first = 0; first < 8; first += 1) {
      for (let second = first + 1; second < 8; second += 1) {
        const decoded = decodeSecded(flipBit(flipBit(code, first), second));
        assert.equal(decoded.kind, "double-error");
        assert.equal(decoded.code, null);
        assert.equal(decoded.position, null);
      }
    }
  }
});

test("parity and SECDED reject invalid bit representations", () => {
  assert.throws(() => checkParity([1, 2, 0]), RangeError);
  assert.throws(() => flipBit([0, 1], -1), RangeError);
  assert.throws(() => encodeSecded([1, 0, 1]), RangeError);
  assert.throws(() => decodeSecded([1, 0, 1]), RangeError);
});

test("device preparation separates partitioning, filesystem, mounting and file save", () => {
  const raw = createDevice();
  assert.throws(() => prepareDevice(raw, "filesystem"), /bölüm/);
  const partitioned = partitionDevice(raw);
  assert.deepEqual(
    partitioned.partitions.map((part) => part.percent),
    [60, 40],
  );
  assert.equal(raw.partitions.length, 0);
  assert.throws(() => prepareDevice(partitioned, "mount"), /Dosya sistemi/);
  assert.throws(() => prepareDevice(partitioned, "save"), /bağlı değil/);
  const formatted = prepareDevice(partitioned, "filesystem");
  assert.equal(formatted.partitions[0].filesystem, true);
  assert.equal(formatted.partitions[1].filesystem, false);
  assert.throws(() => prepareDevice(formatted, "save"), /bağlı değil/);
  const mounted = prepareDevice(formatted, "mount");
  const saved = prepareDevice(mounted, "save");
  assert.equal(saved.partitions[0].files, 1);
  assert.equal(saved.partitions[1].files, 0);
  assert.equal(mounted.partitions[0].files, 0);
});

test("selecting a second partition does not inherit the first partition filesystem", () => {
  const firstReady = prepareDevice(
    prepareDevice(partitionDevice(createDevice()), "filesystem"),
    "mount",
  );
  const second = { ...firstReady, selected: 1 };
  assert.throws(() => prepareDevice(second, "save"), /bağlı değil/);
  const secondReady = prepareDevice(
    prepareDevice(second, "filesystem"),
    "mount",
  );
  assert.equal(secondReady.partitions[0].mounted, true);
  assert.equal(secondReady.partitions[1].mounted, true);
});

test("remapping changes one physical target and preserves all logical identities", () => {
  const mapping = [40, 41, 42, 43, 44, 45, 46, 47];
  const remapped = remapBlock(mapping, 5, 90);
  assert.equal(remapped.length, mapping.length);
  assert.equal(remapped[5], 90);
  assert.equal(mapping[5], 45);
  for (const lba of [0, 1, 2, 3, 4, 6, 7])
    assert.equal(remapped[lba], mapping[lba]);
  assert.throws(() => remapBlock(mapping, 5, 47), RangeError);
});

test("swap page-out reserves a slot but retains dirty RAM until write completes", () => {
  const initial = createSwapState();
  assert.equal(swapInvariant(initial), true);
  const writing = beginPageOut(initial, "A");
  assert.equal(writing.pending.kind, "write");
  assert.equal(writing.slots[2], "A");
  assert.equal(writing.frames[0], "A");
  assert.equal(writing.pages.A.dirty, true);
  assert.equal(writing.pages.A.swapValid, false);
  assert.equal(writing.writes, 0);
  assert.equal(swapInvariant(writing), true);
  const completed = completeTransfer(writing);
  assert.equal(completed.frames[0], null);
  assert.equal(completed.pages.A.swapValid, true);
  assert.equal(completed.pages.A.dirty, false);
  assert.equal(completed.writes, 1);
  assert.equal(swapInvariant(completed), true);
  assert.deepEqual(initial.frames, ["A", "B", "C"]);
});

test("page-in commits RAM only on completion and keeps its valid swap copy", () => {
  const afterOut = completeTransfer(beginPageOut(createSwapState(), "A"));
  const reading = beginPageIn(afterOut, "D");
  assert.equal(reading.pending.source, "swap");
  assert.equal(reading.frames[0], null);
  assert.equal(reading.reads, 0);
  const completed = completeTransfer(reading);
  assert.equal(completed.frames[0], "D");
  assert.equal(completed.slots[1], "D");
  assert.equal(completed.pages.D.swapValid, true);
  assert.equal(completed.reads, 1);
  assert.equal(swapInvariant(completed), true);
});

test("complete prescribed journey yields D,A,C in RAM with one write and two reads", () => {
  let state = createSwapState();
  state = completeTransfer(beginPageOut(state, "A"));
  state = completeTransfer(beginPageIn(state, "D"));
  assert.equal(beginPageIn(state, "A").error, "ram-full");
  state = beginPageOut(state, "B");
  assert.equal(
    state.writes,
    1,
    "clean file-backed B must not count as a swap write",
  );
  assert.equal(state.pending, null);
  state = completeTransfer(beginPageIn(state, "A"));
  assert.deepEqual(state.frames, ["D", "A", "C"]);
  assert.deepEqual(state.slots, ["C", "D", "A", null]);
  assert.equal(state.writes, 1);
  assert.equal(state.reads, 2);
  assert.equal(swapInvariant(state), true);
});

test("full swap refuses dirty eviction without data loss or releasing a frame", () => {
  const full = createSwapState(true);
  const failed = beginPageOut(full, "A");
  assert.equal(failed.error, "full");
  assert.equal(failed.pending, null);
  assert.deepEqual(failed.frames, full.frames);
  assert.deepEqual(failed.slots, full.slots);
  assert.deepEqual(failed.pages.A, full.pages.A);
  assert.equal(failed.writes, 0);
  assert.equal(swapInvariant(failed), true);
});

test("clean anonymous C with a current swap copy may be dropped without a new write", () => {
  const state = beginPageOut(createSwapState(), "C");
  assert.equal(state.frames[2], null);
  assert.equal(state.slots[0], "C");
  assert.equal(state.pages.C.swapValid, true);
  assert.equal(state.writes, 0);
  assert.equal(state.pending, null);
  assert.equal(swapInvariant(state), true);
});

test("clean file-backed B can be loaded from its file without a swap-read count", () => {
  const dropped = beginPageOut(createSwapState(), "B");
  const reading = beginPageIn(dropped, "B");
  assert.equal(reading.pending.source, "file");
  const loaded = completeTransfer(reading);
  assert.equal(loaded.frames[1], "B");
  assert.equal(loaded.reads, 0);
  assert.equal(loaded.writes, 0);
  assert.equal(swapInvariant(loaded), true);
});

test("a second transfer cannot race an in-flight transfer", () => {
  const writing = beginPageOut(createSwapState(), "A");
  assert.throws(() => beginPageOut(writing, "B"), /zaten sürüyor/);
  assert.throws(() => beginPageIn(writing, "D"), /zaten sürüyor/);
});

test("preparation stages restore exact layer state in either navigation direction", () => {
  const snapshots = Array.from({ length: 6 }, (_, stage) =>
    deviceAtStage(stage),
  );
  assert.equal(snapshots[1].partitions.length, 0);
  assert.deepEqual(
    snapshots[2].partitions.map((part) => [
      part.filesystem,
      part.mounted,
      part.files,
    ]),
    [
      [false, false, 0],
      [false, false, 0],
    ],
  );
  assert.deepEqual(
    snapshots[3].partitions.map((part) => [
      part.filesystem,
      part.mounted,
      part.files,
    ]),
    [
      [true, false, 0],
      [false, false, 0],
    ],
  );
  assert.deepEqual(
    snapshots[4].partitions.map((part) => [
      part.filesystem,
      part.mounted,
      part.files,
    ]),
    [
      [true, true, 0],
      [false, false, 0],
    ],
  );
  assert.deepEqual(
    snapshots[5].partitions.map((part) => [
      part.filesystem,
      part.mounted,
      part.files,
    ]),
    [
      [true, true, 1],
      [false, false, 0],
    ],
  );
  for (let stage = 5; stage >= 0; stage--)
    assert.deepEqual(deviceAtStage(stage), snapshots[stage]);
  assert.deepEqual(deviceAtStage(5), snapshots[5]);
  assert.throws(() => deviceAtStage(-1), RangeError);
  assert.throws(() => deviceAtStage(6), RangeError);
});

test("swap stage commits require explicit advancement and reverse without hidden state", () => {
  const snapshots = Array.from({ length: 10 }, (_, stage) =>
    swapJourneyAtStage(stage),
  );
  for (const state of snapshots) assert.equal(swapInvariant(state), true);
  const writing = snapshots[1];
  assert.equal(writing.pending.kind, "write");
  assert.equal(writing.frames[0], "A");
  assert.equal(writing.slots[2], "A");
  assert.equal(writing.pages.A.swapValid, false);
  assert.equal(writing.writes, 0);
  assert.equal(snapshots[2].frames[0], null);
  assert.equal(snapshots[2].writes, 1);
  assert.equal(snapshots[3].pending.kind, "read");
  assert.equal(snapshots[3].frames[0], null);
  assert.equal(snapshots[3].reads, 0);
  assert.equal(snapshots[4].frames[0], "D");
  assert.equal(snapshots[4].reads, 1);
  assert.equal(snapshots[5].frames[1], null);
  assert.equal(snapshots[5].writes, 1);
  assert.equal(snapshots[6].pending.pageId, "A");
  assert.equal(snapshots[6].reads, 1);
  assert.deepEqual(snapshots[7].frames, ["D", "A", "C"]);
  assert.deepEqual([snapshots[7].reads, snapshots[7].writes], [2, 1]);
  assert.deepEqual(snapshots[8].frames, ["A", "B", "C"]);
  assert.deepEqual(snapshots[8].slots, ["C", "D", "E", "F"]);
  assert.equal(snapshots[8].error, null);
  assert.equal(snapshots[9].error, "full");
  assert.equal(snapshots[9].pending, null);
  assert.equal(snapshots[9].frames[0], "A");
  assert.equal(snapshots[9].writes, 0);
  for (let stage = 9; stage >= 0; stage--)
    assert.deepEqual(swapJourneyAtStage(stage), snapshots[stage]);
  assert.deepEqual(swapJourneyAtStage(7), snapshots[7]);
  assert.throws(() => swapJourneyAtStage(10), RangeError);
  assert.throws(() => swapJourneyAtStage(1.5), RangeError);
});

test("single-page journey separates reservation, pending I/O and explicit completion", () => {
  const expected = [
    ["P", null, "free", null, 0, 0],
    ["P", "P", "reserved", null, 0, 0],
    ["P", "P", "reserved", "write", 0, 0],
    [null, "P", "valid", null, 0, 1],
    [null, "P", "valid", "read", 0, 1],
    ["P", null, "free", null, 1, 1],
    ["P", null, "free", null, 1, 1],
  ];
  for (let stage = 0; stage < expected.length; stage++) {
    const state = pageJourneyAtStage(stage);
    assert.equal(state.stage, stage);
    assert.deepEqual(
      [
        state.ram,
        state.slot,
        state.slotStatus,
        state.pending,
        state.reads,
        state.writes,
      ],
      expected[stage],
    );
  }
  // A read cannot make RAM resident before the selected completion stage.
  assert.equal(pageJourneyAtStage(4).ram, null);
  assert.equal(pageJourneyAtStage(4).reads, 0);
  // A write cannot release the only current RAM content at reservation/start.
  assert.equal(pageJourneyAtStage(1).ram, "P");
  assert.equal(pageJourneyAtStage(2).ram, "P");
  assert.equal(pageJourneyAtStage(2).writes, 0);
});

test("single-page replay is immutable, reversible and does not create extra summary I/O", () => {
  const snapshots = Array.from({ length: 7 }, (_, stage) =>
    pageJourneyAtStage(stage),
  );
  for (const stage of [6, 5, 2, 1, 0, 4, 3, 6])
    assert.deepEqual(pageJourneyAtStage(stage), snapshots[stage]);
  const initial = createPageJourney();
  const initialCopy = structuredClone(initial);
  advancePageJourney(initial);
  assert.deepEqual(initial, initialCopy);
  const before = pageJourneyAtStage(4);
  const beforeCopy = structuredClone(before);
  advancePageJourney(before);
  assert.deepEqual(before, beforeCopy);
  const summary = snapshots[6];
  assert.equal(advancePageJourney(summary), summary);
  assert.deepEqual([summary.reads, summary.writes], [1, 1]);
  snapshots[2].ram = null;
  assert.equal(pageJourneyAtStage(2).ram, "P");
  for (const stage of [-1, 7, NaN, 1.5])
    assert.throws(() => pageJourneyAtStage(stage), RangeError);
});
