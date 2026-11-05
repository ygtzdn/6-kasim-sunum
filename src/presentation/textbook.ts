import introductionCurriculum from "../chapters/chapter-11-1/curriculum.json";
import schedulingCurriculum from "../chapters/chapter-11-2-3/curriculum.json";
import { exercises } from "../chapters/closing/exercise-data.mjs";
/** OSC10 Chapter 11, official 47-slide deck; slide numbers are one-based. */
export const textbook = {
  title: "Operating System Concepts",
  edition: "Tenth Edition · 10. baskı",
  authors: "Abraham Silberschatz, Peter B. Galvin, Greg Gagne",
  chapter: "11 · Mass-Storage Structure",
  slidesUrl: "https://os-book.com/OS10/slide-dir/PPTX-dir/ch11.pptx",
  contentsUrl: "/references/osc10-contents.pdf",
  exercisesUrl: "/references/ch11-exercises.pdf",
  verification:
    "Bölüm eşlemesi resmî içindekilerle, kavramlar 10. baskının resmî ders slaytlarıyla denetlendi. Tam kitap metni yerel depoda bulunmuyor.",
} as const;

export type TextbookSection =
  "11.1" | "11.2" | "11.3" | "11.4" | "11.5" | "11.6" | "11.7" | "11.8";

export interface SceneReference {
  sections: readonly TextbookSection[];
  slides: readonly number[];
  takeaway: string;
  model: string;
  exercise?: { label: string; page: number };
}

// Cross-references deliberately include earlier concepts reused in later scenes.
export const sceneReferences: Record<string, SceneReference> = {
  ...Object.fromEntries(
    [...introductionCurriculum, ...schedulingCurriculum].map((scene) => [
      scene.id,
      {
        sections: scene.sections as TextbookSection[],
        slides: scene.slides,
        takeaway: scene.takeaway,
        model: scene.model,
      },
    ]),
  ),
  ...Object.fromEntries(
    exercises.map((exercise) => [
      exercise.id,
      {
        sections: exercise.sections,
        slides: exercise.slides,
        takeaway: exercise.takeaway,
        model: exercise.model,
        exercise: { label: exercise.label, page: exercise.page },
      },
    ]),
  ),
  "storage-opening": {
    sections: ["11.1", "11.2", "11.3", "11.4", "11.5", "11.6", "11.7", "11.8"],
    slides: [1, 2, 3],
    takeaway:
      "Bölüm 11 aygıt yapısı, HDD ve NVM zamanlaması, hata kontrolü, aygıt yönetimi, swap, bağlantı ve RAID konularını içerir.",
    model:
      "Sekiz bölüm başlığı resmî içindekiler sırasındadır. Türkçe başlıklar sunum için kısa karşılıklardır.",
  },
  "why-error-detection": {
    sections: ["11.4"],
    slides: [27],
    takeaway:
      "Saklama veya aktarım sırasında bitler değişebilir. Denetim bilgisi bozulmayı saptamak için kullanılır; hata saptanınca işlem durdurulabilir.",
    model:
      "1011001 → 1001001 değişimi özgün bir öğretim örneğidir. Saklama/okuma yolu kavramsaldır; belirli bir fiziksel arıza nedeni veya oranı modellenmez.",
  },
  "error-detection": {
    sections: ["11.4"],
    slides: [27],
    takeaway:
      "Veriyle saklanan denetim bilgisi bazı bozulmaları saptar; tek paritenin geçmesi kesin veri doğruluğu değildir.",
    model:
      "1011001 ve sabit P=0 özgün çift parite örneğidir. Değişen bit işaretleri anlatıcının eklediği hataları gösterir; denetleyicinin bulduğu konumlar değildir. Parite basit bir checksum türü olarak gösterilir; CRC/checksum için sahte hesap sonucu üretilmez.",
  },
  "error-correction": {
    sections: ["11.4"],
    slides: [27],
    takeaway:
      "ECC bazı hataları hem tespit eder hem düzeltebilir. Kodun sınırları içindeki soft error düzeltilebilir; hard error saptansa da ECC fiziksel arızayı onaramaz.",
    model:
      "1011 → 1001 → 1011 özgün örneği gerçek kod çözme hesabını kullanır; ECC bilgisi kavramsal kutudur. Hamming yerleşimi, sendrom ve evrensel bit sınırı öğretilmez. Son hard error şeması ayrı bir kavramdır, iki bit hatası veya fiziksel arıza simülasyonu değildir.",
  },
  "device-preparation": {
    sections: ["11.5"],
    slides: [28, 29],
    takeaway:
      "Fiziksel biçimlendirme, bölümleme, dosya sistemi oluşturma ve bağlama farklı hazırlık katmanlarıdır.",
    model:
      "60/40 bölümler ve örnek dosya özgün eğitim durumudur. Gerçek format işlemi yapılmaz; geri aşama seçimi gerçek aygıtta geri alma garantisi değildir.",
  },
  "storage-access-modes": {
    sections: ["11.5"],
    slides: [28, 29, 30],
    takeaway:
      "Dosya sistemi blokların üstünde düzen kurar; uygun uygulamalar kendi blok yönetimleri için raw erişim de isteyebilir.",
    model:
      "Cluster grupları ve veritabanı yolu kavramsal örnektir; grup boyutu standart değildir. Raw erişim bütün OS sürücülerinin ortadan kalktığı anlamına gelmez.",
  },
  "boot-sequence": {
    sections: ["11.5"],
    slides: [29, 30],
    takeaway:
      "Firmware ve depolamadaki yükleyici kodu, kernel'in RAM'e yüklenip başlatılmasını sağlar.",
    model:
      "Bootstrap/boot block kavramlarının soyut akışıdır. Kitaptaki Windows/MBR bağlamı belirli bir örnektir; bütün platformlar için tek açılış düzeni varsayılmaz.",
  },
  "bad-block-remapping": {
    sections: ["11.5"],
    slides: [30],
    takeaway:
      "Sorunlu fiziksel sektör yedek alana eşlenirken üst katmanın mantıksal blok adresi korunabilir.",
    model:
      "LBA 5, P45 ve P90 özgün öğretim kimlikleridir. Adres devamlılığı eski okunamayan verinin kesin kurtarılması değildir; üretici remap politikası modellenmez.",
  },
  "swap-space": {
    sections: ["11.6"],
    slides: [31],
    takeaway:
      "Swap, RAM dışına taşınan içerik için arka alan sağlar; dosya/bölüm yerleşimi ve I/O yükünün dağıtılması ayrı kararlardır.",
    model:
      "Alan ve aygıt sayıları özgün şemadır. Hız çarpanı, evrensel swap kapasitesi veya güncel Linux veri yapısı iddiası üretilmez.",
  },
  "swap-journey": {
    sections: ["11.6"],
    slides: [31],
    takeaway:
      "Sayfa kimliği, RAM frame ve swap konumu farklıdır; aktarımın başlaması ve tamamlanması ayrı durumlardır.",
    model:
      "Tek P/F0/S0 modeli özgün ve basitleştirilmiştir. 1 yazma ve 1 okuma açık tamamlanma aşamalarında sayılır. Page-in sonunda slot'u bırakmak model tercihidir, evrensel OS politikası değildir.",
  },
  "management-decisions": {
    sections: ["11.4", "11.5", "11.6"],
    slides: [27, 28, 29, 30, 31],
    takeaway:
      "Doğruluk kontrolü, aygıtın mantıksal hazırlığı ve swap aktarım yönetimi ayrı bilgi ve durum gerektirir.",
    model:
      "Üç soru/cevap çifti özgün sentezdir. Yanıt görünürlüğü ortak aşamaya bağlıdır; bağımsız veya geriye gitmeyen bir cevap hafızası tutulmaz.",
  },
  "host-attached": {
    sections: ["11.7"],
    slides: [15, 32],
    takeaway:
      "Bağlantı yolu ile istemciye sunulan dosya, blok veya API arayüzü ayrı eksenlerdir.",
    model:
      "Yerel port, bus ve fabric kavramsal çizimlerdir; aygıt/protokol hızı ölçülmez ve üç evrensel, birbirini dışlayan ürün sınıfı oluşturulmaz.",
  },
  nas: {
    sections: ["11.7"],
    slides: [33],
    takeaway:
      "NAS uzak dosya sistemi hizmeti verir; aynı IP ağı üzerindeki iSCSI ise SCSI/blok erişimi taşıyabilir.",
    model:
      "Tipik istemci/sunucu sorumluluklarının özgün şemasıdır. NFS/CIFS kaynak bağlamıdır; iSCSI NAS dosya protokolü olarak etiketlenmez.",
  },
  "cloud-storage": {
    sections: ["11.7"],
    slides: [34],
    takeaway:
      "Kitabın bulut örneğinde program uzak veri merkezine API üzerinden ulaşır; gecikme ve başarısızlık tasarımın parçasıdır.",
    model:
      "Yerel istek şemasıdır; gerçek API çağrısı veya güncel bulut ürünleri sınıflandırması yapılmaz. API fiziksel bir aygıt değildir.",
  },
  "storage-arrays": {
    sections: ["11.7"],
    slides: [35],
    takeaway:
      "Storage array host bağlantılarını, denetleyiciyi ve aygıtları birleştirir; RAID ve snapshot gibi hizmetler aynı kavram değildir.",
    model:
      "Diskler ve denetleyici temsildir. Kitabın doğrudan dizi/NAS ağ yükü karşılaştırması bütün diziler ağsızdır biçiminde genellenmez.",
  },
  san: {
    sections: ["11.7"],
    slides: [33, 36, 37],
    takeaway:
      "SAN çok host ve diziyi bağlar; belirli hacimlerin hostlara görünürlüğü dosya sistemi koordinasyonundan ayrı bir karardır.",
    model:
      "LUN görünürlüğü çizimde değişir; gerçek ağ, yetkilendirme veya küme dosya sistemi kurulmaz. Kaynaktaki FC/InfiniBand ve iSCSI/FCoE bağlamı korunur.",
  },
  "raid-intro": {
    sections: ["11.8"],
    slides: [38, 39],
    takeaway:
      "Yedeklilik ve onarım birlikte değerlendirilir; onarım tamamlanana kadar ek arızaya maruz kalınan pencere önemlidir.",
    model:
      "MTTF/MTTR ilişkisi kavramsaldır. Kaynak metin çıkarımında bozuk görünen ömür sayısı/formülü kullanılmaz; bağımsız arıza varsayımı garantiye dönüştürülmez.",
  },
  "raid-striping": {
    sections: ["11.8"],
    slides: [39, 40],
    takeaway:
      "Şeritleme tek başına koruma sağlamaz; aynalama sağlam kopya karşılığında fiziksel alan kullanır.",
    model:
      "Dört diskli RAID0 ve iki diskli RAID1 özgün eş kapasiteli örneklerdir. Nominal kapasite ile erişilebilirlik ayrı gösterilir; performans çarpanı üretilmez.",
  },
  "raid-parity": {
    sections: ["11.8"],
    slides: [39, 40],
    takeaway:
      "RAID4/5 tek P korumasını farklı yerleştirir; RAID6 ikinci bağımsız korumayla iki tam disk kaybını karşılayabilir.",
    model:
      "Eş boyutlu disk/şerit gösterimi özgündür. RAID6 Q cebiri semboliktir; aynı XOR bilgisinin ikinci kopyası iki bağımsız denklem diye sunulmaz.",
  },
  "raid-xor": {
    sections: ["11.8"],
    slides: [39, 40],
    takeaway:
      "Tek kayıp blok sağlam veri ve P üzerinden yeniden hesaplanabilir; aynı denklem iki bilinmeyeni çözmez.",
    model:
      "1100,1010,0110 ve 0000 bitleri özgün eğitim örneğidir, kitabın hazır sayısal örneği değildir. XOR sonucu gerçekten sağlam hücrelerden hesaplanır.",
  },
  "raid-levels": {
    sections: ["11.8"],
    slides: [40],
    takeaway:
      "Resmî slayt40 çok boyutlu RAID6 yerleşimini de gösterir; yalnız seviye adından evrensel hata garantisi çıkarılmaz.",
    model:
      "Kaynak figürünü açıklayan dar bir yerleşim şemasıdır; GF cebiri, keyfî boyutlarda kapasite veya arıza garantisi hesaplanmaz. Kaynakta doğrulanmayan RAID2/3 eklenmez.",
  },
  "raid-nested": {
    sections: ["11.8"],
    slides: [39, 41],
    takeaway:
      "Şeritleme ve aynalamanın sırası, bir disk kaybının hangi koruma grubunu etkilediğini değiştirir.",
    model:
      "Slayt41 kavramının özgün dört diskli indirgemesidir. 0+1 şerit grupları ve 1+0 ayna çiftleri açıkça çizilir; aynı fiziksel kayıp seçiminde farklı sonuç gerçekten hesaplanır.",
  },
  "raid-rebuild": {
    sections: ["11.8"],
    slides: [38, 39, 42],
    takeaway:
      "Yedek disk devreye girse bile eksik içerik tamamlanana kadar tam koruma geri gelmez; rebuild yeterli sağlam bilgi gerektirir.",
    model:
      "Üç temsili şerit özgün durum modelidir; gerçek süre/bant genişliği tahmini değildir. Backspace kısmi şerit durumunu ve eksik hücreleri geri kurar.",
  },
  "raid-features": {
    sections: ["11.8"],
    slides: [35, 39, 42],
    takeaway:
      "Snapshot geçmiş görünümü, replication siteler arası yazı kopyasını, hot spare arızalı aygıtın yerine geçmeyi hedefler.",
    model:
      "Özgün zaman/yazı akışı şemasıdır; gerçek snapshot veya uzak kopya oluşturulmaz. Senkron/asenkron ayrımı onay sırasıyla gösterilir; RPO/RTO veya bağımsız yedek garantisi üretilmez.",
  },
  "raid-integrity": {
    sections: ["11.8"],
    slides: [43],
    takeaway:
      "RAID disk arızasına odaklanır; kaynakta ZFS veri ve metadata bütünlüğünü checksum ile de denetler.",
    model:
      "Checksum ve pointer ilişkisi kavramsal gösterilir. C1/C2 adları kullanılırsa temsili olduğu belirtilir; tek checksumdan doğru veri üretildiği veya her hata yakalandığı iddia edilmez.",
  },
  "storage-pools": {
    sections: ["11.8"],
    slides: [43, 44],
    takeaway:
      "Havuz yaklaşımında dosya sistemleri ortak alanı kullanıp bırakabilir; yönetim sınırları değişir, fiziksel kapasite sınırlı kalır.",
    model:
      "Küçük alan sayıları özgün örnek olabilir; toplam kapasite korunur. Slayt43–44 ZFS bağlamıdır; tüm dosya sistemleri için güncel bir özellik genellemesi değildir.",
  },
  "object-storage": {
    sections: ["11.8"],
    slides: [45, 46],
    takeaway:
      "Program nesne kimliğiyle erişir; yerleştirme, koruma ve birden çok sistemde kopyaları depolama yönetim yazılımı düzenleyebilir.",
    model:
      "Oluştur/eriş/sil ve kopya yerleştirme özgün sonlu örneklerdir. Silinmiş nesne sonraki aşamada nedensiz geri gelmez; yerleştirme için yeni örnek açıkça başlatılır. Güncel HDFS/Ceph mimarisi iddiası eklenmez.",
  },
  "io-journey": {
    sections: ["11.1", "11.2", "11.3", "11.4", "11.5", "11.6", "11.7", "11.8"],
    slides: [7, 11, 15, 17, 18, 27, 31, 33, 35, 37, 39, 43, 45, 46],
    takeaway:
      "Aygıt, kuyruk, yönetim, bağlantı ve koruma aynı depolama sistemindeki farklı sorumluluklardır.",
    model:
      "Bölümün özgün bütünleştirme yoludur; tek zorunlu mimari veya gerçek I/O zaman çizelgesi değildir. RAID her sistemde, swap her dosya okumasında zorunlu aşama değildir.",
  },
  "storage-wrap-up": {
    sections: ["11.1", "11.2", "11.3", "11.4", "11.5", "11.6", "11.7", "11.8"],
    slides: [3, 7, 17, 18, 38, 39, 41, 42, 43],
    takeaway:
      "İş yükü, gecikme, hata modeli ve geri dönüş ihtiyacı birlikte tanımlanır; tek hız veya kapasite sayısı tasarımı belirlemez.",
    model:
      "Özgün kapanış ve gerekçeli değerlendirme kartlarıdır; notlandırma, ürün önerisi veya üretim sistemi yapılandırması üretilmez. Soru geldiğinde semantic konuya dönülür.",
  },
};

/** Compact locators preserve gaps: [4, 9, 12] must not become '4–12'. */
export function formatSlideNumbers(slides: readonly number[]): string {
  const ranges: string[] = [];
  for (let i = 0; i < slides.length; i++) {
    const start = slides[i];
    let end = start;
    while (i + 1 < slides.length && slides[i + 1] === end + 1)
      end = slides[++i];
    ranges.push(start === end ? String(start) : `${start}–${end}`);
  }
  return ranges.join(", ");
}
