/** Chapter stories. Source references live in presentation/textbook.ts. */
export const attachmentStoryData = [
  {
    id: "storage-attachment",
    title: "Storage Attachment",
    chapter: "11.7",
    presenterId: 4,
    kind: "chapter",
    seconds: 40,
    legacyIds: [],
    stages: [
      "Üç temel bağlantı yaklaşımı",
      "Host-attached",
      "Network-attached",
      "Cloud",
    ],
    takeaway:
      "Kitap depolamaya erişimi host-attached, network-attached ve cloud yaklaşımlarıyla tanıtır.",
    model:
      "Üç özgün donanım/bağlantı çizimi kaynak slayt 32’nin girişini görselleştirir. SAN bu üçünün yerine geçen bir sınıflandırma olarak sunulmaz. Paket hareketi aygıt hızı değildir.",
  },
  {
    id: "host-attached",
    title: "Host-attached: yerel I/O bağlantısı",
    chapter: "11.7",
    presenterId: 4,
    kind: "chapter",
    seconds: 30,
    legacyIds: ["s26"],
    stages: [
      "Yerel I/O portu",
      "Host’tan aygıta istek",
      "Bus ile birden çok aygıt",
    ],
    takeaway:
      "Host-attached erişim yerel I/O portunu kullanır. Bir depolama bus’ı birden çok aygıtı bağlayabilir.",
    model:
      "Yerel port ve iki aygıtlı bus özgün kavramsal çizimlerdir. USB, FireWire, Thunderbolt ve FC kaynak örnekleridir. Aygıt veya protokol hızı ölçülmez.",
  },
  {
    id: "nas",
    title: "Network-attached: ağdan depolamaya",
    chapter: "11.7",
    presenterId: 4,
    kind: "chapter",
    seconds: 45,
    legacyIds: ["s27"],
    stages: [
      "NAS ile uzak dosya sistemi",
      "NFS / CIFS ve uzak çağrı",
      "Dosyadan depolama bloklarına",
      "iSCSI ile IP üzerinden blok erişimi",
    ],
    takeaway:
      "NAS uzak dosya sistemi hizmeti verir; aynı IP ağı üzerindeki iSCSI ise SCSI/blok erişimi taşıyabilir.",
    model:
      "Tipik istemci/sunucu sorumluluklarının özgün şemasıdır. NFS/CIFS kaynak bağlamıdır; iSCSI NAS dosya protokolü olarak etiketlenmez.",
  },
  {
    id: "cloud-storage",
    title: "Cloud: Internet üzerinden API erişimi",
    chapter: "11.7",
    presenterId: 4,
    kind: "chapter",
    seconds: 30,
    legacyIds: ["s28"],
    stages: [
      "Program ve hizmet API’si",
      "Internet / WAN üzerinden istek",
      "Uzak veri merkezi ve yanıt",
      "Gecikme ve başarısızlık",
    ],
    takeaway:
      "Kitabın bulut örneğinde program uzak veri merkezine API üzerinden ulaşır; gecikme ve başarısızlık tasarımın parçasıdır.",
    model:
      "Yerel istek şemasıdır; gerçek API çağrısı veya güncel bulut ürünleri sınıflandırması yapılmaz. API fiziksel bir aygıt değildir.",
  },
  {
    id: "storage-arrays",
    title: "Depolama dizisi: denetleyici ve diskler",
    chapter: "11.7",
    presenterId: 4,
    kind: "chapter",
    seconds: 45,
    legacyIds: ["s29"],
    stages: [
      "Tek disk ve depolama dizisi",
      "Host portları",
      "Denetleyici, bellek ve diskler",
      "Birden çok host ve SAN bağlantısı",
    ],
    takeaway:
      "Depolama dizisi host portlarını, denetleyiciyi, belleği, yönetim yazılımını ve diskleri birleştirir.",
    model:
      "Diskler ve denetleyici temsildir. Kitabın doğrudan dizi/NAS ağ yükü karşılaştırması bütün diziler ağsızdır biçiminde genellenmez.",
  },
  {
    id: "san",
    title: "Storage Area Network (SAN)",
    chapter: "11.7",
    presenterId: 4,
    kind: "chapter",
    seconds: 45,
    legacyIds: [],
    stages: [
      "Host’lar ve depolama dizileri",
      "FC switch / InfiniBand ve istek yolu",
      "LUN masking: Host A",
      "LUN masking: Host B",
      "Depolama ağı ve iletişim ağı",
    ],
    takeaway:
      "SAN birden çok host ile depolama dizisini bağlar. LUN masking belirli birimleri belirli host’lara sunar.",
    model:
      "İki host, iki dizi ve iki LUN özgün örnektir. Fiziksel bağlantılar sabit kalır, görünür birim ve seçili erişim yolu vurgulanır. Gerçek ağ kurulmaz. Kaynaktaki FC/InfiniBand ve iSCSI/FCoE bağlamı korunur.",
  },
  {
    id: "nas-san-comparison",
    title: "NAS ve SAN",
    chapter: "11.7",
    presenterId: 4,
    kind: "chapter",
    seconds: 45,
    legacyIds: [],
    stages: [
      "Dosya ve blok erişimi",
      "Bağlantı ve protokoller",
      "Dosya sisteminin yeri",
    ],
    takeaway:
      "NAS dosya sistemi hizmeti sunar. SAN host’lara depolama bloklarını ulaştırır. Dosya sistemi sorumluluğu farklı uçlardadır.",
    model:
      "Slayt 33 ve 36–37’nin özgün karşılaştırmasıdır. Dosya sistemi konumu, NAS dosya hizmeti ile SAN blok erişiminden çıkarılan tipik sorumluluk ayrımıdır. Hız, fiyat veya tüm ürünler için bir üstünlük iddiası eklenmez. iSCSI, IP üzerinden blok erişiminin kaynak örneğidir.",
  },
  {
    id: "raid-intro",
    title: "Yedeklilik ve onarım penceresi",
    chapter: "11.8",
    presenterId: 4,
    kind: "chapter",
    seconds: 45,
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
    seconds: 60,
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
    seconds: 60,
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
    id: "raid-nested",
    title: "Önce ayna mı, önce şerit mi?",
    chapter: "11.8",
    presenterId: 4,
    kind: "chapter",
    seconds: 60,
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
    seconds: 75,
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
    seconds: 45,
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
    seconds: 45,
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
    seconds: 30,
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
    seconds: 45,
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
    seconds: 60,
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
    seconds: 60,
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
