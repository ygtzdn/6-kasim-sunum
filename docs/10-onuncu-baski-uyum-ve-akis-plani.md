# 10 — Onuncu baskıya uyum ve anlatım akışı planı

> **Sonraki revizyon:** Bütün sahnelerin Enter/Backspace ile ortak aşama akışına geçirilmesi [12 — Tüm sahnelerde ileri/geri akış](12-tum-sahnelerde-ileri-geri-akis.md) içinde planlandı. Bu dosya önceki revizyonu kaydeder.

**Tarih:** 5 Kasım 2026. **Durum:** Uygulama öncesi hazırlanan inceleme ve iş sözleşmesi; uygulama tamamlandı. Kanıtlar ve sınırlar [11 — Revizyon sonucu](11-revizyon-sonucu.md) içinde.

Bu belge mevcut revizyonun ana planıdır. 01–09 numaralı belgeler önceki kararların tarihçesidir; çelişen içerik, kaynak, örnek ve kabul kararlarında bu plan esas alınır. Uygulama sonucu ayrıca kaydedilecek; plan maddeleri doğrulanmadan tamamlanmış sayılmayacaktır.

## 1. Amaç ve korunan sınırlar

Sunumun tamamı Abraham Silberschatz, Peter B. Galvin ve Greg Gagne'nin **Operating System Concepts, Tenth Edition**, Bölüm 11 çerçevesinde kalacak. Ana soru: **Aygıtın yapısı, işletim sisteminin zamanlama, alan yönetimi ve güvenilirlik kararlarını nasıl değiştirir?**

Korunan ürün kararları:

- Açılış ve kapanış dahil 36 sahne; S01–S36 kimlikleri ve bağlantıları korunur.
- 1. kişi: 11.1 / S03–S09; 2. kişi: 11.2–11.3 / S10–S17; 3. kişi: 11.4–11.6 / S18–S25; 4. kişi: 11.7–11.8 / S26–S34.
- Türkçe, açık tema, kısa görünür metin, ayrıntılı konuşmacı notları ve küçük yan menü.
- Donanım fotoğrafları ve fontlar yerel; backend veya çalışma sırasında dış API yok.
- Enter sahne içindeki aşamayı ilerletir; son aşamada sahne değiştirmez. Ok tuşları sahne değiştirir. Space hareketi denetler. Odaktaki kontrollerin yerel klavye davranışı korunur.
- Önceki görünür Enter düğmesi geri getirilmez. Aşama erişimi gerekirse aşama adları üzerinden sağlanır.
- Mevcut kayıtlı kullanıcı tercihi gereği tarayıcı otomasyonu, ekran görüntüsü ve görsel tarayıcı denetimi yapılmaz. Yerleşimin görsel doğruluğu otomatik test sonucu olarak sunulmaz.
- Bu çalışma yereldir; yayımlama veya üretim ortamına dağıtım kapsamda değildir. İstenen geliştirme sunucusu açık bırakılır.

## 2. Kaynak doğrulama yöntemi

### 2.1 Kaynak sırası

1. [10. baskı resmî sitesi](https://os-book.com/OS10/index.html): eser ve baskı kimliği.
2. [Resmî içindekiler](https://os-book.com/OS10/toc-dir/toc.pdf): 11.1–11.8 başlıkları ve bölüm sırası.
3. [Resmî Chapter 11 slaytları](https://os-book.com/OS10/slide-dir/PPTX-dir/ch11.pptx): erişilebilen ayrıntılı içerik dayanağı. 5 Kasım incelemesinde 47 slaydın metni çıkarıldı. Aşağıdaki numaralar dosyanın 1 tabanlı slayt sırasıdır.
4. [Slayt dizini](https://os-book.com/OS10/slide-dir/index.html) ve [resmî düzeltmeler](https://os-book.com/OS10/errata-dir/index.html): kaynak kimliği, sürüm ve düzeltme kontrolü.

İncelenen Chapter 11 PPTX dosyasının SHA-256 özeti: `ed5e0f53f672f6c3d41e30341ed11d8439b8c34d142aad99304a830674dd17c2`. Dosya 47 slayttır; sunum görüntüleri uygulamaya kopyalanmaz.

**Doğrulama sınırı:** Kitabın tam metni yerel depoda bulunmuyor. Resmî slaytlar kitabı destekler, tam metnin satır/sayfa düzeyinde denetiminin yerini tutmaz. Bu revizyon “tam kitap metni karşılaştırıldı” iddiasında bulunmaz. Kaynaklarda gösterilmeyen ek ayrıntılar ana anlatıdan çıkarılır veya kitabın kavramını açıklayan özgün ve sınırlı eğitim modeli olarak açıkça işaretlenir.

### 2.2 İçerik ile örneği ayırma

- Bölüm adları, kavramlar ve konu sırası yalnızca OSC10 kaynaklarına bağlanır; OS8/OS9, Essentials veya güncel Linux belgeleri müfredatın yerine kullanılmaz.
- Türkçe açıklamalar, 36 sahne düzeni, sorular, görseller ve küçük durum modelleri projenin özgün anlatımıdır. Kitabın şekli veya doğrudan alıntısı gibi sunulmaz.
- HDD zamanlamasında resmî örnek girdisi kullanılır. Flash sayfa sayısı, SECDED bitleri, swap slot politikası ve RAID bit dizileri özgün eğitim örnekleridir; bu fark notlarda belirtilir.
- Kitabın tarihsel RHEL 7 / NOOP / CFQ örnekleri güncel sistem varsayılanı diye sunulmaz. Güncel ürün fiyatı, IOPS veya pazar payı iddiası eklenmez.
- Fotoğraf ve yazılım belgeleri içerik otoritesi değildir. Medya atıfları korunur; kitap dışı teknik bağlantılar müfredat kaynak listesinden çıkarılır.
- TRIM, güncel Linux swap-table düzeni, UEFI/GPT/ESP ayrıntıları ve write-hole/URE uygulama ayrıntıları erişilebilen OSC10 dayanağı bulunmadığından ana akışı genişletmek için kullanılmaz.

## 3. Mevcut durum ve inceleme bulguları

Başlangıçta çalışma ağacı temizdir. React + TypeScript + Vite uygulaması, modüler sahne dizini ve saf hesap/durum modelleri vardır. Geliştirme sunucusu 5173 portunda başlatıldı. Başlangıç doğrulaması: **42 test başarılı**, içerik denetimi başarılı; ancak gerçek HTML denetimi yalnızca ilk dokuz sahneyi kapsıyor.

| Öncelik | Bulgu | Öğrenmeye / kullanıma etkisi | Karar |
| --- | --- | --- | --- |
| P1 | Global Enter/Space odaktaki düğme ve bağlantıları da yakalıyor | Klavyeyle seçim ve navigasyon yanlış eylemi çalıştırıyor | Etkileşimli hedefleri koru; regresyon testi ekle |
| P1 | Kaynak panelinde OSC10, Linux, SNIA, UEFI ve Hamming kaynakları karışık | Sunumun hangi baskıya dayandığı belirsiz | Tek resmî içerik zinciri ve sahne bazlı kaynak eşlemesi |
| P1 | S21 varsayılan UEFI/GPT/ESP; S28 bulut türleri sınıflaması | Kitaptaki boot block ve WAN/API gerekçesi geri planda | Bu sahneleri resmî slayt kavramlarıyla yeniden kur |
| P1 | S30/S31 paylaşılan RAID durumundan kapsam dışı seviye devralabiliyor | Başlık, seçili kontrol ve diyagram uyuşmayabiliyor | Sahneye uygun başlangıç; uygun paylaşılan durumu koru |
| P2 | Zamanlama örneği kitaptakinden farklı, 0–99 ölçeğinde | Resmî sekiz istekli örnek izlenemiyor; slayttaki SCAN toplamı ayrıca denetlenmeli | 0–199, kafa 53, resmî kuyruk ve bağımsız yol hesabı |
| P2 | S16 başlığı sonucu baştan açıklıyor | Tahmin ve deney aşaması kayboluyor | Önce soru; sonuçta fiziksel/host yazma oranı |
| P2 | Notlarda sahneye özel slayt konumu yok | Kaynağa dönüş ve konuşmacı hazırlığı güç | Her notta kitap bölümü, slayt ve model ayrımı |
| P2 | Menü açıkken otomatik hareket sürebiliyor, odak panele rağmen başlığa taşınabiliyor | Not okuma ve klavye akışı bölünüyor | Menü açıkken hareketi duraklat; odağı koru |
| P2 | Son aşamada tamamlanma ve sonraki sahne işareti yok | Enter'ın neden durduğu anlaşılmıyor | Kısa tamamlanma işareti ve ayrı sahne geçişi |
| P2 | 08 belgesinde gerçek '+' / 'EOF' kalıntıları ve eski 3D anlatımı var | Dokümantasyon güvenilirliğini zedeliyor | Güncel modül belgesi yaz; eski planları tarihsel işaretle |
| P2 | Kontrol yalnızca S01–S09'u oluşturuyor | Sonraki demoların render hataları kaçabilir | Bütün 36 sahneyi ve tanımlı aşamaları statik oluştur |

## 4. Sahne bazında içerik ve akış sözleşmesi

Her sahne şu yapıyı izler: **soru / amaç → değiştirilen durum → gözlenen sonuç → sonraki karar**. Görünür alanda kısa soru veya sonuç yeterlidir; teknik gerekçe notlarda bulunur. Aşağıdaki slayt aralıkları kitaptaki sayfa numarası değildir.

| Sahne | Kitap bölümü / slayt | Ana kavram ve uygulama kararı | Sonraki köprü |
| --- | --- | --- | --- |
| S01 | Bölüm 11 / 1–3 | Depolama isteğini bölümün ana sorusuyla aç | Dört karar alanını tanıt |
| S02 | 11.1–11.8 / 2–3 | Sunucu kapsamı ve dört bağlantılı soru | Donanımdan başla |
| S03 | 11.1 / 4–5 | HDD'nin plaka, mil, kol, kafa, iz/sektör/silindir kavramları; fotoğraf/soyut kavram ayrımı | Kalıcılığı ayır |
| S04 | 11.1 / 4, 9, 12 | Volatil RAM ile kalıcı HDD/SSD karşılaştırması | Aynı kalıcılık farklı erişim maliyeti |
| S05 | 11.1 / 6–7 | Seek + ortalama dönme ve aktarım dahil servis süresi; küçük/büyük istek karşılaştırması | SSD'de hangi bileşenler yok? |
| S06 | 11.1 / 9–11 | Gerçek SSD fotoğrafları, flash ve denetleyici | Sayfa ile silme bloğu farklı |
| S07 | 11.1 / 10–11 | Sayfa yazma/okuma, yerinde güncelleme yerine yeni boş sayfa, blok silme | Farklı ortamların erişim biçimi |
| S08 | 11.1 / 12–16 | RAM disk, teyp ve mantıksal blok soyutlaması | OS için donanım farkı ne değiştirir? |
| S09 | 11.1 / 7, 9, 17 | Mekanik bekleme kontrol sorusu; cevap gerekçesi | Aynı kuyruğu farklı sırala |
| S10 | 11.2 / 17–19 | Resmî kuyruk, kafa, aralık ve yön; OS / denetleyici kuyruğu ayrımı | Önce geliş sırası |
| S11 | 11.2 / 19–20 | FCFS; resmî girdide 640 silindir | Yakın istekleri aynı yönde topla |
| S12 | 11.2 / 21–22 | SCAN; azalan başlangıçta 236; fiziksel uç ve LOOK ayrımı; slayttaki 208 ile farkı açıkla | Servisi tek yönde tut |
| S13 | 11.2 / 23–24 | C-SCAN dönüşünde servis yok, hareket var; aynı azalan yönde 386 | Toplam yol tek ölçüt mü? |
| S14 | 11.2 / 17–25 | Aynı girdide kıyas; hareket/bekleme/adalet ayrımı; tarihsel örnekler | Mekanik hareket kalkınca hedef değişir |
| S15 | 11.3 / 26; 11.1 / 15 | NVM'de kuyruk ve yazılım maliyeti; NVM/NVMe ayrımı bir geri referans | Güncellemenin ek maliyeti |
| S16 | 11.3 / 26; 11.1 / 10–11 | Özgün FTL/GC örneğiyle yazma büyütmesi; sonuç süreç sonunda | Hareket yok, yönetim var |
| S17 | 11.3 / 26; 11.1 / 10–11 | Birleştirme, paralellik, aşınma ve sınırlı silme ömrü; dayanağı doğrulanmayan TRIM genişlemesini çıkar | Veri doğru mu? |
| S18 | 11.4 / 27 | Pariteyle tespit; tek bit / çift bit ayrımı | Tespit düzeltme demek değil |
| S19 | 11.4 / 27 | Ana fikir ECC; SECDED yalnızca açık etiketli özgün örnek | Aygıtı kullanıma hazırlama |
| S20 | 11.5 / 28–29 | Fiziksel biçim, bölümleme, dosya sistemi, bağlama ayrımı | Sistem ilk kodu nereden yükler? |
| S21 | 11.5 / 29–30 | ROM/firmware → boot block → yükleyici → RAM'deki çekirdek | Sorunlu fiziksel alan |
| S22 | 11.5 / 30 | Sector sparing / yedek fiziksel alana eşleme; LBA korunur | Aynı aygıt swap için de kullanılır |
| S23 | 11.6 / 31 | Swap alanı: dosya/bölüm, RAM'den daha yavaş depolama | Bir sayfanın yolculuğu |
| S24 | 11.6 / 31 | Özgün sayfa-slot modeli; yazma tamamlanmadan RAM kopyasını bırakma | Veri, aygıt ve alanı birleştir |
| S25 | 11.4–11.6 / 27–31 | Üç kavramı gerekçeli kontrol sorularıyla bağla | Depolama nereye bağlı? |
| S26 | 11.7 / 32–33, 36–37 | Host-attached, NAS ve SAN bağlamı; SAN bir ağ mimarisi | Dosya / blok erişimi |
| S27 | 11.7 / 33, 36–37 | Dosya sistemi sorumluluğu; IP üzerinden blok erişimi olabileceği | Uzak veri merkezi |
| S28 | 11.7 / 34–35 | Uygulama → WAN/Internet → API → uzak veri merkezi; gecikme ve hata gerekçesi | Dizi denetleyicisi ve çoklu disk |
| S29 | 11.8 / 35, 38–39 | Kapasite, paralellik ve yedekliliği ayrı hedefler olarak göster | Şeritleme ile aynalama |
| S30 | 11.8 / 39–40 | Yalnız RAID 0/1 için uygun başlangıç; şerit kopya değildir | Pariteyle koruma |
| S31 | 11.8 / 39–40 | RAID 4/5/6; XOR özgün örnek, Q cebiri sembolik | Kaç arıza yeterli? |
| S32 | 11.8 / 40–41 | Tam disk arızası modeli; RAID 10'da hangi çiftin kaybolduğu | Korumanın kapasite ve onarım bedeli |
| S33 | 11.8 / 38–39, 42 | Kullanılabilir kapasite ve rebuild; animasyon süre ölçümü değildir | Disk arızasının ötesindeki bütünlük |
| S34 | 11.8 / 41–46 | Checksum, havuz ve nesne depolama; ana seviye seçimini genişletmeden kısa özet | İsteğin tüm yolculuğu |
| S35 | 11.1–11.8 / 15, 17–18, 27–39 | Özgün bütünleştirme; swap sıradan dosya okumasının zorunlu aşaması değildir | Tasarım ölçütlerini geri çağır |
| S36 | Bölüm 11 / 3, 38–46 | İş yükü, gecikme, hata modeli ve yedekleme; kaynaklara erişim | Sorudan ilgili sahneye dön |

### Zamanlama örneğinin kesin sözleşmesi

- Aralık: **0–199**; başlangıç kafası: **53**.
- Geliş sırası: **98, 183, 37, 122, 14, 124, 65, 67**.
- Karşılaştırma için ortak varsayılan yön: **azalan**. FCFS yön parametresini kullanmaz.
- Beklenen toplamlar: FCFS **640**, SCAN **236**, C-SCAN **386**.
- Artan yönde SCAN **331**, C-SCAN **382**. Slaytlardaki C-SCAN yön çizimi ile ortak azalan varsayılanın aynı olduğu iddia edilmez.
- SCAN gerekiyorsa fiziksel uca gider; son isteği tamamladıktan sonra gereksiz yol eklenmez. C-SCAN uçtan dönüş mesafesini sayar; dönüş sırasında istek servis etmez.
- **Uygulama öncesi sayısal düzeltme:** Resmî slayt 21 metninde SCAN için 208 yazmasına rağmen açık fiziksel-uç kuralıyla azalan yol `53→37→14→0→65→67→98→122→124→183` olur; `53 + 183 = 236`. Uca gitmeden 14'te dönen yol `39 + 169 = 208` verir ve bu projede LOOK olarak ayrılır. Slayt ifadesi sessizce doğru kabul edilmez; tam kitap metni görülmediğinden kitabın kendisinde hata olduğu iddia edilmez. İlk araştırma önerisindeki 208 sayısı uygulamadan önce düzeltilmiştir.
- Kafa konumundaki tekrar istekleri ayrı kimlikle ve sıfır ek mesafeyle tamamlanır. Boş kuyruk sıfır hareket üretir. Hatalı taslak son geçerli kuyrukla sessizce çalıştırılmaz.

## 5. Teknik uygulama ve paralel görev dağılımı

Önce okuma amaçlı üç bağımsız inceleme yapıldı. Bu plan yazıldıktan sonra uygulama aşağıdaki dosya sahiplikleriyle paralel yürütülür. Ajanlar başkasının dosyalarını değiştirmeden bulguları ana ajana bildirir; son birleştirme ve kabul kontrolü ana ajandadır.

| İş paketi | Sorumlu | Dosya kapsamı | Somut çıktı |
| --- | --- | --- | --- |
| A — Kaynak ve yönetim/RAID anlatımı | Kaynak ajanı | `src/chapters/chapter-11-4-6/`, `src/chapters/chapter-11-7-8/` | Boot ve bulutun OSC10'a dönüşü, ECC örnek etiketi, kaynak temizliği, RAID başlangıç tutarlılığı |
| B — Donanım ve zamanlama öğrenme akışı | Öğrenme ajanı | `src/chapters/chapter-11-1/`, `src/chapters/chapter-11-2-3/`, `src/components/AccessLab.tsx`, ilgili model testleri | Resmî kuyruk, doğru ölçek/toplam/notlar, GC tahmin-sonuç akışı, TRIM genişlemesinin çıkarılması |
| C — Sunum kabuğu ve erişim | Deneyim ajanı | `src/App.tsx`, `src/presentation/usePresentation.ts`, `controls.mjs`, `SideMenu.tsx`, kabuk CSS'i, klavye testleri | Odak/klavye düzeltmeleri, menüde duraklama, aşama sonu ve dokunmatik erişimi |
| D — Kaynak izlenebilirliği ve bütünleştirme | Ana ajan | Yeni kaynak eşleme modülü, `NotesPanel.tsx`, `src/data/content.ts`, `scripts/check-content.mjs`, README ve docs | 36 kaynak kaydı, sahneye özel açıklama, bütün sahne oluşturma denetimi, tutarlı belgeler ve doğrulama raporu |

Yeni bağımlılık, yeni framework, gerçek donanım erişimi, yeni görsel üretimi veya 3D/video geri dönüşü gerekmiyor. Var olan hesap/durum motorları somut bir hata olmadıkça korunur. Düşük etkili metin değişiklikleri için gereksiz birim testleri yazılmaz; yanlış öğrenmeye yol açabilecek davranış ve hesaplar test edilir.

## 6. Kabul ve doğrulama matrisi

| Kimlik | Kabul koşulu | Kanıt |
| --- | --- | --- |
| K1 | 36 sıralı/benzersiz sahne, dört doğru sunucu, 11.1–11.8 kapsamı | İçerik denetimi |
| K2 | Her sahnede doğru OSC10 bölüm ve 1–47 aralığında resmî slayt kaydı; çapraz başvuru ve özgün model ayrımı | Kaynak eşleme denetimi + elle inceleme |
| K3 | Her sahnenin başlangıcı, ilk kişinin bütün 38 aşaması ve diğer tanımlı aşamalar hatasız HTML üretir | SSR denetimi; başlık, NaN/undefined ve yerel medya kontrolü |
| K4 | Resmî kuyrukta 640/236/386; artan yönde 331/382; 208 LOOK yoluyla farkı; tekrar/boş/geçersiz kuyruk kuralları | Zamanlama testleri |
| K5 | HDD servis süresi, GC canlı eşleme/sayaçları, parite/ECC, swap ve RAID hesapları korunur | Model testleri |
| K6 | Odaktaki düğme/link Enter/Space'i kullanır; boş alanda Enter sadece aşama ilerletir; tekrar/IME/giriş koruması sürer | Klavye karar testleri + kod incelemesi |
| K7 | Menü açıkken demo hareketi ve odak taşıma durur; tamamlanan aşama sonraki sahne yolunu açıklar | React/kabuk incelemesi; tarayıcıyla doğrulanmış sayılmaz |
| K8 | Kitap dışı müfredat kaynakları, TRIM/UEFI/Linux ayrıntı genişlemeleri kaldırılır; medya atıfları korunur | Kaynak ve metin taraması |
| K9 | TypeScript ve üretim derlemesi başarılı; diff boşluk kontrolü temiz | `pnpm build`, `git diff --check` |
| K10 | Canlı HTML, uygulama modülleri, işlenmiş CSS ve yerel medya HTTP 200; CSS'te ham Tailwind yönergesi yok | Yerel HTTP denetimi |
| K11 | README gerçek kapsam ve komutları anlatır; güncel belgelerde '+'/'EOF' kalıntısı ve kaldırılmış modül iddiası yok | Belge bağlantısı / içerik incelemesi |

Başarılı SSR, test ve HTTP kontrolü ekran boyutu, taşma, gerçek odak sırası veya projeksiyon okunabilirliğinin görsel doğrulaması değildir. Bu sınır sonuç raporunda korunur.

## 7. İş sırası ve tamamlanma tanımı

1. Depo, mevcut belgeler, saf modeller ve resmî kaynaklar okunur; başlangıç testleri ve sunucu kaydedilir.
2. Bu ayrıntılı plan dosyası yazılır; ajanlara sınırlı uygulama paketleri gönderilir.
3. Kaynak eşleme / not görünümü ve bölüm düzeltmeleri paralel geliştirilir.
4. Paylaşılan sahne dizini, tipler, stiller ve örneklerin bütünleşmesi incelenir. Çok bileşenli değişikliklerde React kalite/erişilebilirlik kontrolü yapılır.
5. Model ve içerik kontrolleri çalıştırılır; yalnız yeni hata veya değişiklik gerekçesi varsa tekrarlanır.
6. Üretim derlemesi, HTTP ve diff kontrolü tamamlanır. Doğrulanmayan görsel davranış açıkça kaydedilir.
7. Sonuç raporu ve README güncellenir; geliştirme sunucusu açık bırakılır.

Tamamlanma, yalnız planın hazırlanması veya ilk sayfanın açılması değildir: kararlaştırılan kaynak/akış düzeltmeleri uygulanmış, hesaplar ve tüm sahne çıktıları denetlenmiş, son durum belgelenmiş olmalıdır.
