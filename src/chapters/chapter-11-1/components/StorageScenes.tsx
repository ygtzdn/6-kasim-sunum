import type { ReactNode } from "react";
import { ArrowRight, Check, Power, Radio } from "lucide-react";
import type { SceneContext } from "../../../presentation/types";
import { Stage } from "../../../components/presentation/ScenePrimitives";

function Caption({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div key={title} className="intro-explanation" aria-live="polite">
      <h2>{title}</h2>
      <p>{children}</p>
    </div>
  );
}

function Bits({ lost = false }: { lost?: boolean }) {
  return (
    <div
      className={`intro-bits ${lost ? "bits-lost" : ""}`}
      aria-label={lost ? "Veri kayboldu" : "Örnek veri: 1010"}
    >
      {[1, 0, 1, 0, 0, 1, 0, 1].map((bit, i) => (
        <span key={i}>{lost ? "–" : bit}</span>
      ))}
    </div>
  );
}

export function StorageComparison({ stage }: SceneContext) {
  const lost = stage > 0;
  return (
    <Stage title="Volatil ve Non-Volatil.">
      <div className="intro-focus">
        <div className="medium-comparison">
          <article className="medium-card">
            <h2>Volatil</h2>
            <div className="volatile-device">
              <img
                src="/media/ram-module.png"
                width="1774"
                height="407"
                alt="Arka planı şeffaf gerçek RAM modülü"
              />
              <span className="device-name">RAM</span>
              <span className="power-status">
                <Power
                  size={16}
                  className={stage === 1 ? "text-orange" : "text-blue"}
                />
                {stage === 1 ? "Güç yok" : "Güç var"}
              </span>
            </div>
            <Bits lost={lost} />
            <p>Uçucu · Güç kesilince veri kaybolur.</p>
          </article>
          <article className="medium-card">
            <h2>Non-Volatil</h2>
            <div className="nonvolatile-devices">
              <figure>
                <img
                  src="/media/hdd-open.png"
                  width="2000"
                  height="1479"
                  alt="Arka planı şeffaf gerçek HDD"
                />
                <figcaption>HDD</figcaption>
              </figure>
              <figure className={stage === 3 ? "ssd-emphasis" : ""}>
                <img
                  src="/media/ssd-case.png"
                  width="2693"
                  height="1887"
                  alt="Arka planı şeffaf gerçek SSD"
                />
                <figcaption>SSD</figcaption>
              </figure>
            </div>
            <Bits />
            <p>Kalıcı · Güç kesilince veri korunur.</p>
          </article>
        </div>
        <Caption
          title={
            [
              "Güç kesilince ne olur?",
              "Güç kesildi.",
              "Güç geri geldi.",
              "Elektronik olmak, uçucu olmak değildir.",
            ][stage]
          }
        >
          {
            [
              "RAM uçucudur. HDD ve flash tabanlı SSD kalıcıdır.",
              "Volatil belleğin içeriği kaybolur; Non-Volatil depolamada kayıt korunur.",
              "RAM’in eski içeriği kendiliğinden geri gelmez.",
              "Flash tabanlı SSD, hareketli parça olmadan veriyi korur.",
            ][stage]
          }
        </Caption>
      </div>
    </Stage>
  );
}

type Marker = { x: number; y: number; label: string };
function Photo({
  src,
  width,
  height,
  alt,
  markers = [],
}: {
  src: string;
  width: number;
  height: number;
  alt: string;
  markers?: Marker[];
}) {
  return (
    <svg
      className="hardware-photo"
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={alt}
    >
      <image href={src} width={width} height={height} />
      {markers.map((m, i) => (
        <g
          key={m.label}
          transform={`translate(${m.x * width} ${m.y * height})`}
          className="photo-marker"
        >
          <circle
            r={width * 0.025}
            fill="#2247eb"
            stroke="white"
            strokeWidth={width * 0.004}
          />
          <text
            textAnchor="middle"
            dominantBaseline="central"
            fill="white"
            fontSize={width * 0.027}
            fontWeight="700"
          >
            {i + 1}
          </text>
          <title>{m.label}</title>
        </g>
      ))}
    </svg>
  );
}

const hddDetails = [
  [
    "Manyetik disk",
    "Kapak kaldırılmış gerçek bir HDD. Temel parçaları sırayla inceleyelim.",
  ],
  ["1 · Plaka", "Manyetik kaplamalı yüzey veriyi tutar."],
  ["1 · Mil", "Plakalar mil çevresinde birlikte döner."],
  ["1 · Kol", "Okuma/yazma kafasını hedef iz üzerine götürür: seek."],
  [
    "1 · Okuma / yazma kafası",
    "Plaka yüzeyindeki manyetik veriyi okur veya yazar.",
  ],
  [
    "Verinin yüzeydeki düzeni",
    "İz: dairesel kayıt yolu. Sektör: izin parçası. Silindir: yüzeylerde aynı yarıçaptaki izler.",
  ],
];
const hddMarkers: Marker[][] = [
  [],
  [{ x: 0.3, y: 0.6, label: "Plaka" }],
  [{ x: 0.438, y: 0.513, label: "Mil" }],
  [{ x: 0.59, y: 0.265, label: "Kol" }],
  [{ x: 0.46, y: 0.2, label: "Kafa — park konumunda" }],
  [],
];

export function HddAnatomy({ stage }: SceneContext) {
  return (
    <Stage title="HDD’nin temel parçaları.">
      <div className="photo-layout">
        <figure className="photo-figure">
          <Photo
            src="/media/hdd-open.png"
            width={2000}
            height={1479}
            alt="Gerçek HDD: plaka, mil, kol ve park konumundaki kafa"
            markers={hddMarkers[stage]}
          />
          <figcaption>Evan-Amos / AGreuet · CC BY-SA 3.0</figcaption>
        </figure>
        <div className="photo-description">
          <span className="eyebrow">11.1 · Manyetik disk</span>
          <Caption title={hddDetails[stage][0]}>{hddDetails[stage][1]}</Caption>
          {stage === 5 && (
            <p className="photo-detail">
              İz ve sektör çizgileri bu fotoğrafta gözle ayırt edilemez.
              Silindir bir geometrik gruplamadır.
            </p>
          )}
        </div>
      </div>
    </Stage>
  );
}

const ssdDetails = [
  [
    "Flash tabanlı SSD",
    "Veriyi elektrik kesildiğinde de saklayan bir NVM aygıtı.",
  ],
  [
    "Kasanın içinde",
    "Dönen plaka yerine elektronik kart ve bellek yongaları bulunur.",
  ],
  [
    "1–4 · Flash bellek",
    "Verinin kalıcı tutulduğu yongalar. Okuma ve yazma sayfa birimindedir.",
  ],
  [
    "1 · Denetleyici",
    "Bilgisayardan gelen istekleri flash bellek üzerindeki işlemlere dönüştürür.",
  ],
  [
    "Seek yok. Dönme beklemesi yok.",
    "Hareketli parça bulunmaz. Flash yazma ve silmenin ayrı kuralları vardır.",
  ],
];
const ssdMarkers: Marker[][] = [
  [],
  [],
  [
    { x: 0.663, y: 0.2, label: "Flash" },
    { x: 0.663, y: 0.49, label: "Flash" },
    { x: 0.52, y: 0.791, label: "Flash" },
    { x: 0.805, y: 0.791, label: "Flash" },
  ],
  [{ x: 0.288, y: 0.41, label: "SSD denetleyicisi" }],
  [],
];
export function SsdAnatomy({ stage }: SceneContext) {
  return (
    <Stage title="SSD: aynı amaç, farklı yapı.">
      <div className="photo-layout">
        <figure className="photo-figure">
          <Photo
            src={stage === 0 ? "/media/ssd-case.png" : "/media/ssd-board.png"}
            width={stage === 0 ? 2693 : 3184}
            height={stage === 0 ? 1887 : 2022}
            alt={
              stage === 0
                ? "Gerçek Samsung SSD’nin dış görünüşü"
                : "SSD iç kartı: NAND flash yongaları ve denetleyici"
            }
            markers={ssdMarkers[stage]}
          />
          <figcaption>MatteX · CC0 · Gerçek aygıt örneği</figcaption>
        </figure>
        <div className="photo-description">
          <span className="eyebrow">11.1 · Nonvolatile Memory</span>
          <Caption title={ssdDetails[stage][0]}>{ssdDetails[stage][1]}</Caption>
          {stage === 4 && (
            <div className="hardware-contrast">
              <span>HDD · Manyetik yüzey</span>
              <ArrowRight size={20} />
              <span>SSD · Flash bellek</span>
            </div>
          )}
        </div>
      </div>
    </Stage>
  );
}

const flashText = [
  ["Okuma: bir sayfa", "P0’daki veriyi okumak sayfayı değiştirmez."],
  [
    "Yazma: boş bir sayfa",
    "L0’ın yeni sürümü boş P6’ya yazılır. Aynı sayfanın üstüne yazılmaz.",
  ],
  [
    "Eski sürüm geçersiz",
    "L0 artık P6’dadır. P0’daki eski içerik fiziksel olarak henüz silinmemiştir.",
  ],
  [
    "Silme: bütün blok",
    "A bloğunda canlı veri kalmadı. Blok bütünüyle silinince sayfaları yeniden yazılabilir.",
  ],
];
export function FlashBasics({ stage }: SceneContext) {
  return (
    <Stage title="Oku: sayfa. Sil: blok.">
      <div className="intro-focus">
        <div className="flash-blocks intro-flash">
          {[0, 1].map((block) => (
            <div
              className={`flash-block ${stage === 3 && block === 0 ? "erased-block" : ""}`}
              key={block}
            >
              <span className="eyebrow">
                SİLME BLOĞU {block === 0 ? "A" : "B"}
              </span>
              <div className="flash-row">
                {Array.from({ length: 4 }, (_, i) => {
                  const address = block * 4 + i;
                  const erased = block === 0 && stage === 3;
                  const invalid =
                    block === 0 && !erased && (i > 0 || stage >= 1);
                  const fresh = address === 6 && stage >= 1;
                  const label = erased
                    ? "Boş"
                    : address === 0
                      ? "L0 · v1"
                      : block === 0
                        ? "Eski"
                        : i < 2
                          ? `L${i + 1}`
                          : fresh
                            ? "L0 · v2"
                            : "Boş";
                  return (
                    <div
                      key={address}
                      className={`flash-page ${invalid ? "page-invalid" : ""} ${fresh ? "page-new" : ""} ${address === 0 && stage === 0 ? "page-reading" : ""}`}
                    >
                      <small>P{address}</small>
                      <strong>{label}</strong>
                      <span>
                        {invalid ? (
                          "Geçersiz"
                        ) : fresh ? (
                          <Check size={17} />
                        ) : (
                          "Sayfa"
                        )}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <Caption title={flashText[stage][0]}>{flashText[stage][1]}</Caption>
      </div>
    </Stage>
  );
}

export function OtherStorage({ stage }: SceneContext) {
  return (
    <Stage
      title={
        [
          "RAM disk: hızlı, geçici.",
          "Teyp: sıralı veri akışı.",
          "OS, mantıksal blokları görür.",
          "Bloklar sektörlere eşlenir.",
          "Komut gider. Veri aktarılır.",
        ][stage]
      }
    >
      <div className="intro-focus">
        {stage === 0 ? (
          <>
            <div className="ram-disk-visual">
              <img
                className="ram-module-photo"
                src="/media/ram-module.png"
                width="1774"
                height="407"
                alt="Gerçek RAM modülü"
              />
              <Bits />
              <span>RAM → blok aygıtı → dosya sistemi</span>
            </div>
            <Caption title="RAM disk">
              RAM üzerinde dosya sistemi kurulabilir; güç kaybında içerik
              korunmaz.
            </Caption>
          </>
        ) : stage === 1 ? (
          <>
            <div className="tape-strip">
              <Radio size={48} strokeWidth={1.4} />
              <div className="tape-cells">
                {Array.from({ length: 10 }, (_, i) => (
                  <span key={i}>{i}</span>
                ))}
              </div>
            </div>
            <Caption title="Önce konumu bul, sonra sırayla aktar.">
              Manyetik teyp, arşiv ve yedekleme için kullanılan bir ortamdır.
            </Caption>
          </>
        ) : stage < 4 ? (
          <>
            <div
              className="logical-block-row"
              aria-label="Sıralı mantıksal blok adresleri"
            >
              {Array.from({ length: 8 }, (_, i) => (
                <div key={i} className={i === 3 ? "selected" : ""}>
                  <small>LBA</small>
                  <strong>{i}</strong>
                </div>
              ))}
            </div>
            {stage === 3 && (
              <div className="mapping-result intro-reveal">
                <span>LBA 3</span>
                <ArrowRight size={24} />
                <span>Denetleyici</span>
                <ArrowRight size={24} />
                <span>Disk sektörü</span>
              </div>
            )}
            <Caption
              title={
                stage === 2
                  ? "Tek boyutlu blok dizisi"
                  : "Mantıksal adres → fiziksel sektör"
              }
            >
              {stage === 2
                ? "İşletim sistemi disk yüzeyini değil, numaralı blokları adresler."
                : "Kitabın temel modeli sıralı eşlemedir. Bozuk sektörler ve geometri eşlemeyi karmaşıklaştırabilir."}
            </Caption>
          </>
        ) : (
          <>
            <div className="io-route">
              <span>OS</span>
              <ArrowRight />
              <span>Host denetleyicisi</span>
              <ArrowRight />
              <span>Aygıt denetleyicisi</span>
              <ArrowRight />
              <span>Depolama</span>
            </div>
            <div className="dma-route">
              <span>Depolama</span>
              <div className="data-stream">
                <span />
              </div>
              <span>DRAM</span>
            </div>
            <Caption title="DMA ile veri aktarımı">
              Denetleyiciler komutları iletir; veri aygıt ile ana bellek
              arasında aktarılır.
            </Caption>
          </>
        )}
      </div>
    </Stage>
  );
}

export function IntroCheckpoint({ stage, setStage }: SceneContext) {
  return (
    <Stage
      title="Aktarım hızlanırsa bütün bekleme biter mi?"
      controls={
        stage === 0 ? (
          <button className="primary-button" onClick={() => setStage(1)}>
            Cevabı göster <ArrowRight size={18} />
          </button>
        ) : undefined
      }
    >
      <div className="intro-focus">
        <div className={`question-orb ${stage > 0 ? "answer-correct" : ""}`}>
          {stage === 0 ? "?" : <Check size={72} />}
        </div>
        <Caption
          title={
            stage === 0
              ? "Bir HDD okumasını düşünün."
              : stage === 1
                ? "Hayır. Seek + dönme sürer."
                : "Donanım farkı, zamanlama kararını değiştirir."
          }
        >
          {stage === 0
            ? "Aktarım süresi küçülürken mekanik beklemeye ne olur?"
            : stage === 1
              ? "Yüksek aktarım hızı, kafanın konumlanmasını ve sektörün dönmesini ortadan kaldırmaz."
              : "Sıradaki konu: bekleyen HDD isteklerini hangi sırayla işleyelim?"}
        </Caption>
      </div>
    </Stage>
  );
}
