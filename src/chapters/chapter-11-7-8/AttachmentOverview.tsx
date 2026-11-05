import { motion } from "motion/react";
import {
  Cloud,
  FileText,
  Grid2X2,
  Laptop,
  Network,
  Server,
} from "lucide-react";
import { Stage } from "../../components/presentation/ScenePrimitives";
import { StageCaption } from "../../presentation/PresentationMotion";
import type { SceneContext } from "../../presentation/types";
import { StoryControls } from "./StoryControls";

const approaches = [
  {
    name: "Host-attached",
    title: "Yerel bağlantı",
    route: "Host’un I/O portu",
    kind: "host",
  },
  {
    name: "Network-attached",
    title: "Ağ üzerinden",
    route: "NAS ile dosya erişimi",
    kind: "nas",
  },
  {
    name: "Cloud",
    title: "Uzak hizmet",
    route: "Internet / WAN ve API",
    kind: "cloud",
  },
] as const;

/** Original, code-native illustrations share the presentation's hardware and line language. */
function AttachmentPicture({
  kind,
  active,
  enabled,
}: {
  kind: "host" | "nas" | "cloud";
  active: boolean;
  enabled: boolean;
}) {
  const color = active ? "#2247eb" : "#94a3b8";
  return (
    <svg
      viewBox="0 0 320 200"
      className="attachment-picture"
      aria-hidden="true"
    >
      <rect
        x="18"
        y="58"
        width="93"
        height="65"
        rx="7"
        fill="white"
        stroke="#111827"
        strokeWidth="3"
      />
      <rect x="27" y="67" width="75" height="46" rx="2" fill="#e7eaff" />
      <path
        d="M64 123v15m-23 0h46"
        stroke="#111827"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <FileText
        x="51"
        y="77"
        width="27"
        height="27"
        color="#2247eb"
        strokeWidth="1.5"
      />
      <motion.path
        d="M112 93H216"
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeDasharray={kind === "host" ? undefined : "6 5"}
        initial={false}
        animate={{ stroke: color }}
        transition={{ duration: enabled ? 0.3 : 0 }}
      />
      <path d="m207 87 9 6-9 6" stroke={color} fill="none" strokeWidth="3" />
      {kind === "host" ? (
        <g stroke="#111827" strokeWidth="3">
          <rect x="220" y="48" width="76" height="94" rx="10" fill="white" />
          <circle cx="258" cy="87" r="24" fill="#e7eaff" />
          <circle cx="258" cy="87" r="6" fill="white" />
          <path d="m285 111-25-23m-24 42h20" strokeLinecap="round" />
        </g>
      ) : kind === "nas" ? (
        <g stroke="#111827" strokeWidth="3">
          <rect x="220" y="43" width="77" height="105" rx="9" fill="white" />
          {[56, 82, 108].map((y) => (
            <g key={y}>
              <rect
                x="230"
                y={y}
                width="57"
                height="19"
                rx="3"
                fill="#e7eaff"
              />
              <circle
                cx="277"
                cy={y + 9.5}
                r="2"
                fill="#2247eb"
                stroke="none"
              />
            </g>
          ))}
          <Network
            x="148"
            y="72"
            width="40"
            height="40"
            color={color}
            strokeWidth="1.5"
            style={{ background: "#f8f9fc" }}
          />
        </g>
      ) : (
        <>
          <Cloud
            x="207"
            y="26"
            width="100"
            height="113"
            fill="#e7eaff"
            color="#2247eb"
            strokeWidth="1"
          />
          <Server
            x="238"
            y="89"
            width="40"
            height="40"
            color="#111827"
            strokeWidth="1.5"
          />
          <circle
            cx="164"
            cy="93"
            r="18"
            fill="#f8f9fc"
            stroke={color}
            strokeWidth="2"
          />
          <path
            d="M146 93h36m-18-18c-13 10-13 26 0 36m0-36c13 10 13 26 0 36"
            fill="none"
            stroke={color}
            strokeWidth="1.5"
          />
        </>
      )}
      <motion.g
        initial={false}
        animate={{ x: active ? 70 : 0, opacity: active ? 1 : 0 }}
        transition={{ duration: enabled ? 0.65 : 0, ease: [0.22, 1, 0.36, 1] }}
      >
        <rect x="124" y="86" width="13" height="13" rx="3" fill="#2247eb" />
      </motion.g>
      <text x="64" y="174" textAnchor="middle" fill="#64748b" fontSize="15">
        Host
      </text>
      <text x="259" y="174" textAnchor="middle" fill="#64748b" fontSize="15">
        {kind === "host" ? "Aygıt" : kind === "nas" ? "NAS" : "Veri merkezi"}
      </text>
    </svg>
  );
}

export function StorageAttachmentScene(context: SceneContext) {
  const { stage, enabled, setStage } = context;
  const captions = [
    "Bilgisayarlar depolamaya üç temel yoldan erişir.",
    "Host-attached: bilgisayar depolama aygıtına yerel I/O portundan ulaşır.",
    "Network-attached: ağdaki depolamaya erişilir. NAS, dosya sistemi hizmeti sunar.",
    "Cloud: program Internet veya WAN üzerinden uzak depolama hizmetinin API’sini kullanır.",
  ];
  return (
    <Stage title="Storage Attachment" controls={<StoryControls {...context} />}>
      <div className="attachment-scene">
        <p className="attachment-subtitle">
          Depolamanın bilgisayara bağlanması
        </p>
        <div className="attachment-approaches">
          {approaches.map((item, index) => {
            const active = stage === index + 1;
            return (
              <motion.button
                key={item.kind}
                type="button"
                className="attachment-approach"
                aria-pressed={active}
                onClick={() => setStage(index + 1)}
                initial={false}
                animate={{
                  borderColor: active ? "#2247eb" : "#cbd5e1",
                  backgroundColor: active ? "#eef1ff" : "#ffffff",
                }}
                transition={{ duration: enabled ? 0.24 : 0 }}
              >
                <span className="attachment-number">0{index + 1}</span>
                <span className="attachment-approach-name">{item.name}</span>
                <AttachmentPicture
                  kind={item.kind}
                  active={active}
                  enabled={enabled}
                />
                <strong>{item.title}</strong>
                <span className="attachment-route">{item.route}</span>
              </motion.button>
            );
          })}
        </div>
        <StageCaption className="attachment-caption">
          {captions[stage]}
        </StageCaption>
      </div>
    </Stage>
  );
}

const comparisonRows = [
  { label: "Erişim", nas: "Dosya / dizin", san: "Blok / mantıksal hacim" },
  {
    label: "Bağlantı",
    nas: "IP ağı · NFS / CIFS",
    san: "Depolama ağı · FC / InfiniBand",
  },
  { label: "Dosya sistemi", nas: "NAS sunucusunda", san: "Host tarafında" },
];

function ComparisonPath({
  san,
  stage,
  enabled,
}: {
  san: boolean;
  stage: number;
  enabled: boolean;
}) {
  const Request = san ? Grid2X2 : FileText;
  return (
    <svg
      viewBox="0 0 460 160"
      className="attachment-comparison-path"
      role="img"
      aria-label={
        san
          ? "Host’un dosya sistemi blok isteğini depolama ağı üzerinden diziye iletir."
          : "İstemci dosya isteğini IP ağı üzerinden NAS sunucusundaki dosya sistemine iletir."
      }
    >
      <Laptop
        x="16"
        y="42"
        width="68"
        height="68"
        color="#111827"
        strokeWidth="1.4"
      />
      <Network
        x="198"
        y="49"
        width="54"
        height="54"
        color="#2247eb"
        strokeWidth="1.5"
      />
      <Server
        x="365"
        y="42"
        width="68"
        height="68"
        color="#111827"
        strokeWidth="1.4"
      />
      <path
        d="M91 76h98m72 0h96m-9-6 9 6-9 6"
        fill="none"
        stroke="#2247eb"
        strokeWidth="2.5"
      />
      <motion.g
        initial={false}
        animate={{ x: stage >= 1 ? 170 : 0 }}
        transition={{ duration: enabled ? 0.6 : 0 }}
      >
        <rect x="124" y="57" width="38" height="38" rx="8" fill="#e7eaff" />
        <Request
          x="131"
          y="64"
          width="24"
          height="24"
          color="#2247eb"
          strokeWidth="1.7"
        />
      </motion.g>
      <text x="50" y="138" textAnchor="middle" fontSize="17" fill="#111827">
        {san ? "Host" : "İstemci"}
      </text>
      <text x="225" y="138" textAnchor="middle" fontSize="17" fill="#111827">
        {san ? "SAN" : "IP ağı"}
      </text>
      <text x="399" y="138" textAnchor="middle" fontSize="17" fill="#111827">
        {san ? "Dizi" : "NAS"}
      </text>
      <motion.g
        initial={false}
        animate={{ opacity: stage === 2 ? 1 : 0 }}
        transition={{ duration: enabled ? 0.2 : 0 }}
      >
        <rect
          x={san ? 9 : 350}
          y="5"
          width="96"
          height="26"
          rx="6"
          fill="#2247eb"
        />
        <text
          x={san ? 57 : 398}
          y="23"
          textAnchor="middle"
          fontSize="13"
          fontWeight="600"
          fill="white"
        >
          Dosya sistemi
        </text>
      </motion.g>
    </svg>
  );
}

export function NasSanCompareScene(context: SceneContext) {
  const captions = [
    "NAS istemciye dosyaları, SAN host’a depolama bloklarını sunar.",
    "NAS dosya protokollerini kullanır. SAN depolama trafiğini taşır. iSCSI ile blok erişimi de IP üzerinden sağlanabilir.",
    "NAS’ta dosya sistemini sunucu yönetir. SAN’da blokları kullanan dosya sistemi host tarafındadır.",
  ];
  return (
    <Stage title="NAS ve SAN" controls={<StoryControls {...context} />}>
      <div className="attachment-scene">
        <div className="attachment-compare-pictures">
          {[false, true].map((san) => (
            <section key={String(san)}>
              <h2>{san ? "SAN" : "NAS"}</h2>
              <ComparisonPath
                san={san}
                stage={context.stage}
                enabled={context.enabled}
              />
            </section>
          ))}
        </div>
        <table className="attachment-comparison-table">
          <caption className="sr-only">
            NAS ve SAN erişim, bağlantı ve dosya sistemi karşılaştırması
          </caption>
          <thead className="sr-only">
            <tr>
              <th scope="col">Özellik</th>
              <th scope="col">NAS</th>
              <th scope="col">SAN</th>
            </tr>
          </thead>
          <tbody>
            {comparisonRows.map((row, index) => (
              <motion.tr
                key={row.label}
                initial={false}
                animate={{
                  backgroundColor:
                    context.stage === index ? "#e7eaff" : "#ffffff",
                }}
                transition={{ duration: context.enabled ? 0.24 : 0 }}
              >
                <th scope="row">{row.label}</th>
                <td>{row.nas}</td>
                <td>{row.san}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        <StageCaption className="attachment-caption">
          {captions[context.stage]}
        </StageCaption>
      </div>
    </Stage>
  );
}
