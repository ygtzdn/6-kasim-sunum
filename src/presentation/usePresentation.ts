import { useCallback, useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";
import { scenes } from "./registry";
import { nextStage, presentationKey } from "./controls.mjs";
export type MenuTab = "scenes" | "notes" | "sources";
function readIndex() {
  const match = location.hash.match(/^#\/sunum\/(s\d{2})$/);
  return Math.max(
    0,
    scenes.findIndex((s) => s.id === match?.[1]),
  );
}
export function usePresentation() {
  const [index, setIndex] = useState(readIndex);
  const [menu, setMenu] = useState(false);
  const [tab, setTab] = useState<MenuTab>("scenes");
  const [motionOn, setMotionOn] = useState(true);
  const [visible, setVisible] = useState(!document.hidden);
  const [shortcuts, setShortcuts] = useState(true);
  const [notice, setNotice] = useState("");
  const [progress, setProgress] = useState({
    sceneId: scenes[index].id,
    stage: 0,
  });
  const current = scenes[index];
  const stage = progress.sceneId === current.id ? progress.stage : 0;
  const setStage = useCallback(
    (value: number) => {
      setProgress({
        sceneId: current.id,
        stage: Math.max(0, Math.min((current.stages?.length ?? 1) - 1, value)),
      });
    },
    [current],
  );
  const advance = useCallback(() => {
    if (current.stages) {
      setProgress((p) => ({
        sceneId: current.id,
        stage: nextStage(
          p.sceneId === current.id ? p.stage : 0,
          current.stages!.length,
        ),
      }));
    } else {
      document
        .querySelector<HTMLButtonElement>(
          `[data-scene-id="${current.id}"] [data-presentation-next]:not(:disabled)`,
        )
        ?.click();
    }
  }, [current]);
  const reduced = useReducedMotion();
  const goTo = useCallback((id: string) => {
    if (!scenes.some((s) => s.id === id)) return;
    location.hash = `/sunum/${id}`;
    setMenu(false);
  }, []);
  const openMenu = useCallback(() => {
    setTab("scenes");
    setMenu(true);
  }, []);
  const move = useCallback(
    (delta: number) => {
      const next = Math.max(0, Math.min(scenes.length - 1, index + delta));
      if (delta > 0 && index === scenes.length - 1) {
        openMenu();
        return;
      }
      goTo(scenes[next].id);
    },
    [index, goTo, openMenu],
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
      setIndex(n);
      setProgress({ sceneId: scenes[n].id, stage: 0 });
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
          'input,textarea,select,[contenteditable]:not([contenteditable="false"]),[role="slider"]',
        );
      if (
        e.repeat &&
        !menu &&
        shortcuts &&
        !editing &&
        ["Enter", " "].includes(e.key)
      ) {
        e.preventDefault();
        return;
      }
      const action = presentationKey(e, {
        menu,
        shortcuts,
        editing,
      });
      if (!action) return;
      if (action === "close-menu") setMenu(false);
      else if (action === "advance") advance();
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
  }, [menu, shortcuts, move, goTo, openMenu, fullscreen, advance]);
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 4000);
    return () => clearTimeout(timer);
  }, [notice]);
  return {
    index,
    current,
    stage,
    setStage,
    advance,
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
    enabled: motionOn && !reduced && visible,
  };
}
