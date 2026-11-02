import { useCallback, useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";
import { scenes } from "./registry";
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
      if (
        e.defaultPrevented ||
        e.altKey ||
        e.metaKey ||
        e.ctrlKey ||
        (e.target instanceof HTMLElement &&
          e.target.closest('input,textarea,select,[contenteditable="true"]'))
      )
        return;
      const k = e.key.toLowerCase();
      if (k === "escape" && menu) {
        setMenu(false);
        return;
      }
      if (menu || !shortcuts) return;
      let used = true;
      if (k === "arrowright") move(1);
      else if (k === "arrowleft") move(-1);
      else if (k === "home") goTo(scenes[0].id);
      else if (k === "end") goTo(scenes.at(-1)!.id);
      else if (k === "m") openMenu();
      else if (k === "n") {
        setTab("notes");
        setMenu(true);
      } else if (k === "f") void fullscreen();
      else used = false;
      if (used) e.preventDefault();
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [menu, shortcuts, move, goTo, openMenu, fullscreen]);
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 4000);
    return () => clearTimeout(timer);
  }, [notice]);
  return {
    index,
    current: scenes[index],
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
