# Sunucu 1 — Donanım, ortamlar ve erişim maliyeti

5 Kasım 2026. OSC10 V3. Kaynak: **Operating System Concepts, Tenth Edition, Bölüm 11.1** ve yazarların resmî Chapter11 slaytları. Bu metin sahnedeki görünümü sesli açıklamak içindir; paragraf slayta taşınmaz.

**Süre kartı:** çekirdek **9:30**; tam **19:30**. Açılış/kapanış ortak sunum bütçesindedir. Enter aşama ileri, Backspace aşama geri; son aşamada sahne değişmez. Sahne oklarıyla sonraki sayfaya geçilir. Tuşa basılı tutarak aşama atlanmaz.

**Görsel hazırlık:** [HDD ve SSD parça rehberi](../public/references/donanim-gorsel-rehberi.html). HDD’de 1 plaka, 2 mil, 3 kol, 4 park alanındaki kafa ucudur. SSD iç kartında 1 denetleyici, 2 NAND flash örneği, 3 SATA bağlantısıdır. Aynı numaralar sunumda ve rehberde kullanılır.

## İlk prova — çekirdek rota

Başlangıç: `hdd-anatomy`. Menüde çekirdek rotayı seç. Ek sahneler geçiş sırasına dahil değildir. Aşağıdaki her çekirdek kartın süre bütçesine uy. Her sahnede tek ana soru sor; 3–5 saniye tahmin bekle, gerekçeyi göster. Uzun sayısal dizileri tek tek okumak yerine ilk katkıyı ve karar değiştiren hareketi vurgula.

## İkinci prova — geri kurma ve sınırlar

Maliyet toplamından dönme aşamasına dön; toplam tekrar ? olmalı. Flash silme öncesine dön; A bloğundaki eski geçersiz sayfalar geri görünmeli. RAM gücü geri geldiğinde veri geri gelmemeli.

## Üçüncü prova — tam rota

Tarih, performans ölçütleri ve DWPD eklerini doğal sıralarında aç. Eklerdeki sayıları güncel ürün özelliği diye sunma. Ekten çıktığında aşağıdaki köprü cümlesine dön.

## Sahne kartları

### 1. HDD: hareketin kaynağı — `hdd-anatomy`

**Rota / süre:** çekirdek ve tam; çekirdek 1:15 / tam 2:00. **Kaynak:** 11.1; resmî slayt 4, 5.

**Giriş cümlesi:** “Bir dosyayı okumak, bu fiziksel aygıtta iki ayrı hareketi bekletebilir.”

**Aşama eylemleri ve söylem:**

1. Sahne açıldığında **Gerçek HDD**: Manyetik yüzeydeki veriye mekanik hareketle ulaşılır.
2. Enter ile **Plaka ve mil**: Mil, manyetik kaplı plakaları döndürür.
3. Enter ile **Kol ve okuma/yazma kafası**: Kol, okuma/yazma kafasını hedef yarıçapa götürür.
4. Enter ile **Konumlanma ile dönme farklı**: Kolun konumlanması ve sektörün kafa altına dönmesi ayrı işlerdir.
5. Enter ile **Normal boşluk ve head crash riski**: Normal okumada kafa yüzeye sürtmez. Temas, head crash riskidir.

**Dinleyici sorusu:** Disk dönerken hedef iz kafanın altında değilse yalnız dönüşü beklemek yeter mi?
**Beklenen cevap / yanlış cevabı düzeltme:** Hayır; kafa hedef yarıçapa da konumlanmalıdır.

**Kaçınılacak çıkarım:** Kafa fotoğrafta park konumundadır. Normal okumada yüzeye temas ettiği söylenmez; head crash ayrı risk olarak gösterilir.

**Geçiş / devir:** “Hedef konumu iz, sektör ve silindir olarak adlandıralım.”

**Tam anlatımda genişlet:** Tahmin için daha uzun bekle; yanlış cevabı modelde önceki aşamaya dönerek açıkla. Yeni ürün bilgisi veya yeni kaynak ekleme.

### 2. İz, sektör ve silindir — `hdd-geometry`

**Rota / süre:** çekirdek ve tam; çekirdek 0:45 / tam 1:15. **Kaynak:** 11.1; resmî slayt 5, 14, 16.

**Giriş cümlesi:** “Hedef konumun adı önemli: iz, sektör ve silindir birbirinin yerine kullanılmaz.”

**Aşama eylemleri ve söylem:**

1. Sahne açıldığında **Tek yüzey**: Şema bir disk yüzeyini temsil eder; gerçek aygıtın birebir geometrisi değildir.
2. Enter ile **İz: dairesel yol**: dairesel yol: İz, yüzeydeki dairesel kayıt yoludur.
3. Enter ile **Sektör: izin parçası**: izin parçası: Sektör, bir izin parçasıdır; izin bütünü değildir.
4. Enter ile **Silindir: aynı yarıçaptaki izler**: aynı yarıçaptaki izler: Silindir, farklı yüzeylerde aynı yarıçaptaki izlerin geometrik grubudur.

**Dinleyici sorusu:** Bir sektör bütün bir silindir midir?
**Beklenen cevap / yanlış cevabı düzeltme:** Hayır; sektör bir iz parçası, silindir aynı yarıçaptaki izler grubudur.

**Kaçınılacak çıkarım:** Gerçek fotoğrafta iz/sektör çizgileri görünürmüş gibi konuşma. Silindir parça adı değil, geometrik gruptur.

**Geçiş / devir:** “Bu konuma ulaşmanın süresini parçalara ayıralım.”

**Tam anlatımda genişlet:** Tahmin için daha uzun bekle; yanlış cevabı modelde önceki aşamaya dönerek açıkla. Yeni ürün bilgisi veya yeni kaynak ekleme.

### 3. Bir HDD okumasının maliyeti — `hdd-access-cost`

**Rota / süre:** çekirdek ve tam; çekirdek 1:30 / tam 2:30. **Kaynak:** 11.1; resmî slayt 4, 6, 7.

**Giriş cümlesi:** “Şimdi bir küçük okumanın neden yaklaşık9,30 ms sürdüğünü parçalara ayıralım.”

**Aşama eylemleri ve söylem:**

1. Sahne açıldığında **İstek ve açık birimler**: 4 KiB = 4096 B. 1 Gb/s = 125 MB/s. Kuyruk beklemesi bu servis hesabının dışındadır.
2. Enter ile **Seek: 5 ms**: 5 ms: Seek: kafa hedef ize gelir. Örnekte 5 ms.
3. Enter ile **Ortalama dönme: 4,1667 ms**: 4,1667 ms: 7200 RPM → bir tur 8,3333 ms → ortalama dönme beklemesi 4,1667 ms.
4. Enter ile **Konumlandırma: 9,1667 ms**: 9,1667 ms: Konumlandırma = seek + ortalama dönme = 9,1667 ms.
5. Enter ile **4 KiB aktarımı: 0,032768 ms**: 0,032768 ms: Aktarım = 4096 B / 125.000.000 B/s = 0,032768 ms.
6. Enter ile **Denetleyici ve toplam: 9,30 ms**: 9,30 ms: Denetleyici 0,1 ms de eklenir: örnek servis süresi 9,30 ms. Uygulamanın toplam gecikmesi değildir.

**Dinleyici sorusu:** 9,1667 ms ile 9,30 ms neden farklı adlandırılıyor?
**Beklenen cevap / yanlış cevabı düzeltme:** İlki konumlandırma, ikincisi aktarım ve denetleyici dahil örnek servis süresidir.

**Kaçınılacak çıkarım:** 4 KiB=4096 B;1 Gb/s=125 MB/s. Dönme için dakika/saniye dönüşümünü açıkla. Kaynaktaki 9,301 ile yeni açık birimli9,30 gösterimini kesin eşitmiş gibi sunma. Kuyruk dışarıda,controller 0,1 ms içeride.

**Geçiş / devir:** “Yalnız veri miktarı veya hız değişirse hangi terim değişir?”

**Tam anlatımda genişlet:** Tahmin için daha uzun bekle; yanlış cevabı modelde önceki aşamaya dönerek açıkla. Yeni ürün bilgisi veya yeni kaynak ekleme.

### 4. Küçük istek, büyük mekanik pay — `hdd-request-size`

**Rota / süre:** çekirdek ve tam; çekirdek 0:45 / tam 1:30. **Kaynak:** 11.1; resmî slayt 7.

**Giriş cümlesi:** “Aygıtı değiştirmeden veri miktarını, sonra yalnız aktarım hızını değiştireceğiz.”

**Aşama eylemleri ve söylem:**

1. Sahne açıldığında **4 KiB / 125 MB/s**: 4 KiB için aktarım çok küçük; konumlandırma toplamda baskındır.
2. Enter ile **1 MiB / aynı aygıt**: 1 MiB daha fazla aktarım işi getirir. Seek, dönme ve denetleyici aynı kaldı.
3. Enter ile **Aktarım hızını iki katına çıkar**: Hız 125’ten 250 MB/s’ye çıktı: yalnız aktarım süreleri yarıya indi.
4. Enter ile **Değişen ve değişmeyen bileşenler**: Küçük I/O’nun toplamı yarıya inmedi. Mekanik pay, daha hızlı aktarımın kazancını sınırlar.

**Dinleyici sorusu:** Aktarım iki kat hızlanınca küçük I/O toplamı yarıya iner mi?
**Beklenen cevap / yanlış cevabı düzeltme:** Hayır; seek, dönme ve denetleyici terimleri aynı kalır.

**Kaçınılacak çıkarım:** Yalnız transfer bileşeni değişir. Küçük isteğin toplamı iki kat hızlanmaz. Bu değerler ürün kıyaslaması değildir.

**Geçiş / devir:** “Şimdi mekanik beklemeyi taşımayan aygıta geçelim; tam rotadaki tarih ve ölçüt ekleri isteğe bağlıdır.”

**Tam anlatımda genişlet:** Tahmin için daha uzun bekle; yanlış cevabı modelde önceki aşamaya dönerek açıkla. Yeni ürün bilgisi veya yeni kaynak ekleme.

### 5. Kitaptaki ilk ticari disk örneği — `hdd-history`

**Rota / süre:** yalnız tam rota; çekirdek 0:00 / tam 0:45. **Kaynak:** 11.1; resmî slayt 8.

**Giriş cümlesi:** “Bu kısa ek, bugünün ürününü değil kitabın tarihsel başlangıç örneğini gösteriyor.”

**Aşama eylemleri ve söylem:**

1. Sahne açıldığında **1956: IBM Model 350**: IBM Model 350: 1956: kitabın tarihsel örneği IBM Model 350.
2. Enter ile **50 plaka ve 5 milyon 7-bit karakter**: 50 adet 24 inç plaka; 5 milyon 7-bit karakter. Modern MB birimine sessizce çevirmiyoruz.
3. Enter ile **Tarihsel erişim ölçeği**: Erişim bir saniyenin altındaydı. Bu sayılar bugünün ürün özellikleri değildir.

**Dinleyici sorusu:** Bu sayılar bugün satılan HDD özellikleri midir?
**Beklenen cevap / yanlış cevabı düzeltme:** Hayır; 1956 IBM Model 350’nin kitaptaki tarihsel örneğidir.

**Kaçınılacak çıkarım:** 5 milyon 7-bit karakteri sessizce5 MB yapma; tarihsel değerleri bugün satılan HDD özelliği diye verme.

**Geçiş / devir:** “Ölçek kadar kullandığımız performans ölçüsü de önemli.”

**Çekirdekte atlama:** Bu kartı açmadan önceki çekirdek kartın geçiş cümlesinden sonraki çekirdek konuya geç. Süre yetişmiyorsa bu ek konuyu ana örnekten zaman alarak genişletme.

### 6. Hız, gecikme ve bandwidth — `hdd-performance-metrics`

**Rota / süre:** yalnız tam rota; çekirdek 0:00 / tam 1:15. **Kaynak:** 11.1, 11.2; resmî slayt 6, 7, 17.

**Giriş cümlesi:** “Bir arayüz hızı gördüğümüzde onu tek okuma süresi sanmayalım.”

**Aşama eylemleri ve söylem:**

1. Sahne açıldığında **Tarihsel arayüz tavanı: 6 Gb/s**: 6 Gb/s: 6 Gb/s: kaynaktaki tarihsel teorik arayüz örneği. Tek I/O’nun gecikmesi değildir.
2. Enter ile **Tarihsel etkin örnek: 1 Gb/s**: 1 Gb/s: 1 Gb/s: kaynaktaki etkin aktarım örneği. Arayüz tavanıyla aynı değer değildir.
3. Enter ile **Tek I/O servis süresi: ms**: ms: 9,30 ms: bir önceki açık birimli tek I/O hesabı. Hız ile süre farklı birimlerdir.
4. Enter ile **Toplam byte / toplam geçen süre**: Disk bandwidth’i: toplam aktarılan byte / ilk isteğin başlangıcından son tamamlanmaya kadar geçen süre.

**Dinleyici sorusu:** 6 Gb/s arayüz her küçük okumanın o hızla tamamlandığını mı söyler?
**Beklenen cevap / yanlış cevabı düzeltme:** Hayır; arayüz tavanı, etkin aktarım ve tek I/O gecikmesi farklı ölçülerdir.

**Kaçınılacak çıkarım:** Gb/s,MB/s ve ms farklı birimlerdir. Kaynaktaki6/1 Gb/s tarihsel örnek; güncel arayüz veya ürün tavsiyesi değildir.

**Geçiş / devir:** “NVM mekanik gecikmeyi kaldırsa da bağlantı ve yazılım yolu sürer.”

**Çekirdekte atlama:** Bu kartı açmadan önceki çekirdek kartın geçiş cümlesinden sonraki çekirdek konuya geç. Süre yetişmiyorsa bu ek konuyu ana örnekten zaman alarak genişletme.

### 7. SSD, NVM ailesinin bir örneği — `nvm-device`

**Rota / süre:** çekirdek ve tam; çekirdek 0:45 / tam 1:15. **Kaynak:** 11.1; resmî slayt 9.

**Giriş cümlesi:** “Aynı kalıcılık amacına dönen plaka kullanmadan da ulaşılabilir.”

**Aşama eylemleri ve söylem:**

1. Sahne açıldığında **Gerçek SSD dışı**: Flash tabanlı SSD, veriyi güç kesildiğinde de tutan bir NVM aygıtıdır.
2. Enter ile **İç kart: flash ve denetleyici**: flash ve denetleyici: İç kartta flash veriyi tutar; denetleyici istekleri yönetir.
3. Enter ile **Mekanik maliyetleri karşılaştır**: SSD’de seek ve dönme yoktur. Aktarım, yazılım ve flash yönetimi işi devam eder.
4. Enter ile **NVM aygıt ailesi**: SSD, USB flash ve gömülü aygıtlar NVM ailesinin farklı örnekleridir; hepsi aynı ürün değildir.

**Dinleyici sorusu:** Elektronik olan her bellek uçucu mudur?
**Beklenen cevap / yanlış cevabı düzeltme:** Hayır; flash SSD kalıcıdır, RAM uçucudur.

**Kaçınılacak çıkarım:** NVM ortam ailesidir; NVMe arayüzdür. Bütün SSD’ler için aynı kart düzeni veya aynı flash ayrıntısı genellenmez.

**Geçiş / devir:** “Hareket yok, fakat yazma ve silmenin fiziksel kuralları var.”

**Tam anlatımda genişlet:** Tahmin için daha uzun bekle; yanlış cevabı modelde önceki aşamaya dönerek açıkla. Yeni ürün bilgisi veya yeni kaynak ekleme.

### 8. Sayfa oku, blok sil — `flash-page-block`

**Rota / süre:** çekirdek ve tam; çekirdek 1:30 / tam 2:15. **Kaynak:** 11.1; resmî slayt 10, 11.

**Giriş cümlesi:** “Flash hareket etmiyor; fakat güncelleme ve yeniden kullanımın fiziksel kuralları var.”

**Aşama eylemleri ve söylem:**

1. Sahne açıldığında **Sayfa ve silme bloğu**: Küçük kutular sayfa, büyük çerçeveler silme bloğudur. Geometri eğitim ölçeğidir.
2. Enter ile **P0’ı oku: içerik değişmez**: içerik değişmez: P0’daki L0 okunuyor. Okuma, sayfanın içeriğini değiştirmez.
3. Enter ile **Yeni L0 sürümünü boş P6’ya yaz**: L0’ın yeni sürümü boş P6’ya yazıldı; eski P0 geçersiz oldu, fakat silinmedi.
4. Enter ile **Canlı verisi kalmayan A’yı sil**: A’da canlı veri kalmadı; dört sayfa birlikte silindi. B’deki canlı veriler korunur.
5. Enter ile **Geçerli, geçersiz ve silinmiş**: P6 geçerli, P5 geçersiz, P0 silinmiş. Geçersiz veri ile yeniden yazılabilir boş sayfa aynı değildir.

**Dinleyici sorusu:** Geçersiz sayfa doğrudan yeniden yazılabilir mi?
**Beklenen cevap / yanlış cevabı düzeltme:** Hayır; daha büyük blok silme kuralı sürer.

**Kaçınılacak çıkarım:** Canlı veri içeren blok silinmez. Geçersiz sayfa boş sayfa değildir. Burada GC canlı taşıması ve fiziksel/host sayacı tekrar anlatılmaz.

**Geçiş / devir:** “Kalıcı flash ile RAM diskin uçuculuğunu ayıralım; DWPD eki dayanıklılık ölçüsünü açar.”

**Tam anlatımda genişlet:** Tahmin için daha uzun bekle; yanlış cevabı modelde önceki aşamaya dönerek açıkla. Yeni ürün bilgisi veya yeni kaynak ekleme.

### 9. Sınırlı silme ömrü ve DWPD — `flash-endurance`

**Rota / süre:** yalnız tam rota; çekirdek 0:00 / tam 1:30. **Kaynak:** 11.1; resmî slayt 10, 11.

**Giriş cümlesi:** “Silme yeni alan açar. Bu, belleğin sınırsız sayıda silinebileceği anlamına gelmez.”

**Aşama eylemleri ve söylem:**

1. Sahne açıldığında **Sınırlı program/silme dayanıklılığı**: Yeniden kullanılabilir alan kazanmak, birikmiş aşınmayı geri almaz. Silme ömrü sınırlıdır.
2. Enter ile **Kaynaktaki 1 TB / 5 DWPD**: Resmî slaydın örneği: 1 TB aygıt, 5 DWPD derecesi.
3. Enter ile **Günlük örnek bütçe: 5 TB**: 5 TB: 1 TB × 5 = 5 TB/gün. Bu bir yazma hacmi derecelendirmesidir, hücre silme sayısı değildir.
4. Enter ile **3 TB ve 6 TB günlük yükü karşılaştır**: 3 TB/gün örnek bütçenin altında; 6 TB/gün üzerinde. Bu karşılaştırma kesin bir arıza günü tahmini değildir.

**Dinleyici sorusu:** 5 DWPD, her hücrenin günde 5 kez silinmesi midir?
**Beklenen cevap / yanlış cevabı düzeltme:** Hayır; kapasiteye göre günlük yazma hacmi derecelendirmesidir.

**Kaçınılacak çıkarım:** 5 DWPD hücre silme adedi değildir. Örnek bütçe üstü yük, kesin arıza günü göstermez. Her NAND için100.000 sabit ömür iddiası yok.

**Geçiş / devir:** “Kalıcı ortamın sınırlarını gördük; uçucu depolamayı ayıralım.”

**Çekirdekte atlama:** Bu kartı açmadan önceki çekirdek kartın geçiş cümlesinden sonraki çekirdek konuya geç. Süre yetişmiyorsa bu ek konuyu ana örnekten zaman alarak genişletme.

### 10. Dosya sistemi RAM’i kalıcı yapmaz — `ram-disk`

**Rota / süre:** çekirdek ve tam; çekirdek 0:45 / tam 1:15. **Kaynak:** 11.1; resmî slayt 4, 9, 12.

**Giriş cümlesi:** “RAM üzerinde dosya oluşturabiliriz; bundan kalıcılık sonucu çıkarabilir miyiz?”

**Aşama eylemleri ve söylem:**

1. Sahne açıldığında **RAM disk olarak sunulur**: RAM, blok aygıtı gibi sunulup dosya sistemiyle kullanılabilir; uçuculuğu değişmez.
2. Enter ile **Dosya olarak veri yerleştir**: Örnek dosya RAM diske yazıldı. Dosya sistemi arayüzü kalıcılık sağlamaz.
3. Enter ile **Gücü kes: RAM verisi kaybolur**: RAM verisi kaybolur: Güç kesildi: RAM içeriği kayboldu. HDD ve flash SSD’deki kayıt korunur.
4. Enter ile **Güç geri gelir: eski RAM verisi dönmez**: eski RAM verisi dönmez: Güç geri geldi: eski RAM verisi kendiliğinden dönmez. Uçuculuk ve mekanik hareket ayrı özelliklerdir.

**Dinleyici sorusu:** Dosya sistemi RAM diski kalıcı yapar mı?
**Beklenen cevap / yanlış cevabı düzeltme:** Hayır; yazılım arayüzü fiziksel uçuculuğu değiştirmez.

**Kaçınılacak çıkarım:** Güç geri geldiğinde eski RAM bitlerini geri getirme. Dosya sistemi ile ortamın uçuculuğu farklıdır.

**Geçiş / devir:** “Başka bir kalıcı ortamın, teybin erişim şekli farklıdır.”

**Tam anlatımda genişlet:** Tahmin için daha uzun bekle; yanlış cevabı modelde önceki aşamaya dönerek açıkla. Yeni ürün bilgisi veya yeni kaynak ekleme.

### 11. Önce konumu bul, sonra sırayla aktar — `magnetic-tape`

**Rota / süre:** çekirdek ve tam; çekirdek 0:30 / tam 1:00. **Kaynak:** 11.1; resmî slayt 13.

**Giriş cümlesi:** “Şimdi konum bulma ile ardışık aktarma farkını teyple görelim.”

**Aşama eylemleri ve söylem:**

1. Sahne açıldığında **Sıralı kayıt şeridi**: Manyetik teyp, kayıtların sıralı veri akışıyla işlendiği kalıcı bir ortamdır.
2. Enter ile **Uzak kaydın konumunu bul**: Uzak bir kaydı seçmek için önce konum bulunur; konum bulma işi vardır.
3. Enter ile **Ardışık kayıtları oku**: Konum bulunduğunda ardışık kayıtlar aktarılır. Arşiv ve yedekleme bu erişim biçiminin bağlamıdır.

**Dinleyici sorusu:** Kayıt konumunu bulmak ve ardından aktarmak aynı iş midir?
**Beklenen cevap / yanlış cevabı düzeltme:** Hayır; konum bulma ve ardışık aktarım ayrı işlerdir.

**Kaçınılacak çıkarım:** Rastgele kaydı seçmek imkânsız değildir; konum bulma maliyeti vardır. Şemanın temposu gerçek teyp süresi değildir.

**Geçiş / devir:** “Ortamlar farklı; OS disk aygıtını ortak bir adres görünümüyle kullanır.”

**Tam anlatımda genişlet:** Tahmin için daha uzun bekle; yanlış cevabı modelde önceki aşamaya dönerek açıkla. Yeni ürün bilgisi veya yeni kaynak ekleme.

### 12. OS’nin mantıksal blok görünümü — `logical-blocks`

**Rota / süre:** çekirdek ve tam; çekirdek 0:45 / tam 1:15. **Kaynak:** 11.1; resmî slayt 14, 16.

**Giriş cümlesi:** “Bu farklı fiziksel ayrıntılar OS arayüzünde tek boyutlu adreslere dönüşür.”

**Aşama eylemleri ve söylem:**

1. Sahne açıldığında **Numaralı LBA dizisi**: OS, diski tek boyutlu numaralı mantıksal blok dizisi olarak adresler.
2. Enter ile **LBA3 okuma isteği**: İstek LBA 3’ü seçti; bu sayı bir fiziksel yüzey resmi değildir.
3. Enter ile **Temel sıralı sektör eşlemesi**: Kitabın temel modeli blokları sektörlere sıralı eşler. Buradaki geometri küçük bir eğitim modelidir.
4. Enter ile **Fiziksel ayrıntıyı gizle, LBA’yı koru**: Fiziksel ayrıntı gizlenebilir; LBA 3 isteği korunur. Bozuk sektör ve geometri ayrıntıları eşlemeyi karmaşıklaştırabilir.

**Dinleyici sorusu:** LBA her diskte aynı fiziksel koordinatı garanti eder mi?
**Beklenen cevap / yanlış cevabı düzeltme:** Hayır; aygıt eşlemesi ve fiziksel istisnalar vardır.

**Kaçınılacak çıkarım:** LBA3 evrensel fiziksel koordinat değildir. Bozuk sektörün ayrıntılı yeniden eşleme demosunu kişi 3’e bırak.

**Geçiş / devir:** “Bu adresli komut aygıta nasıl gider; veri RAM’e nasıl gelir?”

**Tam anlatımda genişlet:** Tahmin için daha uzun bekle; yanlış cevabı modelde önceki aşamaya dönerek açıkla. Yeni ürün bilgisi veya yeni kaynak ekleme.

### 13. Komut yolu ve DMA veri yolu — `storage-data-path`

**Rota / süre:** çekirdek ve tam; çekirdek 1:00 / tam 1:45. **Kaynak:** 11.1, 11.2; resmî slayt 15, 18.

**Giriş cümlesi:** “Son olarak bir komutun ve gerçek verinin yollarını ayıralım.”

**Aşama eylemleri ve söylem:**

1. Sahne açıldığında **OS isteği ve hedef RAM**: OS, bir LBA okuma isteğini ve verinin yerleştirileceği DRAM alanını belirler.
2. Enter ile **Host denetleyicisine komut**: Komut, bilgisayar tarafındaki host denetleyicisine iletilir.
3. Enter ile **Aygıt denetleyicisine mesaj**: Host denetleyicisi aygıt denetleyicisine mesaj gönderir.
4. Enter ile **Aygıtta veri erişimi**: Aygıt veriye erişir. Komutun gelmesi, verinin DRAM’e taşındığı anlamına gelmez.
5. Enter ile **DMA ile DRAM’e veri aktarımı**: DMA ile veri aygıttan DRAM’e aktarılır. Kontrol yolu ile veri yolu ayrı akışlardır.

**Dinleyici sorusu:** Komut ve verinin DRAM’e aktarılması aynı ok mudur?
**Beklenen cevap / yanlış cevabı düzeltme:** Hayır; controller komut yolu ile DMA veri aktarımı ayrıdır.

**Kaçınılacak çıkarım:** Komutun gönderilmesi ile payload’ın DRAM’e gelmesini aynı olay yapma. DMA’yı CPU byte byte kopyalıyor gibi çizme.

**Geçiş / devir:** “OS aygıtı mantıksal bloklarla adresliyor. Aygıt HDD ise istek sırası fiziksel hareketi değiştiriyor. Şimdi aynı kuyruğu farklı sıralarla karşılamak için sözü ikinci sunucuya bırakıyorum.”

**Tam anlatımda genişlet:** Tahmin için daha uzun bekle; yanlış cevabı modelde önceki aşamaya dönerek açıkla. Yeni ürün bilgisi veya yeni kaynak ekleme.

## Son devir kartı

“OS aygıtı mantıksal bloklarla adresliyor. Aygıt HDD ise bu isteklerin sırası fiziksel hareketi değiştiriyor. Şimdi aynı kuyruğu farklı sıralarla karşılamak için sözü ikinci sunucuya bırakıyorum.” İkinci sunucu `hdd-request-queue` ilk aşamasını açar.

## Doğrulama sınırı

Kitabın tam metni yerel depoda yoktur. Bölüm/baskı eşlemesi resmî içindekilere, ayrıntılı kavramlar resmî slaytlara dayanır. Örnekler ve Türkçe söylem projeye aittir. Tarayıcı otomasyonu ve ekran görüntüsü kullanılmaz; hesap, SSR, TypeScript ve HTTP kontrolleri görsel doğrulama diye anlatılmaz.
