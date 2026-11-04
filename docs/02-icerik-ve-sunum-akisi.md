# 02 — İçerik ve sunum akışı

> **Tarihsel belge:** Bu dosya önceki planı/uygulamayı kaydeder. Güncel kaynak, akış, örnek ve kabul kararları için [14 — Yeni sunum mimarisi](14-kitaba-dayali-yeni-sunum-mimarisi.md), mevcut mimari için [08 — Modüler tam sunum](08-moduler-tam-sunum.md) esas alınır. Aşağıdaki eski örnek toplamları, yapılacaklar ve kaldırılan özellikler güncel uygulama taahhüdü değildir.
> 3 Kasım 2026: S01–S09 için güncel akış [09 — Kitaba bağlı revizyon](09-kitaba-bagli-revizyon.md) ve `src/chapters/chapter-11-1/` altındadır. Bu dosyanın ilk kişi sahne tablosu önceki tasarımı kaydeder.

## 1. Anlatım ilkesi

Sunum dört bağlantılı soruya cevap verir: **Aygıt nasıl çalışır? İstekleri nasıl sıralarız? Veriyi ve alanı nasıl yönetiriz? Birden çok aygıtı nasıl bağlar ve koruruz?**

Her sahnenin kısa görünür metni, özgün diyagramı, konuşmacı notu, kaynak referansı ve bir sonraki sahneye geçiş cümlesi olacak. Aşağıdaki tablo sahne sözleşmesidir. Bölüm ayrıntıları konuşmacı notlarının yazım rehberidir; ekrana uzun paragraf olarak taşınmayacak.

Kaynak kapsamı: [resmî 10. baskı içindekiler](https://os-book.com/OS10/toc-dir/toc.pdf). Bu dosyadaki sahneler, örnekler, soru metinleri ve süreler proje için özgün olarak tasarlanmıştır. Kitabın birebir slayt dizisi değildir.

## 2. Sahne planı — 36 sahne / 45 dakika

Süreler hedef sürelerdir; otomatik sahne geçişi yapılmaz. D01–D08 için [etkileşim şartnamesine](03-etkilesimler.md) bakınız. “Kontrol” sorularının cevapları sunucunun eylemiyle açılır.

| Sahne | Bölüm / kişi | Başlık ve ana mesaj | Görsel veya etkileşim | Süre |
| --- | --- | --- | --- | --- |
| S01 | Açılış / 1 | Bir dosyayı okumak neden zaman alır? | Uygulama → OS → aygıt hattı; başlangıç sorusu | 1:00 |
| S02 | Açılış / 1 | Dört kişi, dört bakış açısı | Dört bloklu bölüm haritası | 1:00 |
| S03 | 11.1 / 1 | Kalıcı veri nerede yaşar? | RAM/RAM disk, HDD, NVM ve teyp karşılaştırması | 1:00 |
| S04 | 11.1 / 1 | HDD'nin içindeki hareket | D01: plaka, iz, sektör ve kafa seçimi | 1:30 |
| S05 | 11.1 / 1 | Erişim süresi tek sayı değildir | D01: seek + dönme + aktarım hesabı | 1:30 |
| S06 | 11.1 / 1 | OS veriyi bloklarla görür | Mantıksal bloktan aygıt eşlemesine şema | 1:00 |
| S07 | 11.1 / 1 | SSD/NVM: hareket yok, farklı maliyet var | Sayfa okuma/yazma ve silme bloğu şeması | 2:00 |
| S08 | 11.1 / 1 | Her ortam aynı iş için uygun değil | Teyp/sıralı erişim; gecikme ve aktarım farkı | 1:00 |
| S09 | 11.1 / 1 | Donanım farkı OS kararını değiştirir | Q01; Kişi 2'ye geçiş | 1:00 |
| S10 | 11.2 / 2 | Aynı kuyruk, farklı servis sırası | D02: başlangıç kafası ve beş istek | 1:00 |
| S11 | 11.2 / 2 | FCFS: geliş sırasını koru | D02: adım adım yol ve toplam hareket | 2:00 |
| S12 | 11.2 / 2 | SCAN: aynı yöndekileri topla | D02: uç nokta ve yön değişimi | 1:30 |
| S13 | 11.2 / 2 | C-SCAN: tek yönde servis | D02: dönüş yolunun da hareket maliyeti var | 1:00 |
| S14 | 11.2 / 2 | Kısa yol tek değerlendirme ölçütü değil | Sonuç tablosu; Q02; adalet ve bekleme tartışması | 1:00 |
| S15 | 11.3 / 2 | NVM'de hedef neden değişir? | Mekanik maliyet yerine yazılım/kuyruk maliyeti | 1:30 |
| S16 | 11.3 / 2 | Yazmak, silmek ve yeniden kullanmak | D03: yeniden yazma, geçersiz sayfa, GC | 2:00 |
| S17 | 11.3 / 2 | Hareket yoksa yönetim de mi yok? | Q03; dayanıklılık ve paralellik özeti | 1:00 |
| S18 | 11.4 / 3 | Veri bozulduğunu nasıl anlarız? | D04: tek bit değişimi ve parite sonucu | 1:00 |
| S19 | 11.4 / 3 | Tespit etmek ile düzeltmek farklıdır | D04: çift bit örneği; ECC kavramsal karşılaştırma | 1:30 |
| S20 | 11.5 / 3 | Fabrikadan dosyaya aygıt hazırlığı | D05: fiziksel biçim, bölümleme, dosya sistemi | 1:00 |
| S21 | 11.5 / 3 | Başlatma kodu veriyi nasıl bulur? | Firmware → bootloader → kernel; eski/yeni bağlam | 1:15 |
| S22 | 11.5 / 3 | Bozuk sektör ve yedek alan | Mantıksal blok aynı; aygıt içi yeniden eşleme | 1:15 |
| S23 | 11.6 / 3 | Swap ne sağlar, neye mal olur? | RAM frame'leri ve swap slot'ları | 1:00 |
| S24 | 11.6 / 3 | Bir sayfanın dışarı ve geri yolculuğu | D06: kirli anonim sayfa, slot ve page-in | 2:00 |
| S25 | 11.4–11.6 / 3 | Doğru veri, hazır aygıt, yönetilen alan | Q04–Q06; Kişi 4'e geçiş | 1:00 |
| S26 | 11.7 / 4 | Depolama nereye bağlı? | D07: doğrudan bağlantı, NAS ve SAN | 1:00 |
| S27 | 11.7 / 4 | Dosya erişimi ile blok erişimi | D07: istemci/sunucu dosya sistemi sorumluluğu | 1:00 |
| S28 | 11.7 / 4 | Bağlantı türünü iş yüküyle eşleştir | Bulut/API yolu; Q07; kısa karşılaştırma | 1:00 |
| S29 | 11.8 / 4 | Birden fazla disk neden kullanılır? | Kapasite, paralellik ve yedeklilik; D08 açılışı | 1:30 |
| S30 | 11.8 / 4 | Striping ve mirroring | D08: RAID 0 ve iki diskli RAID 1 | 1:00 |
| S31 | 11.8 / 4 | Parite ile yeniden kurma | D08: RAID 4/5/6 yerleşim ve koruma farkı | 1:30 |
| S32 | 11.8 / 4 | Hangi arızalardan sağ çıkılır? | D08: disk seçip arıza üret; RAID 10 çiftleri | 1:30 |
| S33 | 11.8 / 4 | Kapasitenin ve yeniden kurmanın bedeli | D08: kapasite tablosu, degraded/rebuild | 1:30 |
| S34 | 11.8 / 4 | RAID seviyesi bir ödünleşimdir | Q08; bütünlük, havuz ve nesne depolamaya kısa köprü | 1:00 |
| S35 | Kapanış / 4 | Aynı isteğin bütün yolculuğu | Dört bloğu birleştiren tek şema | 1:00 |
| S36 | Kapanış / 4 | Öğrendiklerimiz ve kaynaklar | Q09; kaynaklar, soru-cevap bağlantıları | 1:00 |

## 3. Kişi 1 — 11.1: Yapı ve erişim maliyeti

### Öğrenme hedefleri

Dinleyici HDD'nin fiziksel parçalarını tanıyabilmeli; seek, dönme gecikmesi ve aktarım süresini ayırabilmeli; mantıksal blok görünümünün donanımı soyutladığını açıklayabilmeli; NVM'nin HDD'nin hareket içermeyen kopyası olmadığını anlayabilmeli.

### Anlatımın ayrıntısı

1. **Kalıcı depolama ihtiyacı:** RAM ile kalıcı ortamı ayır. RAM diskinde bir dosya sistemi kurulabilmesi RAM'i kalıcı yapmaz; geçici çalışma alanını kısa örnekle açıkla. “İkincil depolama yalnızca HDD'dir” gibi bir tanım kullanma. Maliyet ve kapasite karşılaştırmasını kavramsal tut; güncel pazar payı veya fiyat iddiası ekleme.
2. **HDD anatomisi:** Dönen plaka, okuma/yazma kafası, iz ve sektör. Silindir kavramını aynı yarıçaptaki izler üzerinden açıkla. Diyagramın basitleştirilmiş olduğunu belirt; çizimde gerçek aygıt geometrisi vaat etme.
3. **Erişim bileşenleri:** Önce kafa hedef konuma gelir, ardından istenen sektör kafa altına döner, sonra aktarım yapılır. Kuyruk bekleme süresini aygıttaki servis süresiyle karıştırma. Hesapta birimleri görünür tut.
4. **Mantıksal bloklar:** İşletim sisteminin blok adresleri kullanması ile üreticinin fiziksel yerleşimi arasında denetleyici/eşleme katmanı bulunduğunu göster. Bütün aygıtların sektör boyutunu aynı kabul etme. Host/aygıt denetleyicisi ve DMA'yı veri yolu şemasında kısa etiketlerle tanıt; NVM'nin ortam, NVMe'nin erişim protokolü olduğunu ayır. Ayrıntılı bağlantı karşılaştırması Kişi 4'te kalır.
5. **NVM ve flash:** NVM geniş bir kategoridir; flash tabanlı SSD bu anlatımın somut örneği. Okuma/yazma sayfası ile silme bloğunu ayır. Flash üzerindeki güncellemeyi sayfayı yerinde yeniden yazmak olarak çizme.
6. **Teyp:** Sıralı veri akışının ve konum bulma maliyetinin rolünü göster. Arşiv örneği, teyp ortamının rastgele erişimde HDD gibi davranmadığını açıklamak içindir; “teypten rastgele veri okunamaz” denmez.
7. **Köprü:** Aygıtın fiziksel özelliklerinin kuyruk politikalarını değiştireceğini sorarak zamanlamaya geç.

### Sunucu notları

- D01'de aynı RPM için aktarım boyutunu artır. Dinleyiciden toplam gecikmenin hangi kısmının sabit kaldığını söylemesini iste.
- NVM'deki silme ve yazma yönetimini isim düzeyinde tanıt; algoritmik demo Kişi 2'de kalır.
- Aygıtların gerçek hızını temsil ettiği izlenimini veren marka/model etiketleri kullanma.
- Ana cümle: “Erişim maliyetini anlamadan doğru zamanlama politikasını seçemeyiz.”

**Geçiş cümlesi:** “HDD'nin neden beklediğini gördük; şimdi aynı isteklerin sırasını değiştirerek bu hareketi nasıl etkileyebileceğimizi inceleyelim.”

## 4. Kişi 2 — 11.2 ve 11.3: Zamanlama

### 11.2 öğrenme hedefleri ve anlatım

Dinleyici aynı kuyrukta FCFS, SCAN ve C-SCAN yolunu izleyebilmeli; mekanik hareket ölçüsünü hesaplayabilmeli; verimlilik, öngörülebilirlik ve adaletin farklı hedefler olduğunu söyleyebilmeli.

- **Başlangıç koşulları:** Silindir aralığı, ilk kafa konumu, yön ve kuyruk belirli olmadan algoritma karşılaştırmasının eksik olduğunu göster.
- **FCFS:** Basit ve geliş sırasına bağlı. Toplam yolun kuyruk düzeninden etkilendiğini göster.
- **SCAN:** İlerlediği yöndeki istekleri servis eder, gerekli uç noktaya gider ve döner. LOOK ile farkını ek panelde belirt.
- **C-SCAN:** Bir yönde servis; uçtan diğer uca dönüşte servis yok. Dönüş hareketi maliyet hesabından silinmez.
- **Değerlendirme:** Varsayılan örnek yalnızca toplam kafa hareketini ölçer. Gerçek servis süresi için dönme, aktarım, denetleyici ve kuyruk da önemlidir. Statik kuyruk örneğinden bütün iş yükleri için kazanan çıkarma.
- **Kararı kim verir?** OS kuyruğu ile aygıt/denetleyici kuyruğunun farklı katmanlar olduğunu göster. Okuma/yazma önceliği, birleştirme ve deadline yaklaşımı ek açıklamada yer alır. Kaynaktaki RHEL 7/NOOP/CFQ örnekleri tarihsel bağlamdır; güncel sistem varsayılanı gibi anlatılmaz.
- **Ek içerik:** SSTF, LOOK ve C-LOOK, ana üç algoritmayı karşılaştırmayı destekleyen isteğe bağlı açıklamalardır; ilk sürümde ayrı simülatör zorunluluğu yoktur. Ek kavramlar kitabın doğrulanmış ana başlıkları gibi sunulmaz.

### 11.3 öğrenme hedefleri ve anlatım

Dinleyici mekanik seek ortadan kalkınca hedefin nasıl değiştiğini; kuyruk maliyeti, paralellik ve flash yazma yönetiminin neden sürdüğünü açıklayabilmeli.

- **Mekanik fark:** HDD için faydalı olan konum odaklı yeniden sıralamanın NVM'de aynı gerekçesi yoktur. “Bütün SSD'ler daima FCFS kullanır” genellemesi yapılmaz.
- **Katman farkı:** OS I/O zamanlaması, donanım kuyrukları ve SSD denetleyicisinin FTL/GC işleri ayrı sorumluluklardır. Aynı sahnede ilgili katman etiketlenir.
- **Flash yazma modeli:** Lojik bir sayfanın yeni sürümü başka fiziksel sayfaya yazılabilir; eski sürüm geçersizleşir. Silme birden çok sayfayı kapsar.
- **Garbage collection:** Canlı verilerin taşınması ve silinen bloğun yeniden kullanılması, kullanıcı isteği dışında ek yazma işi doğurabilir.
- **Wear leveling ve over-provisioning:** Aşınmanın dengelenmesi ve ayrılmış alanı kavramsal açıkla. TRIM/discard bir verinin artık gerekmediğini bildirir; anında fiziksel silme veya güvenli veri imhası garantisi değildir.

### Sunucu notları

Önce D02'nin kayıtlı örneğini çalıştır; dinleyici isterse tek bir isteği değiştir. Serbest kuyruk girişine tüm süreyi harcama. D03'te en çok bir GC döngüsü göster. Çizilen sayfa sayılarının gerçek flash aygıt boyutları olmadığını açıkça söyle.

**Geçiş cümlesi:** “İstekleri verimli işledik; şimdi bu isteklerin doğru veriyi okuduğundan ve aygıtın kullanılabilir biçimde yönetildiğinden nasıl emin olduğumuza bakalım.”

## 5. Kişi 3 — 11.4, 11.5 ve 11.6: Hata ve alan yönetimi

### 11.4: Hata tespiti ve düzeltme

**Hedef:** Tespit ile düzeltmeyi ayırmak ve ek denetim bilgisinin her hatayı yakalamadığını anlamak.

Bir veri biti değiştirildiğinde paritenin kontrol sonucunu göster. Sonra iki bitin değiştiği ve paritenin aynı kaldığı örneği aç. Böylece sınırlılığı davranışla öğret. ECC'nin uygun hata modeli ve kod sınırı içinde düzeltme yapabileceğini belirt. CRC ve checksum'u isim düzeyinde karşılaştır; basit pariteyi gerçek disk ECC'sinin tam temsili olarak sunma. Hamming(7,4) açıklaması isteğe bağlı genişletme olabilir; ilk sürümün zorunlu çalışan demosu paritedir.

### 11.5: Depolama aygıtı yönetimi

**Hedef:** Fiziksel hazırlık, bölümleme, mantıksal biçimlendirme, açılış ve bozuk blok yönetiminin farklı işler olduğunu ayırt etmek.

- Fabrika/donanım düzeyindeki biçimlendirme ile dosya sistemi oluşturmayı ayrı katmanlarda göster.
- Bölümleme, aygıt üzerinde mantıksal bölgeler oluşturur; dosya sistemi her bölgenin kullanımını kendi yapılarıyla yönetir.
- Açılış yolunu firmware → bootloader → kernel olarak kur. Tarihsel BIOS/MBR yolu ile UEFI/GPT/EFI System Partition bağlamını tek evrensel zincir gibi birleştirme. UEFI ayrıntısı kısa bağlam açıklamasıdır; yeni bir Chapter 12 konusu açma.
- Bozuk sektörün aygıt/denetleyici tarafından yeniden eşlenmesini göster. Mantıksal adres ile fiziksel konumun aynı şey olmadığını hatırlat.
- Raw aygıt erişimi ve dosya sistemi üzerinden erişimin farklı kullanım biçimleri olduğunu ek açıklamada belirt.

### 11.6: Swap alanı yönetimi

**Hedef:** Swap slot'larının RAM frame'lerinden farklı olduğunu, page-out/page-in maliyeti ve alan tahsisinin yönetildiğini açıklamak.

Örnek, tek bir sürecin tamamı yerine sayfaları izler. Kirli anonim bir sayfa swap'a yazılıp frame serbest bırakılır; sayfa tekrar istendiğinde page-in yapılır. Temiz dosya destekli bir sayfanın bazı durumlarda yeniden dosyadan okunabilmesi, her tahliyenin swap yazması olmadığını gösterir. Swap dosyası ve ayrı swap bölümü seçenekleri konuşulur; evrensel “swap daima RAM'in iki katıdır” kuralı verilmez.

Sayfa değiştirme algoritmaları önceki bellek bölümleriyle bağlantı olarak anılır; bu sunumda FIFO/LRU yarışması açılmaz. D06'da aday sayfa hazır verilir veya sunucu seçer; model alan yönetimine odaklanır.

### Sunucu notları

D04'te çift bit yanılgısını dinleyiciye tahmin ettir. D05'te “biçimlendir” eyleminin yalnızca çizimde durum değiştirdiğini vurgulayan kısa “Eğitim modeli” etiketi olsun. D06'da hareketin yönünü oklar ve “yaz / oku” metniyle açıkla; okların rengi tek anlam taşıyıcısı olmasın.

**Geçiş cümlesi:** “Bir aygıttaki doğruluğu ve alanı yönettik. Şimdi aygıtı sisteme nasıl bağladığımızı ve birden fazla diskle hangi korumaları kurabildiğimizi görelim.”

## 6. Kişi 4 — 11.7 ve 11.8: Bağlantı ve RAID

### 11.7: Depolamanın bağlanması

**Hedef:** Doğrudan aygıt bağlantısını, ağdan dosya paylaşımını ve ağdan blok erişimini ayırmak.

DAS örneğinde host'tan yerel blok aygıtına yol çiz. NAS örneğinde istemcinin dosya isteğinin ağ üzerinden dosya sunucusuna gittiğini göster; NFS/SMB örnekleri bağlam olarak verilebilir. SAN örneğinde host'a sunulan blok hacmi ile onun üstündeki dosya sistemini ayır; Fibre Channel/iSCSI isim düzeyinde örneklenebilir. “NAS daima yavaştır, SAN daima hızlıdır” gibi bağlamdan bağımsız bir sıralama kurma. Ağın bulunması tek başına dosya veya blok semantiğini belirlemez.

Bulut depolama ana anlatıda kısa bir karşılaştırmayla yer alır: Uzak veri merkezine ağ üzerinden, örneğe göre API ile erişim gösterilir. Bütün bulut depolama türlerinin yalnızca nesne erişimi sunduğu genellemesi yapılmaz. Storage array'in denetleyiciler, diskler ve host bağlantılarından oluşabileceği; snapshot, thin provisioning ve replication gibi özelliklerin RAID'den ayrı olduğu açıklama panelinde gösterilir. Çekirdek demo DAS/NAS/SAN farkına odaklanır; bulut/API yolu S28'de statik şemadır, gerçek servis çağrısı yoktur.

### 11.8: RAID

**Hedef:** Striping, mirroring ve parity kavramlarıyla kullanılabilir kapasite, arıza toleransı ve performans ödünleşimlerini açıklamak.

1. RAID 0'da veri dağıtımını göster; yedeklilik sağlamadığını söyle.
2. İki diskli RAID 1'de kopyaları ve kapasite maliyetini göster. Okuma avantajlarının iş yükü ve uygulamaya bağlı olduğunu belirt.
3. RAID 4'te ayrılmış parite diski, RAID 5'te dağıtılmış parite fikrini yan yana göster. Bir kayıp veri bloğunu XOR ile hesapla.
4. RAID 6'nın iki bağımsız koruma bilgisi taşıdığını açıkla. İkinci koruma bilgisi aynı XOR'un kopyası olarak çizilmez; gerçek Q kodlaması bu projenin bit düzeyinde simülatör kapsamı dışındadır.
5. RAID 10'da ayna çiftlerini göster. İki arızanın sonucunu yalnızca arıza sayısıyla belirleme: aynı çiftin iki diski kayıpsa veri kurtarılamaz; farklı çiftlerde birer disk kaybı tolere edilebilir.
6. Rebuild sırasında kalan aygıtlardan okuma ve yedek aygıta yazma yapıldığını göster. Kurtarılabilir olma ile hatasız/tam hızlı çalışma aynı değildir.
7. Donanım/yazılım RAID, hot spare, denetleyici ve güç kaybı tutarlılığı kavramlarını ek açıklamada birleştir. Rebuild animasyonu gerçek zaman tahmini vermez.
8. RAID 0+1 ile 1+0'ın arıza yapısının farklı olduğunu gösteren ek panel sun. RAID 2/3 tarihsel koruma/dağıtım yaklaşımları olarak kısa açıklanır; hepsine ayrı demo ayrılmaz.
9. Ortalama arızalanma süresi (MTTF), onarım süresi (MTTR) ve veri kaybına kadar süreyi farklı ölçüler olarak açıkla. Uzun onarımın korumasız kalınan pencereyi uzattığını belirt. Bağımsız arıza varsayımıyla elde edilen teorik ömürleri gerçek garanti gibi sunma; olasılık hesabı ek notta kalır.
10. Veri bütünlüğü, checksum ve ZFS depolama havuzu fikrini S34'te kısa köprüyle anlat. Havuz, volume ve dosya sistemi ilişkisi ek şemada açılabilir. Nesne depolamada kimlikle veri erişimi, ölçekleme ve kopyalama fikri açıklanır; yeni bir dağıtık sistem dersi açılmaz. “RAID var, dolayısıyla bütün bozulmalar düzelir” sonucu çıkarılmaz.

**Ana düzeltme:** RAID bir yedekleme stratejisinin yerine geçmez. Yanlış silme, mantıksal bozulma veya bütün dizinin kaybı gibi olayları yalnızca disk yedekliliği çözmez.

### Sunucu notları

Önce dört eşit diskli RAID 5'i aç, bir diski kaybet ve pariteden bir bloğun dönüşünü göster. Sonra ikinci kaybın sonucunu sor. Ardından RAID 10'da iki farklı arıza düzenini karşılaştır. Bütün RAID seviyelerinin tüm durumlarını sahnede denemek yerine iki güçlü örnek kullan.

## 7. Öğrenme kontrolü soruları

Bunlar bu proje için yazılmış sorulardır. Resmî soru/çözüm kitapçığından aktarım değildir. Cevapla birlikte kısa gerekçe açılır; yalnızca “doğru/yanlış” rengi gösterilmez.

| Kimlik | Bölüm | Soru | Beklenen cevap ve gerekçe |
| --- | --- | --- | --- |
| Q01 | 11.1 | Küçük bir HDD okumasında yüksek aktarım hızı bütün gecikmeyi ortadan kaldırır mı? | Hayır; seek ve dönme gecikmesi sürer |
| Q02 | 11.2 | C-SCAN'de uçtan başa dönüş toplam kafa hareketine katılır mı? | Evet; dönüşte istek servis edilmemesi hareketi ücretsiz yapmaz |
| Q03 | 11.3 | SSD'de seek yoksa OS ve denetleyicinin yöneteceği maliyet kalmaz mı? | Kalır; kuyruk maliyeti, paralellik ve flash yazma/silme işleri vardır |
| Q04 | 11.4 | Tek parite biti, iki veri bitinin değiştiği her hatayı yakalar mı? | Hayır; çift sayıda değişim pariteyi koruyabilir |
| Q05 | 11.5 | Bölüm oluşturmak ile dosya sistemi oluşturmak aynı işlem midir? | Hayır; mantıksal bölge ayırma ile o bölgede dosya yapıları oluşturma farklıdır |
| Q06 | 11.6 | RAM'den çıkarılan her sayfa swap'a yazılmak zorunda mıdır? | Hayır; yeniden okunabilen temiz dosya sayfaları için yazma gerekmeyebilir |
| Q07 | 11.7 | Ağ üzerinden erişim, mutlaka dosya paylaşımı anlamına mı gelir? | Hayır; SAN örneğinde ağ üzerinden blok erişimi de sunulabilir |
| Q08 | 11.8 | Dört diskli RAID 10 her iki disk arızasını da tolere eder mi? | Hayır; aynı ayna çiftindeki iki kayıp veri kaybına yol açar |
| Q09 | Bütün bölüm | “Hızlı ve yedekli depolama” tek başına doğru bir tasarım tanımı mıdır? | İş yükü, erişim semantiği, hata modeli ve yedekleme ihtiyacı da belirtilmelidir |

## 8. İçerik yazım kuralları

- Ana sahnede bir sav ve onu açıklayan görsel bulunur; ayrıntılı notlar ayrı alandadır.
- Hesaplarda kullanılan değerler “örnek eğitim parametreleri” olarak etiketlenir.
- MB ve MiB, ms ve µs karıştırılmaz; her grafik ekseni birim taşır.
- Güncel ürün performansı ve pazar payı sayıları bu anlatının gereği değildir.
- Yeni kavramlar ilk kullanımda Türkçe ve İngilizce birlikte görünür; sonrası tutarlıdır.
- Yanlış genellemeler kısa ve doğru karşılıklarıyla konuşmacı notlarında tutulur.
- Bir demoyu atlayınca ana açıklama ve kayıtlı örnek sonucu yine görünür olur.
- Kaynak bölüm etiketi her sahnede izlenebilir; kitap metni, özgün anlatım ve ek açıklama birbirine karıştırılmaz.

## 9. Kapanış ve soru-cevap akışı

S35'te tek bir okuma isteği seçilir: host bağlantısı → OS kuyruğu → mantıksal blok → aygıt → veri bütünlüğü kontrolü → uygulama. RAID kullanılıyorsa fiziksel aygıtın birden fazla diskten oluşabileceği gösterilir. Swap, normal dosya okumasının zorunlu adımı gibi bu zincire eklenmez; başka bir depolama kullanım amacı olarak yan dalda kalır.

S36'da dört kişi birer cümleyle kendi bölümünün sonucunu hatırlatabilir. Soru belirli bir bölüme aitse menüden ilgili sahneye dönülür. Demolar otomatik başlamaz; gerekirse “örneği sıfırla” ile bilinen başlangıç durumu açılır.
