import { useEffect, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  ExternalLink,
  Home,
  Maximize,
  Menu,
  Pause,
  Play,
  X,
} from "lucide-react";
import { resources, additionalResources } from "../data/content";
import { attachmentRaidSources } from "../chapters/chapter-11-7-8/sources";
import { scenes, sceneGroups } from "./registry";
import NotesPanel from "./NotesPanel";
import type { usePresentation } from "./usePresentation";

type Props = ReturnType<typeof usePresentation>;
export default function SideMenu(p: Props) {
  const trigger = useRef<HTMLButtonElement>(null);
  const [expanded, setExpanded] = useState<string[]>(["intro", "presenter-1"]);
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
      <div className="floating-nav" aria-label="Sunum kontrolleri">
        <button
          className="nav-button"
          aria-label="Önceki sahne"
          disabled={p.index === 0}
          onClick={() => p.move(-1)}
        >
          <ArrowLeft size={18} />
        </button>
        <Dialog.Trigger asChild>
          <button
            ref={trigger}
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
          className="nav-button"
          aria-label={
            p.index === scenes.length - 1
              ? "Sunum menüsünü aç"
              : "Sonraki sahne"
          }
          onClick={() => p.move(1)}
        >
          <ArrowRight size={18} />
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
          onCloseAutoFocus={(e) => {
            e.preventDefault();
            trigger.current?.focus();
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
            Sunucu ve bölüm gruplarıyla 36 sahnede serbest gezinme, ayrıntılı
            konuşmacı notları ve kaynaklar.
          </Dialog.Description>
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
                            <span>{scene.id.slice(1)}</span>
                            {scene.shortTitle}
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
                {[
                  ...resources,
                  ...additionalResources,
                  ...attachmentRaidSources.map((s) => ({
                    title: s.title,
                    href: s.url,
                    detail: s.purpose,
                    kind: "TEKNİK KAYNAK",
                  })),
                ].map((r, i) => (
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
                <a
                  className="text-xs underline"
                  href="https://creativecommons.org/licenses/by/3.0/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Söküm kaydı · CC BY 3.0
                </a>
                <a
                  className="text-xs underline"
                  href="https://creativecommons.org/licenses/by/4.0/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Spin-up kaydı · CC BY 4.0
                </a>
                <a
                  className="text-xs underline"
                  href="https://creativecommons.org/licenses/by-sa/3.0/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Fotoğraf · CC BY-SA 3.0
                </a>
              </div>
            )}
          </div>
          <div className="menu-tools">
            <button
              className="icon-button"
              aria-label="Ana ekran"
              onClick={() => p.goTo("s01")}
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
