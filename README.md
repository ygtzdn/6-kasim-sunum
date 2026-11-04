# Mass Storage — Kitaba bağlı etkileşimli sunum

**Operating System Concepts, Tenth Edition · Bölüm 11.1–11.8.** Türkçe sunum; 56 sahne, 280 adlandırılmış aşama, dört sunucu. Açık tasarım dili korunarak içerik ve sahne sırası kitap kapsamına göre yeniden kuruldu.

Yerel sunum: **[http://localhost:5173/](http://localhost:5173/)**.

## Başlangıç

Node.js 24 ve pnpm 11.25.0:

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Node PATH'te yoksa `./scripts/dev.sh` kullanılabilir. Uygulama istemci tarafındadır; hesap, veritabanı, API anahtarı veya çalışma sırasında dış servis gerekmez. Font ve gerçek donanım fotoğrafları yereldir.

## İki anlatım rotası

| Rota | Sahne | Aşama | Prova hedefi |
| --- | ---: | ---: | --- |
| Ana anlatım | 50 | 256 | 48:20 · yaklaşık 49 dk |
| Ayrıntılı | 56 | 280 | 84:10 · yaklaşık 85 dk |

Rota menüden seçilir. Ana rota, kitabın bütün 11.1–11.8 başlıklarını korur. Altı ek açıklama ayrıntılı rotada sıraya girer; menüden her zaman doğrudan açılabilir. Bunlar HDD tarihçesi, performans ölçüleri, flash dayanıklılığı/DWPD, raw erişim, XOR ve çok boyutlu paritedir. Süreler plan hedefidir; gerçek konuşma süresi ölçülmüş sayılmaz. Uzun soru-cevap ve tekrar için 90 dakikalık prova önerileri rehberdedir.

## Sunucu dağılımı

| Blok | Kapsam | Ana / tam süre | Hazırlık |
| --- | --- | --- | --- |
| Açılış | Bölümün sorusu ve dört kişinin haritası | 2:00 / 3:00 | Ortak rehber |
| 1. kişi | 11.1 · HDD, NVM, RAM disk, teyp, blok ve veri yolu | 9:30 / 19:30 | [Sunucu 1](docs/sunucu-1-prova.md) |
| 2. kişi | 11.2–11.3 · HDD ve NVM zamanlaması | 10:50 / 16:45 | [Sunucu 2](docs/sunucu-2-prova.md) |
| 3. kişi | 11.4–11.6 · Doğruluk, aygıt, boot ve swap | 9:00 / 16:00 | [Sunucu 3](docs/sunucu-3-prova.md) |
| 4. kişi | 11.7–11.8 · Bağlantı, RAID, bütünlük, havuz ve nesne | 11:00 / 18:55 | [Sunucu 4](docs/sunucu-4-prova.md) |
| Kapanış | İsteğin yolculuğu, seçilmiş Exercises ve tasarım ölçütleri | 6:00 / 10:00 | Sunucu 4 ve ekip |

Her sahnenin Notlar sekmesinde geçerli aşama, kaynak bölümü/slaytı, ana çıkarım, anlatım adımları, soru ve gerekçesi, model sınırı ve geçiş bulunur.

## Klavye ve aşama davranışı

- **Enter:** aynı sahnede ileri; son aşamada kalır.
- **Backspace:** aynı sahnede geri; ilk aşamada kalır. Diyagram, hesap, eşleme, sayaç ve görünür cevap birlikte geri gelir.
- **Sol/sağ ok:** seçili rotada önceki/sonraki sahne. **Home/End:** başlangıç/kapanış.
- **M/N:** menü/notlar. **Space:** açıklayıcı hareketi duraklat/oynat. **F:** tam ekran.
- Aşama listesinden veya sahne içi sekmelerden doğrudan aşama seçilebilir. Görünür Enter düğmesi geri eklenmedi.
- Metin/form kontrolleri yerel klavyelerini korur. Odaktaki düğmede Enter/Space o düğmenin eylemini çalıştırır. Menü açıkken sunum tuşları ve hareket durur.

Aşamalar otomatik zamanlayıcıyla ilerlemez. Flash, swap ve RAID durumları seçilen aşamadan saf model geçişleriyle yeniden üretilir. Sahneye geri dönmek veya doğrudan aşama seçmek başka bir demonun gizli ilerlemesini devralmaz.

Adresler konu adını kullanır: `/#/sunum/hdd-anatomy`, `/#/sunum/swap-journey`, `/#/sunum/raid-rebuild`. Eski `s01–s36` bağlantıları ilgili yeni konuya yönlenir. Yenileme aynı sahneyi başlangıç aşamasında açar.

## Plan ve sunum hazırlığı

- [14 — Ayrıntılı mimari ve kesin sahne tablosu](docs/14-kitaba-dayali-yeni-sunum-mimarisi.md)
- [15 — Ortak prova, kavram yanılgıları ve kurtarma rehberi](docs/15-sunum-prova-ve-kaynak-rehberi.md)
- [1–2. sunucu kaynaklı bölüm planı](docs/bolum-planlari/01-02-donanim-zamanlama.md)
- [3. sunucu kaynaklı bölüm planı](docs/bolum-planlari/03-dogruluk-yonetim-swap.md)
- [4. sunucu kaynaklı bölüm planı](docs/bolum-planlari/04-baglanti-raid-kapanis.md)
- [Makine okunabilir uygulama öncesi sözleşme](docs/presentation-contract.json)
- [Yazdırılabilir çevrimdışı notlar](public/references/sunum-notlari.html)
- [HDD ve SSD görsel parça rehberi](public/references/donanim-gorsel-rehberi.html)
- [16 — Sonuç ve doğrulama raporu](docs/16-yeni-sunum-sonucu-ve-dogrulama.md)
- [17 — Kütüphane tabanlı diyagramlar ve akıcı geçiş altyapısı](docs/17-kutuphane-tabanli-diyagram-ve-gecis.md)
- [18 — Sahneye uygun animasyonlar ve proje incelemesi](docs/18-sahneye-uygun-animasyonlar.md)
- [19 — Donanım fotoğraflarındaki parça anlatımı](docs/19-donanim-fotograflari-ve-gorsel-rehber.md)
- [20 — Diyagram boyutları ve kapanış alıştırmaları](docs/20-diyagram-boyutlari-ve-exercises.md)

Kapanışta, kullanıcının sağladığı `11.pdf` içinden altı alıştırma bulunur: 11.13, 11.14, 11.16(a), 11.17, 11.21(a), 11.25(a,c). Her sorunun çözümü ayrı aşamada açılır. 1–49. sahneler yerlerini korur; alıştırmalar 50–55, son değerlendirme 56. sahnedir. Kaynak PDF, Kaynaklar menüsünde ve soruların üzerinde açılır.

01–13 belgeleri önceki plan ve revizyonların tarihçesini içerir. Temel içerik mimarisi 14 numaralı plan, güncel diyagram/kapanış dizisi 20 numaralı belge ve makine okunabilir sunum sözleşmesidir; önceki 36 sahne / 213 aşama sınırı kaldırılmıştır.

## Kaynak doğruluğu

İçerik çerçevesi [10. baskı resmî sitesi](https://os-book.com/OS10/index.html), [resmî içindekiler](https://os-book.com/OS10/toc-dir/toc.pdf), [Chapter 11 slaytları](https://os-book.com/OS10/slide-dir/PPTX-dir/ch11.pptx), [tekrar soruları](https://os-book.com/OS10/review-dir/11-rev.pdf) ve düzeltmelerdir. Tam kitap metni depoda bulunmadığından sayfa/satır düzeyinde tam kitap doğrulaması iddia edilmez. Kaynaklar aynı 10. baskıya aittir; kitap dışı güncel Linux/UEFI/ürün belgeleri müfredatın yerine kullanılmaz.

HDD kuyruğu kaynak örneğidir: kafa 53, 0–199 aralığı, 98/183/37/122/14/124/65/67. Ortak azalan yönde FCFS 640, SCAN 236, C-SCAN 386. Resmî SCAN slaydındaki 208 ile fiziksel-uç kuralı arasındaki fark açıklanır: 53→0→183=236; 14'te dönen LOOK yolu 208. Kaynak uyuşmazlığı sessizce düzeltilmiş veya kitap metni hatası kesinleşmiş gibi sunulmaz.

Türkçe anlatım, bit/sayfa/disk dizileri ve özgün çizimler eğitim modelleridir. RAID 6 Q ve bazı kavramsal koruma diyagramları semboliktir. Animasyon temposu gerçek aygıt hızı değildir. Fotoğraf atıfları [ATTRIBUTION.md](public/media/ATTRIBUTION.md) içindedir.

## Geliştirme ve kodla doğrulama

```sh
pnpm test
pnpm check:content
pnpm build:notes    # Bağımsız, gömülü fontlu not HTML'i
pnpm build          # TypeScript + notlar + statik üretim
```

`check:content`, sahne/rota metadata'sını uygulama öncesi sözleşmeyle karşılaştırır; bütün aşamaları hareket açık/kapalı ve ileri/ters sırada Node/SSR ile oluşturur. Eski bağlantılar, bölüm/sunucu kapsamı, süreler, kaynaklar, notlar ve yerel medya denetlenir.

React, TypeScript, Vite, Tailwind, Motion, React Flow, Dagre, D3, Radix Dialog ve Lucide kullanılır. Kavramsal grafiklerin otomatik yerleşimi Dagre, kompakt sunum yerleşimleri açık düğüm konumları, bağlantıları React Flow; sayısal yol/ölçekler D3 ile yönetilir. Sahne geçişleri içerik türüne bağlı altı Motion profili kullanır. Aşama değişirken görsel alan korunur; disk kafası, işaretler, grafikler, hücreler ve açıklamalar kendi değişimlerini canlandırır. Sahne ve aşama atomik güncellenir; geçiş sırasında eski sahnenin sıfırlanması ve gecikmiş hash bildiriminin ilerlemeyi silmesi engellenir.

`src/presentation/` ortak kabuk/rota/kaynak; `src/components/diagrams/` kütüphane tabanlı grafikler; `src/chapters/` sahne/not/model; `tests/` hesap ve davranış denetimidir. `dist/` statik üretim çıktısıdır. Bu revizyonda haricî dağıtım yapılmaz.

Kullanıcının isteğiyle uygulama tarayıcı üzerinden test edilmez; tarayıcı otomasyonu ve ekran görüntüsü kullanılmaz. Statik çıktı/model/HTTP kontrolleri gerçek ekran uyumu, odak sırası veya projeksiyon provasının yerine geçmez.
