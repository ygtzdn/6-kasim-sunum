/** Exact V3 presentation contract, merged in docs/14. Source references live in presentation/textbook.ts. */
export const attachmentStoryData = [
  {
    id: "host-attached",
    title: "Depolamaya hangi yoldan ulaşırız?",
    chapter: "11.7",
    presenterId: 4,
    kind: "chapter",
    depth: "core",
    seconds: {
      core: 30,
      full: 50,
    },
    legacyIds: ["s26"],
    stages: [
      "Bağlantı sorusu",
      "Host portu ve aygıt",
      "Bus ile birden çok aygıt",
      "FC fabric örneği",
      "Bağlantı yolu ve hizmet arayüzü",
    ],
    takeaway:
      "Bağlantı yolu ile istemciye sunulan dosya, blok veya API arayüzü ayrı eksenlerdir.",
    model:
      "Yerel port, bus ve fabric kavramsal çizimlerdir; aygıt/protokol hızı ölçülmez ve üç evrensel, birbirini dışlayan ürün sınıfı oluşturulmaz.",
  },
  {
    id: "nas",
    title: "Ağda dosya mı, blok mu?",
    chapter: "11.7",
    presenterId: 4,
    kind: "chapter",
    depth: "core",
    seconds: {
      core: 45,
      full: 75,
    },
    legacyIds: ["s27"],
    stages: [
      "Dosya yolu isteği",
      "NFS ve CIFS",
      "IP üzerinde uzak çağrı",
      "Sunucuda dosya sistemi",
      "iSCSI ile blok karşı örneği",
      "Dosya ve blok sorumluluğu",
    ],
    takeaway:
      "NAS uzak dosya sistemi hizmeti verir; aynı IP ağı üzerindeki iSCSI ise SCSI/blok erişimi taşıyabilir.",
    model:
      "Tipik istemci/sunucu sorumluluklarının özgün şemasıdır. NFS/CIFS kaynak bağlamıdır; iSCSI NAS dosya protokolü olarak etiketlenmez.",
  },
  {
    id: "cloud-storage",
    title: "Uzak depolamaya API ile erişim",
    chapter: "11.7",
    presenterId: 4,
    kind: "chapter",
    depth: "core",
    seconds: {
      core: 30,
      full: 50,
    },
    legacyIds: ["s28"],
    stages: [
      "Uygulama işlemi",
      "WAN ve Internet yolu",
      "Hizmet API arayüzü",
      "Uzak hizmet ve yanıt",
      "Gecikme ve başarısızlık",
    ],
    takeaway:
      "Kitabın bulut örneğinde program uzak veri merkezine API üzerinden ulaşır; gecikme ve başarısızlık tasarımın parçasıdır.",
    model:
      "Yerel istek şemasıdır; gerçek API çağrısı veya güncel bulut ürünleri sınıflandırması yapılmaz. API fiziksel bir aygıt değildir.",
  },
  {
    id: "storage-arrays",
    title: "Bir depolama dizisinin içi",
    chapter: "11.7",
    presenterId: 4,
    kind: "chapter",
    depth: "core",
    seconds: {
      core: 45,
      full: 65,
    },
    legacyIds: ["s29"],
    stages: [
      "Tek aygıttan diziye",
      "Host portları ve denetleyici",
      "Bellek, yazılım ve diskler",
      "Paylaşım ve hizmetler",
      "Dizi özelliği ile RAID seviyesi",
    ],
    takeaway:
      "Storage array host bağlantılarını, denetleyiciyi ve aygıtları birleştirir; RAID ve snapshot gibi hizmetler aynı kavram değildir.",
    model:
      "Diskler ve denetleyici temsildir. Kitabın doğrudan dizi/NAS ağ yükü karşılaştırması bütün diziler ağsızdır biçiminde genellenmez.",
  },
  {
    id: "san",
    title: "Birçok host, birçok dizi",
    chapter: "11.7",
    presenterId: 4,
    kind: "chapter",
    depth: "core",
    seconds: {
      core: 45,
      full: 70,
    },
    legacyIds: [],
    stages: [
      "Hostlar ve diziler",
      "Switch ve fabric",
      "Depolama yolu",
      "LUN ve hacimler",
      "LUN masking ile görünürlük",
      "Ayrı ağlar ve arayüz ayrımı",
    ],
    takeaway:
      "SAN çok host ve diziyi bağlar; belirli hacimlerin hostlara görünürlüğü dosya sistemi koordinasyonundan ayrı bir karardır.",
    model:
      "LUN görünürlüğü çizimde değişir; gerçek ağ, yetkilendirme veya küme dosya sistemi kurulmaz. Kaynaktaki FC/InfiniBand ve iSCSI/FCoE bağlamı korunur.",
  },
  {
    id: "raid-intro",
    title: "Yedeklilik ve onarım penceresi",
    chapter: "11.8",
    presenterId: 4,
    kind: "chapter",
    depth: "core",
    seconds: {
      core: 45,
      full: 70,
    },
    legacyIds: [],
    stages: [
      "Kapasite, paralellik ve güvenilirlik",
      "Bağımsız sağlam kopya",
      "Disk arızası ve MTTF",
      "Onarım penceresi ve MTTR",
      "Veri kaybı ve varsayımlar",
    ],
    takeaway:
      "Yedeklilik ve onarım birlikte değerlendirilir; onarım tamamlanana kadar ek arızaya maruz kalınan pencere önemlidir.",
    model:
      "MTTF/MTTR ilişkisi kavramsaldır. Kaynak metin çıkarımında bozuk görünen ömür sayısı/formülü kullanılmaz; bağımsız arıza varsayımı garantiye dönüştürülmez.",
  },
  {
    id: "raid-striping",
    title: "Veriyi dağıtmak mı, kopyalamak mı?",
    chapter: "11.8",
    presenterId: 4,
    kind: "chapter",
    depth: "core",
    seconds: {
      core: 60,
      full: 95,
    },
    legacyIds: ["s30"],
    stages: [
      "RAID 0 parçaları",
      "RAID 0 tek disk kaybı",
      "RAID 1 aynı kopyalar",
      "RAID 1 bir sağlam kopya",
      "RAID 1 iki kopya kaybı",
      "Kapasite ve koruma karşılığı",
    ],
    takeaway:
      "Şeritleme tek başına koruma sağlamaz; aynalama sağlam kopya karşılığında fiziksel alan kullanır.",
    model:
      "Dört diskli RAID0 ve iki diskli RAID1 özgün eş kapasiteli örneklerdir. Nominal kapasite ile erişilebilirlik ayrı gösterilir; performans çarpanı üretilmez.",
  },
  {
    id: "raid-parity",
    title: "Koruma bilgisini nereye koyarız?",
    chapter: "11.8",
    presenterId: 4,
    kind: "chapter",
    depth: "core",
    seconds: {
      core: 60,
      full: 95,
    },
    legacyIds: ["s31"],
    stages: [
      "Veri ve P ilişkisi",
      "RAID 4 ayrılmış parite",
      "RAID 5 dağıtılmış parite",
      "Tek kayıp ve yeterli bilgi",
      "RAID 6 bağımsız P ve Q",
      "Parite seviyelerini karşılaştır",
    ],
    takeaway:
      "RAID4/5 tek P korumasını farklı yerleştirir; RAID6 ikinci bağımsız korumayla iki tam disk kaybını karşılayabilir.",
    model:
      "Eş boyutlu disk/şerit gösterimi özgündür. RAID6 Q cebiri semboliktir; aynı XOR bilgisinin ikinci kopyası iki bağımsız denklem diye sunulmaz.",
  },
  {
    id: "raid-xor",
    title: "Kayıp bloğu sağlam bilgilerden üret",
    chapter: "11.8",
    presenterId: 4,
    kind: "chapter",
    depth: "extension",
    seconds: {
      core: 0,
      full: 70,
    },
    legacyIds: [],
    stages: [
      "Üç veri bloğu",
      "P paritesini hesapla",
      "A1 kayıp: önce tahmin et",
      "Sağlam hücrelerden A1 üret",
      "İkinci bilinmeyenin sınırı",
    ],
    takeaway:
      "Tek kayıp blok sağlam veri ve P üzerinden yeniden hesaplanabilir; aynı denklem iki bilinmeyeni çözmez.",
    model:
      "1100,1010,0110 ve 0000 bitleri özgün eğitim örneğidir, kitabın hazır sayısal örneği değildir. XOR sonucu gerçekten sağlam hücrelerden hesaplanır.",
  },
  {
    id: "raid-levels",
    title: "Koruma bilgisini iki boyutta yerleştirmek",
    chapter: "11.8",
    presenterId: 4,
    kind: "chapter",
    depth: "extension",
    seconds: {
      core: 0,
      full: 35,
    },
    legacyIds: [],
    stages: [
      "Bilinen RAID seviye haritası",
      "P ve Q yerleşimi",
      "İki boyutlu aygıt düzeni",
      "Satır ve sütun koruma rolleri",
    ],
    takeaway:
      "Resmî slayt40 çok boyutlu RAID6 yerleşimini de gösterir; yalnız seviye adından evrensel hata garantisi çıkarılmaz.",
    model:
      "Kaynak figürünü açıklayan dar bir yerleşim şemasıdır; GF cebiri, keyfî boyutlarda kapasite veya arıza garantisi hesaplanmaz. Kaynakta doğrulanmayan RAID2/3 eklenmez.",
  },
  {
    id: "raid-nested",
    title: "Önce ayna mı, önce şerit mi?",
    chapter: "11.8",
    presenterId: 4,
    kind: "chapter",
    depth: "core",
    seconds: {
      core: 60,
      full: 85,
    },
    legacyIds: ["s32"],
    stages: [
      "Aynı diskler, iki gruplama",
      "0+1: şerit gruplarını aynala",
      "0+1: bir disk ve grup kaybı",
      "1+0: aynaları şeritle",
      "1+0: bir ayna kopyası kayıp",
      "D0 ve D1 sonuçları",
      "D0 ve D2 sonuçları",
    ],
    takeaway:
      "Şeritleme ve aynalamanın sırası, bir disk kaybının hangi koruma grubunu etkilediğini değiştirir.",
    model:
      "Slayt41 kavramının özgün dört diskli indirgemesidir. 0+1 şerit grupları ve 1+0 ayna çiftleri açıkça çizilir; aynı fiziksel kayıp seçiminde farklı sonuç gerçekten hesaplanır.",
  },
  {
    id: "raid-rebuild",
    title: "Boş yedek nasıl sağlam kopya olur?",
    chapter: "11.8",
    presenterId: 4,
    kind: "chapter",
    depth: "core",
    seconds: {
      core: 75,
      full: 105,
    },
    legacyIds: ["s33"],
    stages: [
      "Sağlıklı dizi ve boş hot spare",
      "D0 arızası",
      "Yedek devrede, içerik boş",
      "Birinci şerit yeniden kuruldu",
      "İkinci şerit yeniden kuruldu",
      "Son şerit ve korumanın dönüşü",
      "Onarım maliyeti ve sınırı",
    ],
    takeaway:
      "Yedek disk devreye girse bile eksik içerik tamamlanana kadar tam koruma geri gelmez; rebuild yeterli sağlam bilgi gerektirir.",
    model:
      "Üç temsili şerit özgün durum modelidir; gerçek süre/bant genişliği tahmini değildir. Backspace kısmi şerit durumunu ve eksik hücreleri geri kurar.",
  },
  {
    id: "raid-features",
    title: "Snapshot, replication ve hot spare",
    chapter: "11.8",
    presenterId: 4,
    kind: "chapter",
    depth: "core",
    seconds: {
      core: 45,
      full: 70,
    },
    legacyIds: [],
    stages: [
      "Üç ayrı ihtiyaç",
      "Snapshot: zamandaki görünüm",
      "Replication: iki site",
      "Senkron ve asenkron yazı akışı",
      "Hot spare ve onarım penceresi",
      "Özelliklerin görevlerini ayır",
    ],
    takeaway:
      "Snapshot geçmiş görünümü, replication siteler arası yazı kopyasını, hot spare arızalı aygıtın yerine geçmeyi hedefler.",
    model:
      "Özgün zaman/yazı akışı şemasıdır; gerçek snapshot veya uzak kopya oluşturulmaz. Senkron/asenkron ayrımı onay sırasıyla gösterilir; RPO/RTO veya bağımsız yedek garantisi üretilmez.",
  },
  {
    id: "raid-integrity",
    title: "Disk çalışırken veri bozulabilir",
    chapter: "11.8",
    presenterId: 4,
    kind: "chapter",
    depth: "core",
    seconds: {
      core: 45,
      full: 65,
    },
    legacyIds: ["s34"],
    stages: [
      "Sağlam disk, değişmiş içerik",
      "Veri ve metadata checksum",
      "Pointer ile kontrol bilgisi",
      "İçerik ve kimlik uyuşmazlığı",
      "Tespit ve düzeltme sınırı",
    ],
    takeaway:
      "RAID disk arızasına odaklanır; kaynakta ZFS veri ve metadata bütünlüğünü checksum ile de denetler.",
    model:
      "Checksum ve pointer ilişkisi kavramsal gösterilir. C1/C2 adları kullanılırsa temsili olduğu belirtilir; tek checksumdan doğru veri üretildiği veya her hata yakalandığı iddia edilmez.",
  },
  {
    id: "storage-pools",
    title: "Sabit sınırlar mı, ortak alan mı?",
    chapter: "11.8",
    presenterId: 4,
    kind: "chapter",
    depth: "core",
    seconds: {
      core: 30,
      full: 60,
    },
    legacyIds: [],
    stages: [
      "Geleneksel bölüm ve volume sınırları",
      "Bir dosya sistemi dolarken boş alan",
      "Diskleri ortak havuza ayır",
      "Havuzdan alan kullan",
      "Alan bırak ve farkı özetle",
    ],
    takeaway:
      "Havuz yaklaşımında dosya sistemleri ortak alanı kullanıp bırakabilir; yönetim sınırları değişir, fiziksel kapasite sınırlı kalır.",
    model:
      "Küçük alan sayıları özgün örnek olabilir; toplam kapasite korunur. Slayt43–44 ZFS bağlamıdır; tüm dosya sistemleri için güncel bir özellik genellemesi değildir.",
  },
  {
    id: "object-storage",
    title: "Nesneyi kimliğiyle bulmak",
    chapter: "11.8",
    presenterId: 4,
    kind: "chapter",
    depth: "core",
    seconds: {
      core: 45,
      full: 75,
    },
    legacyIds: [],
    stages: [
      "Havuzda veri nesnesi",
      "Oluştur ve ID al",
      "ID ile eriş",
      "ID ile sil",
      "Ayrı yerleştirme örneğinde N kopya",
      "Yeni sistemle yatay büyüme",
    ],
    takeaway:
      "Program nesne kimliğiyle erişir; yerleştirme, koruma ve birden çok sistemde kopyaları depolama yönetim yazılımı düzenleyebilir.",
    model:
      "Oluştur/eriş/sil ve kopya yerleştirme özgün sonlu örneklerdir. Silinmiş nesne sonraki aşamada nedensiz geri gelmez; yerleştirme için yeni örnek açıkça başlatılır. Güncel HDFS/Ceph mimarisi iddiası eklenmez.",
  },
] as const;

export const closingStoryData = [
  {
    id: "io-journey",
    title: "Bütün bölüm, tek istek",
    chapter: "Ortak kapanış",
    presenterId: 4,
    kind: "closing",
    depth: "core",
    seconds: {
      core: 60,
      full: 75,
    },
    legacyIds: ["s35"],
    stages: [
      "Bütün sistem görünümü",
      "Uygulama isteği",
      "OS kuyruğu",
      "Erişim arayüzü ve bağlantı",
      "Varsa dizi ve RAID",
      "HDD veya NVM aygıt maliyeti",
      "ECC ve veri bütünlüğü",
    ],
    takeaway:
      "Aygıt, kuyruk, yönetim, bağlantı ve koruma aynı depolama sistemindeki farklı sorumluluklardır.",
    model:
      "Bölümün özgün bütünleştirme yoludur; tek zorunlu mimari veya gerçek I/O zaman çizelgesi değildir. RAID her sistemde, swap her dosya okumasında zorunlu aşama değildir.",
  },
  {
    id: "storage-wrap-up",
    title: "Doğru tasarım için dört soru",
    chapter: "Ortak kapanış",
    presenterId: 4,
    kind: "closing",
    depth: "core",
    seconds: {
      core: 60,
      full: 75,
    },
    legacyIds: ["s36"],
    stages: [
      "Tasarım sorusu",
      "İş yükünü tanımla",
      "Gecikme bileşenlerini ayır",
      "Hata kapsamını belirt",
      "Bağımsız geri dönüş kopyası",
      "Birlikte değerlendir ve sorular",
    ],
    takeaway:
      "İş yükü, gecikme, hata modeli ve geri dönüş ihtiyacı birlikte tanımlanır; tek hız veya kapasite sayısı tasarımı belirlemez.",
    model:
      "Özgün kapanış ve gerekçeli değerlendirme kartlarıdır; notlandırma, ürün önerisi veya üretim sistemi yapılandırması üretilmez. Soru geldiğinde semantic konuya dönülür.",
  },
] as const;
