import {
  ArrowRight,
  Check,
  Copy,
  Database,
  HardDrive,
  Layers,
  Server,
  ShieldAlert,
  ShieldCheck,
  X,
} from "lucide-react";
import { Stage } from "../../components/presentation/ScenePrimitives";
import { motion } from "motion/react";
import {
  StageCaption,
  useStageMotion,
} from "../../presentation/PresentationMotion";
import type { SceneContext } from "../../presentation/types";
import {
  createRaidState,
  raidLayout,
  raidStatus,
  raidSceneState,
  nestedRaid,
  STRIPES,
  toggleFailure,
  usableCapacity,
  xorBlocks,
} from "./model.mjs";
import { StoryControls } from "./StoryControls";

type RaidState = ReturnType<typeof createRaidState>;
const STATUS = {
  healthy: {
    label: "Sağlıklı",
    style: "bg-blue text-white",
    Icon: ShieldCheck,
  },
  degraded: {
    label: "Erişim var · koruma azaldı",
    style: "bg-[#fed84b] text-ink",
    Icon: ShieldAlert,
  },
  rebuilding: {
    label: "Yeniden kuruluyor",
    style: "bg-blue/10 text-blue",
    Icon: Layers,
  },
  unrecoverable: {
    label: "Modelde kurtarılamaz",
    style: "bg-orange/15 text-ink",
    Icon: X,
  },
};

function RaidHealth({ state }: { state: RaidState }) {
  const status = STATUS[raidStatus(state) as keyof typeof STATUS];
  const Icon = status.Icon;
  return (
    <div
      className={`state-cell flex items-center gap-2 rounded-full border border-ink px-4 py-2 text-center text-xs font-semibold md:text-sm ${status.style}`}
    >
      <Icon size={17} />
      {status.label}
    </div>
  );
}

function Capacity({ state }: { state: RaidState }) {
  return (
    <div className="flex flex-wrap items-baseline justify-center gap-2 font-display">
      <strong className="text-[clamp(28px,4vw,52px)] font-medium text-blue">
        {usableCapacity(state)}
        <small className="ml-1 text-lg">TB</small>
      </strong>
      <span className="text-xs text-slate-600 md:text-sm">
        {raidStatus(state) === "unrecoverable"
          ? "kurulu kapasite (erişilemez)"
          : "kullanılabilir"}{" "}
        / {state.disks * state.sizeTB} TB fiziksel
      </span>
    </div>
  );
}

function RaidBoard({
  state,
  compact = false,
}: {
  state: RaidState;
  compact?: boolean;
}) {
  const { enabled } = useStageMotion();
  const rows = raidLayout(state);
  return (
    <div
      className="flex min-h-0 w-full max-w-5xl flex-col gap-2"
      role="group"
      aria-label={`RAID ${state.level}, ${state.disks} disk. Kayıp diskler: ${state.failed.length ? state.failed.map((disk: number) => `D${disk}`).join(", ") : "yok"}.`}
    >
      {state.level === 10 && (
        <div
          className="grid gap-2"
          style={{
            gridTemplateColumns: `repeat(${state.disks},minmax(0,1fr))`,
          }}
        >
          {Array.from({ length: state.disks / 2 }, (_, pair) => (
            <div
              key={pair}
              className="col-span-2 rounded-t-xl border-x-2 border-t-2 border-blue text-center text-xs font-bold text-blue"
            >
              Ayna {pair + 1}
            </div>
          ))}
        </div>
      )}
      <div
        className="grid min-h-0 gap-2 md:gap-4"
        style={{ gridTemplateColumns: `repeat(${state.disks},minmax(0,1fr))` }}
      >
        {Array.from({ length: state.disks }, (_, disk) => {
          const failed = state.failed.includes(disk);
          const replacement = failed && state.rebuilding;
          return (
            <div
              key={disk}
              className={`state-cell flex min-h-0 min-w-0 flex-col gap-2 rounded-xl border-2 p-2 md:p-3 ${replacement ? "border-blue bg-blue/5" : failed ? "border-orange bg-orange/5" : "border-ink bg-white"}`}
            >
              <div className="flex flex-wrap items-center justify-center gap-1 text-xs font-bold md:text-base">
                {replacement ? (
                  <Layers className="size-4 text-blue md:size-6" />
                ) : (
                  <HardDrive className="size-4 md:size-6" />
                )}
                <span>D{disk}</span>
                {replacement ? (
                  <span className="text-[10px] text-blue">Yedek</span>
                ) : failed ? (
                  <X size={13} className="text-orange" />
                ) : null}
              </div>
              <div className="grid grid-rows-3 gap-2">
                {rows.map((row, stripe) => {
                  const cell = row[disk];
                  const restored = replacement && stripe < state.rebuild;
                  const missing = failed && !restored;
                  const color =
                    cell.kind === "q"
                      ? "bg-[#c4b2fa] text-ink"
                      : cell.kind === "parity"
                        ? "bg-[#fed84b] text-ink"
                        : "bg-blue text-white";
                  return (
                    <div
                      key={stripe}
                      className={`state-cell flex flex-col items-center justify-center rounded-lg px-1 ${compact ? "h-[clamp(26px,4.8dvh,48px)]" : "h-[clamp(36px,6.8dvh,72px)]"} ${missing ? "border border-dashed border-orange bg-white text-ink" : color}`}
                    >
                      <motion.strong
                        key={`${missing}:${cell.label}`}
                        className="font-display text-sm md:text-xl"
                        initial={
                          enabled
                            ? {
                                opacity: 0.4,
                                y: restored ? 6 : 0,
                                scale: restored ? 0.9 : 1,
                              }
                            : false
                        }
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: enabled ? 0.3 : 0 }}
                      >
                        {missing ? (replacement ? "∅" : "×") : cell.label}
                      </motion.strong>
                      {!compact && (
                        <small className="text-[9px] md:text-[10px]">
                          {missing
                            ? replacement
                              ? "Boş yedek"
                              : "Kayıp"
                            : restored
                              ? "Yeniden kuruldu"
                              : cell.kind === "q"
                                ? "Q ≠ P"
                                : cell.bits}
                        </small>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex flex-wrap justify-center gap-3 text-[10px] font-semibold text-slate-700 md:text-xs">
        <span>
          Mavi:{" "}
          {state.level === 1 || state.level === 10 ? "veri kopyası" : "veri"}
        </span>
        {[4, 5, 6].includes(state.level) && <span>Sarı: P · XOR</span>}
        {state.level === 6 && <span>Mor: bağımsız Q · sembolik</span>}
      </div>
    </div>
  );
}

function Caption({ children }: { children: string }) {
  return (
    <StageCaption className="max-w-4xl text-center text-sm font-semibold leading-relaxed md:text-xl">
      {children}
    </StageCaption>
  );
}

function CapacityTable({ parityOnly = false }: { parityOnly?: boolean }) {
  const rows = parityOnly
    ? [
        createRaidState(4, 4, 4),
        createRaidState(5, 4, 4),
        createRaidState(6, 4, 4),
      ]
    : [
        createRaidState(0, 4, 4),
        createRaidState(1, 2, 4),
        createRaidState(5, 4, 4),
        createRaidState(6, 4, 4),
        createRaidState(10, 4, 4),
      ];
  return (
    <table className="w-full max-w-3xl overflow-hidden rounded-2xl border-2 border-ink bg-white text-center text-xs md:text-base">
      <caption className="mb-2 text-xs font-semibold text-slate-600">
        {parityOnly
          ? "Parite düzenleri · her örnekte 4 × 4 TB disk"
          : "Eşit 4 TB diskler · RAID 1 iki diskli örnek"}
      </caption>
      <thead>
        <tr className="bg-slate-100">
          <th className="p-2">RAID</th>
          <th>Fiziksel</th>
          <th>Kullanılabilir</th>
          <th>Tam disk kaybı</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.level} className="border-t border-slate-200">
            <th className="p-2">{row.level}</th>
            <td>{row.disks} × 4 TB</td>
            <td className="font-display text-lg font-semibold text-blue">
              {usableCapacity(row)} TB
            </td>
            <td>
              {row.level === 0
                ? "0"
                : row.level === 6
                  ? "2"
                  : row.level === 10
                    ? "Her aynada en çok 1"
                    : "1"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function RaidIntroScene(context: SceneContext) {
  const { stage } = context;
  let mirror = createRaidState(1, 2, 4);
  if (stage >= 2) mirror = toggleFailure(mirror, 0);
  const captions = [
    "Kapasite, paralellik ve güvenilirlik farklı hedeflerdir; çok disk kullanmak bunları kendiliğinden birlikte sağlamaz.",
    "Aynı verinin bağımsız bir sağlam kopyası disk kaybında kullanılabilir.",
    "MTTF ortalama arızalanma süresidir; tek bir diskin son kullanma tarihi değildir.",
    "MTTR ortalama onarım süresidir. Kayıp kopya yeniden kurulana kadar ek arızaya maruz kalınan bir pencere vardır.",
    "Veri kaybına kadar süre arıza ve onarım varsayımlarına bağlıdır. Bağımsız arıza modeli gerçek sistem için garanti değildir.",
  ];
  return (
    <Stage
      title="Yedeklilik ve onarım penceresi"
      controls={<StoryControls {...context} />}
    >
      <div className="flex h-full min-h-0 w-full max-w-5xl flex-col items-center justify-center gap-4 md:gap-6">
        {stage === 0 ? (
          <div className="grid w-full grid-cols-3 gap-3">
            {[
              { name: "Kapasite", Icon: Database },
              { name: "Paralellik", Icon: Layers },
              { name: "Güvenilirlik", Icon: ShieldCheck },
            ].map(({ name, Icon }) => (
              <div
                key={name}
                className="rounded-2xl border-2 border-ink bg-white p-4 text-center md:p-7"
              >
                <Icon className="mx-auto size-12 text-blue md:size-20" />
                <strong className="mt-4 block text-sm md:text-xl">
                  {name}
                </strong>
              </div>
            ))}
          </div>
        ) : stage === 4 ? (
          <div className="grid w-full grid-cols-3 gap-3">
            {[
              { name: "MTTF", meaning: "Ortalama arızalanma süresi" },
              { name: "MTTR", meaning: "Ortalama onarım süresi" },
              { name: "MTTDL", meaning: "Veri kaybına kadar ortalama süre" },
            ].map((item) => (
              <div
                key={item.name}
                className="rounded-2xl border-2 border-blue bg-white p-4 text-center md:p-7"
              >
                <h2 className="font-display text-2xl font-semibold text-blue md:text-4xl">
                  {item.name}
                </h2>
                <p className="mt-4 text-xs leading-6 md:text-base">
                  {item.meaning}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <>
            <RaidBoard state={mirror} compact={stage === 3} />
            <RaidHealth state={mirror} />
            {stage === 3 && (
              <div className="w-full max-w-2xl">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold">Arıza</span>
                  <div className="flex-1 rounded-xl border-2 border-orange bg-orange/10 p-4 text-center text-sm font-semibold">
                    Onarım penceresi · MTTR
                  </div>
                  <span className="text-xs font-semibold">Koruma geri</span>
                </div>
                <p className="mt-2 text-center text-xs text-slate-600">
                  Daha uzun onarım, daha uzun maruz kalma penceresi
                </p>
              </div>
            )}
          </>
        )}
        <Caption>{captions[stage]}</Caption>
      </div>
    </Stage>
  );
}

export function StripingMirrorScene(context: SceneContext) {
  const { stage } = context;
  const state = raidSceneState("raid-striping", stage);
  const captions = [
    "RAID 0: veri parçaları farklı disklere dağılır; ek kopya veya parite yoktur.",
    "D0’ın parçaları kayıp. Kalan bilgiler bu eksik veriyi üretmeye yetmez.",
    "RAID 1: iki diskte aynı A kimlikleri ve bitler bulunur. İkinci disk aynı verinin kopyasıdır.",
    "D0 kayıp ama D1’de sağlam kopya var. Erişim sürer; koruma azalmıştır.",
    "İki kopya da kayıp. Sağlam bilgi kalmadığında aynalama veriyi üretemez.",
    "Şeritleme dağıtır; aynalama kopyalar. Kapasite bedeli ve koruma koşulu farklıdır.",
  ];
  return (
    <Stage
      title="Veriyi dağıtmak mı, kopyalamak mı?"
      controls={
        <StoryControls
          {...context}
          choices={[
            { label: "RAID 0", stage: 0, until: 1 },
            { label: "RAID 1", stage: 2, until: 4 },
            { label: "Özet", stage: 5 },
          ]}
        />
      }
    >
      <div className="flex h-full min-h-0 w-full flex-col items-center justify-center gap-4 md:gap-6">
        {stage === 5 ? (
          <div className="grid w-full max-w-4xl grid-cols-2 gap-4">
            {[createRaidState(0, 4, 4), createRaidState(1, 2, 4)].map(
              (example) => (
                <div
                  key={example.level}
                  className="rounded-2xl border-2 border-ink bg-white p-4 text-center"
                >
                  <h2 className="font-display text-2xl font-semibold">
                    RAID {example.level}
                  </h2>
                  <Capacity state={example} />
                  <p className="mt-4 text-sm">
                    {example.level === 0
                      ? "Tek kayıp: veri eksik"
                      : "En az bir sağlam kopya gerekir"}
                  </p>
                </div>
              ),
            )}
          </div>
        ) : (
          <>
            <strong className="font-display text-xl md:text-3xl">
              RAID {state.level}
            </strong>
            <Capacity state={state} />
            <RaidBoard state={state} />
            <RaidHealth state={state} />
          </>
        )}
        <Caption>{captions[stage]}</Caption>
      </div>
    </Stage>
  );
}

export function ParityRaidScene(context: SceneContext) {
  const { stage } = context;
  const state = raidSceneState("raid-parity", stage);
  const captions = [
    "Veriye ek koruma bilgisi hesaplayabiliriz. P bir dosya parçasının ikinci kopyası değildir.",
    "RAID 4: her şeridin paritesi aynı fiziksel disktedir.",
    "RAID 5: parite şeritler arasında disklere dağılır; sabit bir parite diski yoktur.",
    "Bir veri diski kayıp. Sağlam veri ve P, eksik bloğu yeniden üretmek için yeterli olabilir.",
    "RAID 6 bağımsız P ve Q ile iki tam disk kaybını karşılayabilir. Q, P’nin ikinci kopyası değildir.",
    "RAID 4/5 bir disk, RAID 6 iki disk kapasitesi kadar koruma alanı kullanır. Burada yalnız tam disk arızaları modellenir.",
  ];
  return (
    <Stage
      title="Koruma bilgisini nereye koyarız?"
      controls={
        <StoryControls
          {...context}
          choices={[
            { label: "RAID 4", stage: 1 },
            { label: "RAID 5", stage: 2, until: 3 },
            { label: "RAID 6", stage: 4 },
            { label: "Özet", stage: 5 },
          ]}
        />
      }
    >
      <div className="flex h-full min-h-0 w-full flex-col items-center justify-center gap-4 md:gap-6">
        {stage === 0 ? (
          <div className="flex flex-wrap items-center justify-center gap-3">
            {["A0", "A1", "A2"].map((label) => (
              <span
                key={label}
                className="rounded-xl bg-blue px-7 py-6 font-display text-2xl font-semibold text-white"
              >
                {label}
              </span>
            ))}
            <ArrowRight />
            <span className="rounded-xl border-2 border-ink bg-[#fed84b] px-7 py-6 font-display text-3xl font-semibold">
              P
            </span>
          </div>
        ) : stage === 5 ? (
          <CapacityTable parityOnly />
        ) : (
          <>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <strong className="font-display text-xl md:text-3xl">
                RAID {state.level}
              </strong>
              <Capacity state={state} />
            </div>
            <RaidBoard state={state} />
            <RaidHealth state={state} />
          </>
        )}
        <Caption>{captions[stage]}</Caption>
      </div>
    </Stage>
  );
}

function XorProof({ state }: { state: RaidState }) {
  const row = raidLayout(state)[0];
  const operands = row.filter((cell) => cell.disk !== 1);
  const result = xorBlocks(operands.map((cell) => cell.bits as string));
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 rounded-xl bg-slate-100 p-3 font-mono text-sm md:text-xl">
      <strong>A1</strong>
      <span>=</span>
      <span>{operands.map((cell) => cell.bits).join(" ⊕ ")}</span>
      <span>=</span>
      <strong className="text-blue">{result}</strong>
    </div>
  );
}

export function XorRaidScene(context: SceneContext) {
  const { stage } = context;
  const state = raidSceneState("raid-xor", stage);
  const parity = xorBlocks(["1100", "1010", "0110"]);
  const captions = [
    "Özgün küçük örnek: üç veri bloğundan P koruma bilgisini hesaplayalım.",
    "P = 1100 ⊕ 1010 ⊕ 0110 = 0000. Bu koruma değeri saklanır.",
    "D1’deki A1 kayıp. Sonucu açmadan önce sağlam hücrelerden nasıl bulunacağını tahmin edin.",
    "A1 = 1100 ⊕ 0110 ⊕ 0000 = 1010. Sonuç sağlam veri ve saklanan P’den gerçekten hesaplanır.",
    "İki veri bloğu kayıp. Tek parite denklemi iki bilinmeyeni belirleyemez; kurtarma sonucu üretilmez.",
  ];
  return (
    <Stage
      title="Kayıp bloğu sağlam bilgilerden üret"
      controls={<StoryControls {...context} />}
    >
      <div className="flex h-full min-h-0 w-full flex-col items-center justify-center gap-4 md:gap-6">
        {stage <= 1 ? (
          <div className="flex flex-wrap items-center justify-center gap-3 font-mono text-xl md:text-3xl">
            {["1100", "1010", "0110"].map((bits, index) => (
              <div
                key={bits}
                className="rounded-xl bg-blue p-5 text-center text-white"
              >
                <span className="mb-2 block text-xs">A{index}</span>
                {bits}
              </div>
            ))}
            {stage === 1 && (
              <>
                <ArrowRight />
                <div className="rounded-xl border-2 border-ink bg-[#fed84b] p-5 text-center">
                  <span className="mb-2 block text-xs">P</span>
                  {parity}
                </div>
              </>
            )}
          </div>
        ) : (
          <>
            <RaidBoard state={state} compact={stage === 3} />
            {stage === 2 ? (
              <strong className="font-mono text-2xl">A1 = ?</strong>
            ) : stage === 3 ? (
              <XorProof state={state} />
            ) : (
              <div className="rounded-xl bg-orange/10 p-4 text-sm font-semibold">
                İki bilinmeyen · tek denklem · modelde kurtarılamaz
              </div>
            )}
          </>
        )}
        <Caption>{captions[stage]}</Caption>
      </div>
    </Stage>
  );
}

export function RaidLevelsScene(context: SceneContext) {
  const { stage } = context;
  const captions = [
    "RAID seviyeleri veriyi ve koruma bilgisini farklı düzenlerde yerleştirir.",
    "RAID 6’da P ve Q bağımsız koruma bilgilerini temsil eder; bu örnek Q cebirini hesaplamaz.",
    "Çok boyutlu düzende aygıtlar satır ve sütunlar halinde gruplanır.",
    "P ve Q, satır ve sütunlardaki farklı koruma rollerini gösterir. Kesin koruma, seçilen düzene bağlıdır.",
  ];
  return (
    <Stage
      title="Koruma bilgisini iki boyutta yerleştirmek"
      controls={<StoryControls {...context} />}
    >
      <div className="flex h-full min-h-0 w-full max-w-5xl flex-col items-center justify-center gap-5 md:gap-7">
        {stage === 0 ? (
          <div className="flex flex-wrap justify-center gap-4">
            {[0, 1, 4, 5, 6].map((level) => (
              <span
                key={level}
                className="rounded-2xl border-2 border-ink bg-white p-5 font-display text-xl font-semibold md:text-3xl"
              >
                RAID {level}
              </span>
            ))}
          </div>
        ) : stage === 1 ? (
          <RaidBoard state={createRaidState(6, 4, 4)} />
        ) : (
          <div
            className="grid w-full max-w-xl grid-cols-4 gap-2"
            aria-label="Özgün küçültülmüş iki boyutlu veri ve P/Q rol şeması"
          >
            {Array.from({ length: 16 }, (_, index) => {
              const row = Math.floor(index / 4),
                column = index % 4;
              const data = row < 2 && column < 2;
              const role = data
                ? `A${row * 2 + column}`
                : row >= 2 && column >= 2
                  ? "—"
                  : row === 2 || column === 2
                    ? "P"
                    : "Q";
              return (
                <div
                  key={index}
                  className={`flex h-12 items-center justify-center rounded-lg border-2 font-display text-xl font-semibold md:h-17 ${data ? "border-blue bg-blue text-white" : stage === 2 ? "border-dashed border-slate-300 bg-white text-slate-400" : role === "P" ? "border-ink bg-[#fed84b]" : role === "Q" ? "border-ink bg-[#c4b2fa]" : "border-slate-200 bg-white"}`}
                >
                  {data || stage === 3 ? role : "?"}
                </div>
              );
            })}
          </div>
        )}
        <Caption>{captions[stage]}</Caption>
      </div>
    </Stage>
  );
}

function NestedBoard({ kind, failed }: { kind: string; failed: number[] }) {
  const state = nestedRaid(kind, failed);
  return (
    <div className="flex min-w-0 flex-col items-center gap-3">
      <h2 className="font-display text-2xl font-semibold md:text-3xl">
        RAID {kind}
      </h2>
      <strong className="text-xs text-slate-600">
        {kind === "0+1" ? "Şerit gruplarını aynala" : "Ayna çiftlerini şeritle"}
      </strong>
      <div className="grid w-full grid-cols-2 gap-2">
        {state.groups.map((group, index) => {
          const good =
            kind === "0+1"
              ? group.every((disk) => !failed.includes(disk))
              : group.some((disk) => !failed.includes(disk));
          return (
            <div
              key={index}
              className={`state-cell rounded-xl border-2 p-2 ${good ? "border-blue bg-blue/5" : "border-orange bg-orange/5"}`}
            >
              <span className="block text-center text-[10px] font-semibold">
                {kind === "0+1" ? "Şerit grubu" : "Ayna"} {index + 1}
              </span>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {group.map((disk) => (
                  <div
                    key={disk}
                    className={`state-cell rounded-lg border p-2 text-center ${failed.includes(disk) ? "border-orange bg-white" : "border-blue bg-blue text-white"}`}
                  >
                    <span className="block text-[10px]">D{disk}</span>
                    <HardDrive className="mx-auto my-2 size-5 md:size-8" />
                    <strong className="font-display text-base md:text-xl">
                      {failed.includes(disk) ? "×" : state.labels[disk]}
                    </strong>
                  </div>
                ))}
              </div>
              <span className="mt-2 block text-center text-[9px] font-semibold">
                {good
                  ? kind === "0+1"
                    ? "Tam şerit grubu var"
                    : "Sağlam kopya var"
                  : kind === "0+1"
                    ? "Grup kullanılamaz"
                    : "İki kopya da kayıp"}
              </span>
            </div>
          );
        })}
      </div>
      <span
        className={`rounded-full px-3 py-2 text-center text-xs font-semibold ${state.available ? (failed.length ? "bg-[#fed84b]" : "bg-blue text-white") : "bg-orange/15"}`}
      >
        {state.available
          ? failed.length
            ? "Erişim var · koruma azaldı"
            : "Sağlıklı"
          : "Modelde kurtarılamaz"}
      </span>
    </div>
  );
}

export function NestedRaidScene(context: SceneContext) {
  const { stage } = context;
  const captions = [
    "Aynı dört fiziksel disk, iki farklı veri yerleşimi. Önce hangi gruplamanın yapıldığı önemlidir.",
    "0+1: D0–D1 bir şerit grubu, D2–D3 onun aynı parçaları tutan ikinci kopyasıdır.",
    "D0 kaybında ilk şerit grubu eksik kalır. İkinci tam şerit grubu bütün veriyi sunar.",
    "1+0: D0–D1 aynı A0 verisini, D2–D3 aynı A1 verisini aynalar; bu aynalar arasında şeritleme yapılır.",
    "D0 kayıp: ilk aynada D1 sağlamdır. İkinci ayna da sağlam olduğu için erişim sürer.",
    "D0 + D1: 0+1’in ikinci şerit kopyası tamdır; 1+0’ın ilk aynasının iki kopyası da kayıptır.",
    "D0 + D2: 0+1’de iki şerit grubu da eksiktir; 1+0’da her aynada bir sağlam kopya vardır.",
  ];
  const both = stage === 0 || stage >= 5;
  const failed =
    stage === 2 || stage === 4
      ? [0]
      : stage === 5
        ? [0, 1]
        : stage === 6
          ? [0, 2]
          : [];
  return (
    <Stage
      title="Önce ayna mı, önce şerit mi?"
      controls={
        <StoryControls
          {...context}
          choices={[
            { label: "0+1", stage: 1, until: 2 },
            { label: "1+0", stage: 3, until: 4 },
            { label: "D0 + D1", stage: 5 },
            { label: "D0 + D2", stage: 6 },
          ]}
        />
      }
    >
      <div className="flex h-full min-h-0 w-full max-w-6xl flex-col items-center justify-center gap-4 md:gap-6">
        <div
          className={`grid w-full gap-4 md:gap-8 ${both ? "grid-cols-2" : "max-w-2xl grid-cols-1"}`}
        >
          {(both ? ["0+1", "1+0"] : [stage <= 2 ? "0+1" : "1+0"]).map(
            (kind) => (
              <NestedBoard key={kind} kind={kind} failed={failed} />
            ),
          )}
        </div>
        <Caption>{captions[stage]}</Caption>
      </div>
    </Stage>
  );
}

export function RebuildRaidScene(context: SceneContext) {
  const { stage } = context;
  const state = raidSceneState("raid-rebuild", stage);
  const captions = [
    "Dört aktif diskli RAID 5’in yanında tahsis edilmemiş boş bir hot spare bekler.",
    "D0 arızalandı. Veriye erişilebilir ama ek disk kaybına karşı koruma azaldı; yedek henüz içerik taşımıyor.",
    "Yedek D0’ın yerine devreye girdi. ∅ hücreler henüz boş; yalnız disk takılması korumayı tamamlamaz.",
    "Birinci temsili şerit üretildi. Diğer hücreler eksik olduğu için yedek tam sağlam sayılmaz.",
    "İkinci şerit de tamamlandı. Bir şerit hâlâ eksik; onarım penceresi sürüyor.",
    "Son şerit tamamlandı. Kayıp içerik ve dizinin koruması geri geldi.",
    "Hot spare devri beklemeyi azaltabilir; rebuild sağlam disklerden okuma ve yedeğe yazma işi üretir. Bu adımlar gerçek süre tahmini değildir.",
  ];
  return (
    <Stage
      title="Boş yedek nasıl sağlam kopya olur?"
      controls={<StoryControls {...context} />}
    >
      <div className="flex h-full min-h-0 w-full flex-col items-center justify-center gap-3 md:gap-5">
        <Capacity state={state} />
        <RaidBoard state={state} compact />
        {stage <= 1 ? (
          <div className="flex items-center gap-3 rounded-xl border-2 border-dashed border-slate-400 bg-white px-5 py-3">
            <HardDrive className="text-slate-500" />
            <div>
              <strong className="text-xs">
                Ek 4 TB hot spare · tahsis edilmemiş
              </strong>
              <p className="font-mono text-sm text-slate-500">∅ · ∅ · ∅</p>
            </div>
          </div>
        ) : (
          <div
            className="flex gap-2"
            aria-label={`${state.rebuild}/${STRIPES} temsili şerit tamamlandı`}
          >
            {Array.from({ length: STRIPES }, (_, index) => (
              <div
                key={index}
                className={`state-cell flex h-9 w-18 items-center justify-center rounded-lg border border-ink text-xs font-semibold ${index < state.rebuild ? "bg-blue text-white" : "bg-white"}`}
              >
                {index < state.rebuild ? (
                  <Check size={16} />
                ) : (
                  `Şerit ${index + 1}`
                )}
              </div>
            ))}
          </div>
        )}
        <RaidHealth state={state} />
        {stage === 6 && (
          <div className="flex items-center gap-3 text-xs font-semibold text-blue">
            <Database size={18} />
            <span>Sağlam diskleri oku</span>
            <ArrowRight />
            <span>Yedeğe yaz</span>
          </div>
        )}
        <Caption>{captions[stage]}</Caption>
      </div>
    </Stage>
  );
}

export function RaidFeaturesScene(context: SceneContext) {
  const { stage } = context;
  const captions = [
    "Geçmiş görünüm, başka sitede kopya ve arızalı aygıtın değiştirilmesi üç ayrı ihtiyaçtır.",
    "Snapshot değişikliklerden önceki dosya sistemi görünümünü tutar. Canlı görünüm ilerlerken önceki görünüm ayrıdır.",
    "Replication yazıları ayrı siteler arasında otomatik kopyalayabilir; dizi kaybından korunma kapsamı ayrıca değerlendirilir.",
    "Senkron akışta uzak tamamlanma onay zincirine katılır; asenkron örnekte yerel onaydan sonra uzak kopya tamamlanabilir.",
    "Hot spare tahsis edilmemiş aygıttır. Arızada devreye girip yeniden kurmayı başlatması onarım süresini azaltabilir.",
    "Snapshot zamandaki görünüm, replication siteler arası yazı kopyası, hot spare aygıt değiştirmedir. Hiçbir etiket tek başına bütün hataları kapsamaz.",
  ];
  return (
    <Stage
      title="Snapshot, replication ve hot spare"
      controls={
        <StoryControls
          {...context}
          choices={[
            { label: "Snapshot", stage: 1 },
            { label: "Replication", stage: 2, until: 3 },
            { label: "Hot spare", stage: 4 },
            { label: "Özet", stage: 5 },
          ]}
        />
      }
    >
      <div className="flex h-full min-h-0 w-full max-w-5xl flex-col items-center justify-center gap-5 md:gap-7">
        {stage === 0 || stage === 5 ? (
          <div className="grid w-full grid-cols-3 gap-3">
            {[
              { title: "Snapshot", detail: "Zamandaki görünüm", Icon: Copy },
              {
                title: "Replication",
                detail: "Ayrı siteye yazı kopyası",
                Icon: Server,
              },
              {
                title: "Hot spare",
                detail: "Arızalı aygıtın yerine",
                Icon: HardDrive,
              },
            ].map(({ title, detail, Icon }) => (
              <div
                key={title}
                className="rounded-2xl border-2 border-ink bg-white p-4 text-center"
              >
                <Icon className="mx-auto size-12 text-blue md:size-18" />
                <h2 className="mt-3 font-display text-lg font-semibold md:text-2xl">
                  {title}
                </h2>
                {stage === 5 && (
                  <p className="mt-3 text-xs leading-6 md:text-base">
                    {detail}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : stage === 1 ? (
          <div className="grid w-full max-w-3xl grid-cols-2 gap-5">
            <div className="rounded-2xl border-2 border-blue bg-white p-5 text-center">
              <strong>Canlı dosya sistemi</strong>
              <div className="my-4 rounded-xl bg-blue p-5 font-mono text-3xl text-white">
                v2
              </div>
              <span className="text-xs">Değişikliklerden sonra</span>
            </div>
            <div className="rounded-2xl border-2 border-ink bg-[#fed84b]/20 p-5 text-center">
              <strong>Snapshot · t₀</strong>
              <div className="my-4 rounded-xl border border-ink bg-white p-5 font-mono text-3xl">
                v1
              </div>
              <span className="text-xs">Önceki görünüm</span>
            </div>
          </div>
        ) : stage === 2 ? (
          <div className="flex w-full items-center justify-center gap-5">
            <div className="rounded-2xl border-2 border-blue bg-white p-5 text-center">
              <Server className="mx-auto size-16 text-blue" />
              <strong>Site A · v2</strong>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="text-xs">Yazı kopyası</span>
              <ArrowRight className="text-blue" />
            </div>
            <div className="rounded-2xl border-2 border-blue bg-white p-5 text-center">
              <Server className="mx-auto size-16 text-blue" />
              <strong>Site B · v2</strong>
            </div>
          </div>
        ) : stage === 3 ? (
          <div className="grid w-full gap-4">
            {[
              {
                title: "Senkron",
                steps: ["1 Yerel yaz", "2 Uzak tamamla", "3 Uygulamaya onay"],
              },
              {
                title: "Asenkron",
                steps: ["1 Yerel yaz", "2 Uygulamaya onay", "3 Uzak tamamla"],
              },
            ].map((flow) => (
              <div
                key={flow.title}
                className="rounded-2xl border-2 border-ink bg-white p-4"
              >
                <h2 className="mb-3 text-center font-display text-xl font-semibold">
                  {flow.title}
                </h2>
                <div className="grid grid-cols-3 gap-2">
                  {flow.steps.map((label) => (
                    <span
                      key={label}
                      className={`rounded-lg p-3 text-center text-xs font-semibold md:text-base ${label.includes("onay") ? "bg-[#fed84b]" : "bg-blue/10 text-blue"}`}
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-center gap-4">
            <div className="rounded-xl border-2 border-dashed border-slate-400 p-5 text-center">
              <HardDrive className="mx-auto mb-3 size-12" />
              <strong className="text-sm">Boş yedek</strong>
            </div>
            <ArrowRight />
            <div className="rounded-xl border-2 border-blue bg-blue/5 p-5 text-center">
              <Layers className="mx-auto mb-3 size-12 text-blue" />
              <strong className="text-sm">Devreye gir / yeniden kur</strong>
            </div>
            <ArrowRight />
            <div className="rounded-xl bg-[#fed84b] p-5 text-sm font-semibold">
              MTTR penceresini azalt
            </div>
          </div>
        )}
        <Caption>{captions[stage]}</Caption>
      </div>
    </Stage>
  );
}
