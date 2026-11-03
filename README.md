# Mass Storage — Etkileşimli Sunum

Operating System Concepts, **10. baskı, Bölüm 11** için yalnızca istemci tarafında çalışan Türkçe sunum.

**Mevcut sürüm:** Açılış, **11.1–11.8** ve ortak kapanış dahil **36 sahne** hazır. Dört kişinin bölüm dağılımı korunur.

## Çalıştırma

Node.js 24 ve pnpm 11.25.0:

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Bu ortamda Node PATH'te değilse `./scripts/dev.sh` kullanılabilir. Yerel sunucu: [http://localhost:5173](http://localhost:5173).

```sh
pnpm build          # TypeScript ve statik üretim paketi
pnpm test           # 42 hesap/durum ve klavye testi
pnpm check:content  # 36 sahne; ilk kişinin 38 aşaması ve yerel medya
```

`dist/` statik olarak sunulur; backend, veritabanı veya çalışma sırasında dış API gerekmez.

## Vercel

`vercel.json`, Vite derlemesini ve `dist/` çıktı klasörünü tanımlar. Kurulum ve derleme pnpm 11.25.0 sürümünü kullanır; Node.js sürümü `package.json` içinde 24.x olarak sabittir. Ortam değişkeni gerekmez.

Proje kökü depo köküdür. Sunum adresleri `/#/sunum/s01` biçiminde hash yönlendirmesi kullandığı için ek sunucu yönlendirme kuralına gerek yoktur. `.vercel/` içindeki yerel hesap/proje bağlantıları Git'e eklenmez.

## Sunucu dağılımı

| Sunucu | Bölüm | Sahne |
| --- | --- | --- |
| 1. kişi | 11.1 | S03–S09 |
| 2. kişi | 11.2 ve 11.3 | S10–S17 |
| 3. kişi | 11.4, 11.5 ve 11.6 | S18–S25 |
| 4. kişi | 11.7 ve 11.8 | S26–S34 |

S01–S02 açılış; S35–S36 ortak kapanıştır.

## Tasarım ve etkileşim

Açık tema, yüksek kontrast, çok az görünür metin ve kaydırmasız sahneler. Küçük yan menüde bütün sayfalar sunucu gruplarıyla seçilebilir. Her sayfanın ayrıntılı anlamı, anlatım sırası, kavramları ve model sınırları **Notlar** sekmesindedir.

İlk kişinin akışı HDD parçaları → Volatil / Non-Volatil karşılaştırması → okuma maliyeti → SSD fotoğrafları → flash sayfa/blok davranışı → RAM disk, teyp ve mantıksal bloklar şeklindedir. Volatil grupta RAM, Non-Volatil grupta HDD ve SSD bulunur. Gerçek donanım fotoğrafları arka plansız, kırpılmış ve alfa kanallı PNG olarak kullanılır. 3D model, söküm ve çalışma videoları kaldırıldı; yeni donanım animasyonu veya görsel üretilmedi. Kaynak ve lisans bilgileri menüde ve [medya atıflarında](public/media/ATTRIBUTION.md) bulunur.

İçerik sınırı yazarların resmî 10. baskı Chapter 11 slaytlarıdır (ilk kişi için 4–16). Tam kitap metni yerel projede bulunmuyor. Konumlandırma gecikmesi (seek + dönme) ile aktarım dahil örnek servis süresi ayrı adlandırılır; örnek hesap denetleyici/kuyruk ek yükünü içermez.

Diğer modüller gerçek hesap/durum modelleri içerir: FCFS/SCAN/C-SCAN, FTL/GC, parite/SECDED, aygıt hazırlığı, boot, remapping, swap, DAS/NAS/SAN, RAID kapasite/arıza/XOR/rebuild.

**Enter:** aynı sahnenin sonraki aşaması; son aşamada sahne değişmez. Sol altta Enter düğmesi gösterilmez; aşama sayısı, adı ve başa alma kontrolü kalır. İlk kişinin bütün sahneleri aşamalandırılmıştır; diğer sunucuların açıkça işaretlenmiş adım demolarında da Enter kullanılabilir. **Space:** genel animasyon oynatma/duraklatma. **Sol/sağ ok:** önceki/sonraki sahne; Home/End: ilk/son; M: menü; N: notlar; F: tam ekran. Menü veya giriş alanı kullanılırken sunum tuşları devre dışıdır. Tuşa basılı tutma aşamaları atlamaz. Hareketi azalt tercihi korunur; sekme gizlenince animasyonlar duraklar.

## Teknoloji ve modüller

React, TypeScript, Vite, Tailwind, Motion, Radix Dialog ve Lucide. Fontlar ve fotoğraflar yerel paketlenir. WebGL veya video bağımlılığı yoktur.

- `src/presentation/`: tipler, registry, navigasyon, yan menü ve not görünümü.
- `src/chapters/`: sunucu kapsamlarına ayrılmış sahneler, notlar ve model motorları.
- `src/components/presentation/`: ortak sahne ve seçim bileşenleri.
- `tests/`: görünümden bağımsız hesap ve durum doğrulamaları.

## Dokümantasyon

Güncel ilk kişi revizyonu ve uygulama öncesi plan: [09 — Kitaba bağlı revizyon](docs/09-kitaba-bagli-revizyon.md). Diğer sunucuların modüler kapsamı için [08 — Modüler tam sunum](docs/08-moduler-tam-sunum.md).

- [İlk proje kapsamı](docs/01-proje-kapsami.md)
- [36 sahnelik içerik planı](docs/02-icerik-ve-sunum-akisi.md)
- [Simülasyon şartnameleri](docs/03-etkilesimler.md)
- [İlk teknik plan](docs/04-teknik-mimari.md)
- [Kabul planı](docs/05-uygulama-ve-kabul.md)
- [Kaynaklar ve sözlük](docs/06-kaynaklar-ve-sozluk.md)
- [Açık tema ve Tailwind kararı](docs/07-guncel-uygulama.md)

Kullanıcının isteğiyle bu geliştirmede tarayıcı doğrulaması, ekran görüntüsü veya tarayıcı otomasyonu kullanılmadı. Derleme, model testleri, Node içerik kontrolü ve canlı HTTP yanıtları kontrol edildi; görsel olarak doğrulandığı iddia edilmez.
