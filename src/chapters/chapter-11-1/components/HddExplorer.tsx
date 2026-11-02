import { lazy, Suspense, useEffect, useRef, useState } from "react";
import {
  Choice,
  Stage,
} from "../../../components/presentation/ScenePrimitives";
import { hddParts, type HddPartId } from "../parts";

const HddModel3D = lazy(() => import("./HddModel3D"));
type Mode = "model" | "disassembly" | "spinup" | "photo";
function HddVideo({
  mode,
  enabled,
}: {
  mode: "disassembly" | "spinup";
  enabled: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (!enabled) ref.current?.pause();
  }, [enabled]);
  return (
    <video
      ref={ref}
      key={mode}
      className="h-full max-h-full max-w-full rounded-2xl bg-black object-contain"
      controls
      playsInline
      muted
      preload="metadata"
      aria-label={
        mode === "disassembly"
          ? "Hazır stop-motion: gerçek HDD’nin parçalarına ayrılması"
          : "Gerçek HDD’nin dönmeye başlaması"
      }
    >
      <source
        src={
          mode === "disassembly"
            ? "/media/hdd-disassembly.webm"
            : "/media/hdd-spinup.webm"
        }
        type="video/webm"
      />
      Video bu tarayıcıda desteklenmiyor.
    </video>
  );
}
export default function HddExplorer({ enabled }: { enabled: boolean }) {
  const [selected, setSelected] = useState<HddPartId>("platters");
  const [exploded, setExploded] = useState(false);
  const [mode, setMode] = useState<Mode>("model");
  const part = hddParts.find((p) => p.id === selected)!;
  return (
    <Stage
      title={
        mode === "model"
          ? part.name
          : mode === "photo"
            ? "Gerçek aygıt."
            : mode === "spinup"
              ? "Dönüş başlıyor."
              : "Parçaların iç dünyası."
      }
      controls={
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Choice active={mode === "model"} onClick={() => setMode("model")}>
            3D
          </Choice>
          <Choice
            active={mode === "disassembly"}
            onClick={() => setMode("disassembly")}
          >
            Söküm
          </Choice>
          <Choice active={mode === "spinup"} onClick={() => setMode("spinup")}>
            Çalışma
          </Choice>
          <Choice active={mode === "photo"} onClick={() => setMode("photo")}>
            Fotoğraf
          </Choice>
          {mode === "model" && (
            <>
              <select
                aria-label="HDD parçasını seç"
                value={selected}
                onChange={(e) => setSelected(e.target.value as HddPartId)}
                className="min-h-10 max-w-[180px] rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold"
              >
                {hddParts.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              <Choice active={exploded} onClick={() => setExploded(!exploded)}>
                Katmanlar
              </Choice>
            </>
          )}
        </div>
      }
    >
      <div className="relative flex h-full min-h-0 w-full max-w-[1200px] items-center justify-center">
        {mode === "model" ? (
          <Suspense
            fallback={
              <span className="text-sm text-slate-600">Model yükleniyor…</span>
            }
          >
            <HddModel3D
              selected={selected}
              exploded={exploded}
              enabled={enabled}
              onSelect={setSelected}
            />
          </Suspense>
        ) : mode === "photo" ? (
          <img
            src="/media/hdd-open.jpg"
            className="h-full max-w-full object-contain mix-blend-multiply"
            alt="Evan-Amos: HDD’nin gerçek plaka ve kafa düzeni"
          />
        ) : (
          <HddVideo mode={mode} enabled={enabled} />
        )}
        {mode === "model" && (
          <span className="pointer-events-none absolute bottom-1 left-1 rounded-lg bg-white/90 px-3 py-1.5 text-[10px] font-medium text-slate-600">
            Sürükle · Döndür · Parça seç
          </span>
        )}
      </div>
    </Stage>
  );
}
