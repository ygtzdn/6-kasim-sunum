# OSC10 V3 — 11.1–11.3 pedagojik tasarım ve sunucu hazırlığı

**Tarih:** 5 Kasım 2026. **Aşama:** yalnız tasarım; bu belge hazırlanırken `src/` değiştirilmedi. Mevcut çalışan uygulama başlangıç noktasıdır; 36 sahne veya eski sahne sırası tasarım kısıtı değildir.

## 1. Önerilen kapsam ve ana karar

**11.1 için 10 çekirdek + 3 ek; 11.2 için 5 çekirdek; 11.3 için 3 çekirdek sahne öneriyorum. Toplam 18 çekirdek, 21 tam anlatım sahnesi.** Açılış, sunucu haritası ve ortak kapanış bu sayıya dahil değildir; ana ajan bunları ortak bölümde tasarlar.

Ders sırası: **HDD mekanizması → geometri → maliyet → istek boyutu karşılaştırması → NVM → flash kuralları → uçucu RAM disk → teyp → mantıksal bloklar → komut/veri yolu → HDD kuyruğu ve algoritmalar → politika seçimi → NVM zamanlama → bir kez ayrıntılı FTL/GC hesabı → aşınma/ayrılmış alan.** Bu sıra, resmî slaytların 4–26 ilerleyişini korurken tek sayfada biriken farklı düşünceleri ayırır.

Kişi 1 yalnız 11.1; kişi 2 yalnız 11.2 ve 11.3 ana sorumluluğunu taşır. Bir sonraki bölümde kullanılan geri referanslar kaynak listesinde ayrıca işaretlenir. 11.3'teki flash modeli 11.1'de ikinci kez oynatılmaz: ilk kişi yalnız fiziksel sayfa/blok kuralını ve geçersiz/boş ayrımını öğretir; ikinci kişi eşleme, canlı veri taşıma ve yazma büyütmesi hesabını ilk ve tek defa açar.

## 2. Kaynak ve doğruluk sözleşmesi

İçerik, `Operating System Concepts, Tenth Edition`, Bölüm 11 ve yazarların resmî [47 slaytlık Chapter 11 dosyasına](https://os-book.com/OS10/slide-dir/PPTX-dir/ch11.pptx) bağlanır. İncelenen metin `/tmp/osc10-ch11-slides.txt` içindedir. [Resmî içindekiler](https://os-book.com/OS10/toc-dir/toc.pdf) bölüm sırasını; [slayt dizini](https://os-book.com/OS10/slide-dir/index.html) baskı ve kaynak kimliğini doğrular. Slayt numaraları 1 tabanlı dosya sırasıdır; kitap sayfası değildir. Tam kitap metni bulunmadığı için tam sayfa/metin karşılaştırması yapıldığı iddia edilmez.

- Bölümdeki kavram, özgün eğitim örneği ve tarihsel kaynak sayısı ayrı kaydedilir. Çizimler kitap şeklinin kopyası gibi sunulmaz.
- Slayt 6'daki kapasite, arayüz ve performans değerleri güncel ürün aralığı değildir. Çekirdekte pazar değeri ezberletilmez; ek sahnede tarihsel kitap örneği olarak gösterilir.
- Slayt 9'daki fiyat/kapasite/güvenilirlik karşılaştırmaları evrensel güncel ürün hükmüne dönüştürülmez. Çekirdekte mekanik hareketin bulunmaması ve NVM ailesi esas alınır.
- Slayt 10'daki yaklaşık silme sayısı her NAND için sabit ömür diye kullanılmaz. Sınırlı silme dayanıklılığı öğretilir; DWPD yalnız kaynaktaki 1 TB/5 DWPD aritmetiğiyle ek sahnede açılır.
- Slayt 21 metnindeki 208, tanımlanan fiziksel uca giden SCAN yoluyla uyuşmaz. Açık sözleşme 53→0→183=236'dır; 53→14→183=208 LOOK davranışıdır. Kaynak uyuşmazlığı notlarda görünür, motor 208'e zorlanmaz. Tam kitapta hata olduğu iddia edilmez.
- Slayt 7'deki 4 KB ve 1 Gb/s örneğinde birim/yuvarlama gösterimi belirsizdir. Yeni hesapta birimler açık seçilir: 4 KiB=4096 B, 1 Gb/s=125 MB/s, seek=5 ms, RPM=7200, controller=0,1 ms. Erken yuvarlamadan sonuç 9,299434666… ms, görünür sonuç **9,30 ms** olur. Bu, kaynaktaki formül ve girdilerin birimleri açıklanmış eğitim hesabıdır; 9,301 sayısı birebir doğrulanmış kesin sonuç diye aktarılmaz. Queue beklemesi bu servis hesabına dahil değildir.
- TRIM, güncel Linux varsayılanları, güncel NVMe ürün özellikleri, kanal başına gerçek hızlar veya modern yazma protokolü ayrıntıları bu tasarıma eklenmez. SSTF adı 25. slayt bağlamında notlarda anılabilir; resmî slaytta ayrıntılı hesabı olmayan yeni bir SSTF simülatörü çekirdeğe eklenmez.
- Slayt 13'ün çıkarılmış metni yalnız başlıktır; teyp şekli ve temel konum bulma/sıralı aktarım kavramı kullanılabilir. Tam metin doğrulanmadan alt bölüm veya nicel teyp performansı icat edilmez.

## 3. Kesin sıra, kimlik, süre ve aşama sayıları

Tüm satırlar için `kind: chapter`. Kimlikler URL'de sayıya değil kavrama dayanır. Çekirdek rota `depth: core` satırlarını aynı göreli sırayla gezer; tam rota ek sahneleri aşağıdaki doğal konumlarda içerir. Menü ek sahneyi her zaman açabilir; seçilen rota geçişleri bu seçimi açıkça gösterir.

| Tam sıra | Kimlik | Kişi / bölüm | Derinlik | Çekirdek saniye | Tam saniye | Aşama | Resmî slayt |
|---:|---|---|---|---:|---:|---:|---|
| 1 | `hdd-anatomy` | 1 / 11.1 | core | 75 | 120 | 5 | 4,5 |
| 2 | `hdd-geometry` | 1 / 11.1 | core | 45 | 75 | 4 | 5,14,16 |
| 3 | `hdd-access-cost` | 1 / 11.1 | core | 90 | 150 | 6 | 4,6,7 |
| 4 | `hdd-request-size` | 1 / 11.1 | core | 45 | 90 | 4 | 7 |
| 5 | `hdd-history` | 1 / 11.1 | extension | 0 | 45 | 3 | 8 |
| 6 | `hdd-performance-metrics` | 1 / 11.1 | extension | 0 | 75 | 4 | 6,7,17 |
| 7 | `nvm-device` | 1 / 11.1 | core | 45 | 75 | 4 | 9 |
| 8 | `flash-page-block` | 1 / 11.1 | core | 90 | 135 | 5 | 10,11 |
| 9 | `flash-endurance` | 1 / 11.1 | extension | 0 | 90 | 4 | 10,11 |
| 10 | `ram-disk` | 1 / 11.1 | core | 45 | 75 | 4 | 12; geri ref 4,9 |
| 11 | `magnetic-tape` | 1 / 11.1 | core | 30 | 60 | 3 | 13 |
| 12 | `logical-blocks` | 1 / 11.1 | core | 45 | 75 | 4 | 14,16 |
| 13 | `storage-data-path` | 1 / 11.1 | core | 60 | 105 | 5 | 15; ileri ref 18 |
| 14 | `hdd-request-queue` | 2 / 11.2 | core | 60 | 90 | 4 | 17,18,19 |
| 15 | `fcfs-path` | 2 / 11.2 | core | 80 | 120 | 10 | 19,20 |
| 16 | `scan-path` | 2 / 11.2 | core | 90 | 135 | 11 | 21,22 |
| 17 | `cscan-path` | 2 / 11.2 | core | 90 | 135 | 12 | 23,24 |
| 18 | `scheduling-tradeoffs` | 2 / 11.2 | core | 75 | 120 | 6 | 17,18,19,20,21,22,23,24,25 |
| 19 | `nvm-scheduling` | 2 / 11.3 | core | 75 | 120 | 5 | 26; geri ref 15 |
| 20 | `flash-write-amplification` | 2 / 11.3 | core | 120 | 180 | 6 | 26; geri ref 10,11 |
| 21 | `nvm-management-summary` | 2 / 11.3 | core | 60 | 105 | 5 | 26; geri ref 10,11 |

**Toplamlar:**

- Kişi 1: çekirdek **570 s = 9:30**; tam **1170 s = 19:30** (960 s çekirdek sahnelerin geniş anlatımı + 210 s üç ek sahne).
- Kişi 2: çekirdek **650 s = 10:50**; tam **1005 s = 16:45**.
- İki kişi: çekirdek **1220 s = 20:20**; tam **2175 s = 36:15**.
- Aşama: çekirdek **103**, ek **11**, tam **114**. Açılış/kapanış dahil değildir.

45 dakikalık bütün sunum için bu iki kişiden sonra **24:40**; 75 dakika için **38:45** kalır. Ana ajanın diğer paketlerle birleştirebileceği örnek toplam bütçe: açılış 2:00/3:00, kişi1 9:30/19:30, kişi2 10:50/16:45, kişi3 8:00/14:00, kişi4 11:00/17:45, kapanış/soru 3:40/4:00 = **45:00/75:00**. Son iki kişinin süreleri onların tasarımıyla kesinleştirilir; bu tablo dış paketleri kısıtlamaz. Sunumda soru yanıtları süre içindedir; uzun serbest tartışma bu süreye dahil değildir.

## 4. Bütün sahneler için etkileşim ilkesi

Her sahne sonlu, anlamlı durum dizisidir. `context.stage` tek ilerleme durumudur. Enter ileri, Backspace geri, aşama sekmesi aynı durumu doğrudan seçer. Son aşamada Enter sahne değiştirmez; sahne okları veya açık sonraki sahne eylemi kullanılır. Odaktaki gerçek giriş/bağlantı kontrollerinin yerel davranışları korunur. Başlığa göre sadece metin değiştiren genel bir reveal katmanı kullanılmaz.

- Bir önceki aşama yalnız adı geri getirmez: kafa konumu, tamamlanan istekler, toplamlar, eşleme, rezerv, bitler ve görünür sonuç aynı anda o aşamadan türetilir.
- Algoritmalar resmî sabit kuyrukla çalışır; dinamik istek sayısının aşama sayısını bozmasına izin verilmez. İleri/geri gezinme otomatik zamanlayıcıya bağlı değildir.
- Sabit sınıf örneğinde bütün komutlar ve sayılar aşamadan hesaplanır. İsteğe bağlı deney girdileri varsa değişiklik başlangıç aşamasına döndürür; sonuç etiketi eski deneyden kalmaz.
- Uzun sayfa veya metin slaytı yoktur. Açık tema, mevcut fontlar, mavi/turuncu vurgu, numaralı gerçek fotoğraflar, basit şema dili korunur. Renk tek anlam taşıyıcısı değildir; `Geçerli`, `Geçersiz`, `Boş`, `Servis yok` gibi etiketler görünürdür.
- Zaman gösteren her model ms, MB/s, KiB gibi birimleri belirtir. Silindir grafiğinin dikey ekseni olay sırasıdır; zaman diye çizilmez.

## 5. Kişi 1: sahne sözleşmeleri ve prova metni

### 5.1 `hdd-anatomy` — Hareket, maliyetin fiziksel nedenidir

**Görünür ana mesaj:** “Kol konumlanır. Plaka döner.” Gerçek HDD fotoğrafı ana görseldir. Fotoğrafta seçilemeyen iz/sektör boyalı fiziksel çizgi gibi sunulmaz.

**Kesin 5 aşama:** `Gerçek HDD` → `Plaka ve mil` → `Kol ve okuma/yazma kafası` → `Konumlanma ile dönme farklı` → `Normal boşluk / head crash riski`.

**Gözlenen değişiklik:** Aşamalar ilgili fotoğraf işaretlerini seçer. Dördüncüde kol hareketi ve plaka dönüşü iki ayrı temsili okla ayrılır. Beşincide küçük özgün yan kesit normal kafa/yüzey boşluğunu temas durumuyla karşılaştırır; çalışan diskte kafanın yüzeye sürttüğü izlenimi kaldırılır. Gerçek donanım animasyonu veya video üretilmez.

**Sunucu sırası:** “Veri manyetik yüzeyde. Plakayı mil döndürüyor; kol kafayı hedef yarıçapa götürüyor. Kafa ile yüzeyin teması normal okuma değildir.” Parça adlarını okuyup geçmek yerine her adı bir görevle eşleştir.

**Soru/cevap:** “Disk dönerken hedef iz henüz kafanın altında değilse yalnız dönüşü beklemek yeter mi?” — Hayır; önce hedef yarıçapa konumlanmak gerekir.

**Geçiş:** “Hedef konumu iz, sektör ve silindir olarak adlandıralım.”

### 5.2 `hdd-geometry` — Aynı kelimeler aynı şeyi anlatmaz

**Görünür mesaj:** “İz ≠ sektör ≠ silindir.”

**4 aşama:** `Tek yüzey` → `İz: dairesel yol` → `Sektör: izin parçası` → `Silindir: yüzeylerde aynı yarıçap`.

**Model:** Özgün düz SVG. İlk üç aşama üstten tek yüzey şemasında farklı fiziksel grupları seçer. Son aşama çok yüzeyli küçük yan görünümü açıp aynı yarıçaptaki izleri birlikte vurgular. Perspektifli 3D model gerekmez; şema ile gerçek fotoğraf ayrı tutulur.

**Sunucu sırası:** Dairesel yolun tamamını seç; sonra onun bir parçasını; sonra birden çok yüzeyde ortak yarıçapı seç. “Silindir bir aygıt parçası değil, izlerin geometrik gruplanmasıdır.”

**Soru/cevap:** “Bir sektörü seçmek bütün bir silindiri seçmek midir?” — Hayır; bir iz parçası ile aynı yarıçaptaki izler grubu farklıdır.

**Geçiş:** “Konumu bildiğimizde oraya ulaşmanın süresini parçalayabiliriz.”

### 5.3 `hdd-access-cost` — Konumlandırma ile servis süresini ayır

**Görünür mesaj:** “Seek + dönme + aktarım + denetleyici.”

**6 aşama:** `İstek ve açık birimler` → `Seek: 5 ms` → `Ortalama dönme: 4,1667 ms` → `Konumlandırma: 9,1667 ms` → `4 KiB aktarım: 0,032768 ms` → `Denetleyici 0,1 ms; toplam 9,30 ms`.

**Hesap sözleşmesi:** `rotationMs=30000/rpm`; `transferMs=(sizeKiB*1024)/(rateMBps*1e6)*1000`; `positioning=seek+rotation`; `service=positioning+transfer+controller`. Kuyruk beklemesi ayrı, hesaba dahil değil. Birimler veri etiketinde ve notta açık. Tam hesap kayan noktayla; yalnız gösterim yuvarlanır.

**Gözlenen değişiklik:** İstek işareti kafa/sector/DRAM hattında ilerler; sadece o ana kadar açıklanan terimler zaman çizelgesine eklenir. Seek ve dönmeden sonra bir parantez konumlandırmayı gruplar. Toplam son aşamaya kadar `?` kalır. Son aşama denetleyici katkısını gerçekten ayrı parçayla ekler; küçük bileşenler görünmez olmasın diye sayısal etiketler grafiğe eşlik eder.

**Sunucu sırası:** Önce her terimin nedeni, sonra formülü, sonra sayı. “7200 RPM dakikada turdur; bir tur 8,3333 ms, ortalama bekleme yarım turdur.” Küçük aktarımın baskın olmayan maliyet olduğunu sonucu açmadan sordur.

**Soru/cevap:** “9,1667 ms ile 9,30 ms niçin aynı isimle anılmıyor?” — İlki konumlandırma, ikincisi aktarım ve denetleyici dahil bu örneğin servis süresidir.

**Geçiş:** “Aynı aygıtta yalnız veri miktarını değiştirirsek hangi terim değişir?”

### 5.4 `hdd-request-size` — Küçük okumada hızın sınırı

**Görünür mesaj:** “Veri büyür; mekanik bekleme aynı kalır.”

**4 aşama:** `4 KiB / 125 MB/s` → `1 MiB / aynı aygıt` → `Aktarım hızını iki katına çıkar` → `Değişen / değişmeyen bileşenleri karşılaştır`.

**Kesin örnekler:** 5 ms seek, 7200 RPM, 0,1 ms controller sabittir. 125 MB/s'de 4 KiB toplam9,2994347 ms, 1 MiB toplam17,6552747 ms. 250 MB/s'de sırasıyla9,2830507 ms ve13,4609707 ms. Küçük/büyük iki sütunun seek+dönme+controller bölümleri değişmez; yalnız aktarım parçaları küçülür. Son aşamada aynı bileşenler ortak parantezle eşleştirilir, değişen transferler ayrı renkle seçilir.

**Sunucu sırası:** Önce dinleyiciden değişecek halkayı seçmesini iste; boyutu artır, sonra hızı artır. “Aktarım hızı iki katına çıktı diye küçük I/O toplamı yarıya inmedi.” Benchmark ya da ürün önerisi yok.

**Soru/cevap:** “Aktarım hızı sonsuza yaklaşsa bu HDD örneğinin bütün beklemesi biter mi?” — Hayır; sabit konumlandırma ve controller terimleri kalır.

**Geçiş:** Çekirdekte “Şimdi bu mekanik terimleri taşımayan aygıta geçelim.” Tam rotada kısa tarih ve ölçüt eklerinden sonra aynı cümleye dönülür.

### 5.5 `hdd-history` — Ek, 45 saniye

**Mesaj:** “Depolama geometrisi ve ölçek zamanla değişti.”

**3 aşama:** `1956 IBM Model 350` → `50 × 24 inç plaka; 5 milyon 7-bit karakter` → `Erişim <1 saniye; güncel ölçüt değildir`.

**Model/anlatım:** Slayt8'deki tarih ve ölçek kısa tipografik karşılaştırma/özgün plaka sayacıyla verilir. Fotoğraf bulunmazsa yeni fotoğraf üretmek yerine tarihsel bilgi kartı kullanılır. Kaynaktaki yazım veya eski kapasite birimi modern5MB'ye sessiz çevrilmez.

**Soru/cevap:** “Bu sayılar bugün satılan bir HDD'nin özellikleri mi?” — Hayır; kaynağın tarihsel örneği.

**Geçiş:** “Yalnız ölçek değil, kullandığımız performans ölçüsü de önemli.”

### 5.6 `hdd-performance-metrics` — Ek, 75 saniye

**Mesaj:** “Arayüz tavanı, etkin aktarım, gecikme ve bandwidth ayrı ölçüdür.”

**4 aşama:** `Kitaptaki tarihsel arayüz tavanı 6 Gb/s` → `Kitaptaki etkin örnek 1 Gb/s` → `Tek I/O servis süresi ms` → `Toplam byte / toplam geçen süre`.

**Model:** İlk iki aşama birim olarak aynı hız çubuklarını ayırır. Üçüncüde sayı ms kutusuna taşınır; hızla aynı grafikte boyuna göre yanlış karşılaştırılmaz. Son aşama çok istekli örnek zaman aralığı üzerinde bandwidth tanımını gösterir; kuyruk dahil ölçüm penceresi açık olur. Kaynak17 ileri referanstır.

**Soru/cevap:** “6 Gb/s port, her küçük okumanın o hızda tamamlandığını mı söyler?” — Hayır; arayüz tavanı tek I/O gecikmesi değildir.

**Geçiş:** “NVM mekanik gecikmeyi kaldırsa da bağlantı ve yazılım yolu sürer.”

### 5.7 `nvm-device` — Flash SSD, NVM'nin bir örneğidir

**Mesaj:** “Kalıcı; hareketli parça yok.”

**4 aşama:** `Gerçek SSD dışı` → `Gerçek iç kart: flash ve denetleyici` → `HDD ile mekanik maliyet karşılaştırması` → `SSD, daha geniş NVM ailesinin bir biçimi`.

**Model:** Mevcut iki SSD fotoğrafı; flash ve denetleyici görev etiketleri. Üçüncü aşamada HDD seek/dönme terimlerinin karşısında SSD için `Yok` görünür; aktarım/yazılım/flash işleri silinmez. Dördüncüde SSD, USB flash ve gömülü NVM örnekleri aynı aile şemasında, marka veya güncel hız iddiası olmadan görünür.

**Soru/cevap:** “Elektronik olan her bellek uçucu mudur?” — Hayır; flash SSD güç kesildiğinde kayıtlı veriyi tutar.

**Geçiş:** “Hareket yok, fakat yazma ve silmenin farklı fiziksel kuralları var.”

### 5.8 `flash-page-block` — İlk kişi fiziksel kuralı öğretir

**Mesaj:** “Sayfa oku/yaz; daha büyük blok sil.”

**5 aşama:** `Sayfa ve silme bloğunu tanı` → `P0'ı oku: içerik değişmez` → `L0 yeni sürümü boş P6'ya yaz` → `Canlı veri kalmayan A bloğunu sil` → `Geçerli / geçersiz / silinmiş sayfayı karşılaştır`.

**Deterministik başlangıç:** A: P0=L0güncel, P1–P3=geçersiz. B: P4=L1geçerli, P5=geçersiz, P6/P7=boş. Güncelleme P6'yı güncel yapar, P0'ı geçersizleştirir. Sonra A silinebilir; B'deki L1 ve yeniL0 korunur. Son karşılaştırma P6geçerli, P5geçersiz, P0silinmiş örneklerini birlikte seçer. Silme öncesi canlı veriyi kaybettiren görünüm yoktur.

**Sunucu sırası:** Kutu ölçeğinin gerçek NAND geometrisi olmadığını bir kez söyle. Okumanın veriyi değiştirmediğini, güncellemenin yeni yere gittiğini, geçersiz yerin henüz yeniden yazılabilir olmadığını davranışla göster. Denetleyicinin güncel yeri izlemesi burada yalnız bir ok/etikettir; ayrıntılı FTLtablosu, canlı taşıma ve sayısal GC döngüsü açılmaz.

**Soru/cevap:** “Geçersiz sayfa boş ve doğrudan yeniden yazılabilir midir?” — Hayır; daha büyük blok silme kuralı sürer.

**Geçiş:** Çekirdekte “Flash kalıcı; RAM disk aynı kalıcılığı taşıyor mu?” Tam rotada dayanıklılık eki ardından bu karşılaştırmaya dön.

### 5.9 `flash-endurance` — Ek, kaynaktaki DWPD

**Mesaj:** “Silme ömrü sınırlıdır; DWPD bir yazma bütçesi ölçüsüdür.”

**4 aşama:** `Sınırlı program/silme dayanıklılığı` → `Kaynaktaki 1 TB, 5 DWPD örneği` → `1 TB × 5 = 5 TB/gün` → `3 TB/gün ile 6 TB/günü bu örnek bütçeyle karşılaştır`.

**Model/anlatım:** Günlük bütçe çubuğu 5TB'de sabit; seçilen iki günlük hacim sınırın iki tarafındadır. Garanti süresi ve tanımlı koşullar kaynağın çerçevesidir. Sınırı aşma “aygıt o gün kesin ölür” diye gösterilmez; yaklaşık100.000 bütün flash türleri için evrensel sabit olarak ekrana yazılmaz. İç sayfa silme sayacıyla cihaz yazma hacmi aynı birim gibi karşılaştırılmaz.

**Soru/cevap:** “5 DWPD, bir hücrenin günde yalnız5kez silinmesi midir?” — Hayır; aygıt kapasitesine göre günlük yazma hacmi derecelendirmesidir.

**Geçiş:** “Kalıcı ortamın fiziksel sınırlarını gördük; uçucu depolamayı ayıralım.”

### 5.10 `ram-disk` — Dosya sistemi, ortamı kalıcı yapmaz

**Mesaj:** “RAM → blok aygıtı → dosya sistemi; hâlâ uçucu.”

**4 aşama:** `RAM disk olarak sunulur` → `Dosya okuma/yazma ile veri yerleştir` → `Gücü kes: RAM içeriği kaybolur` → `Güç geri gelsin: HDD/SSD kaydı durur, RAM eski verisi dönmez`.

**Model:** RAM fotoğrafı, blok aygıtı/dosya sistemi şeması ve gerçekten değişen bit durumu. Son aşamada RAM/HDD/SSD iki özellik bakımından karşılaştırılır: uçuculuk ve mekanik hareket. Fotoğraflar mevcut; işlem fiziksel güç komutu değildir. `tmpfs` ile herRAMdiskin birebir aynı aygıt olduğu gibi yeni sistem ayrıntıları açılmaz.

**Soru/cevap:** “Dosya sistemi oluşturulduğuna göre RAM disk kalıcı mı oldu?” — Hayır; yazılım arayüzü fiziksel uçuculuğu değiştirmez.

**Geçiş:** “Başka bir kalıcı ortam olan teybin erişim şekli farklıdır.”

### 5.11 `magnetic-tape` — Konum bulmak ile aktarım ayrı

**Mesaj:** “Önce kayda ulaş; sonra sırayla aktar.”

**3 aşama:** `Sıralı kayıt şeridi` → `Uzak kaydın konumunu bul` → `Ardışık kayıtları oku; arşiv/yedekleme bağlamı`.

**Model:** Kaydın üzerinden geçen tek seçici. İkinci aşama aradaki konum değişimini gösterir; üçüncü aşama bulunduğu yerden komşu kayıtları aktarır. Rastgele bir kaydı seçmenin imkânsız olduğu veya teyp hızının tüm ölçülerde düşük olduğu söylenmez. Gerçek süre tahmini yoktur.

**Soru/cevap:** “Bir kaydı bulma süresi ile bulduktan sonra ardışık aktarım aynı maliyet midir?” — Hayır; farklı iş ve maliyetlerdir.

**Geçiş:** “Ortamlar farklı; OS disk aygıtını ortak bir adres görünümüyle kullanır.”

### 5.12 `logical-blocks` — Mantıksal görünüm, fiziksel ayrıntıyı saklar

**Mesaj:** “OS tek boyutlu mantıksal blok dizisini adresler.”

**4 aşama:** `Numaralı LBA dizisi` → `LBA3 okuma isteği` → `Kitabın temel sıralı sektör eşlemesi` → `Mantıksal görünümü koru, fiziksel ayrıntıyı gizle`.

**Model:** Sekiz bloklu mantıksal satır ve ayrı disk şeması. İstek seçildiğinde yalnızLBA3 ve örneksektörü bağlanır. Son aşamada disk geometrisi kapatılıp LBA3 isteği ve denetleyici sınırı kalır. Bu, soyutlamanın hangi bilgiyi OS'den sakladığını görsel olarak açıklar. Bozuk sektör ve değişken sektör/iz sayısı notta istisnadır; yeniden eşleme demosu kişi3'e bırakılır.

**Soru/cevap:** “LBA numarası her diskte aynı görünür fiziksel koordinatı garanti eder mi?” — Hayır; temel sıralı model istisnaları ve aygıtın eşlemesi vardır.

**Geçiş:** “Bu adresli komut aygıta nasıl gider; veri RAM'e nasıl gelir?”

### 5.13 `storage-data-path` — Sunucu 1'in birleşimi ve devri

**Mesaj:** “Komut yolu ile veri yolu ayrı.”

**5 aşama:** `OS okuma isteği ve hedef RAM alanı` → `Host denetleyicisine komut` → `Aygıt denetleyicisine mesaj` → `Aygıtta veri erişimi` → `DMA ile DRAM'e veri aktarımı`.

**Model:** OS→hostcontroller→devicecontroller→medium üst hattı; medium→DRAM alt veri hattı. Her aşama ilgili komut veya payload konumunu gerçekten değiştirir. Son aşamada DRAM hedef kutusuna veriler dolar. CPU'nun bytebyte kopyalaması çizilmez. Arayüz etiketleri SATA/NVMe isim düzeyinde anılır; bütünSSD'lerin NVMe olduğu söylenmez. Bağlantı mimarilerinin karşılaştırması kişi4'e bırakılır.

**Soru/cevap:** “Komutun controller'a iletilmesi ile verinin DRAM'e taşınması aynı ok mudur?” — Hayır; kontrol ve veri aktarımı farklı akışlardır.

**Kesin devir cümlesi:** “OS aygıtı mantıksal bloklarla adresliyor. Aygıt HDD ise bu isteklerin sırası fiziksel hareketi değiştiriyor. Şimdi aynı kuyruğu farklı sıralarla karşılamak için sözü ikinci sunucuya bırakıyorum.” Kişi2 `hdd-request-queue` ilk aşamasını açarak başlar; RAMdisk/flash tanımlarını yeniden anlatmaz.

## 6. Kişi 2: sahne sözleşmeleri ve prova metni

### 6.1 `hdd-request-queue` — Karşılaştırmanın sözleşmesi

**Mesaj:** “Aynı kuyruk. Aynı kafa. Aynı sınırlar.”

**4 aşama:** `İsteğin kaynağı ve kuyruk` → `Resmî geliş sırası` → `Kafa53 ve0–199 sınırları` → `Azalan yön; ölçüΣ|Δsilindir|`.

**Model:** İlk aşamada boş olmayan kuyruğun neden gerektiği idle/busyiki aygıt durumu ile ayrılır. Sonra resmîsekizkart açılır:98,183,37,122,14,124,65,67. Başlangıçgeometrisi ve yön eklenir. OS/denetleyici katmanı iki kutuyla belirtilir. Sayılar ve yön sabittir; karşılaştırma sırasında değişmez.

**Soru/cevap:** “Bekleyen kuyruk yoksa bu sıralama optimizasyonunda seçilecek ne var?” — Tek hazır istekte yeniden sıralanacak birden çok talep yoktur.

**Geçiş:** “Önce geliş sırasını bozmadan yolu izleyelim.”

### 6.2 `fcfs-path` — On sonlu aşama

**Mesaj:** “Geliş sırasını koru; uzaklık öncelik değildir.”

**10 aşama:** `Başlangıç53` → `98` → `183` → `37` → `122` → `14` → `124` → `65` → `67` → `Sonuç640`.

**Tam sayılar:** Katkılar45,85,146,85,108,110,59,2; birikimler45,130,276,361,469,579,638,640. Sonuçaşamasında tamamlanan yolun zigzagları ve toplama dizisi aynı anda seçilir.

**Sunucu sırası:** İlk hareketi dinleyiciye hesaplat; orta yoldaki iki uzun gidişgelişi vurgula; bütün sayıları yüksek sesle okumak yerine toplamın nasıl biriktiğini göster. Grafikteyataykonum=silindir, dikey=olaysırası. Gelecek yol çizgileri sonucu baştan açıklamasın; pendingkartlar görünür, tamamlanan yol aşamayla oluşsun.

**Soru/cevap:** “Kuyruğun sonundaki istek başlangıç kafasına yakınsa FCFS onu öne alır mı?” — Hayır; gelişsırasını korur.

**Geçiş:** “Gelişsırası adil bir düzen sağlar; şimdi konum yönünü kullanalım.”

### 6.3 `scan-path` — Fiziksel uç ve kaynak uyuşmazlığı

**Mesaj:** “İlerle, yoldakileri servis et, fiziksel uca git, dön.”

**11 aşama:** `Başlangıç53` → `37` → `14` → `Fizikseluç0` → `65` → `67` → `98` → `122` → `124` → `183` → `Sonuç236 / LOOK208 ayrımı`.

**Tam sayılar:** Katkılar16,23,14,65,2,31,24,2,59; birikimler16,39,53,118,120,151,175,177,236. Uç0 aşamasında2/8 servis sayısı değişmez. Sonuçaşamasında iki yol aynı ölçekte karşılaştırılır:0'agiden236,14'tedönen208. Bu açıklama küçük diyagram veya segment vurgusuyla gerçekten farklı rotayı gösterir, sadece bir dipnot olmaz.

**Soru/cevap:** “14 son azalan istekse burada dönmek bu sahnenin SCAN kuralına uyar mı?” — Hayır; karşı tarafta istek varken fiziksel0ucuna gitme sözleşmesi uygulanır.14'tedönmekLOOKolur.

**Kaynak sınırı:** Resmî21.slayt208ifadesi notlarda ayrı ‘erişilenkaynak ile hesap uyuşmazlığı’ olarak kaydedilir; sınıfta tartışmayı tamkitabınhatasına çevirmeyin. Motoru doğrugeometriden ayırmayın.

**Geçiş:** “İki yönde servis verdik. Tek yönde servis veren çevrimde geri dönüşe ne olur?”

### 6.4 `cscan-path` — Dönüş servis değil; harekettir

**Mesaj:** “0→199: servis yok, +199 hareket var.”

**12 aşama:** `Başlangıç53` → `37` → `14` → `Uç0` → `Servisyapmadan199'adön` → `183` → `124` → `122` → `98` → `67` → `65` → `Sonuç386`.

**Tam sayılar:** Katkılar16,23,14,199,16,59,2,24,31,2; birikimler16,39,53,252,268,327,329,353,384,386.0→199turuncukesikli; diğerhareketlermavi. Dönüşboyunca tamamlanan2/8değişmez. Sonuç53+199+134parçalarıylagörünür.

**Soru/cevap:** “0→199 boyunca98'inüstündengeçildi;98isteğitamamlandı mı?” — Hayır; dönüşteservis yapılmaz.

**Kaynak/yön:** Aynıazalanbaşlangıç karşılaştırmayıkorur. ResmîC-SCANçizimindekiartanrotanın382sonucu notta alternatifolarak kalır; aynıyönmüşgibianlatılmaz.

**Geçiş:** “Bu üç toplamı aynı hedefle değerlendirelim; sonra hedefin eksiklerini soralım.”

### 6.5 `scheduling-tradeoffs` — Sayıdan politika seçimine

**Mesaj:** “En kısa yol, tek karar ölçütü değildir.”

**6 aşama:** `FCFS640` → `SCAN236` → `C-SCAN386` → `C-SCAN53+199+134ayrımı` → `Hareket ile servis sırası farklı ölçüt` → `Politika: bekleyen eski isteği gözet`.

**Model:** İlküççubukaynıölçekteaçılır. DördüncüdeC-SCANçubuğugerçekoranlıüçparçayaayrılır;199turuncuolarakbelirginleşir. Beşincideisteklerin gelişkimliği→servissırasıtablosu açılır: buradakisıra gerçekmsbeklemesideğildir. Altıncıda25.slayttaki tarihseldeadlinefikri küçükbirpaneldeaçılır: LBAyakınlığınagöresırayıseçerkeneskibekleyenisteğinbulunduğukuyruğageçilebilir.

**Çekirdek/tam ayrımı:**75sçekirdekte sonpanelinmesajı10–15s'deanlatılır.120stamrotada4tarihselkuyruk(oku/yaz ×LBA/FCFS) minidiyagramıyla açıklanır; birbatchsonrasıkontrol ve eskiisteğinbulunduğuLBAkuyruğununseçilmesigösterilir. Kaynaktaki500msyaşörneğigüncelLinuxvarsayılanıdiyeverilmez. Buayrıntıyeniayrısahneolmadanaynısonludurumuikiöğretimderinliğindeaçıklar.

**Soru/cevap:** “236enazolduğuna göreSCANheristemincikmesini enazaindirir mi?” — Hayır; toplammesafe dışında bekleme,istekboyutu,rotasyon,önbellek,aygıtvehedeflerönemlidir.

**Geçiş:** “NVM'dekafa yolu yok. O zaman bu politikaların hangi gerekçeleri kalır?”

### 6.6 `nvm-scheduling` — HDD algoritmasını SSD'ye isim değiştirerek taşıma

**Mesaj:** “Seek yok; yazılım ve kuyruk işi sürer.”

**5 aşama:** `OSkuyruğu` → `BitişikL10/L11isteklerinibirleştir` → `Komutlarıaygıtagönder` → `Aygıtiçiparalellik` → `HostI/Oiledenetleyiciyönetiminiayır`.

**Model:** Dörtistek:OkuL10,OkuL11,YazL40,OkuL90. BirleştirmegerçektenikiokumayısingleL10–L11yapar. Geri dönünceikikartgeri gelir. Göndermeveparalellikaşamalarıkomutkonumunuvetenİçişleri değiştirir. NVMeisimdüzeyinde11.1geri referansıdır; kanal/kuyruksayısıürünsözüdeğildir.

**Sunucu sırası:** Kaynak26'dakibitişikistekbirleştirme,IOPS/bandwidthayrımıveyazmabüyütmesiuyarısınıkullan. “NVMdaherşeyFCFS'dir”genellemesiyapma;RHEL7NOOPörneğitarihseldir. Güncelürünsayılarıverme. Denetleyicigörevleriniyalnızbaşlıkolrakgöster;GCçalışmaörneğinisıradakisahneye bırak.

**Soru/cevap:** “Seekolmadığıiçinbitişikistekleribirleştirmekdeanlamsızmı?” — Hayır;komut/yazılım/kuyrukekyükünüazaltmafarklıbirgerekçedir.

**Geçiş:** “Birhostyazmasınınaygıtiçindetekfizikselyazmaolduğunuvarsayabilir miyiz?”

### 6.7 `flash-write-amplification` — Tek ayrıntılı FTL/GC modeli

**Mesaj:** Başta “Host yazması = fiziksel yazma mı?”, sonda “3host,5fizikselyazma,1silme”.

**6 aşama:** `Başlangıçeşlemesi` → `L0güncelle` → `L1güncelle` → `CanlıL2/L3'üGCiçintaşı` → `B0bloğunusil` → `L2güncelleve5/3oranınıhesapla`.

**Başlangıç:**3blok×4sayfa. B0=L0–L3; B1=L4,L5,boş,boş;B2GCrezervi.6mantıksalsayfa. Başlangıçyüklemesisayılmaz.

**Adımlar/sayaçlar:** [host,fiziksel,silme] sırasıyla[0,0,0]→[1,1,0]→[2,2,0]→[2,4,0]→[2,4,1]→[3,5,1]. FTLherkopyaile güncellenir. B0'da canlıreferanskalmadığında silme yapılır;sonraB0rezervolur. EskiL2kopyasısonL2güncellemesindegeçersizleşir. Toplamratio5/3≈1,67.

**Model kontratı:** `stateAtStage(stage)` başlangıçtantekraroynatır;stateklonlanır;gerikurmadageçerlisayfalar,yedekblok,FTLvesayaçlarbirliktedöner. Tablodakiodaklanansayfaaşamadan gelir;ayrısaklıUIstateyoktur. Fiziksel/hostformülüvisible;host=0iken“—”.

**Soru/cevap:** “Hostsayacı2'dedururkenfizikselyazma4nasıloldu?” — GCiki canlıkopyayazdı;bunlaryenihostisteğideğildi.

**FTL tekrarını önleme:** İlkkişininsayfa/bloktanımını20s'denuzunyenidenanlatma. Buradayeniöğrenmehedefieşleme/sayaçlarınbirlikteyönetilmesiveekiştir. Sahnedenönce/sonrayenibirseparateFTL/GCtutorialtekrarıekleme.

**Geçiş:** “GC boş alanı geri kazandırır. Peki aşınmayı geri alır mı?”

### 6.8 `nvm-management-summary` — Aşınmayı geri almadan alanı yönet

**Mesaj:** “FTL, GC, wear leveling ve ayrılmış alan farklı görevlerdir.”

**5 aşama:** `Host/denetleyicigörevayrımı` → `Birikmişsilme[8,2,2,1]` → `Yeni19döngüyüaz aşınanlaradağıt:[8,8,8,8]` → `B0'da1silmedaha:[9,8,8,8]` → `Host'asunulmayanGCçalışmaalanı`.

**Model:** Dörtbloklusayaçkarşılaştırması.2→3geçişindeekişdağılımıB1+6,B2+6,B3+7olarakgörünür;birandaşifa/gizlisıfırlamaolmaz. SonrakiadımB0'ıyükseltir. İleriyöndehiçbiraşınmasayacıazalmaz. Son aşamadayenibirkapasiteoranıidayetmedenfizikselalanilehostgörünümünüayıransınırlışema açılır;GCiçinayrılanbölümhost'ungörebildiğidosyaboşluğuolarakboyanmaz. Busayılargerçekwear-levelingalgoritmasınınverimliliği değildir.

**Soru/cevap:** “Birbloğusilmekonungelecekteyenidenyazılmasınısağlıyor;geçmişsilmesayacınısıfırlar mı?” — Hayır;alanıgeri kazanmakaşınmayıgerialmakdeğildir.

**Kişi3'e kesin devir:** “İsteklerin sırasını ve aygıtın yaptığı ek işi yönettik. Bu işlemlerin sonunda okuduğumuz bitlerin doğru olduğunu nasıl anlayacağız? Şimdi hata tespiti ve düzeltmeyle devam ediyoruz.” Kişi3parite/eccsahnesininaçılışsorusunuaçar;SSDfotoğraflarıveGCyenidenanlatılmaz.

## 7. Eski yapıdan yeni yapıya geçiş ve yeniden kullanım

Bu eşleme yeni mimariyi eskiye hapsetmez; yalnız mevcut çalışan kodun hangi parçalarının korunabileceğini ve eski adreslerin nereye bağlanabileceğini belirtir.

| Eski sahne / bileşen | Yeni kimlikler | Korunabilir parça | Yeni ihtiyaç |
|---|---|---|---|
| S03 / HddAnatomy | hdd-anatomy, hdd-geometry | Fotoğraf, marker, caption | Ayrı düz geometriSVG; kafa/yüzey yan kesit |
| S04 / StorageComparison | ram-disk; nvm-device'da kısa mekanik karşılaştırma | RAM/HDD/SSDfotoğrafları ve bit görünümü | RAMdiskdosyaakışınınayrıdurumları; ikiözellikmatrisi |
| S05 / AccessLab | hdd-access-cost, hdd-request-size | Saf süre modeli, birimformatı, halkalar | Controllerterimi; açıkbit/byteörneği; ikiistekboyutunuaynıkoşulda gösterenkarşılaştırma |
| S06 / SsdAnatomy | nvm-device | Dış/içgerçekfotoğraf ve görevmarkerları | KüçükNVMailesiyerleşimi |
| S07 / FlashBasics | flash-page-block | Sayfa/blokyerleşimi ve durumetiketleri | 5aşamalısafküçükmodel; geçerli/geçersiz/silinmiş karşılaştırması |
| S08 / OtherStorage | ram-disk, magnetic-tape, logical-blocks, storage-data-path | AyrıRAM/teyp/LBA/DMAşemaprimitive'leri | Tekbüyükternaryyerinedörtbağımsızmodel; gerçekpayload/adresdurumları |
| S09 / IntroCheckpoint | hdd-request-size'ınsonu; storage-data-pathdevri | Soru ve gerekçefikri | Ayrısoru-tekrarsahnesigerekmiyor; kaybolanöğrenmehedefiyok |
| S10 / QueueSetup | hdd-request-queue | Kitabınsekizkartıvebaşlangıçgirdileri | Idle/busykuyrukgerekçesi; dörtaşamadagirdi sözleşmesi |
| S11–S13 / SchedulingLab | fcfs-path, scan-path, cscan-path | Safmotor, doğru236/208ayrımı, tamamlanantekadayollar | Gelecekyolunbaştaaçılmaması; SCAN/LOOKsonuçkarşılaştırması |
| S14 / ScheduleComparison | scheduling-tradeoffs | 640/236/386çubukları ve53/199/134ayrımı | Servissırasıtablosu; tarihselpolitika/deadlinepaneli |
| S15 / NvmScheduling | nvm-scheduling | Birleştirme→gönderme→paralellik akışı | Sabitkaynaklımetriknotları; tam/çekirdekanlatımfarkı |
| S16 / FlashLab + model | flash-write-amplification | Baştansaftekrar,FTL,3/5/1sayaçları | Yalnızgörünürnotveaşamabaşlıklarınınsonplana uyumu |
| S17 / NvmCheckpoint | nvm-management-summary; flash-enduranceeki | Monotonikaşınmasayaçları veGCalanı | +19döngününfarkhesabı; DWPDşemasınıayrıek olaraküret |
| Yeniekler | hdd-history, hdd-performance-metrics | Yerel font, ortakStage/Choice | Metin/çubuk/özgünSVG; yeni donanım fotoğrafı veya video şart değil |

**Önerilen eski URL aliasları:** s03→hdd-anatomy; s04→ram-disk; s05→hdd-access-cost; s06→nvm-device; s07→flash-page-block; s08→logical-blocks; s09→hdd-request-size; s10→hdd-request-queue; s11→fcfs-path; s12→scan-path; s13→cscan-path; s14→scheduling-tradeoffs; s15→nvm-scheduling; s16→flash-write-amplification; s17→nvm-management-summary. EskiS08birdenfazlakonuyu taşıdığıiçin menü/README'deartıksplitkonumlarıaçıkolmalı. s01/s02ortakaçılışanaajanda. Görünürsahnesayısıseçilirotadan hesaplanır;URLkimliğisayısalnumarayaeşitlenmez.

## 8. Kavramsal hatalar ve kabul planı

| Yanlış çıkarım | Önleyici sahne/durum | Kontrol sorusu / doğrulama |
|---|---|---|
| Kafa yüzeye sürterek normal okur | hdd-anatomy normal/temas kesiti | Temasın headcrash riski olduğunusöyle |
| İz,sektör,silindiraynıbirim | hdd-geometry4ayrıseçim | Seçilenikişeklinadınıgörevleeşleştir |
| DönmebirimsizRPM'dendoğrudanms | hdd-access-cost birimtüretimi | 7200RPM→8,3333mstur→4,1667msortalama |
| Konumlandırma=aktarımıdahiltoplam | İkifarklıparantez/etiket | 9,1667ile9,30farkınısor |
| Mb/s=MB/s,KBherzamanaynı | Açık4KiB/125MB/s/1Gb/setiketleri | 4096Baytdoğrulaması |
| Transferiki kat oluncaIOiki kat hızlanır | hdd-request-size ikiaygıtaynımekanik | KüçükbüyükikiI/Otoplamını karşılaştır |
| Elektronikbellekherzaman uçucu | nvm-device + ram-disk güç akışı | HDD/SSD/RAMkutuplarınıkarıştırma |
| Geçersizsayfaderhalyazılabilir | flash-page-block üçdurum | Yenidenkullanmak içinblok silme gerekir |
| Silme canlıveriyisilebilir | KüçükflashveGCmodelicanlıreferanskorur | Canlıreferanskalanbloktabloklama/invariant |
| RAMdiskdosyasistemi kalıcılık sağlar | ram-diskdördüncüaşamadaeskiRAMbitleriyok | GüçgerigelinceoldRAMgeri dönmez |
| Teypterastgeleistek imkânsızdır | Öncekonumbul,sonrasıralıoku | İmkânsızilekonumbulmaliyetini ayır |
| LBAgerçekgeometriyi sabit gösterir | logical-blockssoyutlamasınırı | Bozuksektöristisnasınotta, remappingkiş3'te |
| DMAkomutveyabaytkopyasıaynı | storage-data-path ikiayrıhat | PayloadDRAM'eyazılmadanistektamamlandı çizilmez |
| FCFSen yakın isteği seçer | Resmîzigzagyol | Başlangıçyakınlığıgelişsırasınıbozmaz |
| SCAN14'tedöner/208herSCANsonucudur | scan-path236v208yolkarşılaştırması | Fiziksel0aşamasıve14katkısıtest |
| C-SCANreturnücretsiz | Dönüş+199ve2/8sabit | Dönüşöncesi53,sonrası252assert |
| Enküçüktoplamadaletpuanı | Tradeoffservissırası/tablo ve ölçüetiketleri | Çevrimiçims/starvationhesabıüretilmez |
| NVM=NVMe=FTL | Ayrıortam/arayüz/denetleyicikutuları | İstekyolundaüçününrolüyerinekonur |
| Hostyazması=fizikselyazma | GC2→4fiziksel,host2sabit | Fiziksel/hostoranıgerçeksayaçlardan |
| GCvewearlevelingaynıiş | AyrıFTL/GCörneğiveaşınmadağıtımı | Alanıkazanmaveaşınmayönetimifarklı |
| Sayaç ileri giderkenazalabilir | [8,2,2,1]→[8,8,8,8]→[9,8,8,8] | Herblok için forwardmonotonicinvariant |
| ÖrnekDWPDkesinölümgünü verir | Ekflash-endurancebütçe/garantikoşulu | 5TB/günhesabı,hiçbirgerçekömrügarantileme |
| Slaytkaynağıtamkitapmetnidoğrulamasıdır | Kaynakpanellerindedürüstdoğrulamasınırı | Bölüm+baskı+slayt+özgünmodelbilgisi |

## 9. Sunucu provası ve birleştirme görevleri

**Faz2'de bu paketin sahipliği:** kişi1/2sahneve safmodeldosyaları; ikiayrıprova dokümanı `docs/speakers/01-donanim-ve-ortamlar.md`, `docs/speakers/02-hdd-ve-nvm-zamanlama.md`. Nihai dosyaadlarıanaajanlamutabıkolur. Bu faz1belgesiuygulamaizniyerinegeçmez; anaajanbirleşikplanıyayımladıktansonra uygulanır.

Her prova dokümanında sahne kimliği, rota, saniye bütçesi, sahneye giriş cümlesi, Enterdurakları, dinleyiciyesorulacaksoru, beklenecekcevap, yanlışcevabaverilecek1cümlelikdüzeltme, model sınırı ve çıkış/devir cümlesi bulunur. Çekirdekve tamrotadakihangiaçıklamanınkısalacağı ayrıca işaretlenir. Sunucu kendi sahne sırasını ezberlerken eskiSnumaralarınıdeğil kavramadlarını kullanır.

**Birinci prova:** Yalnızçekirdekrota. Kişi1=570s; kişi2=650s. Her sahnede0'dansonaseçilenaşamalarıizle; sadecebiröğretimsorusunaseslibekle. Süreaşımıolursa önce tarihsel/yanürünifadelerinikısalt; fizikselneden→hesap→sonuç zincirini kesme.

**İkinci prova:** Geriyegezinme. Her çalışandemodasonuçtandan2–3aşamaönceyegit: yanlışeskitoplam, yanlışkafa,hayaletonay,yanlışFTLrezervivekaybolanaşınma görülsün. Geriye gitmek gerçekaygıttagerialmaanlamıtaşımasın. Aşamaadlarıvekonuşmacınotlarıgörünenstate'leuyuşsun.

**Üçüncü prova:** Tamrota. Eklerbaşlangıçtaneşsıralıziyaretedilir; çekirdeğeatlandığındabağlaçcümlesiyinemantıklıolur. P1'inhistoricperformansmetriklerinibu yılınürünsayılarıgibianlatmadığıdinlenir. P2'ninSCAN208uyuşmazlığınıuzuntartışmayadönüştürmedenişaretleyip236doğrulumotorudevamettirdiğikontrol edilir.

**Son kalite kapıları:** kaynaklısemantiksceneIDs/sıralar/secondsmetadata; tümaşamalardaayrılabilirHTML; ileri/geriaynıstate; çalışandurumdaNaN/undefinedyok; kaynakpanelindekitap/baskı/slaytveözgünmodelayrımı; hesaptestlerivebirimler; currentdateyeniperformansiddiasıyok; mevcut tasarımdilivefotoğraflarınatıflarıkorunur. Tarayıcıotomasyonu, ekran görüntüsü veya tarayıcıgörselkontrolü kullanılmaz; SSR/build/test/HTTPkanıtlarıgörselkalitegarantisidiyeanlatılmaz.
