import { useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, Check, RotateCcw } from "lucide-react";
import type { SceneDefinition } from "../../presentation/types";
import { Stage, Choice } from "../../components/presentation/ScenePrimitives";

function Journey() {
  const [step, setStep] = useState(0);
  const labels = [
    "Uygulama",
    "OS kuyruğu",
    "Bağlantı",
    "RAID",
    "Aygıt",
    "Kontrol",
  ];
  return (
    <Stage
      title="Tek istek. Bütün sistem."
      controls={
        <div className="flex items-center gap-3">
          <button
            className="primary-button"
            onClick={() => setStep((s) => (s + 1) % labels.length)}
          >
            Adım <ArrowRight size={18} />
          </button>
          <button
            className="icon-button"
            aria-label="Yolculuğu sıfırla"
            onClick={() => setStep(0)}
          >
            <RotateCcw size={20} />
          </button>
        </div>
      }
    >
      <div className="grid w-full max-w-[1100px] grid-cols-3 gap-5 md:grid-cols-6">
        {labels.map((label, i) => (
          <button
            onClick={() => setStep(i)}
            aria-pressed={step === i}
            className="flex min-w-0 flex-col items-center gap-4"
            key={label}
          >
            <motion.span
              animate={{
                scale: step === i ? 1.1 : 1,
                backgroundColor: step === i ? "#2247eb" : "#fff",
                color: step === i ? "#fff" : "#111827",
              }}
              className="flex aspect-square w-full max-w-28 items-center justify-center rounded-full border-2 border-ink font-display text-3xl"
            >
              {String(i + 1).padStart(2, "0")}
            </motion.span>
            <strong className="text-xs font-semibold md:text-base">
              {label}
            </strong>
          </button>
        ))}
      </div>
    </Stage>
  );
}
function WrapUp() {
  const [selected, setSelected] = useState<string[]>([]);
  const labels = ["İş yükü", "Gecikme", "Hata modeli", "Yedekleme"];
  return (
    <Stage
      title="Doğru tasarım?"
      controls={
        <span className="text-sm font-semibold text-slate-600">
          Birlikte düşün.
        </span>
      }
    >
      <div className="grid w-full max-w-[850px] grid-cols-2 gap-4 md:gap-7">
        {labels.map((label) => (
          <Choice
            active={selected.includes(label)}
            onClick={() =>
              setSelected((s) =>
                s.includes(label)
                  ? s.filter((v) => v !== label)
                  : [...s, label],
              )
            }
            key={label}
          >
            <span className="flex min-h-20 items-center justify-center gap-3 font-display text-xl md:min-h-32 md:text-3xl">
              {label}
              {selected.includes(label) && <Check size={24} />}
            </span>
          </Choice>
        ))}
      </div>
    </Stage>
  );
}
export const closingScenes: SceneDefinition[] = [
  {
    id: "s35",
    title: "Tek isteğin bütün yolculuğu",
    shortTitle: "Bütün sistem",
    chapter: "Ortak kapanış",
    presenterId: 4,
    render: () => <Journey />,
    notes: {
      represents:
        "Altı düğüm bir dosya okuma isteğinin kavramsal yolunu birleştirir: uygulama, OS kuyruğu, bağlantı, varsa çok diskli hacim, fiziksel aygıt ve veri bütünlüğü kontrolü. Mavi düğüm üzerinde konuşulan sorumluluktur; çizim evrensel bir OS işlem sırası veya bütün sistemlerin aynı mimariye sahip olduğu iddiası değildir.",
      learningGoal:
        "Dört sunucunun anlattığı parçaları aynı I/O isteği çevresinde ilişkilendirmek.",
      walkthrough: [
        "Adım ile uygulamadan başlayın; uygulamanın fiziksel sektör seçmediğini anımsatın.",
        "OS kuyruğunda bekleyen istekleri zamanlama ve arayüz katmanlarıyla bağlayın.",
        "Bağlantıyı DAS/NAS/SAN ayrımıyla yorumlayın; NAS yolunda sunucu tarafındaki dosya sistemi rolünü söyleyin.",
        "RAID’in isteğe bağlı bir yapı olduğunu vurgulayın; tek diskte de veri erişimi yapılabilir.",
        "Aygıtta HDD ile flash maliyetlerinin neden farklı olduğunu yeniden sorun.",
        "Kontrol aşamasında ECC/checksum ve RAID korumasının farklı hata türlerine cevap verdiğini özetleyin.",
      ],
      keyPoints: [
        "Soyutlama katmanları fiziksel ayrıntıları saklar; maliyetleri yok etmez.",
        "Swap sıradan dosya okumasının zorunlu bir adımı değildir; başka bir depolama kullanım amacıdır.",
        "Güvenilirlik yalnızca disk sayısından; hız yalnızca aktarım hızından çıkarılamaz.",
      ],
      limits:
        "Adımlar dikkat yönlendirmek içindir; gerçek duvar saati süresi veya tek zorunlu mimari verilmez. Önbellek ve paralellik bir gerçek sistemde birden çok aşamayı farklılaştırabilir.",
      transition:
        "Şimdi bütün tasarım kararlarını hangi ölçütlerle birlikte değerlendirmemiz gerektiğini düşünelim.",
    },
  },
  {
    id: "s36",
    title: "Tasarım kararları ve soru-cevap",
    shortTitle: "Kapanış ve sorular",
    chapter: "Ortak kapanış",
    presenterId: 4,
    render: () => <WrapUp />,
    notes: {
      represents:
        "Dört seçilebilir alan, depolama tasarımında birlikte sorulması gereken dört soruyu temsil eder. Birini seçmek diğerini geçersiz kılmaz; bir tasarımı yalnızca en yüksek hız veya en yüksek kapasiteyle değerlendirmemeyi amaçlar. Bu bir tek doğru seçenekli sınav değildir.",
      learningGoal:
        "İş yükü, gecikme, hata modeli ve yedekleme gereksinimlerini aynı tasarım değerlendirmesinde kullanmak.",
      walkthrough: [
        "İş yükünü seçin: rastgele/sıralı, okuma/yazma ve istek boyutunu somutlaştırın.",
        "Gecikmeyi seçin: seek, dönme, kuyruk ve aktarımın hangi durumda öne çıktığını sorun.",
        "Hata modelini seçin: bit bozulması, tam disk kaybı, denetleyici veya tüm dizinin kaybı aynı şey değildir.",
        "Yedeklemeyi seçin: yanlış silme ve dizinin kaybına karşı RAID dışında kopya ve kurtarma ihtiyacını konuşun.",
        "Soru geldiğinde küçük menüden ilgili sunucunun sahnesine geri dönün; kaynaklar sekmesindeki resmî kitap materyalini gösterin.",
      ],
      keyPoints: [
        "Doğru aygıt ve politika iş yüküyle birlikte seçilir.",
        "RAID bir yedekleme stratejisinin yerine geçmez.",
        "Bir modelin başarıyla gösterdiği hata durumları, açıklanmamış bütün hatalarda koruma garantisi değildir.",
        "Sunum örnekleri gerçek aygıt ölçümü değil öğretim modelleridir.",
      ],
      limits:
        "Seçimler notlandırma veya tasarım tavsiye motoru üretmez. Ürün önerisi, maliyet tahmini veya üretim sisteminde uygulanacak komut sunulmaz.",
      question: {
        prompt: "Hızlı ve yedekli demek tasarımı tanımlamak için yeterli mi?",
        answer:
          "Hayır; iş yükü, gecikme hedefi, hata varsayımı, veri bütünlüğü ve yedekleme/kurtarma ihtiyacı birlikte belirlenmelidir.",
      },
    },
  },
];
