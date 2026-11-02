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
pnpm test           # 37 hesap/durum testi
pnpm check:content  # 36 sahne, sunucu dağılımı ve ayrıntılı not sözleşmesi
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

HDD anatomisi Three.js / React Three Fiber / Drei ile döndürülüp yakınlaştırılabilir; dokuz parça grubu seçilebilir, katmanlar ayrılabilir. Hazır söküm stop-motion'u, çalışma videosu ve gerçek fotoğraf aynı modüldedir. Kaynak ve lisans bilgileri menüde ve [medya atıflarında](public/media/ATTRIBUTION.md) bulunur.

Diğer modüller gerçek hesap/durum modelleri içerir: FCFS/SCAN/C-SCAN, FTL/GC, parite/SECDED, aygıt hazırlığı, boot, remapping, swap, DAS/NAS/SAN, RAID kapasite/arıza/XOR/rebuild.

Sol/sağ ok: önceki/sonraki; Home/End: ilk/son; M: menü; N: notlar; F: tam ekran. Menüden kısayollar ve hareket kapatılabilir. Hareketi azalt tercihi korunur; sekme gizlenince animasyonlar kapanır.

## Teknoloji ve modüller

React, TypeScript, Vite, Tailwind, Motion, Radix Dialog, Lucide ve Three.js ekosistemi. Fontlar ve medya yerel paketlenir. Ağdan büyük video indirmesi veya WebGL, temel navigasyonun ön koşulu değildir; HDD 3D görünümünün fotoğraf yedeği vardır.

- `src/presentation/`: tipler, registry, navigasyon, yan menü ve not görünümü.
- `src/chapters/`: sunucu kapsamlarına ayrılmış sahneler, notlar ve model motorları.
- `src/components/presentation/`: ortak sahne ve seçim bileşenleri.
- `tests/`: görünümden bağımsız hesap ve durum doğrulamaları.

## Dokümantasyon

Güncel kapsam: [08 — Modüler tam sunum](docs/08-moduler-tam-sunum.md).

- [İlk proje kapsamı](docs/01-proje-kapsami.md)
- [36 sahnelik içerik planı](docs/02-icerik-ve-sunum-akisi.md)
- [Simülasyon şartnameleri](docs/03-etkilesimler.md)
- [İlk teknik plan](docs/04-teknik-mimari.md)
- [Kabul planı](docs/05-uygulama-ve-kabul.md)
- [Kaynaklar ve sözlük](docs/06-kaynaklar-ve-sozluk.md)
- [Açık tema ve Tailwind kararı](docs/07-guncel-uygulama.md)

Kullanıcının isteğiyle bu geliştirmede tarayıcı doğrulaması, ekran görüntüsü veya tarayıcı otomasyonu kullanılmadı. Derleme, model testleri, Node içerik kontrolü ve canlı HTTP yanıtları kontrol edildi; görsel olarak doğrulandığı iddia edilmez.
