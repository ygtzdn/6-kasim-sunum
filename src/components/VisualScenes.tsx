import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Cpu,
  Database,
  HardDrive,
  Layers3,
  Play,
  Power,
  Radio,
  RotateCcw,
  X,
} from "lucide-react";
import DiskDiagram from "./DiskDiagram";
import { Stage, Choice } from "./presentation/ScenePrimitives";

export function Cover({
  start,
  menu,
  enabled,
}: {
  start: () => void;
  menu: () => void;
  enabled: boolean;
}) {
  return (
    <section className="home-grid">
      <div className="flex flex-col items-start gap-7 md:gap-9">
        <span className="eyebrow">Operating System Concepts · 10. baskı</span>
        <h1 id="scene-heading" tabIndex={-1} className="home-title">
          Mass
          <br />
          <span className="text-blue">Storage.</span>
        </h1>
        <p className="text-lg font-medium md:text-2xl">
          Verinin fiziksel dünyası.
        </p>
        <div className="flex items-center gap-6">
          <button className="primary-button" onClick={start}>
            Başla <ArrowRight size={21} />
          </button>
          <button
            className="inline-flex items-center gap-2 text-sm font-semibold"
            onClick={menu}
          >
            Sunum akışı <ArrowUpRight size={17} />
          </button>
        </div>
        <span className="text-xs font-medium text-slate-600">
          Bölüm 11 / 4 sunucu
        </span>
      </div>
      <motion.div
        className="home-object"
        whileHover={enabled ? { rotate: -3, scale: 1.03 } : undefined}
        transition={{ type: "spring", stiffness: 130, damping: 18 }}
      >
        <DiskDiagram moving={enabled} />
        <div className="flex items-center gap-3 text-xs font-semibold">
          <span className="h-2 w-2 rounded-full bg-blue" />
          01 / Manyetik disk
        </div>
      </motion.div>
    </section>
  );
}
export function Roadmap({ goTo }: { goTo: (id: string) => void }) {
  const labels = ["Donanım", "Zamanlama", "Yönetim", "RAID"];
  const sections = ["11.1", "11.2–11.3", "11.4–11.6", "11.7–11.8"];
  const icons = [HardDrive, Cpu, Layers3, Database];
  return (
    <Stage
      title="Dört bakış."
      controls={
        <button className="primary-button" onClick={() => goTo("s03")}>
          11.1’e başla <ArrowRight size={19} />
        </button>
      }
    >
      <div className="roadmap-grid">
        {labels.map((name, i) => {
          const Icon = icons[i];
          return (
            <motion.button
              onClick={() => goTo(["s03", "s10", "s18", "s26"][i])}
              aria-label={`${i + 1}. kişinin bölümüne geç`}
              className="roadmap-node"
              key={name}
              whileHover={{ y: -8 }}
            >
              <span className="text-sm font-medium text-slate-600">
                0{i + 1} / {sections[i]}
              </span>
              <div className={`roadmap-orb orb-${i}`}>
                <Icon size={48} strokeWidth={1.5} />
              </div>
              <h2 className="font-display text-xl font-semibold md:text-3xl">
                {name}
              </h2>
            </motion.button>
          );
        })}
      </div>
    </Stage>
  );
}
function Tape({ enabled }: { enabled: boolean }) {
  return (
    <svg
      viewBox="0 0 660 380"
      className="focus-svg"
      role="img"
      aria-label="İki makara arasında ilerleyen manyetik teyp"
    >
      <rect
        x="55"
        y="55"
        width="550"
        height="270"
        rx="30"
        fill="#fff"
        stroke="#111827"
        strokeWidth="3"
      />
      <path d="M190 265H470" stroke="#111827" strokeWidth="12" />
      {[200, 460].map((x) => (
        <g key={x}>
          <circle
            cx={x}
            cy="180"
            r="96"
            fill="#e9e6ff"
            stroke="#111827"
            strokeWidth="3"
          />
          <g>
            {enabled && (
              <animateTransform
                attributeName="transform"
                type="rotate"
                from={`0 ${x} 180`}
                to={`360 ${x} 180`}
                dur="8s"
                repeatCount="indefinite"
              />
            )}
            {[0, 120, 240].map((a) => (
              <circle
                key={a}
                cx={x + 58 * Math.cos((a * Math.PI) / 180)}
                cy={180 + 58 * Math.sin((a * Math.PI) / 180)}
                r="24"
                fill="#fff"
                stroke="#111827"
                strokeWidth="2"
              />
            ))}
          </g>
          <circle cx={x} cy="180" r="12" fill="#111827" />
        </g>
      ))}
    </svg>
  );
}
export function Storage({ enabled }: { enabled: boolean }) {
  const [selected, setSelected] = useState(0);
  const [power, setPower] = useState(true);
  const [lost, setLost] = useState(false);
  const names = ["HDD", "SSD / NVM", "RAM disk", "Teyp"];
  const icons = [HardDrive, Cpu, Layers3, Radio];
  return (
    <Stage
      title="Veri nerede?"
      controls={
        <div className="flex flex-wrap justify-center gap-2 md:gap-3">
          {names.map((name, i) => {
            const Icon = icons[i];
            return (
              <Choice
                key={name}
                active={selected === i}
                onClick={() => {
                  setSelected(i);
                  setPower(true);
                  setLost(false);
                }}
              >
                <Icon size={18} />
                {name}
              </Choice>
            );
          })}
        </div>
      }
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={selected}
          className="storage-visual"
          initial={{ opacity: 0, scale: 0.93 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.23 }}
        >
          {selected === 0 ? (
            <DiskDiagram moving={enabled} />
          ) : selected === 3 ? (
            <Tape enabled={enabled} />
          ) : (
            <div className="chip">
              <Cpu size={36} />
              <div className="chip-cells">
                {Array.from({ length: 24 }, (_, i) => (
                  <motion.div
                    key={i}
                    style={{
                      color: power && !lost && i % 3 === 0 ? "#fff" : "#111827",
                    }}
                    animate={{
                      backgroundColor:
                        power && !lost
                          ? i % 3 === 0
                            ? "#2247eb"
                            : "#e7eaff"
                          : "#e7e9ee",
                      scale: enabled && power && !lost ? [1, 1.05, 1] : 1,
                    }}
                    transition={{
                      duration: 1.8,
                      delay: enabled ? i * 0.045 : 0,
                      repeat: enabled ? Infinity : 0,
                    }}
                  >
                    {power && !lost ? (i % 3 === 0 ? "1" : "0") : "–"}
                  </motion.div>
                ))}
              </div>
              {selected === 2 && (
                <button
                  className={`power-button ${power ? "" : "is-off"}`}
                  aria-pressed={!power}
                  aria-label={power ? "RAM gücünü kes" : "RAM gücünü aç"}
                  onClick={() => {
                    if (power) setLost(true);
                    setPower(!power);
                  }}
                >
                  <Power size={20} />
                </button>
              )}
            </div>
          )}
          <span className="visual-caption">
            {selected === 0
              ? "Kalıcı · Mekanik"
              : selected === 1
                ? "Kalıcı · Elektronik"
                : selected === 2
                  ? power
                    ? lost
                      ? "Güç var · Eski veri yok"
                      : "Uçucu"
                    : "Güç yok → veri yok"
                  : "Kalıcı · Sıralı erişim"}
          </span>
        </motion.div>
      </AnimatePresence>
    </Stage>
  );
}
const mapping = [7, 2, 10, 5, 12, 0, 14, 9, 6, 13, 1, 8, 15, 4, 11, 3];
export function Blocks({ enabled }: { enabled: boolean }) {
  const [selected, setSelected] = useState(3);
  return (
    <Stage
      title="Adres ≠ konum."
      controls={
        <div className="mapping-result" aria-live="polite">
          <span>LBA {String(selected).padStart(2, "0")}</span>
          <ArrowRight size={22} />
          <span>P {String(mapping[selected]).padStart(2, "0")}</span>
        </div>
      }
    >
      <div className="block-layout">
        <div className="block-group">
          <span className="eyebrow">MANTIKSAL</span>
          <div className="address-grid">
            {mapping.map((_, i) => (
              <button
                key={i}
                aria-label={"LBA " + i}
                aria-pressed={selected === i}
                className={selected === i ? "selected" : ""}
                onClick={() => setSelected(i)}
              >
                {String(i).padStart(2, "0")}
              </button>
            ))}
          </div>
        </div>
        <div className="mapping-controller">
          <Database size={28} />
          <span>Eşleme</span>
          <motion.div
            animate={{ opacity: enabled ? [0.3, 1, 0.3] : 1 }}
            transition={{ duration: 1.2, repeat: enabled ? Infinity : 0 }}
          >
            <ArrowRight size={25} />
          </motion.div>
        </div>
        <div className="block-group">
          <span className="eyebrow">FİZİKSEL</span>
          <div className="address-grid physical-grid">
            {mapping.map((_, i) => (
              <motion.div
                key={i}
                className={mapping[selected] === i ? "selected" : ""}
                animate={{
                  scale: mapping[selected] === i ? [0.94, 1.06, 1] : 1,
                }}
                transition={{ duration: 0.3 }}
              >
                {String(i).padStart(2, "0")}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </Stage>
  );
}
export function Flash() {
  const [version, setVersion] = useState(0);
  return (
    <Stage
      title="Yeni sürüm. Yeni sayfa."
      controls={
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            className="primary-button"
            onClick={() => setVersion((v) => v + 1)}
            disabled={version === 4}
          >
            L0’ı yaz <ArrowRight size={18} />
          </button>
          <button
            className="icon-button"
            aria-label="Flash örneğini sıfırla"
            onClick={() => setVersion(0)}
          >
            <RotateCcw size={21} />
          </button>
        </div>
      }
    >
      <div className="flash-focus">
        <div className="flash-blocks">
          {[0, 1].map((block) => (
            <div className="flash-block" key={block}>
              <span className="eyebrow">BLOK {block}</span>
              <div className="flash-row">
                {Array.from({ length: 4 }, (_, i) => {
                  const address = block * 4 + i;
                  const isOld =
                    (address === 0 && version > 0) ||
                    (block === 1 && i < version - 1);
                  const fresh = block === 1 && i === version - 1;
                  const label =
                    address < 4
                      ? i === 0
                        ? "L0"
                        : `L${i}`
                      : i < version
                        ? "L0"
                        : "—";
                  return (
                    <motion.div
                      layout
                      key={address}
                      animate={{
                        scale: fresh ? [0.94, 1.05, 1] : 1,
                        backgroundColor: fresh
                          ? "#2247eb"
                          : isOld
                            ? "#eceef2"
                            : "#fff",
                      }}
                      transition={{ duration: 0.4 }}
                      className={`flash-page ${isOld ? "page-invalid" : ""} ${fresh ? "page-new" : ""}`}
                    >
                      <small>P{String(address).padStart(2, "0")}</small>
                      <strong>{label}</strong>
                      <span>
                        {isOld ? (
                          <X size={17} />
                        ) : fresh ? (
                          <Check size={17} />
                        ) : (
                          <span />
                        )}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <div className="mapping-result" aria-live="polite">
          <span>L0</span>
          <ArrowRight size={22} />
          <motion.span
            key={version}
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            P{String(version === 0 ? 0 : version + 3).padStart(2, "0")}
          </motion.span>
        </div>
      </div>
    </Stage>
  );
}
export function Workloads({ enabled }: { enabled: boolean }) {
  const [sequential, setSequential] = useState(false);
  const [step, setStep] = useState(0);
  const requests = sequential
    ? [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]
    : [2, 19, 7, 22, 13];
  useEffect(() => {
    setStep(0);
  }, [sequential]);
  useEffect(() => {
    if (!enabled) return;
    const t = setInterval(
      () => setStep((s) => (s + 1) % requests.length),
      1100,
    );
    return () => clearInterval(t);
  }, [enabled, requests.length]);
  const points = requests.map((i) => ({
    x: 70 + (i % 12) * 77,
    y: 115 + Math.floor(i / 12) * 145,
  }));
  const current = points[step % points.length];
  const path = points
    .slice(0, (step % points.length) + 1)
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x} ${p.y}`)
    .join(" ");
  return (
    <Stage
      title={sequential ? "Sıralı erişim." : "Rastgele erişim."}
      controls={
        <div className="flex flex-wrap justify-center gap-2">
          <Choice active={!sequential} onClick={() => setSequential(false)}>
            Rastgele
          </Choice>
          <Choice active={sequential} onClick={() => setSequential(true)}>
            Sıralı
          </Choice>
          <button
            className="icon-button"
            aria-label="İsteği ilerlet"
            onClick={() => setStep((s) => (s + 1) % requests.length)}
          >
            <Play size={19} />
          </button>
        </div>
      }
    >
      <svg
        viewBox="0 0 1000 360"
        className="focus-svg"
        aria-label="Farklı veri konumları arasında ilerleyen okuma isteği"
      >
        <path
          d={path}
          stroke="#2247eb"
          strokeWidth="4"
          fill="none"
          strokeLinejoin="round"
        />
        {Array.from({ length: 24 }, (_, i) => {
          const x = 70 + (i % 12) * 77,
            y = 115 + Math.floor(i / 12) * 145;
          const active = requests[step % requests.length] === i;
          return (
            <g key={i}>
              <rect
                x={x - 24}
                y={y - 27}
                width="48"
                height="54"
                rx="7"
                fill={active ? "#2247eb" : "#fff"}
                stroke="#111827"
                strokeWidth="2"
              />
              <text
                x={x}
                y={y + 7}
                textAnchor="middle"
                fontSize="16"
                fill={active ? "#fff" : "#111827"}
              >
                {String(i).padStart(2, "0")}
              </text>
            </g>
          );
        })}
        <motion.circle
          animate={{ cx: current.x, cy: current.y - 46 }}
          transition={{ type: "spring", stiffness: 85, damping: 18 }}
          r="9"
          fill="#f05b28"
        />
      </svg>
    </Stage>
  );
}
export function Checkpoint() {
  const [answer, setAnswer] = useState<boolean | null>(null);
  return (
    <Stage
      title="Hız artarsa bekleme biter mi?"
      controls={
        <div className="flex gap-3">
          <Choice active={answer === true} onClick={() => setAnswer(true)}>
            Evet
          </Choice>
          <Choice active={answer === false} onClick={() => setAnswer(false)}>
            Hayır
          </Choice>
        </div>
      }
    >
      <div className="checkpoint-focus">
        <motion.div
          animate={{
            rotate: answer === true ? [0, -5, 5, -5, 0] : 0,
            scale: answer === false ? [0.9, 1.1, 1] : 1,
          }}
          transition={{ duration: 0.45 }}
          className={`question-orb ${answer === false ? "answer-correct" : ""}`}
        >
          {answer === null ? (
            "?"
          ) : answer === false ? (
            <Check size={80} strokeWidth={2} />
          ) : (
            <X size={80} strokeWidth={2} />
          )}
        </motion.div>
        <div className="checkpoint-caption" aria-live="polite">
          {answer === null ? (
            <>
              <span>Aktarım ↑</span>
              <ArrowRight size={25} />
              <span>Bekleme = 0 ?</span>
            </>
          ) : (
            <>
              <span>Seek</span>
              <span>+</span>
              <span>Dönme</span>
              <span>≠ 0</span>
            </>
          )}
        </div>
      </div>
    </Stage>
  );
}
