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
      "Bir depolama isteğini aygıt yapısı, işletim sistemi politikası, yönetim ve güvenilirlik kararları birlikte belirler.",
    model:
      "Açılış sorusu, fotoğraf vurguları ve Türkçe anlatım özgündür; gerçek I/O veya aygıt performansı ölçülmez.",
  },
  "presentation-map": {
    sections: ["11.1", "11.2", "11.3", "11.4", "11.5", "11.6", "11.7", "11.8"],
    slides: [2, 3],
    takeaway:
      "Donanım, zamanlama, veri ve alan yönetimi, bağlantı ve güvenilirlik aynı bölümün birbirini tamamlayan kararlarıdır.",
    model:
      "Sunuculara dağılım ve kısa/tam rota proje tasarımıdır; bu harita her I/O isteğinin zorunlu işlem sırası değildir.",
  },
  "hdd-anatomy": {
    sections: ["11.1"],
    slides: [4, 5],
    takeaway:
      "HDD’de kol konumlanması ve plaka dönüşü farklı işlerdir; normal okumada kafa yüzeye temas etmez.",
    model:
      "Gerçek fotoğrafın işaretleri ile özgün küçük yan kesit kullanılır; fotoğrafta görünmeyen fiziksel çizgiler varmış gibi sunulmaz.",
  },
  "hdd-geometry": {
    sections: ["11.1"],
    slides: [5, 14, 16],
    takeaway:
      "İz, sektör ve silindir farklı geometrik gruplardır; silindir tek bir yüzey parçası değildir.",
    model:
      "Özgün düz SVG geometri modelidir; gerçek aygıt geometrisi veya kaynaktaki şeklin birebir kopyası olduğu iddia edilmez.",
  },
  "hdd-access-cost": {
    sections: ["11.1"],
    slides: [4, 6, 7],
    takeaway:
      "Konumlandırma seek ve dönmedir; bu örneğin servis süresi aktarım ve denetleyici katkısını da içerir.",
    model:
      "Kaynak girdileri açık birimlerle hesaplanır: 4 KiB, 7200 RPM, 5 ms seek, 125 MB/s, 0,1 ms denetleyici. Kuyruk beklemesi dışarıdadır.",
  },
  "hdd-request-size": {
    sections: ["11.1"],
    slides: [7],
    takeaway:
      "Aktarım boyutu veya hızı değişince seek ve dönme aynı kalabilir; küçük I/O toplamı transfer hızıyla aynı oranda değişmez.",
    model:
      "İki istek boyutu aynı mekanik koşullarda karşılaştırılır; sonuçlar özgün birim gösterimiyle hesaplanır, ürün kıyası yapılmaz.",
  },
  "hdd-history": {
    sections: ["11.1"],
    slides: [8],
    takeaway:
      "Kitaptaki IBM Model 350 örneği depolamanın tarihsel ölçeğini gösterir; güncel ürün özelliklerini anlatmaz.",
    model:
      "Tarihsel bilgi kısa tipografi ve özgün sayma şemasıyla gösterilir; kapasite birimi sessizce modern MB değerine dönüştürülmez.",
  },
  "hdd-performance-metrics": {
    sections: ["11.1", "11.2"],
    slides: [6, 7, 17],
    takeaway:
      "Arayüz tavanı, etkin transfer, tek I/O gecikmesi ve toplam disk bandwidth’i aynı ölçü değildir.",
    model:
      "Kaynak sayıları tarihsel örnek olarak etiketlenir; farklı birimler aynı çubuk uzunluğuyla yanlış karşılaştırılmaz.",
  },
  "nvm-device": {
    sections: ["11.1"],
    slides: [9],
    takeaway:
      "Flash tabanlı SSD kalıcıdır ve hareketli parça taşımaz; bütün NVM biçimleri tek bir SSD ürünüyle aynı değildir.",
    model:
      "Mevcut gerçek SSD fotoğrafları temel görevler için kullanılır; fiyat, güncel hız, kapasite veya evrensel güvenilirlik iddiası eklenmez.",
  },
  "flash-page-block": {
    sections: ["11.1"],
    slides: [10, 11],
    takeaway:
      "Flash güncellemesi boş sayfaya gider; geçersiz sayfa yeniden yazılabilir boş sayfa değildir ve silme daha büyük blokta yapılır.",
    model:
      "İki küçük blok fiziksel kuralı öğretir. Tam FTL tablosu, GC canlı taşıması ve yazma büyütmesi hesabı burada tekrarlanmaz.",
  },
  "flash-endurance": {
    sections: ["11.1"],
    slides: [10, 11],
    takeaway:
      "Silme dayanıklılığı sınırlıdır; DWPD kapasiteye göre günlük yazma hacmi derecelendirmesidir, hücre silme sayısı değildir.",
    model:
      "1 TB × 5 DWPD = 5 TB/gün kaynaktaki örnektir. Garanti koşulu korunur; kesin ömür veya evrensel NAND silme limiti çıkarılmaz.",
  },
  "ram-disk": {
    sections: ["11.1"],
    slides: [4, 9, 12],
    takeaway:
      "RAM disk blok aygıtı ve dosya sistemi sunabilir; fiziksel ortamın uçuculuğunu değiştirmez.",
    model:
      "Kavramsal bitler ve gerçek RAM/HDD/SSD fotoğrafları kullanılır; fiziksel güç komutu gönderilmez ve tmpfs ayrıntısı genişletilmez.",
  },
  "magnetic-tape": {
    sections: ["11.1"],
    slides: [13],
    takeaway:
      "Teypte bir kaydın konumunu bulma ile o noktadan ardışık aktarım farklı işlerdir; rastgele seçim imkânsız diye sunulmaz.",
    model:
      "Özgün kayıt şeridi ve seçici kullanılır; gerçek süre, ürün hızı veya doğrulanmamış kitap alt bölümü verilmez.",
  },
  "logical-blocks": {
    sections: ["11.1"],
    slides: [14, 16],
    takeaway:
      "Disk OS’ye tek boyutlu mantıksal blok dizisi olarak görünür; LBA her aygıtta aynı fiziksel koordinatı garanti etmez.",
    model:
      "Küçük sıralı eşleme eğitim modelidir. Bozuk sektör ve değişken geometri notlarda anılır; yeniden eşleme demosu kişi3’e bırakılır.",
  },
  "storage-data-path": {
    sections: ["11.1", "11.2"],
    slides: [15, 18],
    takeaway:
      "Komutun controller’lar üzerinden iletilmesi ile verinin DMA ile DRAM’e aktarılması ayrı akışlardır.",
    model:
      "Özgün iki hatlı diyagram ve aşamadan türetilen payload konumu kullanılır; gerçek DMA protokolü veya ürün arayüz performansı ölçülmez.",
  },
  "hdd-request-queue": {
    sections: ["11.2"],
    slides: [17, 18, 19],
    takeaway:
      "Birden çok bekleyen istek sıralama seçimi doğurur; adil karşılaştırma kuyruk, kafa, sınırlar ve yönü sabit tutar.",
    model:
      "Resmî sekiz istek, kafa53 ve azalan ortak yön kullanılır. Bütün istekler başlangıçta hazırdır; yeni geliş veya gerçek bekleme süresi yoktur.",
  },
  "fcfs-path": {
    sections: ["11.2"],
    slides: [19, 20],
    takeaway:
      "FCFS geliş sırasını korur; resmî sekiz istek için tamamlanmış yol toplamı 640 silindir hareketidir.",
    model:
      "Saf motor her aşamada kafa, tamamlanan kimlikler ve toplamı yeniden hesaplar. Dikey olay sırası zaman ekseni değildir.",
  },
  "scan-path": {
    sections: ["11.2"],
    slides: [21, 22],
    takeaway:
      "Fiziksel0 ucuna giden azalan SCAN yolu236’dır; 14’te dönen LOOK yolu208 verir ve aynı davranış değildir.",
    model:
      "Resmî21.slaytın208 ifadesi açık fiziksel uç kuralıyla uyuşmaz. Tam kitap hatası iddia edilmeden iki yol ve hesap gösterilir.",
  },
  "cscan-path": {
    sections: ["11.2"],
    slides: [23, 24],
    takeaway:
      "C-SCAN dönüşte servis vermez, fakat 199 silindirlik fiziksel dönüş azalan örneğin386 toplamına dahildir.",
    model:
      "Ortak azalan yön kullanılır; kaynaktaki artan yönün382 sonucu alternatif olarak notlanır. Geri aşama toplamı ve servis durumunu birlikte geri kurar.",
  },
  "scheduling-tradeoffs": {
    sections: ["11.2"],
    slides: [17, 18, 19, 20, 21, 22, 23, 24, 25],
    takeaway:
      "Bu sabit kuyrukta kısa yol SCAN’indir; bekleme, adalet ve politika seçimi yalnız toplam mesafeden çıkarılmaz.",
    model:
      "Çubuklar hesaplanan toplamdır, adalet puanı değildir. Deadline/NOOP/CFQ anlatımı kaynağın tarihsel bağlamında tutulur.",
  },
  "nvm-scheduling": {
    sections: ["11.3", "11.1"],
    slides: [11, 15, 26],
    takeaway:
      "NVM’de mekanik seek yoktur; bitişik istek birleştirme, yazılım/kuyruk maliyeti ve denetleyici işleri sürer.",
    model:
      "L10/L11 birleşimi özgün örnektir. NVM ortamı, NVMe arayüzü ve FTL görevi ayrılır; kanal sayısı veya ürün hızı vaat edilmez.",
  },
  "flash-write-amplification": {
    sections: ["11.3", "11.1"],
    slides: [10, 11, 26],
    takeaway:
      "GC canlı sayfaları kopyalarken host yazması olmadan fiziksel yazmayı artırır; örnek3host/5fiziksel/1silme ile biter.",
    model:
      "Üçblok×dörtsayfa özgün senaryodur. Her aşama başlangıçtan saf tekrar ile kurulur;1,67 bütün SSD’lerin sabit oranı değildir.",
  },
  "nvm-management-summary": {
    sections: ["11.3", "11.1"],
    slides: [10, 11, 26],
    takeaway:
      "FTL, GC, wear leveling ve ayrılmış alan farklı görevlerdir; alanı geri kazanmak geçmiş aşınmayı geri almaz.",
    model:
      "Birikmiş sayaçlar ileri aşamalarda azalmaz; yeni19döngü B1+6/B2+6/B3+7 dağıtılır. Gerçek wear-leveling verimliliği veya ömür hesaplanmaz.",
  },
  "error-detection": {
    sections: ["11.4"],
    slides: [27],
    takeaway:
      "Veriyle saklanan denetim bilgisi bazı bozulmaları saptar; tek paritenin geçmesi kesin veri doğruluğu değildir.",
    model:
      "1011001 ve sabit P=0 özgün parite örneğidir. CRC/checksum için algoritma veya sahte hesap sonucu üretilmez.",
  },
  "error-correction": {
    sections: ["11.4"],
    slides: [27],
    takeaway:
      "Uygun ECC, tasarlandığı hata sınırları içinde bazı hataları düzeltebilir; tespit edilen her hata düzeltilemez.",
    model:
      "Gerçek SECDED hesabı genel ECC fikrini somutlaştıran özgün ve sınırlı örnektir; Hamming konumları/sendromu ana anlatıma alınmaz, kapasite bütün aygıtlara genellenmez.",
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
