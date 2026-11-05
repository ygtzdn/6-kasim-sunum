import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronDown,
  ExternalLink,
  Home,
  Maximize,
  Menu,
  Pause,
  Play,
  RotateCcw,
  X,
} from "lucide-react";
import { resources } from "../data/content";
import { scenes, sceneGroups } from "./registry";
import { adjacentSceneId } from "./navigation.mjs";
import NotesPanel from "./NotesPanel";
import SceneSources from "./SceneSources";
import type { usePresentation } from "./usePresentation";

type Props = ReturnType<typeof usePresentation>;
export default function SideMenu(p: Props) {
  const [expanded, setExpanded] = useState<string[]>(["intro", "11.1"]);
  const stages = p.current.stages;
  const finalStage = p.stage === stages.length - 1;
  const previousId = adjacentSceneId(scenes, p.current.id, -1, p.mode);
  const nextId = adjacentSceneId(scenes, p.current.id, 1, p.mode);
  const previousScene = scenes.find((scene) => scene.id === previousId);
  const nextScene = scenes.find((scene) => scene.id === nextId);
  const previousLabel = previousScene
    ? `Önceki sahne: ${previousScene.presenterId}. kişi · ${previousScene.shortTitle}`
    : "Önceki sahne yok";
  const nextLabel = nextScene
    ? `Sonraki sahne: ${nextScene.presenterId}. kişi · ${nextScene.shortTitle}`
    : "Sunum menüsünü aç";
  useEffect(() => {
    const group = sceneGroups.find((g) =>
      g.scenes.some((s) => s.id === p.current.id),
    );
    if (group)
      setExpanded((v) => (v.includes(group.id) ? v : [...v, group.id]));
  }, [p.current.id]);
  const toggle = (id: string) =>
    setExpanded((v) =>
      v.includes(id) ? v.filter((x) => x !== id) : [...v, id],
    );
  return (
    <Dialog.Root modal={false} open={p.menu} onOpenChange={p.setMenu}>
      {stages.length > 1 && (
        <div
          className="stage-progress"
          role="group"
          aria-label="Sahne aşamaları"
        >
          <button
            className="nav-button"
            aria-label="Aşamaları başa al"
            disabled={p.stage === 0}
            onClick={() => p.setStage(0)}
          >
            <RotateCcw size={16} />
          </button>
          <button
            className="nav-button"
            aria-label="Önceki aşama (Backspace)"
            title="Önceki aşama (Backspace)"
            disabled={p.stage === 0}
            onClick={p.retreat}
          >
            <ChevronLeft size={18} />
          </button>
          <span className="stage-position">
            {p.stage + 1}/{stages.length}
          </span>
          <select
            className="stage-selector"
            aria-label="Sahne aşamasını seç"
            aria-describedby="stage-instruction"
            value={p.stage}
            onChange={(event) => p.setStage(Number(event.currentTarget.value))}
          >
            {stages.map((name, index) => (
              <option key={name} value={index}>
                {name}
              </option>
            ))}
          </select>
          <span id="stage-instruction" className="sr-only" aria-live="polite">
            {p.stage + 1}/{stages.length}: {stages[p.stage]}.{" "}
            {finalStage
              ? "Aşamalar tamamlandı. Backspace ile önceki aşamaya, sağ ok veya Sonraki sahne düğmesiyle sonraki sahneye geçin."
              : "Aşamayı listeden seçin. Sunum alanında Enter ile ileri, Backspace ile geri gidin."}
          </span>
        </div>
      )}
      <div className="floating-nav" aria-label="Sunum kontrolleri">
        <button
          className="nav-button"
          aria-label={
            p.motionOn
              ? "Animasyonu duraklat (Space)"
              : "Animasyonu başlat (Space)"
          }
          aria-pressed={p.motionOn}
          title="Oynat / duraklat (Space)"
          onClick={() => p.setMotionOn((v) => !v)}
        >
          {p.motionOn ? <Pause size={17} /> : <Play size={17} />}
        </button>
        <button
          className="nav-button scene-nav-button"
          aria-label={previousLabel}
          title={previousLabel}
          disabled={!previousScene}
          onClick={() => p.move(-1)}
        >
          <ArrowLeft size={18} aria-hidden="true" />
          <span className="scene-nav-presenter" aria-hidden="true">
            {previousScene ? `${previousScene.presenterId}. kişi` : "—"}
          </span>
        </button>
        <Dialog.Trigger asChild>
          <button
            className="menu-tab"
            aria-label="Sunum menüsü"
            title="Menü (M)"
          >
            <Menu size={18} />
            <span>{String(p.index + 1).padStart(2, "0")}</span>
            <span className="text-slate-500">/{scenes.length}</span>
          </button>
        </Dialog.Trigger>
        <button
          className="nav-button scene-nav-button"
          aria-label={nextLabel}
          title={nextLabel}
          onClick={() => p.move(1)}
        >
          <ArrowRight size={18} aria-hidden="true" />
          <span className="scene-nav-presenter" aria-hidden="true">
            {nextScene ? `${nextScene.presenterId}. kişi` : "Menü"}
          </span>
        </button>
      </div>
      <Dialog.Portal>
        <Dialog.Content
          className="side-menu"
          onInteractOutside={(e) => {
            if (
              e.target instanceof Element &&
              e.target.closest(".floating-nav")
            )
              e.preventDefault();
          }}
        >
          <div className="flex items-center justify-between">
            <Dialog.Title className="font-display text-lg font-semibold">
              Sunum
            </Dialog.Title>
            <Dialog.Close className="icon-button" aria-label="Menüyü kapat">
              <X size={19} />
            </Dialog.Close>
          </div>
          <Dialog.Description className="sr-only">
            Sunucu ve bölüm gruplarıyla {scenes.length} sahnede serbest gezinme,
            sayfa açıklamaları ve kaynaklar.
          </Dialog.Description>
          <fieldset className="shrink-0">
            <legend className="mb-2 text-xs font-semibold text-slate-600">
              Anlatım rotası
            </legend>
            <div className="grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1">
              {(["core", "full"] as const).map((mode) => (
                <button
                  key={mode}
                  aria-pressed={p.mode === mode}
                  onClick={() => p.setMode(mode)}
                  className={`rounded-lg px-2 py-2 text-xs font-semibold ${p.mode === mode ? "bg-white text-blue shadow-sm" : "text-slate-600"}`}
                >
                  {mode === "full" ? "Tüm içerik" : "Ana akış"}
                  <small className="mt-1 block font-normal">
                    {
                      scenes.filter(
                        (scene) =>
                          mode === "full" || scene.depth !== "extension",
                      ).length
                    }{" "}
                    sahne · ≈
                    {Math.ceil(
                      scenes.reduce(
                        (sum, scene) => sum + (scene.seconds?.[mode] ?? 0),
                        0,
                      ) / 60,
                    )}{" "}
                    dk
                  </small>
                </button>
              ))}
            </div>
            <p className="mt-2 text-[10px] leading-relaxed text-slate-600">
              {p.route.length} sahne · {Math.floor(p.estimatedSeconds / 60)} dk{" "}
              {p.estimatedSeconds % 60} sn hedef. Ek açıklamalar menüden her
              zaman açılabilir.
            </p>
          </fieldset>
          <div className="menu-tabs" role="group" aria-label="Menü içeriği">
            {(["scenes", "notes", "sources"] as const).map((tab, i) => (
              <button
                key={tab}
                aria-pressed={p.tab === tab}
                onClick={() => p.setTab(tab)}
              >
                {["Sahneler", "Notlar", "Kaynaklar"][i]}
              </button>
            ))}
          </div>
          <div className="menu-body">
            {p.tab === "scenes" && (
              <div className="space-y-2">
                {sceneGroups.map((group) => (
                  <section key={group.id}>
                    <button
                      aria-expanded={expanded.includes(group.id)}
                      className="flex w-full items-center justify-between rounded-xl bg-slate-100 px-3 py-3 text-left text-xs font-semibold"
                      onClick={() => toggle(group.id)}
                    >
                      <span>
                        {group.label}
                        <span className="ml-2 text-[10px] font-medium text-slate-600">
                          {group.sections}
                        </span>
                      </span>
                      <ChevronDown
                        size={15}
                        className={
                          expanded.includes(group.id) ? "rotate-180" : ""
                        }
                      />
                    </button>
                    {expanded.includes(group.id) && (
                      <div className="scene-list my-1">
                        {group.scenes.map((scene) => (
                          <button
                            key={scene.id}
                            aria-current={
                              p.current.id === scene.id ? "page" : undefined
                            }
                            className={
                              p.current.id === scene.id ? "selected" : ""
                            }
                            onClick={() => p.goTo(scene.id)}
                          >
                            <span>
                              {String(scenes.indexOf(scene) + 1).padStart(
                                2,
                                "0",
                              )}
                            </span>
                            {scene.shortTitle}
                            {scene.depth === "extension" && (
                              <small className="ml-auto shrink-0 text-[9px] font-medium text-slate-500">
                                Ek
                              </small>
                            )}
                            {p.current.id === scene.id && <Check size={15} />}
                          </button>
                        ))}
                      </div>
                    )}
                  </section>
                ))}
              </div>
            )}
            {p.tab === "notes" && <NotesPanel scene={p.current} />}
            {p.tab === "sources" && (
              <div className="menu-sources">
                <SceneSources scene={p.current} />
                <p>
                  İçerik: Operating System Concepts, 10. baskı, Bölüm 11.
                  Fotoğraflar yalnızca görsel destektir.
                </p>
                <p>
                  Tam kitap metni yerel depoda bulunmuyor. Kavramlar resmî
                  içindekiler ve destek slaytlarıyla denetlendi; sahneye özel
                  kaynaklar bu sekmede gösterilir.
                </p>
                {resources.map((r, i) => (
                  <a
                    key={`${r.title}-${i}`}
                    href={r.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <div>
                      <span className="eyebrow">{r.kind}</span>
                      <strong>{r.title}</strong>
                      <p>{r.detail}</p>
                    </div>
                    <ExternalLink size={14} />
                  </a>
                ))}
              </div>
            )}
          </div>
          <p className="text-[10px] text-slate-600">
            Enter: ileri · Backspace: geri · ← →: sahne
            <span className="mt-1 block">
              Space: hareket · Menü açıkken hareket duraklatılır.
            </span>
          </p>
          <div className="menu-tools">
            <button
              className="icon-button"
              aria-label="Ana ekran"
              onClick={() => p.goTo("storage-opening")}
            >
              <Home size={18} />
            </button>
            <button
              className="icon-button"
              aria-label={p.motionOn ? "Animasyonu durdur" : "Animasyonu aç"}
              aria-pressed={!p.motionOn}
              onClick={() => p.setMotionOn(!p.motionOn)}
            >
              {p.motionOn ? <Pause size={18} /> : <Play size={18} />}
            </button>
            <button
              className="icon-button"
              aria-label="Tam ekran"
              onClick={() => void p.fullscreen()}
            >
              <Maximize size={17} />
            </button>
            <button
              className="shortcut-toggle"
              aria-pressed={p.shortcuts}
              onClick={() => p.setShortcuts(!p.shortcuts)}
            >
              Tuşlar {p.shortcuts ? "açık" : "kapalı"}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
