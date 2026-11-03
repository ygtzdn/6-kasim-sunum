import test from "node:test";
import assert from "node:assert/strict";
import { nextStage, presentationKey } from "../src/presentation/controls.mjs";

const active = { menu: false, shortcuts: true, editing: false };
test("Enter advances stages; arrows alone select scenes", () => {
  assert.equal(presentationKey({ key: "Enter" }, active), "advance");
  assert.equal(presentationKey({ key: "ArrowRight" }, active), "next-scene");
  assert.equal(presentationKey({ key: "ArrowLeft" }, active), "previous-scene");
});
test("Space controls animation without advancing a stage or scene", () => {
  assert.equal(presentationKey({ key: " " }, active), "toggle-motion");
  assert.equal(presentationKey({ key: "Spacebar" }, active), "toggle-motion");
});
test("Final stage stays final, including scenes without stages", () => {
  for (const count of [0, 1, 3, 4, 5, 6]) {
    let stage = 0;
    for (let i = 0; i < 30; i++) stage = nextStage(stage, count);
    assert.equal(stage, Math.max(0, count - 1));
  }
});
test("Menu, text/range editing and disabled shortcuts retain native key handling", () => {
  for (const key of ["Enter", " ", "ArrowRight", "Home"])
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
  for (const key of ["Enter", " ", "ArrowRight"])
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
