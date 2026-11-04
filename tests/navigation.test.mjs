import test from "node:test";
import assert from "node:assert/strict";
import {
  adjacentSceneId,
  resolveSceneId,
  sceneIdFromHash,
  scenesForMode,
} from "../src/presentation/navigation.mjs";

const scenes = [
  { id: "opening", legacyIds: ["s01"], depth: "core" },
  { id: "hdd-anatomy", legacyIds: ["s03"], depth: "core" },
  { id: "hdd-history", depth: "extension" },
  { id: "storage-summary", legacyIds: ["s36"], depth: "core" },
];
test("stable URLs and legacy links resolve to the same canonical scene", () => {
  assert.equal(resolveSceneId(scenes, "s03"), "hdd-anatomy");
  assert.equal(sceneIdFromHash("#/sunum/hdd-anatomy", scenes), "hdd-anatomy");
  assert.equal(sceneIdFromHash("#/sunum/s03", scenes), "hdd-anatomy");
  for (const hash of [
    "",
    "#/sunum/missing",
    "#/sunum/../../file",
    "#/sunum/hdd-anatomy/extra",
  ])
    assert.equal(sceneIdFromHash(hash, scenes), "opening");
});
test("core route skips extensions, while full route includes every scene in book order", () => {
  assert.deepEqual(
    scenesForMode(scenes, "core").map((s) => s.id),
    ["opening", "hdd-anatomy", "storage-summary"],
  );
  assert.equal(
    adjacentSceneId(scenes, "hdd-anatomy", 1, "core"),
    "storage-summary",
  );
  assert.equal(
    adjacentSceneId(scenes, "hdd-anatomy", 1, "full"),
    "hdd-history",
  );
  assert.equal(
    adjacentSceneId(scenes, "storage-summary", -1, "core"),
    "hdd-anatomy",
  );
});
test("directly opened extensions can rejoin either route, and boundaries never reset a scene", () => {
  assert.equal(
    adjacentSceneId(scenes, "hdd-history", -1, "core"),
    "hdd-anatomy",
  );
  assert.equal(
    adjacentSceneId(scenes, "hdd-history", 1, "core"),
    "storage-summary",
  );
  assert.equal(adjacentSceneId(scenes, "opening", -1, "full"), null);
  assert.equal(adjacentSceneId(scenes, "storage-summary", 1, "core"), null);
  assert.equal(adjacentSceneId(scenes, "missing", 1, "core"), null);
});
