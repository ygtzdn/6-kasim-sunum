import {
  ArrowRight,
  Check,
  CircleAlert,
  CircleHelp,
  HardDrive,
  LockKeyhole,
  ShieldCheck,
  ShieldX,
} from "lucide-react";
import { Stage } from "../../components/presentation/ScenePrimitives";
import {
  StageCaption,
  StageReveal,
} from "../../presentation/PresentationMotion";
import type { SceneContext } from "../../presentation/types";
import { IntegrityBits } from "./IntegrityBits";
import { managementStages } from "./stages";
import { StageControls } from "./StageControls";
import {
  ORIGINAL_BITS,
  STORED_PARITY,
  checkParity,
  decodeSecded,
  encodeSecded,
  flipBit,
} from "./model.mjs";

const PARITY_CAPTIONS = [
  "Çift paritede veri ve P içindeki 1’lerin toplamı çift olmalı.",
  "Bir bit değişti. Saklanan P aynı kaldı. Kontrol henüz yapılmadı.",
  "Toplam tek çıktı. Hata tespit edildi, ancak hangi bitin bozuk olduğu bilinmiyor.",
  "İki bit değişti ama toplam yine çift. Bu parite kontrolü hatayı kaçırdı.",
];

function DetectionMethods() {
  return (
    <StageReveal className="integrity-methods">
      <div className="integrity-method">
        <h2>Checksum</h2>
        <p>Veriden hesaplanan, sabit uzunlukta bir denetim değeri.</p>
        <div className="integrity-submethod">
          <strong>Parite</strong>
          <span>
            Basit bir checksum türü. Tek sayıda bit değişimini saptar.
          </span>
        </div>
      </div>
      <div className="integrity-method">
        <h2>CRC</h2>
        <p>Çok bitli hataların tespitinde de kullanılan başka bir yöntem.</p>
        <div className="integrity-submethod">
          <strong>Cyclic Redundancy Check</strong>
          <span>Kitap, ağ iletişimindeki yaygın kullanımını da belirtir.</span>
        </div>
      </div>
      <StageCaption className="integrity-caption integrity-methods-caption">
        Tespit, veride sorun olduğunu bildirir. Doğru içeriği elde etmek için
        düzeltme gerekir.
      </StageCaption>
    </StageReveal>
  );
}

export function ParityLab({ stage, setStage }: SceneContext) {
  const bits =
    stage === 0 || stage === 4
      ? [...ORIGINAL_BITS]
      : stage < 3
        ? flipBit([...ORIGINAL_BITS], 2)
        : flipBit(flipBit([...ORIGINAL_BITS], 0), 1);
  const result = checkParity(bits, STORED_PARITY);
  const pending = stage === 1;
  const missed = stage === 3;
  const Icon = pending
    ? CircleHelp
    : result.detected || missed
      ? CircleAlert
      : Check;
  return (
    <Stage
      title={
        stage === 4 ? "Parite, checksum ve CRC" : "Parite ile hata tespiti"
      }
      controls={
        <StageControls
          stage={stage}
          setStage={setStage}
          labels={managementStages["error-detection"]}
        />
      }
    >
      {stage === 4 ? (
        <DetectionMethods />
      ) : (
        <div className="integrity-scene integrity-parity">
          <div className="integrity-parity-data">
            <div className="integrity-word">
              <span className="integrity-label">
                {stage === 0 ? "Veri bitleri" : "Okunan veri bitleri"}
              </span>
              <IntegrityBits
                bits={bits}
                original={ORIGINAL_BITS}
                label="Parite örneğindeki veri"
              />
            </div>
            <span className="integrity-plus" aria-hidden="true">
              +
            </span>
            <div className="integrity-word">
              <span className="integrity-label">Parite biti</span>
              <div
                className="integrity-bit integrity-parity-bit"
                aria-label={`Saklanan parite biti P: ${STORED_PARITY}, sabit`}
              >
                {STORED_PARITY}
                <LockKeyhole
                  size={18}
                  className="integrity-parity-lock"
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>
          <div className="integrity-check">
            <span className="integrity-count">
              1’lerin toplamı{" "}
              <strong>{pending ? "?" : result.ones + STORED_PARITY}</strong>
            </span>
            <span
              className={`integrity-result ${result.detected || missed ? "integrity-result-warning" : ""}`}
            >
              <Icon size={22} aria-hidden="true" />
              {pending
                ? "Kontrol bekliyor"
                : result.detected
                  ? "Tek: hata tespit edildi"
                  : missed
                    ? "Çift: kontrol hata bulmadı"
                    : "Çift: parite uygun"}
            </span>
          </div>
          <StageCaption className="integrity-caption">
            {PARITY_CAPTIONS[stage]}
          </StageCaption>
          <p className="integrity-footnote">
            {stage === 0
              ? "Özgün örnek: 1011001 ve P=0 birlikte saklanır."
              : "Turuncu işaretler örnekte değiştirdiğimiz bitlerdir. Parite bunların yerini bulmaz."}
          </p>
        </div>
      )}
    </Stage>
  );
}

const ECC_DATA = [1, 0, 1, 1];
const ECC_CODE = encodeSecded(ECC_DATA);
const ECC_DATA_POSITIONS = [2, 4, 5, 6];
const ECC_RECEIVED = flipBit(ECC_CODE, 5);
const ECC_CAPTIONS = [
  "Veriyle birlikte hata düzeltme kodu da saklanır.",
  "Okumada bir bit değişti. ECC denetimi henüz yapılmadı.",
  "Bu örnekte ECC hatayı tespit etti ve doğru veriyi yeniden elde etti.",
];

function UncorrectableError() {
  return (
    <StageReveal className="integrity-scene">
      <div
        className="integrity-path"
        role="group"
        aria-label="Kalıcı hata saptanabilir ancak ECC fiziksel arızayı onaramaz"
      >
        <div className="integrity-panel integrity-panel-error">
          <HardDrive className="integrity-icon" aria-hidden="true" />
          <h2>Kalıcı hata</h2>
          <span className="integrity-detail">Hard error</span>
        </div>
        <ArrowRight className="integrity-arrow" aria-hidden="true" />
        <div className="integrity-panel">
          <CircleAlert className="integrity-icon" aria-hidden="true" />
          <h2>Hata tespit edilir</h2>
          <span className="integrity-detail">Sorun olduğu anlaşılır.</span>
        </div>
        <ArrowRight className="integrity-arrow" aria-hidden="true" />
        <div className="integrity-panel integrity-panel-error">
          <ShieldX className="integrity-icon" aria-hidden="true" />
          <h2>Düzeltilemez</h2>
          <span className="integrity-detail">
            ECC fiziksel arızayı onaramaz.
          </span>
        </div>
      </div>
      <StageCaption className="integrity-caption">
        ECC bazı hataları düzeltebilir. Tespit edilen her hata düzeltilemez.
      </StageCaption>
      <p className="integrity-footnote">
        Kitabın soft error / hard error ayrımı. Bozuk blok yönetimine sonraki
        bölümde döneceğiz.
      </p>
    </StageReveal>
  );
}

export function EccLab({ stage, setStage }: SceneContext) {
  const decoded = decodeSecded(ECC_RECEIVED);
  // The decoder output supplies the corrected payload. Original bits are a reference only.
  const code =
    stage === 0
      ? ECC_CODE
      : stage === 2 && decoded.code
        ? decoded.code
        : ECC_RECEIVED;
  const bits = ECC_DATA_POSITIONS.map((position) => code[position]);
  return (
    <Stage
      title={
        stage === 3 ? "Her hata düzeltilebilir mi?" : "ECC ile hata düzeltme"
      }
      controls={
        <StageControls
          stage={stage}
          setStage={setStage}
          labels={managementStages["error-correction"]}
        />
      }
    >
      {stage === 3 ? (
        <UncorrectableError />
      ) : (
        <div className="integrity-scene">
          <div
            className="integrity-path"
            role="group"
            aria-label="Veri ve ECC bilgisinden okunan verinin denetlenmesine"
          >
            <div className="integrity-panel">
              <h2>Saklanan veri</h2>
              <IntegrityBits
                bits={ECC_DATA}
                label="Saklanan ECC örneği verisi"
                compact
              />
              <span className="integrity-code">
                <LockKeyhole size={16} aria-hidden="true" /> Ek ECC bilgisi
              </span>
            </div>
            <ArrowRight className="integrity-arrow" aria-hidden="true" />
            <div
              className={`integrity-panel ${stage === 2 ? "integrity-panel-active" : ""}`}
            >
              <ShieldCheck
                className="integrity-icon"
                strokeWidth={1.5}
                aria-hidden="true"
              />
              <h2>ECC denetimi</h2>
              <span className="integrity-detail">
                {stage === 0
                  ? "Veri ve kod birlikte okunur."
                  : stage === 1
                    ? "Kontrol bekliyor"
                    : "Hata tespit edildi ve düzeltildi."}
              </span>
            </div>
            <ArrowRight className="integrity-arrow" aria-hidden="true" />
            <div
              className={`integrity-panel ${stage === 1 ? "integrity-panel-error" : stage === 2 ? "integrity-panel-active" : ""}`}
            >
              <h2>{stage === 2 ? "Düzeltilen veri" : "Okunan veri"}</h2>
              <IntegrityBits
                bits={bits}
                original={ECC_DATA}
                label={
                  stage === 2 ? "Düzeltilen veri" : "Okunan ECC örneği verisi"
                }
                compact
              />
              <span className="integrity-detail">
                {stage === 0
                  ? "Başlangıçta sağlam."
                  : stage === 1
                    ? "Bir veri biti değişti."
                    : "Başlangıçtaki içerik elde edildi."}
              </span>
            </div>
          </div>
          <StageCaption className="integrity-caption">
            {ECC_CAPTIONS[stage]}
          </StageCaption>
          <div className="integrity-takeaway">
            {stage === 2 ? (
              <StageReveal key="soft-error">
                Soft error: kodun sınırları içinde düzeltilebilir.
              </StageReveal>
            ) : (
              <span>Düzeltme kapasitesi kullanılan koda bağlıdır.</span>
            )}
          </div>
          <p className="integrity-footnote">
            Bit dizileri özgün bir örnektir. Kitaptaki genel ECC fikrini
            gösterir.
          </p>
        </div>
      )}
    </Stage>
  );
}
