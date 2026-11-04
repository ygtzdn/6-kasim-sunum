/** @param {number} stage @param {number} count */
export function clampStage(stage, count) {
  const final = Math.max(0, Math.trunc(Number.isFinite(count) ? count : 0) - 1);
  return Math.max(
    0,
    Math.min(final, Number.isFinite(stage) ? Math.trunc(stage) : 0),
  );
}

/** @param {number} current @param {number} count */
export function nextStage(current, count) {
  return clampStage(clampStage(current, count) + 1, count);
}

/** @param {number} current @param {number} count */
export function previousStage(current, count) {
  return clampStage(clampStage(current, count) - 1, count);
}

/** @typedef {{key: string, repeat?: boolean, defaultPrevented?: boolean, altKey?: boolean, metaKey?: boolean, ctrlKey?: boolean, isComposing?: boolean}} PresentationKeyEvent */
/** @typedef {{menu: boolean, shortcuts: boolean, editing: boolean, interactive?: boolean}} KeyboardContext */

/** Prevent held activation keys from repeatedly clicking a demo or advancing stages.
 * Native text input, IME composition and modified keys are never suppressed.
 * @param {PresentationKeyEvent} event
 * @param {KeyboardContext} state */
export function blocksRepeatedActivation(event, { menu, shortcuts, editing }) {
  return Boolean(
    event.repeat &&
    !event.defaultPrevented &&
    !event.isComposing &&
    !event.altKey &&
    !event.metaKey &&
    !event.ctrlKey &&
    !menu &&
    shortcuts &&
    !editing &&
    ["enter", "backspace", " ", "spacebar"].includes(event.key.toLowerCase()),
  );
}

/** @param {PresentationKeyEvent} event
 * @param {KeyboardContext} state */
export function presentationKey(
  event,
  { menu, shortcuts, editing, interactive },
) {
  if (
    event.defaultPrevented ||
    event.repeat ||
    event.isComposing ||
    event.altKey ||
    event.metaKey ||
    event.ctrlKey ||
    editing
  )
    return null;
  const key = event.key.toLowerCase();
  if (key === "escape" && menu) return "close-menu";
  if (menu || !shortcuts) return null;
  if (interactive && ["enter", " ", "spacebar"].includes(key)) return null;
  return (
    /** @type {Record<string, string>} */ ({
      enter: "advance",
      backspace: "retreat",
      " ": "toggle-motion",
      spacebar: "toggle-motion",
      arrowright: "next-scene",
      arrowleft: "previous-scene",
      home: "first-scene",
      end: "last-scene",
      m: "menu",
      n: "notes",
      f: "fullscreen",
    })[key] ?? null
  );
}
