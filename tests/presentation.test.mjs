import test from "node:test";
import assert from "node:assert/strict";
import {
  blocksRepeatedActivation,
  clampStage,
  nextStage,
  previousStage,
  presentationKey,
} from "../src/presentation/controls.mjs";

const active = { menu: false, shortcuts: true, editing: false };
test("Enter advances, Backspace retreats; arrows alone select scenes", () => {
  assert.equal(presentationKey({ key: "Enter" }, active), "advance");
  assert.equal(presentationKey({ key: "Backspace" }, active), "retreat");
  assert.equal(presentationKey({ key: "ArrowRight" }, active), "next-scene");
  assert.equal(presentationKey({ key: "ArrowLeft" }, active), "previous-scene");
});
test("Space controls animation without advancing a stage or scene", () => {
  assert.equal(presentationKey({ key: " " }, active), "toggle-motion");
  assert.equal(presentationKey({ key: "Spacebar" }, active), "toggle-motion");
});
test("Focused buttons and links keep native Enter and Space activation", () => {
  const interactive = { ...active, interactive: true };
  for (const key of ["Enter", " ", "Spacebar"])
    assert.equal(presentationKey({ key }, interactive), null);
  assert.equal(
    presentationKey({ key: "ArrowRight" }, interactive),
    "next-scene",
  );
  assert.equal(presentationKey({ key: "Enter" }, active), "advance");
  assert.equal(presentationKey({ key: "Backspace" }, interactive), "retreat");
});
test("Final stage stays final, including scenes without stages", () => {
  for (const count of [0, 1, 3, 4, 5, 6]) {
    let stage = 0;
    for (let i = 0; i < 30; i++) stage = nextStage(stage, count);
    assert.equal(stage, Math.max(0, count - 1));
  }
});
test("Backward stages clamp at zero and exactly undo forward progress", () => {
  for (const count of [0, 1, 3, 5, 10, 12, 20]) {
    assert.equal(previousStage(0, count), 0);
    for (let stage = 0; stage < count - 1; stage++)
      assert.equal(previousStage(nextStage(stage, count), count), stage);
    let stage = Math.max(0, count - 1);
    for (let i = 0; i < count + 3; i++) stage = previousStage(stage, count);
    assert.equal(stage, 0);
  }
});
test("Invalid stage selections cannot poison progress with NaN or out-of-range values", () => {
  for (const value of [NaN, Infinity, -Infinity, -10])
    assert.equal(clampStage(value, 5), 0);
  assert.equal(clampStage(100, 5), 4);
  assert.equal(clampStage(2.9, 5), 2);
  assert.equal(clampStage(4, 0), 0);
});
test("Menu, text/range editing and disabled shortcuts retain native key handling", () => {
  for (const key of ["Enter", "Backspace", " ", "ArrowRight", "Home"])
    for (const state of [
      { ...active, menu: true },
      { ...active, editing: true },
      { ...active, shortcuts: false },
    ])
      assert.equal(presentationKey({ key }, state), null);
  assert.equal(
    presentationKey({ key: "Escape" }, { ...active, menu: true }),
    "close-menu",
  );
});
test("Held, consumed, composing and modified keys do not trigger presentation actions", () => {
  for (const key of ["Enter", "Backspace", " ", "ArrowRight"])
    for (const field of [
      "repeat",
      "defaultPrevented",
      "isComposing",
      "altKey",
      "metaKey",
      "ctrlKey",
    ])
      assert.equal(presentationKey({ key, [field]: true }, active), null);
});
test("Held activation is suppressed on canvas and buttons without consuming native editing or IME", () => {
  for (const key of ["Enter", "Backspace", " ", "Spacebar"])
    for (const interactive of [false, true]) {
      const context = { ...active, interactive };
      assert.equal(
        blocksRepeatedActivation({ key, repeat: true }, context),
        true,
      );
      assert.equal(blocksRepeatedActivation({ key }, context), false);
      for (const field of [
        "defaultPrevented",
        "isComposing",
        "altKey",
        "metaKey",
        "ctrlKey",
      ])
        assert.equal(
          blocksRepeatedActivation(
            { key, repeat: true, [field]: true },
            context,
          ),
          false,
        );
      for (const state of [
        { ...context, menu: true },
        { ...context, editing: true },
        { ...context, shortcuts: false },
      ])
        assert.equal(
          blocksRepeatedActivation({ key, repeat: true }, state),
          false,
        );
    }
  assert.equal(
    blocksRepeatedActivation({ key: "ArrowRight", repeat: true }, active),
    false,
  );
});
