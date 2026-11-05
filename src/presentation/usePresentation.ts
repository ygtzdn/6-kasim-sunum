import { useCallback, useEffect, useReducer, useState } from "react";
import { useReducedMotion } from "motion/react";
import { scenes } from "./registry";
import {
  adjacentSceneId,
  resolveSceneId,
  sceneIdFromHash,
} from "./navigation.mjs";
import {
  blocksRepeatedActivation,
  clampStage,
  presentationKey,
} from "./controls.mjs";
import { presentationPosition } from "./position.mjs";
export type MenuTab = "scenes" | "notes" | "sources";
const estimatedSeconds = scenes.reduce(
  (total, scene) => total + scene.seconds,
  0,
);
function focusCanvasAfterStageButton(sceneId: string) {
  const active = document.activeElement;
  if (
    active instanceof HTMLButtonElement &&
    active.closest("[data-scene-id],.stage-progress")
  ) {
    const frame = Array.from(
      document.querySelectorAll<HTMLElement>("[data-scene-id]:not([inert])"),
    ).find((element) => element.dataset.sceneId === sceneId);
    frame
      ?.querySelector<HTMLElement>("#scene-heading")
      ?.focus({ preventScroll: true });
  }
}
function readIndex() {
  const id = sceneIdFromHash(location.hash, scenes);
  return Math.max(
    0,
    scenes.findIndex((s) => s.id === id),
  );
}
export function usePresentation() {
  const [position, dispatchPosition] = useReducer(
    presentationPosition,
    undefined,
    () => ({ index: readIndex(), stage: 0, direction: 1 }),
  );
  const index = position.index;
  const [menu, setMenu] = useState(false);
  const [tab, setTab] = useState<MenuTab>("scenes");
  const [motionOn, setMotionOn] = useState(true);
  const [visible, setVisible] = useState(!document.hidden);
  const [shortcuts, setShortcuts] = useState(true);
  const [notice, setNotice] = useState("");
  const current = scenes[index];
  const stage = clampStage(position.stage, current.stages.length);
  const setStage = useCallback(
    (value: number) => {
      dispatchPosition({
        type: "stage",
        index,
        value,
        count: current.stages.length,
      });
      focusCanvasAfterStageButton(current.id);
    },
    [current, index],
  );
  const changeStage = useCallback(
    (direction: 1 | -1) => {
      dispatchPosition({
        type: "step",
        index,
        delta: direction,
        count: current.stages.length,
      });
      focusCanvasAfterStageButton(current.id);
    },
    [current, index],
  );
  const advance = useCallback(() => changeStage(1), [changeStage]);
  const retreat = useCallback(() => changeStage(-1), [changeStage]);
  const reduced = useReducedMotion();
  const goTo = useCallback((id: string) => {
    const resolved = resolveSceneId(scenes, id);
    if (!resolved) return;
    dispatchPosition({
      type: "scene",
      index: scenes.findIndex((scene) => scene.id === resolved),
    });
    location.hash = `/sunum/${resolved}`;
    setMenu(false);
  }, []);
  const openMenu = useCallback(() => {
    setTab("scenes");
    setMenu(true);
  }, []);
  const move = useCallback(
    (delta: number) => {
      const next = adjacentSceneId(scenes, current.id, delta);
      if (!next && delta > 0) {
        openMenu();
        return;
      }
      if (next) goTo(next);
    },
    [current.id, goTo, openMenu],
  );
  const fullscreen = useCallback(async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (document.documentElement.requestFullscreen)
        await document.documentElement.requestFullscreen();
      else setNotice("Tam ekran desteklenmiyor.");
    } catch {
      setNotice("Tam ekran açılamadı.");
    }
  }, []);
  useEffect(() => {
    const update = () => {
      const n = readIndex();
      dispatchPosition({ type: "scene", index: n, sync: true });
      document.title = `${scenes[n].shortTitle} · Mass Storage`;
      if (location.hash !== `#/sunum/${scenes[n].id}`)
        history.replaceState(null, "", `#/sunum/${scenes[n].id}`);
    };
    update();
    window.addEventListener("hashchange", update);
    return () => window.removeEventListener("hashchange", update);
  }, []);
  useEffect(() => {
    const update = () => {
      setVisible(!document.hidden);
      if (document.hidden) setMotionOn(false);
    };
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      const editing =
        e.target instanceof Element &&
        !!e.target.closest(
          'input,textarea,select,[contenteditable]:not([contenteditable="false"]),[role="slider"],[role="spinbutton"],[role="combobox"],[role="radio"],[role="tab"],[role="menuitem"]',
        );
      const interactive =
        e.target instanceof Element &&
        !!e.target.closest(
          'button,a[href],summary,[role="button"],[role="checkbox"],[role="switch"]',
        );
      const keyboardContext = { menu, shortcuts, editing, interactive };
      if (blocksRepeatedActivation(e, keyboardContext)) {
        e.preventDefault();
        return;
      }
      const action = presentationKey(e, keyboardContext);
      if (!action) return;
      if (action === "close-menu") setMenu(false);
      else if (action === "advance") advance();
      else if (action === "retreat") retreat();
      else if (action === "toggle-motion") setMotionOn((v) => !v);
      else if (action === "next-scene") move(1);
      else if (action === "previous-scene") move(-1);
      else if (action === "first-scene") goTo(scenes[0].id);
      else if (action === "last-scene") goTo(scenes.at(-1)!.id);
      else if (action === "menu") openMenu();
      else if (action === "notes") {
        setTab("notes");
        setMenu(true);
      } else if (action === "fullscreen") void fullscreen();
      e.preventDefault();
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [menu, shortcuts, move, goTo, openMenu, fullscreen, advance, retreat]);
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 4000);
    return () => clearTimeout(timer);
  }, [notice]);
  return {
    index,
    direction: position.direction,
    estimatedSeconds,
    current,
    stage,
    setStage,
    advance,
    retreat,
    menu,
    setMenu,
    tab,
    setTab,
    motionOn,
    setMotionOn,
    shortcuts,
    setShortcuts,
    notice,
    goTo,
    openMenu,
    move,
    fullscreen,
    enabled: motionOn && !reduced && visible && !menu,
  };
}
