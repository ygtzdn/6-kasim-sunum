import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  Braces,
  Cloud,
  Database,
  File,
  HardDrive,
  Laptop,
  Network,
  Play,
  RotateCcw,
  Server,
} from "lucide-react";
import { Choice, Stage } from "../../components/presentation/ScenePrimitives";
import type { SceneContext } from "../../presentation/types";
import { ATTACHMENTS, topologyStep } from "./model.mjs";

type Attachment = keyof typeof ATTACHMENTS;
let savedTopology: { kind: Attachment; step: number } = {
  kind: "DAS",
  step: -1,
};

export function TopologyScene({
  enabled,
  semantic = false,
  openMenu,
}: SceneContext & { semantic?: boolean }) {
  const [state, setState] = useState(savedTopology);
  const reduce = useReducedMotion();
  const path = ATTACHMENTS[state.kind];
  const change = (next: typeof state) => {
    savedTopology = next;
    setState(next);
  };
  const count = path.nodes.length;
  const x = (index: number) => 110 + index * (780 / (count - 1));
  const icons =
    state.kind === "NAS"
      ? [Laptop, Network, Server, HardDrive]
      : [Laptop, Network, HardDrive];
  const fsNode = state.kind === "NAS" ? 2 : 0;
  return (
    <Stage
      title={semantic ? "Dosya mı, blok mu?" : "Depolama nereye bağlı?"}
      controls={
        <div className="flex flex-wrap items-center justify-center gap-2">
          {(["DAS", "NAS", "SAN"] as const).map((kind) => (
            <Choice
              key={kind}
              active={state.kind === kind}
              onClick={() => change({ kind, step: -1 })}
            >
              {kind}
            </Choice>
          ))}
          <button
            className="primary-button"
            disabled={state.step === count - 1}
            onClick={() => change({ ...state, step: state.step + 1 })}
          >
            <Play size={16} />
            {state.step < 0 ? "İsteği izle" : "Adım"}
          </button>
          <button
            className="icon-button"
            aria-label="Topoloji isteğini sıfırla"
            onClick={() => change({ ...state, step: -1 })}
          >
            <RotateCcw size={19} />
          </button>
          <button
            className="icon-button"
            aria-label="Bu modelin açıklamasını ve sınırlarını aç"
            onClick={openMenu}
          >
            ?
          </button>
        </div>
      }
    >
      <div className="flex h-full min-h-0 w-full max-w-6xl flex-col items-center justify-center gap-3 md:gap-7">
        <div className="flex items-center gap-4 rounded-full border-2 border-ink bg-white px-5 py-2 font-display text-lg md:text-2xl">
          <span className="text-blue">{path.abstraction}</span>
          <ArrowRight size={19} />
          <span>{state.kind === "NAS" ? "/sunum.pdf" : "LBA 42"}</span>
        </div>
        <svg
          viewBox="0 0 1000 300"
          className="min-h-0 w-full flex-1"
          role="img"
          aria-label={`${state.kind}: ${path.nodes.join(" → ")}. İstemciye ${path.abstraction.toLocaleLowerCase("tr")} sunulur; dosya sistemi ${path.filesystem.toLocaleLowerCase("tr")} üzerinde.`}
        >
          <path
            d="M110 145H890"
            stroke="#cbd5e1"
            strokeWidth="5"
            strokeLinecap="round"
          />
          {state.step >= 0 && (
            <motion.path
              animate={{ pathLength: state.step / (count - 1) }}
              initial={false}
              transition={{ duration: enabled && !reduce ? 0.5 : 0 }}
              d="M110 145H890"
              stroke="#2247eb"
              strokeWidth="5"
              strokeLinecap="round"
            />
          )}
          {path.nodes.map((label, index) => {
            const Icon = icons[index];
            const active = state.step === index;
            const hasFs = semantic && index === fsNode;
            return (
              <g
                key={`${state.kind}-${label}`}
                transform={`translate(${x(index)} 145)`}
              >
                <motion.circle
                  animate={{
                    r: active ? 63 : 55,
                    fill: active ? "#2247eb" : "#ffffff",
                  }}
                  transition={{ duration: enabled && !reduce ? 0.25 : 0 }}
                  stroke={hasFs ? "#f05b28" : "#111827"}
                  strokeWidth={hasFs ? 5 : 2}
                />
                <Icon
                  x={-23}
                  y={-23}
                  width={46}
                  height={46}
                  color={active ? "#fff" : "#111827"}
                  strokeWidth={1.5}
                />
                <text
                  y="94"
                  textAnchor="middle"
                  fontSize="16"
                  fontWeight="600"
                  fill="#111827"
                >
                  {label.split(" · ")[0]}
                </text>
                {label.includes(" · ") && (
                  <text
                    y="118"
                    textAnchor="middle"
                    fontSize="13"
                    fill="#475569"
                  >
                    {label.split(" · ")[1]}
                  </text>
                )}
                {hasFs && (
                  <g>
                    <rect
                      x="-64"
                      y="-99"
                      width="128"
                      height="25"
                      rx="8"
                      fill="#f05b28"
                    />
                    <text
                      y="-82"
                      textAnchor="middle"
                      fontSize="12"
                      fill="#111827"
                      fontWeight="700"
                    >
                      Dosya sistemi
                    </text>
                  </g>
                )}
              </g>
            );
          })}
          {state.step >= 0 && (
            <motion.circle
              initial={false}
              animate={{ cx: x(state.step) }}
              cy="145"
              r="8"
              fill="#fed84b"
              stroke="#111827"
              strokeWidth="2"
              transition={{ duration: enabled && !reduce ? 0.5 : 0 }}
            />
          )}
        </svg>
        <div
          className="flex min-h-8 items-center justify-center gap-3 text-center font-display text-base md:text-2xl"
          aria-live="polite"
        >
          {semantic ? (
            <>
              <span>Dosya sistemi</span>
              <ArrowRight size={20} />
              <strong className="text-blue">{path.filesystem}</strong>
            </>
          ) : (
            <span>
              {state.step < 0 ? path.protocol : `${state.step + 1} / ${count}`}
            </span>
          )}
        </div>
        <p className="sr-only" aria-live="polite">
          {state.step >= 0
            ? topologyStep(state.kind, state.step)
            : "İstek hazır. İsteği izle düğmesiyle adımlayın."}
        </p>
        {semantic && state.kind === "SAN" && (
          <p className="text-center text-xs font-semibold text-slate-700">
            Ortak hacim ≠ ortak dosya sistemi tutarlılığı
          </p>
        )}
      </div>
    </Stage>
  );
}

type CloudMode = "object" | "file" | "block";
const CLOUD_MODES = {
  object: {
    title: "Nesne",
    protocol: "HTTP API",
    target: "Kimlik → nesne",
    Icon: Braces,
  },
  file: {
    title: "Dosya",
    protocol: "Dosya protokolü",
    target: "/paylasim/dosya",
    Icon: File,
  },
  block: {
    title: "Blok",
    protocol: "Blok erişimi",
    target: "Host → hacim",
    Icon: Database,
  },
};

export function CloudScene({ enabled, openMenu }: SceneContext) {
  const [mode, setMode] = useState<CloudMode>("object");
  const [request, setRequest] = useState(0);
  const [answer, setAnswer] = useState<boolean | null>(null);
  const reduce = useReducedMotion();
  const selected = CLOUD_MODES[mode];
  const Icon = selected.Icon;
  return (
    <Stage
      title="Ağ, erişim biçimini belirlemez."
      controls={
        <div className="flex flex-wrap items-center justify-center gap-2">
          {(Object.keys(CLOUD_MODES) as CloudMode[]).map((key) => (
            <Choice
              key={key}
              active={key === mode}
              onClick={() => {
                setMode(key);
                setRequest(0);
              }}
            >
              {CLOUD_MODES[key].title}
            </Choice>
          ))}
          <button
            className="primary-button"
            onClick={() => setRequest(request + 1)}
          >
            <Play size={16} />
            İstek
          </button>
          <button
            className="icon-button"
            onClick={openMenu}
            aria-label="Bulut, diziler ve bağlantı türlerinin ayrıntılarını aç"
          >
            ?
          </button>
        </div>
      }
    >
      <div className="flex h-full min-h-0 w-full max-w-5xl flex-col items-center justify-center gap-5">
        <svg
          viewBox="0 0 900 340"
          className="min-h-0 w-full flex-1"
          role="img"
          aria-label={`Uygulama, ağ üzerinden ${selected.protocol} ile bulut ${selected.title.toLocaleLowerCase("tr")} depolamasına erişir. Gerçek servis çağrısı yapılmaz.`}
        >
          <path
            d="M150 155H730"
            stroke="#111827"
            strokeWidth="3"
            strokeDasharray="8 8"
          />
          <rect
            x="65"
            y="85"
            width="150"
            height="140"
            rx="30"
            fill="white"
            stroke="#111827"
            strokeWidth="2"
          />
          <Laptop
            x="105"
            y="120"
            width="70"
            height="70"
            color="#111827"
            strokeWidth="1.5"
          />
          <Cloud
            x="330"
            y="60"
            width="240"
            height="190"
            fill="#dce3ff"
            color="#2247eb"
            strokeWidth="1.5"
          />
          <rect
            x="655"
            y="85"
            width="150"
            height="140"
            rx="30"
            fill="#fed84b"
            stroke="#111827"
            strokeWidth="2"
          />
          <Icon
            x="695"
            y="120"
            width="70"
            height="70"
            color="#111827"
            strokeWidth="1.5"
          />
          <text
            x="140"
            y="265"
            textAnchor="middle"
            fill="#111827"
            fontSize="19"
            fontWeight="600"
          >
            Uygulama
          </text>
          <text
            x="450"
            y="280"
            textAnchor="middle"
            fill="#2247eb"
            fontSize="21"
            fontWeight="700"
          >
            {selected.protocol}
          </text>
          <text
            x="730"
            y="265"
            textAnchor="middle"
            fill="#111827"
            fontSize="19"
            fontWeight="600"
          >
            {selected.title}
          </text>
          {request > 0 && (
            <motion.circle
              key={`${mode}-${request}`}
              cx="150"
              cy="155"
              r="10"
              fill="#f05b28"
              stroke="#111827"
              strokeWidth="2"
              initial={{ x: 0 }}
              animate={{ x: 580 }}
              transition={{ duration: enabled && !reduce ? 1.1 : 0 }}
            />
          )}
        </svg>
        <span className="font-display text-lg font-semibold md:text-3xl">
          {selected.target}
        </span>
        <div className="flex flex-wrap items-center justify-center gap-2 border-t border-slate-300 pt-4">
          <span className="mr-2 text-sm font-semibold">Ağ = dosya?</span>
          <Choice active={answer === true} onClick={() => setAnswer(true)}>
            Evet
          </Choice>
          <Choice active={answer === false} onClick={() => setAnswer(false)}>
            Hayır
          </Choice>
          {answer !== null && (
            <span
              aria-live="polite"
              className={`px-2 text-sm font-semibold ${answer === false ? "text-blue" : "text-orange"}`}
            >
              {answer === false ? "Blok da olabilir." : "SAN → blok"}
            </span>
          )}
        </div>
      </div>
    </Stage>
  );
}
