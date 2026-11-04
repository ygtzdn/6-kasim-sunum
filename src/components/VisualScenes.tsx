import { motion } from "motion/react";
import {
  ArrowRight,
  ArrowUpRight,
  Cpu,
  Database,
  HardDrive,
  Layers3,
} from "lucide-react";
import { Stage } from "./presentation/ScenePrimitives";
import { StageCaption } from "../presentation/PresentationMotion";

export function Cover({
  start,
  menu,
  enabled,
  stage,
}: {
  start: () => void;
  menu: () => void;
  enabled: boolean;
  stage: number;
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
        <img
          className="cover-photo"
          src="/media/hdd-open.png"
          width="2000"
          height="1479"
          alt="Plaka, mil ve okuma/yazma kolu görülen gerçek HDD"
        />
        <div className="flex items-center gap-3 text-xs font-semibold">
          <span className="h-2 w-2 rounded-full bg-blue" />
          <StageCaption>
            {
              [
                "Bir dosyayı okumak…",
                "İşletim sistemi isteği iletir.",
                "Depolama aygıtı veriye erişir.",
              ][stage]
            }
          </StageCaption>
        </div>
      </motion.div>
    </section>
  );
}
export function Roadmap({
  goTo,
  stage,
  enabled,
}: {
  goTo: (id: string) => void;
  stage: number;
  enabled: boolean;
}) {
  const labels = ["Donanım", "Zamanlama", "Yönetim", "Bağlantı ve RAID"];
  const sections = ["11.1", "11.2–11.3", "11.4–11.6", "11.7–11.8"];
  const icons = [HardDrive, Cpu, Layers3, Database];
  return (
    <Stage
      title="Dört bakış."
      controls={
        <button className="primary-button" onClick={() => goTo("hdd-anatomy")}>
          11.1’e başla <ArrowRight size={19} />
        </button>
      }
    >
      <div className="roadmap-grid">
        {labels.map((name, i) => {
          const Icon = icons[i];
          return (
            <motion.button
              onClick={() =>
                goTo(
                  [
                    "hdd-anatomy",
                    "hdd-request-queue",
                    "error-detection",
                    "host-attached",
                  ][i],
                )
              }
              aria-label={`${i + 1}. kişinin bölümüne geç`}
              className="roadmap-node"
              key={name}
              initial={false}
              animate={{
                opacity: stage === i ? 1 : 0.48,
                y: stage === i ? -6 : 0,
              }}
              whileHover={enabled ? { y: -9 } : undefined}
              transition={{ duration: enabled ? 0.28 : 0 }}
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
