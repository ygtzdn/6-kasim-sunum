/** @param {number} current @param {number} count */
export function nextStage(current, count) {
  return Math.max(0, Math.min(Math.max(0, count - 1), current + 1));
}

/** @param {{key: string, repeat?: boolean, defaultPrevented?: boolean, altKey?: boolean, metaKey?: boolean, ctrlKey?: boolean, isComposing?: boolean}} event
 * @param {{menu: boolean, shortcuts: boolean, editing: boolean}} state */
export function presentationKey(event, { menu, shortcuts, editing }) {
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
  return (
    /** @type {Record<string, string>} */ ({
      enter: "advance",
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
