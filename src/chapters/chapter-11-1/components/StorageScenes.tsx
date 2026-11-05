import { arc, curveLinear, line, pointRadial } from "d3-shape";
import { motion } from "motion/react";
import {
  FlowDiagram,
  type DiagramNode,
  type DiagramEdge,
} from "../../../components/diagrams/FlowDiagram";
import { ArrowRight, Cpu, Database, HardDrive } from "lucide-react";
import type { SceneContext } from "../../../presentation/types";
import { hardwareCaptions } from "../captions";
import { Lesson, Photo, Metric } from "./LearningPrimitives";
import { HardwarePartsLegend } from "./HardwarePhoto";

type DiagramPoint = [number, number];
const straightLine = line<DiagramPoint>()
  .x((point) => point[0])
  .y((point) => point[1])
  .curve(curveLinear);
const polyline = (points: DiagramPoint[]) => straightLine(points) ?? "";
const hddSector =
  arc()({
    innerRadius: 121,
    outerRadius: 139,
    startAngle: Math.PI / 3,
    endAngle: Math.PI / 2,
  }) ?? "";

export function HddAnatomy({ stage }: SceneContext) {
  const visibleParts =
    stage === 0
      ? []
      : stage === 1
        ? ["platter", "spindle"]
        : ["platter", "spindle", "arm", "head"];
  const activeParts =
    stage === 1
      ? ["platter", "spindle"]
      : stage === 2 || stage === 4
        ? ["arm", "head"]
        : visibleParts;
  return (
    <Lesson
      title="Kol konumlanır. Plaka döner."
      caption={hardwareCaptions["hdd-anatomy"][stage]}
    >
      <div className="hardware-layout">
        <Photo
          device="hdd"
          visibleParts={visibleParts}
          activeParts={activeParts}
        />
        <div className="hardware-explanation">
          <span className="eyebrow">Manyetik disk</span>
          <h2 className="font-display text-xl font-medium md:text-3xl">
            {
              [
                "Gerçek HDD",
                "Plaka ve mil",
                "Kol ve kafa ucu",
                "İki farklı hareket",
                "Temas normal okuma değildir",
              ][stage]
            }
          </h2>
          {stage === 0 ? (
            <HardDrive
              className="size-16 text-blue md:size-24"
              strokeWidth={1.3}
            />
          ) : stage === 1 ? (
            <HardwarePartsLegend
              device="hdd"
              visibleParts={["platter", "spindle"]}
            />
          ) : stage === 2 ? (
            <HardwarePartsLegend device="hdd" visibleParts={["arm", "head"]} />
          ) : stage === 3 ? (
            <div className="flex flex-col gap-3">
              <Metric value="Seek" label="Kolun hedef ize gitmesi" />
              <Metric value="Dönme" label="Sektörün kafa altına gelmesi" />
            </div>
          ) : (
            <svg
              viewBox="0 0 360 230"
              className="w-full"
              role="img"
              aria-label="Normal kafa yüzeyden ayrıdır; temas head crash riskidir"
            >
              <path
                d={
                  polyline([
                    [20, 85],
                    [340, 85],
                  ]) +
                  polyline([
                    [20, 195],
                    [340, 195],
                  ])
                }
                stroke="#111827"
                strokeWidth="9"
              />
              <path
                d={polyline([
                  [65, 45],
                  [230, 45],
                  [260, 60],
                  [230, 60],
                ])}
                stroke="#2247eb"
                strokeWidth="12"
                fill="none"
              />
              <path
                d={polyline([
                  [65, 155],
                  [230, 155],
                  [260, 193],
                  [230, 193],
                ])}
                stroke="#f05b28"
                strokeWidth="12"
                fill="none"
              />
              <text x="20" y="20" fontSize="16" fill="#2247eb">
                Normal: yüzeye temas yok
              </text>
              <text x="20" y="135" fontSize="16" fill="#a93411">
                Temas: head crash riski
              </text>
              <text x="20" y="225" fontSize="12" fill="#64748b">
                Kavramsal yan kesit · ölçeksiz
              </text>
            </svg>
          )}
        </div>
      </div>
    </Lesson>
  );
}
export function HddGeometry({ stage }: SceneContext) {
  return (
    <Lesson
      title="İz ≠ sektör ≠ silindir."
      caption={hardwareCaptions["hdd-geometry"][stage]}
    >
      <svg
        viewBox="0 0 1000 450"
        className="h-full max-h-[440px] w-full"
        role="img"
        aria-label={
          stage === 3
            ? "Çok yüzeyde aynı yarıçaptaki izler bir silindirdir"
            : "Tek yüzeyde dairesel iz ve onun sektör parçası"
        }
      >
        <g transform="translate(270 225)">
          <circle r="180" fill="#eef1f7" stroke="#111827" strokeWidth="3" />
          <circle r="27" fill="white" stroke="#111827" strokeWidth="3" />
          {[70, 100, 130, 160].map((r) => (
            <circle
              key={r}
              r={r}
              fill="none"
              stroke={stage >= 1 && r === 130 ? "#2247eb" : "#bdc5d3"}
              strokeWidth={stage >= 1 && r === 130 ? 12 : 2}
            />
          ))}
          {stage >= 2 && <path d={hddSector} fill="#f05b28" />}
          {stage === 2 && (
            <>
              <path
                d={
                  polyline([[0, 0], pointRadial(Math.PI / 2, 180)]) +
                  polyline([[0, 0], pointRadial(Math.PI / 3, 180)])
                }
                stroke="#f05b28"
                strokeDasharray="6 5"
              />
              <text x="185" y="-36" fontSize="18" fill="#a93411">
                Sektör
              </text>
            </>
          )}
        </g>
        {stage === 3 ? (
          <g transform="translate(660 55)">
            {[0, 1, 2].map((i) => (
              <g key={i} transform={`translate(0 ${i * 130})`}>
                <ellipse
                  cx="75"
                  cy="32"
                  rx="135"
                  ry="34"
                  fill="#eef1f7"
                  stroke="#111827"
                  strokeWidth="2"
                />
                <ellipse
                  cx="75"
                  cy="32"
                  rx="95"
                  ry="24"
                  fill="none"
                  stroke="#2247eb"
                  strokeWidth="8"
                />
              </g>
            ))}
            <path
              d={
                polyline([
                  [-20, 32],
                  [-20, 292],
                ]) +
                polyline([
                  [170, 32],
                  [170, 292],
                ])
              }
              stroke="#2247eb"
              strokeWidth="2"
              strokeDasharray="8 6"
            />
            <text
              x="75"
              y="390"
              textAnchor="middle"
              fontSize="20"
              fill="#2247eb"
            >
              Aynı yarıçap → silindir
            </text>
          </g>
        ) : (
          <g transform="translate(600 150)">
            <text fontSize="34" fill="#111827">
              {["Tek disk yüzeyi", "İz", "Sektör"][stage]}
            </text>
            <text y="50" fontSize="20" fill="#64748b">
              {
                ["Geometri modeli", "Dairesel kayıt yolu", "İzin bir parçası"][
                  stage
                ]
              }
            </text>
            {stage >= 1 && (
              <path
                d={polyline([
                  [0, 85],
                  [230, 85],
                ])}
                stroke={stage === 2 ? "#f05b28" : "#2247eb"}
                strokeWidth="12"
              />
            )}
          </g>
        )}
      </svg>
    </Lesson>
  );
}
export function NvmDevice({ stage }: SceneContext) {
  const parts =
    stage === 0
      ? []
      : stage === 1
        ? ["nand"]
        : ["nand", "controller", "connector"];
  const active = stage === 2 ? ["controller", "connector"] : parts;
  return (
    <Lesson
      title="NVM ve SSD'nin parçaları"
      caption={hardwareCaptions["nvm-device"][stage]}
    >
      <div className="hardware-layout">
        <Photo
          device={stage === 0 ? "ssd-case" : "ssd-board"}
          visibleParts={parts}
          activeParts={active}
        />
        <div className="hardware-explanation">
          {stage === 0 ? (
            <>
              <h2 className="font-display text-3xl">Flash SSD</h2>
              <p className="text-lg leading-relaxed text-slate-600">
                Kalıcı bellek kullanır.
                <br />
                Hareketli parçası yoktur.
              </p>
            </>
          ) : (
            <HardwarePartsLegend
              device="ssd-board"
              visibleParts={parts}
              activeParts={active}
            />
          )}
        </div>
      </div>
    </Lesson>
  );
}

export function FlashBasics({ stage }: SceneContext) {
  return (
    <Lesson
      title="NAND'da sayfa ve blok"
      caption={hardwareCaptions["flash-page-block"][stage]}
    >
      <div className="nand-structure">
        <div className="nand-blocks">
          {[0, 1, 2].map((block) => (
            <div
              key={block}
              className={`nand-block ${stage === 2 && block === 0 ? "erasing-block" : ""}`}
            >
              <h2>Blok B{block}</h2>
              {[0, 1, 2, 3].map((page) => {
                const selected = block === 0 && page === 0;
                const filled =
                  (stage === 1 && selected) || (block === 1 && page === 0);
                return (
                  <div
                    key={page}
                    className={`nand-page ${selected && stage < 2 ? "selected-page" : ""}`}
                  >
                    <span>P{page}</span>
                    <strong>{filled ? "Veri" : "Boş"}</strong>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div className="nand-operation">
          <strong>
            {
              [
                "Bir blok, birden çok sayfa içerir",
                "Okuma ve yazma: bir sayfa",
                "Silme: bloğun bütün sayfaları",
              ][stage]
            }
          </strong>
        </div>
      </div>
    </Lesson>
  );
}
export function FlashEndurance({ stage, enabled }: SceneContext) {
  return (
    <Lesson
      title="Silme ömrü sınırlı. DWPD başka bir ölçü."
      caption={hardwareCaptions["flash-endurance"][stage]}
    >
      <div
        className={`endurance-scene ${stage === 3 ? "endurance-with-chart" : ""}`}
      >
        <div className="endurance-facts">
          <div className="grid grid-cols-2 gap-5">
            {stage === 0 ? (
              <>
                <Metric
                  value="Sınırlı döngü"
                  label="Flash bloklarının yazma/silme dayanıklılığı"
                />
                <Metric
                  value="Dayanıklılık"
                  label="Yazılabilecek veri hacmiyle değerlendirilir"
                />
              </>
            ) : (
              <>
                <Metric value="1 TB" label="Aygıt kapasitesi" />
                <Metric
                  value="5 DWPD"
                  label="Günlük tam aygıt yazma derecesi"
                />
              </>
            )}
          </div>
          {stage >= 2 && (
            <Metric
              value="1 × 5 = 5 TB/gün"
              label="Tanımlı koşullardaki günlük yazma bütçesi"
            />
          )}
        </div>
        {stage === 3 && (
          <div
            className="endurance-chart"
            role="img"
            aria-label="5 TB/gün sınırına göre 3 TB bütçe altında, 6 TB bütçe üstünde"
          >
            <div className="endurance-chart-heading">
              Günlük yazma <span>Kesikli çizgi: 5 TB</span>
            </div>
            {[3, 6].map((value) => (
              <div className="endurance-bar-row" key={value}>
                <div>
                  <strong>{value} TB/gün</strong>
                  <span>{value <= 5 ? "Bütçe altında" : "Bütçe üstünde"}</span>
                </div>
                <div className="endurance-track">
                  <motion.div
                    initial={enabled ? { width: 0 } : false}
                    animate={{ width: `${(value / 7) * 100}%` }}
                    transition={{ duration: enabled ? 0.45 : 0 }}
                    style={{ background: value <= 5 ? "#2247eb" : "#f05b28" }}
                  />
                  <i style={{ left: `${(5 / 7) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Lesson>
  );
}
export function LogicalBlocks({ stage }: SceneContext) {
  return (
    <Lesson
      title="OS, numaralı mantıksal blokları görür."
      caption={hardwareCaptions["logical-blocks"][stage]}
    >
      <div className="flex w-full max-w-[950px] flex-col gap-6 md:gap-10">
        <div className="grid grid-cols-8 gap-2">
          {Array.from({ length: 8 }, (_, i) => (
            <div
              key={i}
              className={`state-cell flex aspect-square flex-col items-center justify-center gap-2 rounded-xl border ${stage >= 1 && i === 3 ? "border-blue bg-blue text-white" : "border-slate-300 bg-white"}`}
            >
              <small className="text-[9px]">LBA</small>
              <strong className="font-display text-xl md:text-3xl">{i}</strong>
            </div>
          ))}
        </div>
        {stage === 0 ? (
          <div className="flex justify-center gap-3 text-sm text-slate-500">
            <Database size={24} />
            <span>Tek boyutlu adres dizisi</span>
          </div>
        ) : stage === 1 ? (
          <div className="mx-auto flex items-center gap-4 rounded-xl border-2 border-blue bg-blue/5 px-7 py-5 text-sm font-semibold">
            <span>OS · Oku LBA 3</span>
            <ArrowRight />
            <span>Aygıt</span>
          </div>
        ) : stage === 2 ? (
          <svg
            viewBox="0 0 800 170"
            className="max-h-48 w-full"
            role="img"
            aria-label="LBA3, küçük sıralı eşlemede örnek sektör3 ile eşleşir"
          >
            <text x="15" y="90" fontSize="24" fill="#2247eb">
              LBA 3
            </text>
            <path
              d={polyline([
                [115, 82],
                [250, 82],
              ])}
              stroke="#2247eb"
              strokeWidth="4"
            />
            <path
              d={polyline([
                [230, 68],
                [250, 82],
                [230, 96],
              ])}
              fill="none"
              stroke="#2247eb"
              strokeWidth="4"
            />
            {Array.from({ length: 8 }, (_, i) => (
              <g key={i} transform={`translate(${280 + i * 62} 50)`}>
                <rect
                  width="56"
                  height="65"
                  rx="6"
                  fill={i === 3 ? "#2247eb" : "#eef1f7"}
                  stroke="#111827"
                />
                <text
                  x="28"
                  y="39"
                  textAnchor="middle"
                  fontSize="21"
                  fill={i === 3 ? "white" : "#111827"}
                >
                  {i}
                </text>
              </g>
            ))}
            <text x="280" y="155" fontSize="16" fill="#64748b">
              Temel sıralı sektör modeli · gerçek geometri değil
            </text>
          </svg>
        ) : (
          <div className="grid grid-cols-3 items-center gap-3 text-center">
            <Metric value="LBA 3" label="İstek korunur" />
            <ArrowRight className="mx-auto text-blue" size={35} />
            <Metric value="Denetleyici" label="Fiziksel ayrıntı soyutlanır" />
          </div>
        )}
      </div>
    </Lesson>
  );
}
export function DataPath({ stage, enabled }: SceneContext) {
  const definitions = [
    {
      id: "os",
      label: "OS",
      detail: "Oku LBA 3 · hedef DRAM",
      icon: Cpu,
      position: { x: 0, y: 0 },
    },
    {
      id: "host",
      label: "Host denetleyicisi",
      detail: "Bilgisayar tarafı",
      icon: Cpu,
      position: { x: 400, y: 0 },
    },
    {
      id: "device",
      label: "Aygıt denetleyicisi",
      detail: "Komutu alır",
      icon: Cpu,
      position: { x: 800, y: 0 },
    },
    {
      id: "storage",
      label: "Depolama",
      detail: "Veriye erişir",
      icon: Database,
      position: { x: 800, y: 250 },
    },
    {
      id: "ram",
      label: "DRAM",
      detail: "DMA hedef alanı",
      icon: Database,
      position: { x: 400, y: 250 },
    },
  ];
  const nodes: DiagramNode[] = definitions.map((node, index) => ({
    ...node,
    tone: stage === index ? "active" : stage > index ? "complete" : "muted",
    badge:
      index === 4
        ? stage === 4
          ? "1010 · veri geldi"
          : "Boş hedef alan"
        : stage === index
          ? index === 0
            ? "Okuma isteği"
            : index === 3
              ? "1010 · veri hazır"
              : "Komut burada"
          : undefined,
  }));
  const edges: DiagramEdge[] = [
    {
      source: "os",
      target: "host",
      label: "Komut",
      active: stage >= 1,
      muted: stage < 1,
    },
    {
      source: "host",
      target: "device",
      label: "Mesaj",
      active: stage >= 2,
      muted: stage < 2,
    },
    {
      source: "device",
      target: "storage",
      label: "Veriye erişim",
      sourceSide: "bottom",
      targetSide: "top",
      active: stage >= 3,
      muted: stage < 3,
    },
    {
      source: "storage",
      target: "ram",
      label: "DMA · veri",
      sourceSide: "left",
      targetSide: "right",
      active: stage >= 4,
      muted: stage < 4,
    },
  ];
  return (
    <Lesson
      title="Komut gider. Veri DRAM’e taşınır."
      caption={hardwareCaptions["storage-data-path"][stage]}
    >
      <FlowDiagram
        id="storage-command-and-data"
        label="OS’den aygıta komut ve depolamadan DRAM’e DMA veri aktarımı"
        nodes={nodes}
        edges={edges}
        direction="LR"
        enabled={enabled}
      />
    </Lesson>
  );
}
