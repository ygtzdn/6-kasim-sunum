# 05 — Uygulama ve doğrulama planı

> **Tarihsel belge:** Bu dosya önceki planı/uygulamayı kaydeder. Güncel kaynak, akış, örnek ve kabul kararları için [14 — Yeni sunum mimarisi](14-kitaba-dayali-yeni-sunum-mimarisi.md), mevcut mimari için [08 — Modüler tam sunum](08-moduler-tam-sunum.md) esas alınır. Aşağıdaki eski örnek toplamları, yapılacaklar ve kaldırılan özellikler güncel uygulama taahhüdü değildir.

## 1. Mevcut aşama ve teslim sınırı

İlk dokümantasyon tesliminden sonra S01–S09 uygulandı. Güncel kapsam ve tasarım [07 — Güncel uygulama](07-guncel-uygulama.md) içindedir. Aşağıdaki tablo bütün bölüm için kabul planıdır; tüm maddelerin tamamlandığını göstermez. Son tasarım revizyonunda kullanıcı isteğiyle tarayıcı doğrulaması yapılmaz; derleme ve dört HDD hesap testi kullanılır.

## 2. Uygulama sırası

| Adım | Yapılacak iş | Somut çıktı | Tamamlanma ölçütü |
| --- | --- | --- | --- |
| A1 | İçerik verisini kur | Sunucu, 36 sahne, dokuz soru, kaynak kayıtları | Bölüm/sunucu ve süre eşlemesi doğru |
| A2 | Sunum kabuğunu kur | Sahne, navigasyon, URL, bölüm menüsü | S01–S36 baştan sona erişilebilir |
| A3 | Görsel dili uygula | Tipografi, tema, SVG şema sistemi | Projeksiyona uygun ilk bütün akış |
| A4 | D01 ve D02 | Erişim hesabı ve üç zamanlama algoritması | Beklenen sayılar ve uç nokta kuralları doğru |
| A5 | D03–D06 | NVM, parite, aygıt ve swap modelleri | Sayaçlar/eşlemeler tutarlı; veri kaybı yok |
| A6 | D07 ve D08 | Topoloji ve RAID modeli | Kapasite, arıza, rebuild kuralları doğru |
| A7 | Sunum yardımcıları | Notlar, kronometre, okuma modu, sözlük, print | Mod geçişi ve klavye davranışı tutarlı |
| A8 | Doğrulama ve prova | Hesap testleri, ekran kontrolü, süre provası | Kabul tablosunun bütün zorunlu maddeleri karşılanır |
| A9 | Yerel paket / hedefe göre statik yayın | Tam statik dosya paketi | Eksik varlık yok; README gerçek çalıştırma bilgileriyle güncel |

Kodlama sırasında sunucuların kapsamı değişmez. Sekiz demonun hepsi ilk sürümde yer alır; çalışan ürün tesliminde bunların sessizce statik görsele düşürülmesi kabul edilmez. İlk sürümün sadeleştirmeleri şartnamede zaten açıkça belirtilmiştir: Serbest NVM iş yükü, Hamming motoru ve gerçek RAID 6 Q hesabı zorunlu değildir.

## 3. İş listesi

### İçerik

- [ ] Kişi 1–4 adları verildiyse yer tutucuları güncelle.
- [ ] 36 sahne için kısa görünür metinleri ve konuşmacı notlarını yaz.
- [ ] S03'te RAM diskini kalıcı depolamadan ayır.
- [ ] 11.2'de OS ve aygıt/denetleyici kuyruklarını ayır.
- [ ] 11.3'te NVM ortamı ile NVMe protokolünü karıştırma.
- [ ] 11.4'te pariteyi gerçek ECC'nin tam karşılığı gibi sunma.
- [ ] 11.5'te fiziksel biçimlendirme ile dosya sistemi oluşturmayı ayır.
- [ ] 11.6'da temiz dosya sayfası ve kirli anonim sayfayı farklı işle.
- [ ] 11.7'de host, NAS, bulut ve SAN/array bağlamını kapsa.
- [ ] 11.8'de RAID seviyeleri yanında rebuild, bütünlük, havuz/nesne kavramlarını kısa ve doğru konumlandır.
- [ ] Q01–Q09 gerekçelerini ekle; cevap açma isteğe bağlı olsun.
- [ ] İlgili sahnelere kaynak ve özgün eğitim modeli etiketlerini ekle.

### Uygulama

- [ ] Sahne, sunucu ve bölüm menüsü tek veri kaynağından oluşsun.
- [ ] D01–D08 model/görünüm sınırı korunsun.
- [ ] Sıfırla ve varsayılan örnek yükleme farklı eylemler olarak uygulansın.
- [ ] Demo durumları aynı oturumda korunsun; arka plan oynatma durdurulsun.
- [ ] Notlar başlangıçta gizli; tam ekran başarısızlığı yönetiliyor olsun.
- [ ] Tema, hareket tercihi ve storage hata durumu uygulansın.
- [ ] Okuma modu, sözlük, kaynaklar ve yazdırma görünümü tamamlansın.
- [ ] Tüm varlıklar yerelde; dış servis zorunluluğu bulunmasın.

## 4. Anlamlı otomatik doğrulamalar

Öncelik, yanlış sonuç üretmesi öğrenmeyi doğrudan bozacak matematik ve durum modelleridir. Sadece bir metnin dosyada bulunmasını veya CSS sınıfını tekrar eden testler yazılmaz. Görsel düzen ve projeksiyon okunabilirliği gerçek kullanımda kontrol edilir.

| Kimlik | Konu | Girdi / eylem | Beklenen sonuç |
| --- | --- | --- | --- |
| T01 | D01 | 7200 RPM, 6 ms, 4 KiB, 200 MB/s | Yaklaşık 10,1871467 ms; karşılaştırmada küçük tolerans |
| T02 | D01 | RPM iki katı | Yalnızca ortalama dönme bileşeni yarıya iner |
| T03 | D01 | RPM=0 veya hız=0 | Model üretilmez; açıklayıcı doğrulama hatası |
| T04 | D02 FCFS | Varsayılan kuyruk | Yol ve toplam 189 |
| T05 | D02 SCAN | Varsayılan, artan | 99 uç noktası dahil toplam 151 |
| T06 | D02 C-SCAN | Varsayılan, artan | 99→0 dönüşü dahil toplam 187 |
| T07 | D02 sınır | Kuyruk boş | Hareket 0, servis olayı yok |
| T08 | D02 tekrar | Kafa 35; kuyruk [35,35] | İki ayrı servis, toplam 0 |
| T09 | D02 yön | Kafa 35; kuyruk [12]; artan | SCAN: 35→99→12, 151; C-SCAN: 35→99→0→12, 175 |
| T10 | D02 azalan | Varsayılan kuyruk, azalan | SCAN: 111; C-SCAN: 191; servis sırası yön kuralına uygun |
| T11 | D02 FCFS sırası | Kafa 35; kuyruk [42,35] | 42 sonra 35, toplam 14; aynı konumdaki istek öne alınmaz |
| T12 | D03 | İki güncelleme, iki canlı kopya, silme, son güncelleme | Host 3, fiziksel yazma 5, silme 1, oran 5/3 |
| T13 | D03 eşleme | GC sırasında ve sonrasında tüm canlı sayfalar | Her mantıksal sayfanın geçerli tek güncel eşlemesi var; silmeden önce kopyalar hazır |
| T14 | D04 | İlk veride 3. bit bozulması | Parite başarısız |
| T15 | D04 | İlk veride 1. ve 2. bit bozulması | Veri farklı; kontrol hata saptamaz |
| T16 | D05 | Dosya sistemi öncesi dosya eylemi | Eylem uygulanmaz; geçersiz duruma geçilmez |
| T17 | D06 | Ana üç adım | RAM D,A,C; swap okuma 2, swap yazma 1 |
| T18 | D06 | Dolu swap, yeni kirli anonim tahliye | Tahliye başarısız; sayfa RAM'de korunur |
| T19 | D08 RAID 5 | 4×4 TB | 12 TB; bir kayıp kurtarılabilir, iki kayıp değil |
| T20 | D08 RAID 6 | 4×4 TB | 8 TB; iki kayıp kurtarılabilir, üç kayıp değil |
| T21 | D08 RAID 10 | 4×4 TB; D0+D2 ve D0+D1 | İlk durum kurtarılabilir, ikinci değil; kapasite 8 TB |
| T22 | D08 seviyeler | RAID 0 / 1 / 4 | Kapasite ve tam disk arıza kuralları tabloyla uyumlu |
| T23 | D08 XOR | 1100,1010,0110 | Parite 0000; ikinci kayıp 1010 olarak geri bulunur |
| T24 | D08 rebuild | Kurtarılamaz durum | Rebuild çalışmaz; başarılı sonuç üretilmez |
| T25 | İçerik | Bütün sahne verisi | 36 benzersiz ID, 2700 saniye, doğru bölüm/sunucu ilişkisi |
| T26 | URL / tercihler | Bozuk sahne yolu veya bozuk storage JSON | Geçerli açılış/varsayılan; uygulama çökmez |

Floating-point sonuçlarında gösterim metni yerine sayısal değer ve tolerans kontrol edilir. D02 gibi tam sayı sonuçlarında tam eşitlik beklenir. Model durum testleri görsel animasyonun süresine bağlı olmaz.

## 5. Kullanım ve erişilebilirlik kontrolü

| Kimlik | Deneme | Kabul ölçütü |
| --- | --- | --- |
| K01 | S01'den S36'ya git, geri dön | Sahne atlanmaz; doğru sayım ve bölüm görünür |
| K02 | Sunucu 1–4 menüsü | İlgili blok başlangıcı açılır; önceki demolar kendi başına oynamaz |
| K03 | S12 bağlantısını doğrudan aç ve yenile | Aynı sahne açılır; demo başlangıç örneğinde |
| K04 | Tarayıcı geri/ileri | URL ve görünen sahne eşleşir |
| K05 | Kuyruk alanında yaz, slider oklarını kullan | Sunum yanlışlıkla sahne değiştirmez |
| K06 | Menü aç, Tab/Shift+Tab ve Escape kullan | Odak erişilebilir; kapanışta açan kontrole döner |
| K07 | Hareketi azalt tercihi | Demo bütün adımları animasyonsuz öğretir |
| K08 | Demo oynarken sahne değiştir veya sekmeyi gizle | Animasyon durur; dönüşte istemsiz devam etmez |
| K09 | localStorage reddedilsin / bozuk veri olsun | Sunum ve demolar bellekte çalışır |
| K10 | Fullscreen reddedilsin veya destek bulunmasın | Normal pencerede akış sürer |
| K11 | Sadece klavye ile demoları kullan | Bitler, diskler, sorular ve sıfırlama erişilebilir |
| K12 | Ekran okuyucu ile bir grafik ve bir adım | Kimlikler, birimler ve sonuç metni anlaşılır |
| K13 | Notları aç ve kapat | Aynı ekran görünürlüğü açıktır; yenilemede gizlenir |
| K14 | Okuma moduna gir, tekrar sunuma dön | Metin/model tutarlı; çift animasyon yok |
| K15 | Yazdırma önizlemesi | 36 sahne sıralı; kontroller yok; örnek sonuçlar görünür |
| K16 | Dış interneti kapat, yerel HTTP'den aç | Tüm sahneler ve demolar çalışır; eksik font/grafik yok |

## 6. Ekran ve tarayıcı matrisi

Uygulama anında erişilebilen tarayıcılarda ölçülür; kurulmamış tarayıcılar test edilmiş sayılmaz. Sürüm numaraları gerçek raporda belirtilir.

| Ortam | Amaç | Kontrol |
| --- | --- | --- |
| 1920×1080 masaüstü | Ana sunum | Tüm sahneler, grafik etiketleri, not ve menü |
| 1366×768 veya 1280×720 | Düşük çözünürlük projeksiyon | Kontroller/metin kesilmez; yoğun sahneler okunur |
| 768×1024 tablet | Okuma ve demo | Diyagramlar uyarlanır; yatay taşma yönetilir |
| 390×844 telefon | Tekrar/keşif | Kontroller dokunulabilir; yazı küçülterek gizleme yok |
| %200 zoom | Yeniden akış | Erişim kaybı ve örtüşme yok |
| Chrome/Chromium ve Firefox | Ana uyumluluk | SVG, modüller, hash navigasyonu, print |
| Safari, erişilebiliyorsa | Ek uyumluluk | Fullscreen desteğine göre normal pencere alternatifi |

Tarayıcı otomasyonu/ekran altyapısı erişilemiyorsa bu sınır rapor edilir. Gerçek projeksiyon denemesi masaüstü ekran görüntüsüyle eşdeğer sayılmaz.

## 7. Dört kişilik prova

1. Her kişi kendi blok başlangıcını menüden açar ve hangi demo durumunun geldiğini kontrol eder.
2. Birinci turda yalnızca ana anlatı ve kayıtlı örnekler kullanılır; gerçek süre ölçülür.
3. Geçişlerde fare/klavye devri yapılır; gelen sunucu ilk cümlesini ve örnek başlangıcını bilir.
4. İkinci turda yanlış kuyruk girişi, fullscreen reddi ve internet kesintisi gibi kesintiler denenir.
5. Süre aşılırsa önce serbest girdi ve ek paneller kısaltılır; 11.x başlıkları korunur.
6. Her kişi bölümünün bir yanlış genellemesini ve doğru karşılığını açıklayabilir.
7. Son yerel paket ve notlar sunum bilgisayarında önceden açılır; kullanılacak bağlantılar doğrulanır.

## 8. Riskler ve uygulama kararları

| Risk | Önlem |
| --- | --- |
| 11.8'de çok fazla alt kavram | Ana demo iki güçlü arıza örneği; tarihsel seviyeler ve ayrıntılar ek panelde |
| 45 dakikalık varsayımın gerçek süreye uymaması | 30 dakikalık alternatif; bölüm kapsamını koruyan süre düzenlemesi |
| Demoda yanlış sonuç öğrenilmesi | Model testleri, görünür birimler, kayıtlı başlangıç örnekleri |
| Geçişlerde demo kalıntısı | Oturum durumu görünür; açık sıfırlama; otomatik devam yok |
| Projeksiyonda düşük kontrast | Açık/koyu tema ve gerçek mekânda prova |
| Baskı/sayfa farkı | Ana referans bölüm numarası; kaynak sürümü görünür |
| Kaynaktaki tarihsel ürün bilgilerinin güncel sanılması | Yıl/bağlam etiketleri; güncel pazar/varsayılan iddiası yok |
| Backend olmayan üründen ortak oylama beklenmesi | Katılımın cihaz başına olduğu ürün açıklamasında belirtilir |

## 9. Tamamlanma tanımı

Website teslimi, yalnızca güzel görünen ilk ekranla tamamlanmış sayılmaz. G-01–G-10 gereksinimleri korunmuş, 36 sahne yazılmış, sekiz demo şartnameyle uyumlu çalışmış, model testleri geçmiş, kullanılabilir tarayıcılarda akış kontrol edilmiş ve ölçülemeyen noktalar açıkça rapor edilmiş olmalıdır.

Son teslimde yerel dosya konumu veya gerçek yayın bağlantısı, nasıl açılacağı, yapılan doğrulamalar ve varsa somut eksikler belirtilir. Bu dokümantasyon aşaması için tamamlanma ölçütü ise dosyaların tutarlılığı ve uygulamaya yeterli açıklıktadır.

## 10. Bu dokümantasyon aşamasında yapılan kontroller

2 Kasım 2026'da yerel dokümanlar üzerinde aşağıdaki kontroller yapıldı:

- README ile altı konu dokümanının varlığı ve yerel Markdown bağlantılarının hedefleri doğrulandı; kırık dosya bağlantısı bulunmadı.
- Markdown kod bloklarının açılış/kapanış dengesi kontrol edildi.
- Sahne tablosunda S01–S36'nın her birinin tam bir kez bulunduğu ve süre toplamının 2700 saniye olduğu hesaplandı.
- D02'nin varsayılan FCFS/SCAN/C-SCAN yolları bağımsız aritmetik kontrolle sırasıyla 189/151/187 olarak doğrulandı.
- D01 örnek sonucu 10,1871467 ms olarak yeniden hesaplandı.
- D04'ün hatasız, tek bit ve çift bit örneklerinde parite sonuçları kontrol edildi.
- D08'in örnek XOR paritesi 0000, geri kazanılan veri 1010 olarak doğrulandı.

Bu kontroller doküman örneklerini doğrular. Henüz yazılmamış uygulamanın test edildiği, tarayıcıda çalıştığı veya projeksiyonda denendiği anlamına gelmez.
