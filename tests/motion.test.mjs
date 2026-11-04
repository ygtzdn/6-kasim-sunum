import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  motionGroups,
  sceneMotionPose,
  sceneMotionProfile,
} from "../src/presentation/motion-presets.mjs";

const contract = JSON.parse(
  readFileSync(
    new URL("../docs/presentation-contract.json", import.meta.url),
    "utf8",
  ),
);

test("every planned scene has exactly one intentional motion profile", () => {
  const ids = Object.values(motionGroups).flat();
  assert.equal(
    new Set(ids).size,
    ids.length,
    "No duplicate profile assignments",
  );
  assert.deepEqual(
    ids.toSorted(),
    contract.map((scene) => scene.id).toSorted(),
  );
  assert.equal(Object.keys(motionGroups).length, 6);
});

test("tracing scenes leave coordinates steady while communication follows direction", () => {
  for (const id of ["fcfs-path", "scan-path", "cscan-path"]) {
    const pose = sceneMotionPose(sceneMotionProfile(id), "enter", {
      enabled: true,
      direction: 1,
    });
    assert.equal(pose.x, 0);
    assert.equal(pose.y, 0);
    assert.equal(pose.scale, 1);
  }
  const forward = sceneMotionPose(sceneMotionProfile("swap-journey"), "enter", {
    enabled: true,
    direction: 1,
  });
  const backward = sceneMotionPose(
    sceneMotionProfile("swap-journey"),
    "enter",
    { enabled: true, direction: -1 },
  );
  assert.ok(forward.x > 0);
  assert.equal(backward.x, -forward.x);
});

test("pausing or reducing motion settles every entrance and exit without displacement", () => {
  for (const profile of Object.keys(motionGroups))
    for (const direction of [-1, 1])
      for (const phase of ["enter", "visible", "exit"])
        assert.deepEqual(
          sceneMotionPose(profile, phase, { enabled: false, direction }),
          {
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
            transition: { duration: 0 },
          },
        );
});

test("all profiles reach the same readable pose with bounded, finite timing", () => {
  for (const profile of Object.keys(motionGroups)) {
    const pose = sceneMotionPose(profile, "visible", {
      enabled: true,
      direction: 1,
    });
    assert.equal(pose.opacity, 1);
    assert.equal(pose.x, 0);
    assert.equal(pose.y, 0);
    assert.equal(pose.scale, 1);
    assert.ok(pose.transition.duration > 0 && pose.transition.duration <= 0.5);
    assert.equal(pose.transition.repeat, undefined);
  }
});
