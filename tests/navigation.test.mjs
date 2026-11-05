import test from "node:test";
import assert from "node:assert/strict";
import {
  adjacentSceneId,
  resolveSceneId,
  sceneIdFromHash,
} from "../src/presentation/navigation.mjs";

const scenes = [
  { id: "opening", legacyIds: ["s01"] },
  { id: "hdd-anatomy", legacyIds: ["s03"] },
  { id: "storage-summary", legacyIds: ["s36"] },
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
test("forward and backward navigation follow the same single scene sequence", () => {
  assert.equal(adjacentSceneId(scenes, "hdd-anatomy", 1), "storage-summary");
  assert.equal(adjacentSceneId(scenes, "hdd-anatomy", -1), "opening");
  assert.equal(adjacentSceneId(scenes, "storage-summary", -1), "hdd-anatomy");
});
test("navigation boundaries and unknown scenes never reset a scene", () => {
  assert.equal(adjacentSceneId(scenes, "opening", -1), null);
  assert.equal(adjacentSceneId(scenes, "storage-summary", 1), null);
  assert.equal(adjacentSceneId(scenes, "missing", 1), null);
  assert.equal(adjacentSceneId(scenes, "hdd-anatomy", 0), null);
});
