import type { SceneNotes } from "../../presentation/types";
import curriculum from "./curriculum.json";
import {
  calculateSchedule,
  defaultSchedule,
  type ScheduleAlgorithm,
} from "./model";
const algorithmNotes = (algorithm: ScheduleAlgorithm) => {
  const result = calculateSchedule(algorithm, defaultSchedule);
  return [
    "Kafa 53’te, toplam 0 ve tamamlanan 0/8. Önce bir sonraki hedefi ve mesafeyi tahmin edin.",
    ...result.events.map((event) =>
      event.kind === "service"
        ? `Kafa ${event.position}’e gelir; istek ${(event.requestId ?? 0) + 1} tamamlanır. Bu hareket+${event.distance}, birikimli toplam ${event.total} silindirdir.`
        : event.kind === "turn"
          ? `Fiziksel uç ${event.position}’a gidilir. +${event.distance} hareket toplamı${event.total} yapar; istek servis sayısı artmaz.`
          : `0→199 dönüşünde servis yok. +${event.distance} hareket toplamı${event.total} yapar; tamamlanan istek 2/8 kalır.`,
    ),
    algorithm === "SCAN"
      ? "Fiziksel0’a giden yol53+183=236. 14’te dönen LOOK yolu39+169=208. Kaynak 21’deki208 ile bu fiziksel uç kuralı uyuşmaz; tam kitap metninde hata iddia edilmez."
      : algorithm === "FCFS"
        ? "Geliş sırası korundu:45+85+146+85+108+110+59+2=640. Grafiğin dikey ekseni olay sırası; gerçek zaman değildir."
        : "Sonuç53+199+134=386. Ortak azalan yön korunur; artan alternatif382’dir ve kaynak çizimiyle yön farkı notlanır.",
  ];
};
export const schedulingCaptions: Record<string, string[]> = {
  "hdd-request-queue": [
    "Aygıt boşsa tek istek hemen işlenebilir; meşgulse birden çok bekleyen istek sıralama seçimi doğurur.",
    "Resmî geliş sırası98,183,37,122,14,124,65,67. Bütün istekler t=0’da hazırdır.",
    "Kafa 53 ve fiziksel0–199 sınırları bütün karşılaştırmalarda aynıdır.",
    "Ortak başlangıç yönü azalan; FCFS yönü kullanmaz. Σ|sonraki−önceki| silindir hareketidir, ms değildir.",
  ],
  "fcfs-path": algorithmNotes("FCFS"),
  "scan-path": algorithmNotes("SCAN"),
  "cscan-path": algorithmNotes("C-SCAN"),
  "scheduling-tradeoffs": [
    "FCFS aynı sekiz isteği geliş sırasıyla640 silindirde tamamlar.",
    "SCAN fiziksel0 ucuna gider; aynı kuyrukta236 hareket yapar.",
    "C-SCAN servis yapılmayan dönüşü de sayarak386 hareket yapar.",
    "C-SCAN çubuğunu53,199,134 olarak ayırın. 199 dönüşü servis yapmaz ama hareket toplamında kalır.",
    "Geliş kimlikleriyle servis sırasını karşılaştırın. Tablo gerçek bekleme süresi veya adalet puanı değildir.",
    "25. slayttaki tarihsel deadline fikri: batch sonrasında eski isteği gözet; o isteğin bulunduğu LBA kuyruğunu seç. RHEL 7 / NOOP / CFQ güncel varsayılan diye sunulmaz.",
  ],
  "nvm-scheduling": [
    "Seek yok; host komut hazırlama ve kuyruk işi sürer.",
    "OkuL10 ve OkuL11 tek OkuL10–L11 isteğinde birleştirilir. Geriye gidince iki kart geri gelir.",
    "Komutlar aygıta gönderilir. NVMe iletişim arayüzüdür; FTL değildir.",
    "Aygıt içindeki işler paralel ilerleyebilir. Çizilen iç iş sayısı ürün özelliği veya hız çarpanı değildir.",
    "Host I/O kararları, FTL eşlemesi, GC ve wear leveling ayrı sorumluluklardır. Ayrıntılı GC hesabı bir sonraki sahnededir.",
  ],
  "flash-write-amplification": [
    "Başlangıç B0=L0–L3, B1=L4/L5 ve2boş, B2=GCrezervi. İlk yükleme sayaçlara dahil değil; oran host 0 iken tanımsızdır.",
    "L0:v1→B1.P2; eskiL0 geçersiz. Host 1, fiziksel 1, silme 0.",
    "L1:v1→B1.P3; eskiL1 geçersiz. Host 2, fiziksel 2, silme 0.",
    "CanlıL2/L3 B2’ye kopyalanır; FTL güncellenir. Host 2 kalır, fiziksel yazma4 olur.",
    "B0’da canlı referans kalmadığı için blok birlikte silinir. Silme1 olur; yeni GCrezervi B0’dır.",
    "L2:v1→B2.P2. Sonuç host 3, fiziksel 5, silme 1. Fiziksel/host=5/3≈1,67; bu sabit ürün oranı değildir.",
  ],
  "nvm-management-summary": [
    "OS istek gönderme/birleştirmeyi; SSD denetleyicisi FTL,GC ve aşınmayı yönetir.",
    "Birikmiş silmeler[8,2,2,1]. Aşınma sayıları kalan ömür yüzdesi değildir.",
    "Yeni 19 silme döngüsü B1+6,B2+6,B3+7 dağıtılır:[8,8,8,8]. Hiçbir sayaç azalmaz.",
    "B0’da bir silme daha:[9,8,8,8]. Alan yeniden kullanılabilir, geçmiş aşınma geri alınmaz.",
    "Denetleyicinin GC için ayırdığı alan host’un dosya sistemi boşluğu değildir. FTL/GC/aşınma farklı işlerdir.",
  ],
};
const questions: Record<string, { prompt: string; answer: string }> = {
  "hdd-request-queue": {
    prompt: "Bekleyen kuyruk yoksa yeniden sıralanacak ne var?",
    answer:
      "Tek hazır istekte birden çok talep arasından servis sırası seçimi yoktur.",
  },
  "fcfs-path": {
    prompt: "Sonradan gelen yakın istek FCFS’de öne geçer mi?",
    answer: "Hayır; geliş sırasındaki yerini korur.",
  },
  "scan-path": {
    prompt: "14’te dönmek bu SCAN sözleşmesine uyar mı?",
    answer: "Hayır; burada fiziksel0’a gidilir.14’te dönen LOOK yolu208’dir.",
  },
  "cscan-path": {
    prompt: "0→199 dönüşünde98’in üzerinden geçmek98isteğini tamamlar mı?",
    answer: "Hayır; dönüşte servis yapılmaz,199 hareket yine sayılır.",
  },
  "scheduling-tradeoffs": {
    prompt: "En kısa yol her durumda en düşük uygulama gecikmesi midir?",
    answer:
      "Hayır; dönme,istek boyutu,kuyruk ve adalet hedefleri de önemlidir.",
  },
  "nvm-scheduling": {
    prompt: "Seek yoksa bitişik isteği birleştirmek anlamsız mı?",
    answer: "Hayır; komut ve yazılım ek yükünü azaltma farklı bir gerekçedir.",
  },
  "flash-write-amplification": {
    prompt: "Host2’de dururken fiziksel yazma4 nasıl oldu?",
    answer:
      "GC canlıL2/L3 kopyalarını yazdı; bunlar yeni host yazması değildi.",
  },
  "nvm-management-summary": {
    prompt: "Bloğu silmek geçmiş aşınma sayacını sıfırlar mı?",
    answer: "Hayır; alanı geri kazanmak geçmiş aşınmayı geri almak değildir.",
  },
};
const transitions: Record<string, string> = {
  "hdd-request-queue": "Önce geliş sırasını koruyarak yolu izleyelim.",
  "fcfs-path": "Kafayı çok gezdirdik; şimdi aynı yöndeki istekleri toplayalım.",
  "scan-path": "Servisi tek yönde tutarsak dönüş yoluna ne olur?",
  "cscan-path":
    "Üç toplamı aynı hedefle karşılaştıralım; sonra ölçünün eksiklerini soralım.",
  "scheduling-tradeoffs":
    "NVM’de kafa yolu yok. Politikaların hangi gerekçeleri kalır?",
  "nvm-scheduling":
    "Bir host yazması aygıt içinde kaç fiziksel yazma doğurabilir?",
  "flash-write-amplification":
    "GC alanı geri kazandırır. Aşınmayı geri alır mı?",
  "nvm-management-summary":
    "İsteklerin sırasını ve aygıtın yaptığı ek işi yönettik. Okuduğumuz bitlerin doğru olduğunu nasıl anlayacağız? Şimdi hata tespiti ve düzeltmeyle devam ediyoruz.",
};
export const schedulingNotes: Record<string, SceneNotes> = Object.fromEntries(
  curriculum.map((scene) => [
    scene.id,
    {
      represents: `${scene.model} Bu sahne ${scene.stages.join(" → ")} durumlarından oluşur. Her görünür kafa, eşleme, sayaç ve seçim yalnız geçerli aşamadan hesaplanır.`,
      learningGoal: scene.takeaway,
      walkthrough: scene.stages.map(
        (name, index) =>
          `${index + 1}. aşama — ${name}: ${schedulingCaptions[scene.id][index]}`,
      ),
      keyPoints: [
        scene.takeaway,
        scene.model,
        `Kaynak: Operating System Concepts, Tenth Edition; ${scene.sections.join(" / ")}; resmî slaytlar ${scene.slides.join(", ")}.`,
      ],
      limits: `${scene.model} Statik sınıf modeli gerçek ms, IOPS, ürün ömrü veya güncel OS varsayılanı üretmez. Geriye gitmek geçmiş eğitim görünümünü kurar; gerçek aygıt işlemini geri almaz.`,
      question: questions[scene.id],
      transition: transitions[scene.id],
    },
  ]),
);
