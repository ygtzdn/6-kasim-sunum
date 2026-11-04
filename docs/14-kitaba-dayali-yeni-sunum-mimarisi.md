# 14 — Kitaba dayalı yeni sunum mimarisi ve hazırlık planı

> Kullanıcının sonraki isteğiyle kapanışa altı seçilmiş PDF alıştırması eklendi. Güncel 56 sahne / 280 aşama dizisi, diyagram düzenlemeleri ve süreler [20 numaralı belgede](20-diyagram-boyutlari-ve-exercises.md) kayıtlıdır. Aşağıdaki 50 sahnelik tablo ilk uygulamanın kapsam kaydıdır.

**5 Kasım 2026 · Plan uygulandı.** Sonuç ve kanıtlar [16 — Doğrulama raporu](16-yeni-sunum-sonucu-ve-dogrulama.md) içindedir. Kullanıcı sahne sayısı ve sırası dahil tasarım dili dışındaki bütün yapının yeniden ele alınmasına izin verdi. Bu plan, 36 sahneyi koruma sınırını kaldırır. 12–13 belgeleri önceki 213 aşamalı çalışma temelini kaydeder; yeni teslimin içerik mimarisi burada kararlaştırılır.

## 1. Amaç ve başarı tanımı

Bölüm 11'i sırayla açıklayan, dört sunucunun birbirine gerekçeli geçiş yaptığı, dinleyicinin her sahnede tek ana ilişkiyi takip edebildiği bir Türkçe sunum hazırlanacak. İçerik ve sahne sayısı mevcut kodun sınırlarından türetilmeyecek; **Operating System Concepts, Tenth Edition** konu yapısından türetilecek.

Başarı yalnız yeni bir menü veya daha fazla sahne değildir:

- 11.1–11.8'in bütün ana başlıkları ve resmî destek materyalindeki önemli kavramsal bağlar izlenebilir olacak.
- Her sahnede tek öğretim sorusu, anlamlı model/görsel, sonlu Enter/Backspace akışı, çıkarım, kaynak, model sınırı ve sonraki sahneye geçiş olacak.
- Yoğun sahneler bölünecek; aynı algoritma veya yönetim fikri gereksiz yere baştan tekrar edilmeyecek.
- Kitap kavramı ile özgün eğitim örneği ayırt edilecek. Bağlantı konumu, dosya/blok/API erişimi ve güvenilirlik katmanları birbirine karıştırılmayacak.
- Sunucular için konuşma taslağı, demo hareketi, tahmin sorusu, beklenen gerekçe, yanlış anlama uyarısı, geçiş ve prova süresi bulunacak.
- Kodla bütün aşamaların ileri/geri tutarlılığı denetlenecek; tarayıcı kullanılmayacak.

## 2. Değişmeyen tasarım dili ve teknik davranış

Açık zemin, Manrope/Space Grotesk, mavi/turuncu vurgu, mevcut çizgi/ikon dili, gerçek yerel donanım fotoğrafları ve küçük yan menü korunur. Yeni bir tema, 3D, WebGL, video veya üretilmiş donanım görseli eklenmez. Sunum ekranı kısa metin ve tek ana çizim taşır; ayrıntılı metin notlar/prova belgelerindedir.

Enter aynı sahnede ileri, Backspace geri gider. İlk ve son aşamada kalınır. Sol/sağ ok sahne değiştirir. Açık menü ve form kontrolleri yerel klavye kullanımını korur. Her şey `context.stage` değerinden çizilir; flash, swap ve RAID için saf durum geçişi yeniden üretimi sürer. Zamanlayıcı ders aşamasını ilerletemez.

## 3. Kaynak hiyerarşisi ve belirsizlik kaydı

| Kaynak | Kullanım | Sınır |
| --- | --- | --- |
| [10. baskı resmî eser sayfası](https://os-book.com/OS10/index.html) | Eser, yazarlar ve baskı kimliği | Kitap sayfası içeriğinin yerini tutmaz |
| [Resmî içindekiler](https://os-book.com/OS10/toc-dir/toc.pdf) | 11.1–11.8 bölüm sırası ve kapsamı | Ayrıntılı alt kavram doğrulaması tek başına yapılamaz |
| [Chapter 11 resmî slaytları](https://os-book.com/OS10/slide-dir/PPTX-dir/ch11.pptx) | 47 slaydın kavram, örnek, metin ve şemaları | Kitaptaki sayfalarla birebir eşit olduğu varsayılmaz |
| [Resmî tekrar soruları](https://os-book.com/OS10/review-dir/11-rev.pdf) | Öğrenci düzeyi ve öğrenme hedefi kontrolü | Sorular birebir kopyalanmaz; bazı kapsam ifadeleri slayt sınıflamasından farklıdır |
| [Resmî düzeltmeler](https://os-book.com/OS10/errata-dir/index.html) | Basılı/ePub sürüm farkı takibi | Bütün metin çelişkilerinin çözüldüğü iddia edilmez |

Tam kitap metni yerel depoda yoktur. Sayfa düzeyinde tam kitap denetimi yapıldığı söylenmez. Bu revizyonun kitap bağlılığı, aynı 10. baskının resmî içindekiler ve yazar destek materyallerinin kapsamı üzerinden kurulur. Projenin sahne sırası, Türkçe açıklamalar ve sayısal küçük modelleri özgün öğretim tasarımıdır.

Somut belirsizlikler ve kararlar:

1. SCAN slayt 21 metni 208 gösterir; verilen kuyrukla fiziksel 0 ucuna giden açık yol 236'dır. 208, 14'te dönen LOOK yoludur. Hesap doğru tutulur, fark açıklanır; kitap metninde hata olduğu iddia edilmez.
2. Resmî tekrar sorusunda erişim için iki genel yol sorulurken slayt 32 host/network/cloud sıralar. Bu etiketler sahnede yanlış biçimde birbirini dışlayan donanım sınıfları yapılmaz: yerel/uzak konum ile dosya/blok/API arayüzü ayrı eksenlerdir.
3. Slayt 38'in çıkarılmış güvenilirlik sayıları birbiriyle tutarsız görünüyor. MTTF/MTTR/MTTDL ilişkisi nitel anlatılır; doğrulanmamış büyük yaşam süresi sayıları tekrarlanmaz.
4. RAID 2/3 görünür resmî bölüm materyalinde doğrulanmadığından konu genişletmek için eklenmez. Doğrulanan 0/1/4/5/6, iç içe RAID ve kaynakta yer alan uzantılar esas alınır.
5. Güncel Linux, UEFI, üretici performansı, fiyat/pazar payı ve kaynakta doğrulanmayan TRIM ayrıntıları ana müfredat değildir.

## 4. Yeniden tasarlama ilkeleri

### Sahne başına tek ana ilişki

Önceki birleşik RAM disk/teyp/LBA/veri yolu sahnesi ayrı sorulara bölünür. RAID'in iç içe örgütlenmesi, checksum, havuz ve nesne depolama tek özet sahnesinde sıkıştırılmaz. Bölüm derinliği kaynak sırasını izler; bir ana fikir yalnız başka bir sahnenin uzun notuna saklanmaz.

### Önce soru, sonra değişim, sonra gerekçe

Soru aşamasında sonuç açıklanmaz. Sonraki aşamada dinleyicinin tahmin ettiği fark görünür olur. Son aşama modelin neyi kanıtladığını ve neyi kanıtlamadığını açıklar. Sadece açıklama cümlesini değiştiren aşama yerine mümkün olduğunda diyagramdaki maliyet, konum, koruma veya sorumluluk değişir.

### Ortak örnek ve kontrollü tekrar

HDD karşılaştırmaları aynı kitap kuyruğunu kullanır. 11.1 flash'ın fiziksel sayfa/blok kurallarını tanıtır; ayrıntılı çalışan FTL/GC örneği 11.3'te yazma büyütmesi sorusunu cevaplar. Swap ve RAID örnekleri de aşamalar arasında aynı kimlikleri korur; yeni senaryo açıkça tanıtılır.

### Kısa rota ve ayrıntılı rota

Bir kısa ders/prova rotası ve ek açıklamaları içeren tam rota planlanır. Süreler prova hedefidir, ölçülmüş gerçek süre değildir. Kısa rota hiçbir 11.x ana başlığını kaldırmaz; tarihsel örnek, cebirsel ayrıntı veya ikinci gösterim gibi ek açıklamalar ayrıntılı rotada kalabilir. Menü bütün sahnelere erişim sağlar; rota seçimi sadece ileri/geri gezinmenin izleyeceği diziyi belirler.

45/75 dakika başlangıç hedefidir. Kapsam bu süreyi dürüst biçimde taşımıyorsa öğrenme hedeflerini ezmek yerine planın gerçek tahmini açıklanır; daha uzun prova rotası verilir. Otomatik hızlandırma veya slayt zamanlayıcısı eklenmez.

## 5. Veri ve navigasyon mimarisi

Sahne kimlikleri sıralı numaraya bağımlı olmaktan çıkar: `hdd-anatomy`, `swap-journey`, `raid-rebuild` gibi anlamlı ve kalıcı kimlikler kullanılır. Ekrandaki numara güncel diziden hesaplanır. Eski `s01`–`s36` adresleri uygun yeni sahnenin takma adı olarak çözülür; yeniden düzenleme eski paylaşılan bağlantıyı rastgele bir konuya götürmez.

Sahne sözleşmesi:

- `id`: anlamlı kalıcı kimlik.
- `legacyIds`: varsa eski bağlantılar.
- `kind`: açılış, bölüm veya kapanış.
- `depth`: kısa rotada bulunan çekirdek veya ek açıklama.
- `seconds.core / seconds.full`: rota başına tam sayı saniye hedefi; ek açıklamanın kısa rota süresi sıfır.
- `chapter / presenterId`: kitap bölümü ve sorumlu sunucu.
- `stages`: bütün anlamlı durumları adlandıran zorunlu sonlu dizi.
- `notes`: temsil, hedef, anlatım, kavram, soru/cevap, model sınırı ve geçiş.
- `render(context)`: ortak aşamadan gerçek görünüm.

Kaynak eşlemesi `textbook.ts` içinde yeni kimliklere taşınır; her sahnenin resmî slayt konumu, çıkarımı ve özgün model ayrımı denetlenir. Menüdeki sunucu grupları `kind/presenterId` üzerinden oluşur. Açılış, kapanış, sayı veya kimlik için 36'ya sabitlenmiş koşullar kalmaz.

## 6. Paralel çalışma fazları ve dosya sahipliği

| Faz | Donanım/zamanlama ajanı | Yönetim ajanı | Bağlantı/RAID ajanı | Ana ajan |
| --- | --- | --- | --- | --- |
| A — Kaynak ve tasarım | 11.1–11.3 yeni sahne/stage/soru/süre planı | 11.4–11.6 kapsam ve öğretim planı | 11.7–11.8/kapanış ve uzantılar planı | Kaynak belirsizlikleri, rota/kimlik mimarisi, birleşik bütçe |
| B — Uygulama | Kendi bölüm dosyaları + sunucu1/2 prova belgeleri | Kendi bölüm dosyaları + sunucu 3 prova belgesi | Kendi bölüm/kapanış dosyaları + sunucu 4 prova belgesi | Ortak tip, registry, navigasyon, menü, kaynak haritası, kontrol betiği |
| C — Çapraz inceleme | Diğer bölümün kaynak/anlatım/geri dönüş denetimi | Diğer bölüm ve ortak kabuk denetimi | Diğer bölüm ve kaynak/rota denetimi | Model, bütün sahne/aşama, derleme, HTTP ve belge bütünleşmesi |
| D — Sunum hazırlığı | Açılış, örnek anlatımı ve ikinci sunucuya devir | Kavram soruları, swap demosu ve dördüncü kişiye devir | Kapanış, soru-cevap ve kurtarma/prova rotası | Ana prova rehberi, süre dökümü, kabul ve sonuç raporu |

Her fazda paralel sorumluluklar tanımlıdır; dosya sahiplikleri çakışmaz. Kaynakta doğrulanmayan yeni konu, ana ajana bulgu olarak iletilir; sahne sayısını artırmak için kavram icat edilmez.

## 7. Sunum hazırlığı teslimleri

1. Güncel kaynaklı sahne haritası: bölüm, kimlik, ana soru, aşamalar, kısa/tam süre ve derinlik.
2. Dört sunucu için konuşmaya hazır prova notları: açılış cümlesi, ekrandaki nesneler, hangi tuşla neyin değiştiği, sorunun cevabı ve bir sonraki konuşmacının ilk cümlesi.
3. Yanlış anlama listesi: NVM/NVMe, kalıcılık/mekanik hareket, seek/aktarımı, SCAN/LOOK, tespit/düzeltme, hazırlama katmanları, swap/RAM, dosya/blok/API, RAID/backup.
4. Öğrenme kontrolleri: her 11.x için en az bir gerekçeli soru; cevapları kaynaktaki kavrama bağlayan özgün Türkçe açıklamalar.
5. İki prova rotası: kısa ders ve tam anlatım; temel bölümler korunarak hangi ek sahnelerin atlanacağı açık.
6. Teknik prova/kurtarma kartı: yerel sunucuyu açma, doğrudan sahneye geçme, aşamayı sıfırlama, hareketi durdurma, hatalı/bozuk URL'yi normale döndürme.
7. Gerçekleşen kod kontrolleri ile yapılmayan tarayıcı/projeksiyon provasını ayrı kaydeden sonuç raporu.

## 8. Kabul ölçütleri

- Her sahnenin yeni kimliği benzersiz; eski takma adlar çakışmıyor ve belirli bir yeni sahneye gidiyor.
- Kısa/tam rota sırası kitabın konu sırasını koruyor; bütün 11.1–11.8 başlıkları kısa rotada mevcut.
- Her sahnenin en az iki anlamlı aşaması var. Enter/Backspace sınırda kalıyor; sahne içi hareket URL'yi değiştirmiyor.
- Bütün aşamalar hareket açık/kapalıyken Node/SSR ile oluşturuluyor; komşu aşamalar farklı; ters sırada aynı aşama aynı çıktıyı veriyor.
- Flash/swap/RAID durum testleri değişen gerçek ara durumu, sayaçları ve geri üretimi kapsıyor.
- Tüm sahne kaynakları 10. baskı resmî materyaline bağlı; kısa/tam süreler ve sunucu toplamları veri üzerinden hesaplanabiliyor.
- Eski DOM tıklama yedeği, bağımsız ilerleme deposu, otomatik ders aşaması ve 36 sahneye sabitlenen kontroller yok.
- TypeScript, üretim derlemesi, HTTP, diff ve belge bağlantısı kontrolleri başarılı.
- Tasarım dili korunuyor; tarayıcı/ekran görüntüsü testi yapılmıyor ve yapılmış gibi raporlanmıyor.

## 9. Birleşik sahne sözleşmesi

Üç bağımsız bölüm planının kesin kimlik, sıra, süre ve kaynak dökümleri aşağıda birleştirildi. Uygulama görevleri bu birleşik sözleşmeden sonra verildi; sonuçlar 16numaralı raporda kayıtlıdır.

### Ayrıntılı bölüm planları

- [3. sunucu — Doğruluk, aygıt yönetimi ve swap](bolum-planlari/03-dogruluk-yonetim-swap.md): dokuz sahnenin 45 aşaması, 540/960 saniye, örnek ve soru/cevap sözleşmeleri.
- [4. sunucu — Bağlantı, RAID ve kapanış](bolum-planlari/04-baglanti-raid-kapanis.md): 18 sahne, 102 aşama, API/fabric/LUN ve koruma katmanları dahil kaynaklı sözleşmeler.

Bu dosyalar paralel ajanların uygulama öncesi tasarım girdileridir. Buradaki “ana ajanın onayı” ifadeleri kullanıcıdan yeniden izin isteme kapısı değildir; bu çalışma için kullanıcı yetkisi vardır. Kesin kod sözleşmesi ana planın birleşik tablosudur.

### Birleşik karar — uygulama sözleşmesi

Üç bölüm planı incelendi ve aynı kitap/etkileşim sözleşmesinde birleştirildi: **50 sahne**, kısa rotada **44**, ayrıntılı rotada **50** sahne. Kısa rotada **244**, ayrıntılı rotada **268** aşama öngörülür. Tasarım dili değişmez; önceki yoğun birleşik sahneler görevlerine göre ayrılır.

| Blok | Ana sahne | Ek sahne | Tam aşama | Kısa süre hedefi | Tam süre hedefi |
| --- | ---: | ---: | ---: | ---: | ---: |
| Açılış ve harita | 2 | 0 | 7 | 2:00 | 3:00 |
| 1. kişi / 11.1 | 10 | 3 | 55 | 9:30 | 19:30 |
| 2. kişi / 11.2–11.3 | 8 | 0 | 59 | 10:50 | 16:45 |
| 3. kişi / 11.4–11.6 | 8 | 1 | 45 | 9:00 | 16:00 |
| 4. kişi / 11.7–11.8 | 14 | 2 | 89 | 11:00 | 18:55 |
| Ortak kapanış | 2 | 0 | 13 | 2:00 | 2:30 |
| **Toplam** | **44** | **6** | **268** | **44:20** | **76:40** |

Tablodaki 11.1/11.2 aşama alt toplamları makine sözleşmesinden doğrulandı: 55 ve 59; iki blok toplamı 114'tür. Süreler gerçek sunumda ölçülmedi. Arayüz kısa rotayı yaklaşık 45, ayrıntılı rotayı yaklaşık 77 dakika olarak gösterebilir. Uzun dinleyici katılımı için **90 dakika** prova/tartışma ayrılması önerilir; bu, 77 dakikalık rotanın otomatik hız değiştirmesi değildir.

Açılış kimlikleri `storage-opening` ve `presentation-map`; eski s01/s02 bunlara gider. 21 donanım/zamanlama, 9 yönetim, 16 bağlantı/RAID ve 2 kapanış kimliği paralel bölüm planlarında kesinleştirildi. Kaynak, aşama adları, süre ve alias kayıtları makine sözleşmelerinden merkezi veriye aktarılır; kontrol betiği yeni sayıya sabitlenmez.

[1–2. sunucu ayrıntılı planı](bolum-planlari/01-02-donanim-zamanlama.md), [3. sunucu planı](bolum-planlari/03-dogruluk-yonetim-swap.md) ve [4. sunucu planı](bolum-planlari/04-baglanti-raid-kapanis.md) uygulamaya esas alınır. Bu birleşik karardan sonra paralel uygulama fazı başlar.

### Kesin sahne, kaynak ve rota sözleşmesi

Makine okunabilir tasarım girdisi: [presentation-contract.json](presentation-contract.json). Bu dosya uygulama öncesi onaylanan 50 sahneyi, aşama adlarını, kitap kaynaklarını, eski bağlantıları ve süreleri kaydeder.

| # | Kimlik | Bölüm | Ana / ek | Aşama | Kısa sn | Tam sn | Slayt |
| ---: | --- | --- | --- | ---: | ---: | ---: | --- |
| 1 | `storage-opening` | Bölüm 11 · Açılış | Ana | 3 | 45 | 60 | 1, 2, 3 |
| 2 | `presentation-map` | Bölüm 11 · Yol haritası | Ana | 4 | 75 | 120 | 2, 3 |
| 3 | `hdd-anatomy` | 11.1 | Ana | 5 | 75 | 120 | 4, 5 |
| 4 | `hdd-geometry` | 11.1 | Ana | 4 | 45 | 75 | 5, 14, 16 |
| 5 | `hdd-access-cost` | 11.1 | Ana | 6 | 90 | 150 | 4, 6, 7 |
| 6 | `hdd-request-size` | 11.1 | Ana | 4 | 45 | 90 | 7 |
| 7 | `hdd-history` | 11.1 | Ek | 3 | 0 | 45 | 8 |
| 8 | `hdd-performance-metrics` | 11.1 | Ek | 4 | 0 | 75 | 6, 7, 17 |
| 9 | `nvm-device` | 11.1 | Ana | 4 | 45 | 75 | 9 |
| 10 | `flash-page-block` | 11.1 | Ana | 5 | 90 | 135 | 10, 11 |
| 11 | `flash-endurance` | 11.1 | Ek | 4 | 0 | 90 | 10, 11 |
| 12 | `ram-disk` | 11.1 | Ana | 4 | 45 | 75 | 4, 9, 12 |
| 13 | `magnetic-tape` | 11.1 | Ana | 3 | 30 | 60 | 13 |
| 14 | `logical-blocks` | 11.1 | Ana | 4 | 45 | 75 | 14, 16 |
| 15 | `storage-data-path` | 11.1 | Ana | 5 | 60 | 105 | 15, 18 |
| 16 | `hdd-request-queue` | 11.2 | Ana | 4 | 60 | 90 | 17, 18, 19 |
| 17 | `fcfs-path` | 11.2 | Ana | 10 | 80 | 120 | 19, 20 |
| 18 | `scan-path` | 11.2 | Ana | 11 | 90 | 135 | 21, 22 |
| 19 | `cscan-path` | 11.2 | Ana | 12 | 90 | 135 | 23, 24 |
| 20 | `scheduling-tradeoffs` | 11.2 | Ana | 6 | 75 | 120 | 17, 18, 19, 20, 21, 22, 23, 24, 25 |
| 21 | `nvm-scheduling` | 11.3 | Ana | 5 | 75 | 120 | 11, 15, 26 |
| 22 | `flash-write-amplification` | 11.3 | Ana | 6 | 120 | 180 | 10, 11, 26 |
| 23 | `nvm-management-summary` | 11.3 | Ana | 5 | 60 | 105 | 10, 11, 26 |
| 24 | `error-detection` | 11.4 | Ana | 4 | 75 | 120 | 27 |
| 25 | `error-correction` | 11.4 | Ana | 5 | 45 | 75 | 27 |
| 26 | `device-preparation` | 11.5 | Ana | 6 | 105 | 150 | 28, 29 |
| 27 | `storage-access-modes` | 11.5 | Ek | 4 | 0 | 90 | 28, 29, 30 |
| 28 | `boot-sequence` | 11.5 | Ana | 5 | 60 | 105 | 29, 30 |
| 29 | `bad-block-remapping` | 11.5 | Ana | 3 | 45 | 75 | 30 |
| 30 | `swap-space` | 11.6 | Ana | 5 | 60 | 90 | 31 |
| 31 | `swap-journey` | 11.6 | Ana | 7 | 105 | 165 | 31 |
| 32 | `management-decisions` | 11.4–11.6 | Ana | 6 | 45 | 90 | 27, 28, 29, 30, 31 |
| 33 | `host-attached` | 11.7 | Ana | 5 | 30 | 50 | 15, 32 |
| 34 | `nas` | 11.7 | Ana | 6 | 45 | 75 | 33 |
| 35 | `cloud-storage` | 11.7 | Ana | 5 | 30 | 50 | 34 |
| 36 | `storage-arrays` | 11.7 | Ana | 5 | 45 | 65 | 35 |
| 37 | `san` | 11.7 | Ana | 6 | 45 | 70 | 33, 36, 37 |
| 38 | `raid-intro` | 11.8 | Ana | 5 | 45 | 70 | 38, 39 |
| 39 | `raid-striping` | 11.8 | Ana | 6 | 60 | 95 | 39, 40 |
| 40 | `raid-parity` | 11.8 | Ana | 6 | 60 | 95 | 39, 40 |
| 41 | `raid-xor` | 11.8 | Ek | 5 | 0 | 70 | 39, 40 |
| 42 | `raid-levels` | 11.8 | Ek | 4 | 0 | 35 | 40 |
| 43 | `raid-nested` | 11.8 | Ana | 7 | 60 | 85 | 39, 41 |
| 44 | `raid-rebuild` | 11.8 | Ana | 7 | 75 | 105 | 38, 39, 42 |
| 45 | `raid-features` | 11.8 | Ana | 6 | 45 | 70 | 35, 39, 42 |
| 46 | `raid-integrity` | 11.8 | Ana | 5 | 45 | 65 | 43 |
| 47 | `storage-pools` | 11.8 | Ana | 5 | 30 | 60 | 43, 44 |
| 48 | `object-storage` | 11.8 | Ana | 6 | 45 | 75 | 45, 46 |
| 49 | `io-journey` | Ortak kapanış | Ana | 7 | 60 | 75 | 7, 11, 15, 17, 18, 27, 31, 33, 35, 37, 39, 43, 45, 46 |
| 50 | `storage-wrap-up` | Ortak kapanış | Ana | 6 | 60 | 75 | 3, 7, 17, 18, 38, 39, 41, 42, 43 |

Bu planın toplamları veriden hesaplandı: 268 tam aşama; 244 kısa rota aşaması; 2660 / 4600 saniye. Uygulama bu sözleşmeyle karşılaştırılacak.
