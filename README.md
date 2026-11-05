# Kütlesel depolama — Etkileşimli sunum

**Operating System Concepts, Tenth Edition · Bölüm 11.1–11.8.** Dört kişinin Türkçe sunumu. İlk ekranda sekiz bölüm başlığı birlikte görünür. Sunum yalnızca 51 sayfalık **Ana akış** ile çalışır.

Yerel sunum: [http://localhost:5173/](http://localhost:5173/).

## Başlangıç

Node.js 24 ve pnpm 11.25.0:

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Node PATH'te yoksa `./scripts/dev.sh` kullanılabilir. Fotoğraflar ve fontlar yereldir. Sunum sırasında hesap, veritabanı, API anahtarı veya dış hizmet gerekmez.

## Güncel akış

Açılıştaki her başlık kendi bölümünün ilk sayfasına bağlanır. Menü de 11.1–11.8 başlıklarıyla gruplanır.

| Sunucu | Kapsam |
| --- | --- |
| 1. kişi | 11.1 · HDD, SSD/NVM, sayfa/blok ve temel yazma/silme kuralları, DWPD, RAM |
| 2. kişi | 11.2–11.3 · HDD/NVM zamanlaması, ayrıntılı adresleme, güncelleme, GC, yazma büyütmesi ve wear leveling |
| 3. kişi | 11.4–11.6 · Hata kontrolü, aygıt yönetimi ve swap |
| 4. kişi | 11.7–11.8 · Bağlantılar, RAID, bütünlük, havuz ve nesne depolama |

11.1 ana akışı:

1. Gerçek HDD, SSD ve RAM fotoğraflarıyla ortak tanıtım.
2. Gerçek fotoğraf üzerinden HDD parçaları.
3. İz, sektör ve silindir.
4. HDD okuması ve erişim süresi.
5. İstek boyutu ve mekanik bekleme.
6. Gerçek kart üzerinden NVM/SSD parçaları.
7. NAND'da sayfa ve blok.
8. Flash dayanıklılığı ve DWPD.
9. RAM'in çalışma alanı ve elektrikle ilişkisi.
10. RAM, HDD ve SSD karşılaştırması.

Teyp ve HDD tarihçesi sunumdan çıkarıldı. RAM disk anlatımı RAM'in çalışma alanı ve güç bağımlılığıyla değiştirildi. GC ve wear leveling 2. kişinin bölümünde kalır. Adresleme ve GC aynı üç bloklu flash modelini kullanır.

Sunum, menü ve çevrimdışı notlar aynı 51 sayfayı içerir. Önceki altı ek sayfa kaldırıldı. DWPD ana akıştadır.

3. kişinin 11.4 bölümü önce hata tespitinin neden gerektiğini gösterir. Ardından bit değişimi ve parite kontrolü ayrı adımlarda açılır, iki bitlik hatanın pariteden kaçması açıklanır. Paritenin basit bir checksum türü olduğu ve CRC'nin başka bir tespit yöntemi olduğu gösterilir. ECC, veri/denetim/sonuç diyagramıyla anlatılır; son adım kitabın soft error / hard error ayrımıdır. Bölümün başlangıç adresi `/#/sunum/why-error-detection` olur. Ayrıntılar [3. kişi düzenleme kaydındadır](docs/24-ucuncu-kisi-hata-tespiti-ve-duzeltme.md).

Kapanışta bütünleşik I/O yolculuğu, altı seçilmiş alıştırma ve tasarım değerlendirmesi bulunur. Kullanıcının sağladığı yerel Exercises PDF'sinden 11.13, 11.14, 11.16(a), 11.17, 11.21(a), 11.25(a,c) kullanılır.

## Notlar ve kaynaklar

Notlar sekmesi, her sayfanın anlattığı konuyu kısa metinle açıklar. Notlar aşama başına konuşma metni, sunucu yönergesi, dinleyici sorusu veya geçiş konuşması içermez. Kitap dayanağı ve model ayrıntıları ayrı **Kaynaklar** sekmesindedir.

Not biçimi, metin uzunluğu, soru sayısı ve aşama başına ayrı açıklama için zorunlu kontroller kaldırıldı. En az iki aşama, aşama adlarının biçimi, her aşamanın farklı görünmesi ve bütün aşamaların ileri/geri karşılaştırılması gibi içerik kuralları da kaldırıldı.

- [Çevrimdışı sayfa açıklamaları](public/references/sunum-notlari.html)
- [HDD ve SSD görsel parça rehberi](public/references/donanim-gorsel-rehberi.html)
- [1. kişinin sayfa açıklamaları](docs/sunucu-1-prova.md)
- [2. kişinin sayfa açıklamaları](docs/sunucu-2-prova.md)
- [3. kişinin sayfa açıklamaları](docs/sunucu-3-prova.md)
- [4. kişinin sayfa açıklamaları](docs/sunucu-4-prova.md)
- [Güncel plan ve kararlar](docs/22-acilis-ve-11-1-yeniden-duzenleme-plani.md)
- [Uygulama kaydı](docs/23-yeni-acilis-ve-notlar.md)

01–21 numaralı belgeler önceki revizyonların tarihçesidir. Eski not ve aşama gereksinimleri güncel uygulamayı bağlamaz. `docs/presentation-contract.json`, güncel sayfaların veri dökümüdür. İçerik üretimini sınırlayan bir sözleşme olarak kullanılmaz.

## Klavye ve gezinme

- **Enter / Backspace:** aynı sayfada sonraki / önceki aşama.
- **Sol / sağ ok:** önceki / sonraki sayfa.
- **Home / End:** sunumun başlangıcı / sonu.
- **M / N:** menü / notlar.
- **Space:** açıklayıcı hareketi duraklat / oynat.
- **F:** tam ekran.

Tek görünümü yeterli olan sayfalarda aşama seçicisi gösterilmez. Form kontrolleri ve düğmeler kendi klavye davranışlarını korur. Menü açıkken sunum kısayolları ve hareket durur. Aşamalar zamanlayıcıyla ilerlemez.

Adresler `/#/sunum/hdd-anatomy` biçimindedir. Eski s01–s36 adresleri korunur. Eski harita açılışa, eski RAM disk bağlantısı yeni RAM sayfasına yönlenir. Yenileme aynı sayfayı başlangıç durumunda açar.

## Kaynak ve model doğruluğu

Çerçeve [resmî 10. baskı sitesi](https://os-book.com/OS10/index.html), [içindekiler](https://os-book.com/OS10/toc-dir/toc.pdf) ve [Chapter 11 slaytlarına](https://os-book.com/OS10/slide-dir/PPTX-dir/ch11.pptx) dayanır. Tam kitap metni depoda bulunmadığından kitap sayfası/satırı düzeyinde tam doğrulama iddia edilmez. Gerçek fotoğrafların atıfları [medya kaydındadır](public/media/ATTRIBUTION.md).

HDD örneğinde kafa 53, aralık 0–199, kuyruk 98/183/37/122/14/124/65/67'dir. Ortak azalan yönde FCFS 640, fiziksel uca giden SCAN 236, C-SCAN 386 hareket üretir. Kaynak slaydındaki 208 değeri, 14'te dönen LOOK yolu ile açıklanır. Kaynak uyuşmazlığı sessizce değiştirilmez.

Flash, swap ve RAID örnekleri eğitim modelleridir. Animasyon süresi aygıt hızı değildir. Flash güncelleme ve GC durumu saf modelden üretilir. Wear leveling karşılaştırmaları aynı başlangıç ve aynı üç yeni silme üzerinden yapılır.

## Geliştirme ve kontroller

```sh
pnpm test
pnpm check:content
pnpm build
```

`test`, gezinme ve işlem modellerinin doğruluğunu sınar. `check:content`, sayfaların ilk görünümünün oluşturulmasını, bölüm bağlantılarını, eski adresleri ve yerel görselleri kontrol eder. Not biçimini veya her aşamayı denetlemez. `build`, TypeScript kontrolü, çevrimdışı not üretimi ve statik derlemeyi yapar. Notları tek başına üretmek için `pnpm build:notes` kullanılabilir.

React, TypeScript, Vite, Tailwind, Motion, React Flow, Dagre, D3, Radix Dialog ve Lucide kullanılır. `src/presentation/` ortak kabuk ve kaynakları, `src/chapters/` içerik ve modelleri, `public/` yerel varlıkları, `dist/` derleme çıktısını içerir.

Kullanıcının mevcut tercihi doğrultusunda tarayıcı otomasyonu ve ekran görüntüsü kullanılmaz. Statik oluşturma, model ve HTTP kontrolleri projeksiyon okunurluğu veya gerçek tarayıcı provasının yerine geçmez.

## Dağıtım

`vercel.json`, Vite derlemesini ve `dist/` klasörünü tanımlar. Node.js 24.x ve pnpm 11.25.0 kullanılır. Ortam değişkeni gerekmez. Hash adresleme ek yönlendirme kuralı gerektirmez. `.vercel/` yerel proje bağlantıları Git'e eklenmez. Bu çalışma yerel uygulamayı değiştirir, haricî dağıtım yapmaz.
