import { motion } from "motion/react";
import { ArrowRight, HardDrive, Timer } from "lucide-react";
import { calculateSchedule } from "./model";

/** The same cylinder scale is used for the physical rail and the event plot. */
export function HeadRail({
  position,
  requests,
  enabled,
}: {
  position: number;
  requests: readonly number[];
  enabled: boolean;
}) {
  const x = (cylinder: number) => 55 + (cylinder / 199) * 970;
  return (
    <svg
      viewBox="0 0 1080 86"
      className="head-rail"
      role="img"
      aria-label={`HDD kafası ${position} silindirinde. Bekleyen silindirler: ${requests.join(", ") || "yok"}.`}
    >
      <path
        d="M55 43H1025"
        stroke="#cbd5e1"
        strokeWidth="7"
        strokeLinecap="round"
      />
      {[0, 50, 100, 150, 199].map((tick) => (
        <g key={tick}>
          <path d={`M${x(tick)} 36v15`} stroke="#64748b" strokeWidth="2" />
          <text
            x={x(tick)}
            y="76"
            textAnchor="middle"
            fontSize="14"
            fill="#64748b"
          >
            {tick}
          </text>
        </g>
      ))}
      {requests.map((cylinder, index) => (
        <circle
          key={`${cylinder}-${index}`}
          cx={x(cylinder)}
          cy="43"
          r="5"
          fill="#2247eb"
        />
      ))}
      <motion.g
        initial={false}
        animate={{ x: x(position) }}
        transition={{ duration: enabled ? 0.5 : 0, ease: "easeInOut" }}
      >
        <path
          d="M-11 25L0 40L11 25Z"
          fill="#fed84b"
          stroke="#111827"
          strokeWidth="2"
        />
        <text
          y="16"
          textAnchor="middle"
          fontSize="15"
          fontWeight="700"
          fill="#111827"
        >
          Kafa {position}
        </text>
      </motion.g>
    </svg>
  );
}

export function HddRationale({
  stage,
  enabled,
}: {
  stage: number;
  enabled: boolean;
}) {
  const orders = [
    [183, 37],
    [37, 183],
  ];
  return (
    <div className="hdd-rationale">
      <div className="scheduling-premise">
        <HardDrive aria-hidden="true" />
        <div>
          <h2>
            {stage === 2
              ? "Servis sırası, kafanın katettiği yolu değiştirir"
              : "HDD’de veriye erişmek fiziksel hareket gerektirir"}
          </h2>
          <p>
            {stage === 2
              ? "Aynı iki istek, aynı başlangıç kafası: 53"
              : "Kafa hedef silindire gider, plaka hedef sektörü kafanın altına getirir."}
          </p>
        </div>
      </div>
      {stage < 2 ? (
        <>
          <div className="hdd-costs">
            <div>
              <strong>Seek</strong>
              <span>Kafanın silindire hareketi</span>
            </div>
            <span className="scheduling-plus">+</span>
            <div>
              <strong>Dönme beklemesi</strong>
              <span>Sektörün kafaya ulaşması</span>
            </div>
            <span className="scheduling-plus">+</span>
            <div>
              <strong>Aktarım</strong>
              <span>Verinin taşınması</span>
            </div>
          </div>
          <div className="hdd-busy-flow">
            <div className="hdd-request-sources">
              <span>OS</span>
              <span>Sistem süreçleri</span>
              <span>Kullanıcı süreçleri</span>
            </div>
            <ArrowRight aria-hidden="true" />
            <div className="hdd-waiting-queue">
              <strong>
                {stage === 0
                  ? "Tek hazır istek"
                  : "HDD meşgul: istekler kuyrukta"}
              </strong>
              <div>
                {[98, 183, 37].map((cylinder, i) => (
                  <motion.span
                    key={cylinder}
                    aria-hidden={stage === 0 && i > 0 ? true : undefined}
                    initial={false}
                    animate={{
                      opacity: stage === 0 && i > 0 ? 0 : 1,
                      y: stage === 0 && i > 0 ? -12 : 0,
                    }}
                    transition={{ duration: enabled ? 0.3 : 0 }}
                    className={stage === 1 && i === 0 ? "request-served" : ""}
                  >
                    {cylinder}
                    {stage === 1 && i === 0 ? " ✓" : ""}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>
          <HeadRail
            position={stage === 0 ? 53 : 98}
            requests={stage === 0 ? [98] : [183, 37]}
            enabled={enabled}
          />
          <p className="scheduling-insight">
            <Timer size={18} aria-hidden="true" />
            {stage === 0
              ? "Seek mesafesi büyüdükçe seek süresi genellikle artar."
              : "98 işlenirken 183 ve 37 bekler. Sırada hangisi olmalı?"}
          </p>
        </>
      ) : (
        <div className="hdd-order-comparison">
          {orders.map((queue, index) => {
            const result = calculateSchedule("FCFS", {
              head: 53,
              queue,
              direction: "down",
            });
            const x = (cylinder: number) => 35 + (cylinder / 199) * 400;
            return (
              <div key={index}>
                <p>{result.path.join(" → ")}</p>
                <svg
                  viewBox="0 0 470 135"
                  role="img"
                  aria-label={`${result.path.join(", ")}: ${result.total} silindir hareketi`}
                >
                  <path d="M35 25H435M35 70H435M35 115H435" stroke="#d5dbe4" />
                  <motion.path
                    d={`M${x(53)} 25L${x(queue[0])} 70L${x(queue[1])} 115`}
                    fill="none"
                    stroke={index === 0 ? "#ef602e" : "#2247eb"}
                    strokeWidth="5"
                    initial={enabled ? { pathLength: 0 } : false}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: enabled ? 0.65 : 0 }}
                  />
                  {result.path.map((cylinder, i) => (
                    <circle
                      key={i}
                      cx={x(cylinder)}
                      cy={25 + 45 * i}
                      r="6"
                      fill={i === 0 ? "#fed84b" : "#111827"}
                      stroke="#111827"
                    />
                  ))}
                </svg>
                <strong>
                  {result.total}
                  <small>silindir hareketi</small>
                </strong>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
