# 11 — Onuncu baskı revizyonu: sonuç ve doğrulama

> **Sonraki revizyon:** Bütün sahnelerin Enter/Backspace ile ortak aşama akışına geçirilmesi [12 — Tüm sahnelerde ileri/geri akış](12-tum-sahnelerde-ileri-geri-akis.md) içinde planlandı. Bu dosya önceki revizyonu kaydeder.

**5 Kasım 2026 · Yerel geliştirme.** Ayrıntılı karar ve iş sözleşmesi [10 — Uyum ve akış planı](10-onuncu-baski-uyum-ve-akis-plani.md) içinde uygulamadan önce yazıldı. Önce üç paralel okuma incelemesi, ardından aynı üç ajana dosya sınırları belirli uygulama görevleri verildi. Ana ajan kaynak eşlemesini, dokümanları, içerik kontrolünü ve son bütünleştirmeyi yürüttü.

## Uygulanan değişiklikler

### Kaynak ve öğrenme akışı

- 36 sahnenin her biri `src/presentation/textbook.ts` üzerinden **Operating System Concepts, Tenth Edition** bölüm/slayt konumuna bağlandı.
- Notlarda kısa ana çıkarım, kitap dayanağı ve özgün örnek/model ayrımı gösteriliyor. Önceki öğrenme hedefi, anlatım adımları, temel kavramlar, sorular ve geçişler korunuyor.
- Kaynak panelinde yalnız resmî OSC10 müfredat kaynakları ve ayrı niteliği açık medya atıfları kaldı. Linux/SNIA/UEFI/Hamming belgeleri içerik otoritesi listesinden çıkarıldı.
- Boot sahnesi firmware → boot block → yükleyici → RAM'de çekirdek zincirine döndü.
- Bulut sahnesi uygulama → WAN/Internet → API → uzak veri merkezi akışını ve gecikme/hata gerekçesini öğretiyor.
- ECC ana kavram olarak kalıyor. SECDED çalışan fakat özgün ve sınırlı örnek olarak tanımlanıyor; tüm ECC kodlarına genellenmiyor.
- Resmî slaytlarda dayanağı bulunmayan TRIM genişlemesi yerine sınırlı silme ömrü gösteriliyor.
- Flash demosu sonucu baştan söylemiyor; süreç sonunda 3 host / 5 fiziksel yazma ve fiziksel/host oranını açıklıyor.
- HDD erişim hesabında 4 KiB / 1 MiB seçimleri aktarım ile mekanik beklemeyi karşılaştırmayı kolaylaştırıyor.
- Topoloji adımları artık yalnız sayı yerine ne olduğunu görünür kısa cümleyle açıklıyor.

### Zamanlama örneği ve aritmetik bulgu

Kafa **53**, aralık **0–199**, kuyruk **98, 183, 37, 122, 14, 124, 65, 67**. Bu girdiler resmî slayt örneğidir. Karşılaştırmada ortak varsayılan yön azalandır.

| Başlangıç yönü | FCFS | SCAN | C-SCAN |
| --- | --- | --- | --- |
| Azalan (varsayılan) | 640 | 236 | 386 |
| Artan | 640 | 331 | 382 |

Resmî slayt 21 metnindeki **208** ifadesiyle fiziksel-uç kuralı uyuşmuyor. SCAN yolu `53→37→14→0→65→67→98→122→124→183`; mesafe `53+183=236`. Uca gitmeden 14'te dönen LOOK yolu `39+169=208` olur. Bu fark kaynak notu ve regresyon testinde açıklandı. Tam kitap metni görülmediği için kitabın kendisinde hata olduğu iddia edilmedi. Planın ilk araştırma önerisindeki 208 de uygulamadan önce düzeltildi.

Kuyruk hatalıyken Dene devre dışı; kullanıcı son geçerli girdinin yanlışlıkla yeni taslak diye işlendiğini düşünmüyor. Kitap örneği tek eylemle yeniden yüklenebiliyor.

### Sunum akışı ve erişim

- Odaktaki düğme/link Enter ve Space ile kendi eylemini çalıştırıyor. Sunum alanındaki Enter yalnız aynı sahnenin aşamasını ilerletiyor.
- Basılı tuş, IME, değiştirici tuş ve giriş/slider/seçim korumaları sürüyor.
- Aşama adı yerel seçim listesi: dokunmatik veya klavyeyle aşama seçilebiliyor. Görünür Enter düğmesi geri eklenmedi.
- Son aşamada tamamlanma ve sağ okla sahne değiştirme işareti var.
- Menü açıkken hareket duraklıyor; sahne geçişi odağı açık panelden almıyor.
- S30 yalnız RAID 0/1, S31 yalnız RAID 4/5/6 bağlamında açılıyor. Uygun paylaşılan durum korunuyor; uyumsuz seviye sahneye uygun örneğe dönüşüyor.
- Zamanlama, flash ve RAID depoları statik oluşturma için sunucu görüntüsü sağlıyor.

### Dokümantasyon

README güncellendi. 08 belgesindeki gerçek `+`/`EOF` kalıntıları ve kaldırılmış 3D/video mimarisi temizlendi. Önceki planlar tarihsel olarak işaretlendi; kaynak/akış/kabul kararlarında 10 belgesi, mevcut mimaride 08 belgesi esas alınıyor.

## Doğrulama kanıtları

| Kontrol | Sonuç |
| --- | --- |
| `pnpm test` | **45/45 başarılı**: HDD hesabı, zamanlama, GC, parite/SECDED, hazırlama, remapping, swap, topoloji, RAID ve klavye |
| `pnpm check:content` | **36 sahne, dört sunucu, 36 kaynak/not kaydı, 65 sahne/aşama HTML çıktısı**, ilk kişinin 38 aşaması ve yerel medya başarılı |
| `pnpm build` | TypeScript ve Vite üretim derlemesi başarılı |
| Canlı HTTP | HTML, uygulama/kaynak/navigasyon/bölüm modülleri, CSS, yerel PDF ve dört PNG dahil **17 uç nokta/varlık HTTP 200** |
| Canlı CSS | Ham `@apply` / `@theme` yok; yeni aşama seçimi stili üretiliyor |
| `git diff --check` | Temiz |
| Yerel Markdown bağlantıları / kalıntılar | Güncel README ve docs hedefleri mevcut; patch kalıntısı yok |
| React kalite incelemesi | Hook sırası, state/store kullanımı, erişilebilir adlar, yerel klavye davranışı, durum sonuçları ve hareket kontrolü kod üzerinden incelendi |

İçerik kontrolü yalnız metin varlığına bakmıyor: gerçek modülleri Vite SSR ile yükleyip her başlangıcı ve tanımlı aşamayı oluşturuyor; başlık, NaN/undefined, kaldırılmış medya öğeleri ve yerel medya hedeflerini denetliyor. Kaynak kayıtları sahne kimlikleriyle birebir eşleşmeli; slaytlar 1–47 aralığında, benzersiz ve sıralı olmalı.

## Sınırlar ve kalan gözlemler

- **Tam kitap metni depoda yok.** Bölüm/kavram denetimi resmî içindekiler ve 47 slaytlık destek materyali üzerinden yapıldı. Doğrudan tam kitap sayfası karşılaştırması iddia edilmez.
- Kullanıcının kayıtlı tercihi doğrultusunda **tarayıcı otomasyonu ve ekran görüntüsü kullanılmadı**. Gerçek tarayıcı odağı, farklı ekranlarda taşma, %200 yakınlaştırma ve projeksiyon okunabilirliği görsel olarak doğrulanmış sayılmaz.
- Üretim JavaScript paketi yaklaşık **625,48 kB** (gzip **199,03 kB**); Vite'ın 500 kB parça uyarısı sürüyor. Bu derleme hatası değildir. Yerel sunum için tüm sahneler aynı paketten yüklenir; paket bölme bu revizyonun içinde yapılmadı.
- Modeller gerçek donanım benchmark'ı değildir. RAID 6 Q hesabı sembolik; rebuild adımları süre ölçmez. Özgün flash/swap/ECC örnekleri gerçek firmware veya işletim sistemi iç yapısının tam simülatörü değildir.
- Haricî yayımlama, kullanıcı verisi işlemi veya gerçek disk işlemi yapılmadı.

Geliştirme sunucusu açık bırakıldı: **[http://localhost:5173/](http://localhost:5173/)**.
