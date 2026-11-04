# 06 — Kaynaklar ve kavram sözlüğü

**Güncelleme: 5 Kasım 2026.** Sahne bazında güncel kaynak eşlemesi `src/presentation/textbook.ts`, ortak ileri/geri akış sözleşmesi [12 — Tüm sahnelerde ileri/geri akış](12-tum-sahnelerde-ileri-geri-akis.md) içindedir. Önceki kaynak denetimi 10 numaralı planda kayıtlıdır.

## 1. Kaynak yaklaşımı

Temel eser: **Abraham Silberschatz, Peter B. Galvin, Greg Gagne — Operating System Concepts, Tenth Edition**, Chapter 11.

2 Kasım araştırması ve 5 Kasım 2026 revizyonunda resmî kitap sitesi, içindekiler ve 11. bölümün resmî PPTX dosyasındaki metinler incelendi. Tam kitap metni proje klasöründe bulunmuyor ve bu aşamada satır/sayfa düzeyinde karşılaştırılmadı. Bu nedenle başlıklar resmî içindekilerle doğrulanmış; ayrıntılı öğretim örnekleri ve etkileşim kuralları özgün proje tasarımı olarak yazılmıştır. Slayt görselleri bu dokümanlara kopyalanmadı.

Resmî PPTX’in 47 slaydının metni revizyonda yeniden incelendi. Her sahne bölüm ve slayt numarasına bağlandı. Özgün çizimler ve küçük durum modelleri kitabın şekillerinin eşdeğeri olarak sunulmaz. Tam kitap metniyle ileride yapılacak karşılaştırmada fark bulunursa içerik güncellenir; sunucu dağılımı korunur.

## 2. Birincil kaynaklar

| Kimlik | Kaynak | Bu projede kullanımı | Doğrulama durumu |
| --- | --- | --- | --- |
| osc10-home | [10. baskı resmî sitesi](https://os-book.com/OS10/index.html) | Kitap kimliği, yazarlar, resmî kaynaklara giriş | İncelendi |
| osc10-toc | [10. baskı içindekiler](https://os-book.com/OS10/toc-dir/toc.pdf) | 11.1–11.8 ana başlıkları ve bölüm sırası | İncelendi |
| osc10-slides-index | [Resmî slayt dizini](https://os-book.com/OS10/slide-dir/index.html) | 11. bölüm slayt bağlantısı ve kullanım notu | İncelendi |
| osc10-ch11-slides | [Chapter 11 PPTX](https://os-book.com/OS10/slide-dir/PPTX-dir/ch11.pptx) | Kapsam kontrolü; RAM disk, denetleyici, bulut, RAID/uzantılar | İndirilen dosyanın slayt metinleri incelendi; görseller aktarılmadı |
| osc10-review | [Chapter 11 review questions](https://os-book.com/OS10/review-dir/11-rev.pdf) | Kapsam ve soru derinliği kontrolü | İncelendi; sorular bu projeye kopyalanmadı |
| osc10-errata | [Resmî düzeltmeler dizini](https://os-book.com/OS10/errata-dir/index.html) | Uygulama öncesi kitap sürümüne uygun düzeltme takibi | Dizin, basılı sürüm ve ePub düzeltmeleri incelendi; bu revizyonda algoritmik bir bölüm düzeltmesi bulunmadı |

Resmî kaynakların bazı başlıkları sunum ile kitap arasında küçük ad farkları taşıyabilir: Kitap içindekilerindeki **Mass-Storage Structure** adı ana referanstır; slayt kapağında **Mass-Storage Systems** kullanılması bölümün farklı olduğu anlamına gelmez.

### Baskı ve güncellik notları

- OS8/OS9 veya Essentials kaynaklarının bölüm sırası 10. baskı yerine kullanılmaz.
- Global Edition'da sayfa numaraları farklılaşabilir; sahneler 11.x numarasına bağlanır.
- Resmî siteye bağlı Study Guide dosyasında eski bölüm numaraları görüldü; bu planın bölüm eşlemesi için kullanılmadı. Başlıkta “10th Ed” yazması tek başına eşleme doğrulaması değildir.
- Slaytlardaki kapasite, fiyat, arayüz yaygınlığı, erase ömrü ve RHEL 7 zamanlayıcı örnekleri güncel donanım/pazar iddiası olarak kullanılmaz.
- NVM ve flash sözcükleri eş anlamlılaştırılmaz: Flash tabanlı SSD modeli NVM ailesinin bir örneğidir.

## 3. Teknik uygulama kaynakları

Bu kaynaklar eğitim konusunun kitap kapsamını değiştirmek için değil, tarayıcı davranışlarını doğru tasarlamak için kullanılır.

| Kimlik | Kaynak | İlgili karar |
| --- | --- | --- |
| mdn-modules | [MDN — JavaScript modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) | Modüler statik yapı; HTTP üzerinden sunum |
| mdn-storage | [MDN — localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) | Tercih saklama; hata ve origin sınırları |
| mdn-fullscreen | [MDN — Fullscreen API](https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API) | Kullanıcı eylemiyle isteğe bağlı tam ekran |
| mdn-motion | [MDN — prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion) | Hareket azaltma tercihi |
| wcag22 | [W3C — WCAG 2.2](https://www.w3.org/TR/WCAG22/) | Klavye, kontrast, odak, renk dışı anlam ve yeniden akış hedefleri |

## 4. Kaynak ve özgün katkının ayrımı

**Kaynakla doğrulanan iskelet:** Eserin baskısı, bölüm başlıkları, ana konu alanları ve resmî eğitim materyalinin varlığı.

**Proje tasarımı:** 36 sahne, dört sunucuya göre akış, süreler, Türkçe açıklamalar, soru metinleri, demo parametreleri, algoritma sonlandırma kuralları, test girdileri, görsel sistem ve teknik mimari.

**Eğitim modeli sınırları:** HDD'de doğrusal hareket ölçümü, üç bloklu flash, tek bit parite, sınırlı swap senaryosu, soyut topoloji ve tam disk arızalı RAID modeli. Bunlar kitabın gerçek sistem davranışlarının eksiksiz simülatörü olduğu iddiasını taşımaz.

## 5. Atıf ve varlık kullanımı

Her sahne ilgili bölüm numarasını; kaynak paneli eser, baskı, yazar ve bağlantıları gösterir. Özgün çizimler projede üretilir. Kitap sayfaları veya slayt ekran görüntüleri sitenin arka planı olarak paketlenmez.

Resmî slayt sayfası, kişisel ve kitapla yürütülen ders kullanımına ilişkin koşullar belirtir; değiştirilmiş slaytlarda kaynak ve değişiklik bilgisinin korunmasını ister. Bu not, her türlü yeniden yayına sınırsız izin olarak yorumlanmaz. Projenin başlangıç kararı özgün metin ve görseller kullanmaktır. [Kaynak: resmî slayt kullanım notu](https://os-book.com/OS10/slide-dir/index.html).

Planlanan kaynak ibaresi:

> Operating System Concepts, 10th Edition — Silberschatz, Galvin ve Gagne; Chapter 11 temel alınarak hazırlanmış özgün Türkçe anlatım ve eğitim modelleri.

Bu ibare kitap cümlesi değildir; proje için yazılmış atıf metnidir.

## 6. Kavram sözlüğü

| Terim | Türkçe karşılık / kısa açıklama |
| --- | --- |
| Mass storage | Büyük miktarda veri için kullanılan depolama ortamları ve yapıları |
| Secondary storage | Ana bellek dışında kalıcı veri tutan ikincil depolama |
| HDD | Dönen manyetik plakalar ve hareketli kafa kullanan disk |
| Platter / track / sector | Plaka / iz / sektör; fiziksel disk yerleşimi kavramları |
| Cylinder | Çok plakalı HDD'de aynı yarıçaptaki izlerin kavramsal grubu |
| Seek time | Kafanın hedef iz/silindir konumuna ulaşma süresi |
| Rotational latency | İstenen sektörün kafa altına dönmesini bekleme süresi |
| Transfer time | Belirtilen miktardaki verinin aktarılma süresi |
| Throughput / bandwidth | Birim zamanda tamamlanan iş/veri; bağlama göre tanımlanmalı |
| IOPS | Saniyedeki I/O işlem sayısı; aktarım boyutundan bağımsız yorumlanmamalı |
| Logical block / LBA | Mantıksal blok ve adresi; fiziksel yerleşimden ayrılır |
| Controller / HBA | Aygıt veya host tarafında I/O iletişimini yöneten denetleyici |
| DMA | Verinin CPU'nun her byte'ı kopyalamasına gerek kalmadan bellekle aktarılması yaklaşımı |
| NVM | Güç kesilince içeriğini koruyan kalıcı bellek ailesi |
| SSD | Katı hal depolama aygıtı; bu projede flash tabanlı örneği kullanılır |
| NVMe | Kalıcı bellek aygıtlarıyla iletişim için kullanılan bir erişim protokolü |
| Flash page / erase block | Okuma/yazma sayfası ile daha büyük silme birimi |
| FTL | Mantıksal ve fiziksel flash konumlarını eşleyen katman |
| Garbage collection | Geçerli veriyi koruyarak geçersiz sayfaların alanını geri kazanma |
| Wear leveling | Yazma/silme aşınmasını fiziksel alanlara dağıtma yaklaşımı |
| Over-provisioning | Aygıt yönetimi için kullanıcıya doğrudan sunulmayan ek alan |
| Write amplification | Host yazmasına karşı gerçekleşen ek fiziksel yazma oranı |
| RAM disk | RAM'i blok aygıtı/dosya sistemi gibi kullanma; kendiliğinden kalıcı değildir |
| FCFS | İsteklere geliş sırasıyla servis verme |
| SCAN / C-SCAN | Yönlü tarama / çevrimsel tek yönde servis yaklaşımı |
| Deadline | Bir isteğin çok uzun beklemesini sınırlamayı hedefleyen zamanlama yaklaşımı |
| Parity | Veriye eklenen ve belirli hata türlerini saptamaya yardımcı denetim bilgisi |
| CRC / checksum | Veri bütünlüğü kontrol yöntemleri; özellikleri seçilen yönteme bağlıdır |
| ECC | Belirli hata sınırlarında tespit ve düzeltme sağlayan kodlama |
| Physical formatting | Ortamın denetleyicinin işleyebileceği fiziksel birimlere hazırlanması |
| Partition | Aygıt üzerinde tanımlanan mantıksal bölüm |
| Logical formatting | Bir alanda dosya sistemi yapılarının oluşturulması |
| Mount | Dosya sistemini işletim sisteminin ad alanında kullanıma açma |
| Bootloader | İşletim sistemi çekirdeğinin yüklenmesine katılan açılış programı |
| Bad-block remapping | Sorunlu fiziksel alanın yedek konumla eşlenmesi |
| Swap space / slot | Bellek sayfaları için depolamadaki alan / o alanın tahsis birimi |
| Frame / page | Fiziksel RAM birimi / sanal bellek birimi |
| Dirty page | Geçerli backing kopyasına göre değiştirilmiş sayfa |
| Page fault | İstenen sayfanın erişim anında RAM'de hazır olmaması gibi nedenlerle oluşan bellek istisnası |
| Page-in / page-out | Sayfanın depolamadan RAM'e / RAM'den backing alana taşınması |
| DAS / host-attached | Host'un yerel I/O bağlantılarıyla eriştiği depolama |
| NAS | Ağ üzerinden dosya/dizin erişimi sunan depolama yapısı |
| SAN | Host'lara depolama erişimi, tipik olarak blok hacimleri sunan depolama ağı |
| LUN | Mantıksal birimin adreslenmesine ilişkin terim; host'a sunulan hacim bağlamında görülür |
| Storage array | Denetleyiciler ve birden çok aygıtı içerebilen depolama sistemi |
| RAID | Birden çok diski kapasite, performans ve/veya yedeklilik amacıyla örgütleme |
| Striping | Veri parçalarını birden fazla diske dağıtma |
| Mirroring | Aynı verinin kopyalarını birden fazla aygıtta tutma |
| Degraded | Arıza sonrası erişimin sürdüğü ancak koruma/performansın azaldığı durum |
| Rebuild | Kaybolan disk içeriğinin mevcut koruma bilgisinden yeniden oluşturulması |
| Hot spare | Arızalı aygıtın yerine kullanılmak üzere hazır tutulan yedek disk |
| MTTF / MTTR | Arızalanmaya kadar ortalama süre / ortalama onarım süresi |
| Snapshot / replication | Bir zamandaki görünüm / veriyi başka konumda çoğaltma; RAID ile aynı değildir |
| Storage pool | Fiziksel kapasitenin üst yapılar arasında paylaşıldığı depolama havuzu |
| Object storage | Veriyi nesne kimlikleri ve uygun erişim arayüzleri üzerinden yönetme yaklaşımı |

## 7. Kaynakla hesap uyuşmazlığı kaydı

Resmî SCAN slaydı 21 metnindeki 208, projedeki fiziksel-uç kuralıyla aynı yol toplamını vermiyor. 53 başlangıcından 0’a gidip 183’te biten SCAN yolu **236**; 14’te dönen LOOK yolu **208**. Uygulama açık yolu ve doğru toplamını korur; bu fark S12 notunda ve regresyon testinde görünürdür. Tam kitap metni incelenmeden kitabın kendisinde hata olduğu iddia edilmez.

Kitap dışı Linux/SNIA/UEFI/Hamming belgeleri müfredat dayanağı listesinden çıkarıldı. SECDED örneği, slayt 27’nin genel ECC kavramı için özgün ve sınırlı bir gösterim olarak korunur. TRIM yerine slayt 10’daki sınırlı silme ömrü anlatılır.

## 8. Sonraki içerik kontrolü için bilgiler

Sunumun toplam süresi, dört kişinin adları, öğretim elemanının özel derinlik beklentisi, varsa kullanılacak yasal kitap kopyasının sürümü ve yayımlama hedefi henüz verilmedi. Bunlar mevcut dokümantasyonu engellemez. Süre ve görsel kararlar değiştirilebilir; kitap bölümü dağılımı sabittir.
