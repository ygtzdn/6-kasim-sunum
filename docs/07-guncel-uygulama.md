# 07 — Güncel uygulama ve tasarım kararı

> **Tarihsel belge:** Bu dosya önceki planı/uygulamayı kaydeder. Güncel kaynak, akış, örnek ve kabul kararları için [14 — Yeni sunum mimarisi](14-kitaba-dayali-yeni-sunum-mimarisi.md), mevcut mimari için [08 — Modüler tam sunum](08-moduler-tam-sunum.md) esas alınır. Aşağıdaki eski örnek toplamları, yapılacaklar ve kaldırılan özellikler güncel uygulama taahhüdü değildir.

> Sonraki uygulama: Sunum 36 sahneye tamamlandı, HDD kütüphane/hazır içerik modülü ve ayrıntılı notlar eklendi. Güncel kapsam için [08 — Modüler tam sunum](08-moduler-tam-sunum.md) esas alınır; bu belgedeki dokuz sahnelik durum önceki aşamadır.

**2 Kasım 2026.** Bu belge, kullanıcının son yönlendirmelerini kaydeder. İlk planlardaki koyu tema, framework kullanmama ve sunum ekranında uzun metin gösterme kararlarının yerine geçer.

## Tasarımın amacı

Öncelik **basitlik, anlaşılabilirlik ve etkileşim**. Animasyon, anlatılan nesnedeki değişimi gösterir. Sahneler bir web sayfası gibi okunmak yerine sunucunun sözlü anlatımını destekler.

- Açık zemin: `#f8f9fc`; ana metin: `#111827`.
- Etkileşim: mavi `#2247eb`; ikinci vurgu: turuncu `#f05b28`.
- Ana ekran dışında her sahne `100dvh` alan içinde kalır. Dikey/yatay sayfa kaydırması kapalıdır.
- Başlık, görsel ve kısa kontroller görünür. Uzun açıklamalar, atıflar ve model sınırları yan menüye taşınır.
- Ana ekranda ve yan menü içinde gerekirse kaydırma kullanılabilir.
- Sayfalar arasında serbest geçiş sağ alttaki küçük gezinme sekmesinden veya klavyeden yapılır.
- Yan menü tam ekranı kapatmaz; sahne yanında açılan küçük bir paneldir.

## Teknoloji kararı

| Araç | Kullanım |
| --- | --- |
| React 19 + TypeScript | Sahne bileşenleri ve yerel etkileşim durumları |
| Vite 8 | Geliştirme sunucusu ve statik üretim derlemesi |
| Tailwind CSS 4 + Vite eklentisi | Yerleşim, tema, tipografi ve uyarlanabilir boyutlar |
| Motion | Sahne geçişi, seçim geri bildirimi ve durum değişimi |
| SVG animasyonları | Plaka dönüşü ve temsili hareket |
| Radix Dialog | Küçük, erişilebilir yan menü |
| Lucide | Az sayıda, işlevi belirgin ikon |

Bağımlılıkların tam sürümleri `package.json` ve `pnpm-lock.yaml` içinde sabittir. Tailwind entegrasyonu [resmî Vite kurulumuna](https://tailwindcss.com/docs/installation/using-vite) dayanır. Kaynaklar `src/` altında düzenlenir; `dist/` derleme çıktısıdır. İlk plandaki doğrudan `dist/` altında geliştirme yaklaşımı kullanılmaz.

## Mevcut kapsam

S01–S09 uygulanmıştır; 11.2–11.8 sonraki aşamadadır. Sunucu dağılımı korunur. Hazır olmayan bölümlere çalışan sahne izlenimi veren bağlantı eklenmez.

| Sahne | Ekrandaki etkileşim |
| --- | --- |
| S01 | Hareketli disk ve sunuma başlama |
| S02 | Dört sunucunun kısa haritası |
| S03 | Ortam seçimi; RAM gücünü kesince verinin kaybolması |
| S04 | Plaka/iz/sektör/kafa seçimi; şema ve fotoğraf arasında geçiş |
| S05 | Dört parametreyle seek/dönme/aktarım hesabını değiştirme |
| S06 | LBA seçip fiziksel eşlemesini görme |
| S07 | L0'ın yeni sürümünü boş bir fiziksel sayfaya yazma |
| S08 | Rastgele/sıralı konumlar arasında hareketi karşılaştırma |
| S09 | Cevap seçimiyle mekanik beklemeyi hatırlama |

Gösterimler eğitim modelleridir. Animasyonların ekrandaki temposu gerçek aygıt hızı değildir. S05'in hesabında kuyruk, önbellek ve denetleyici maliyeti yoktur; birimler menü notunda belirtilir. S06 eşlemesi gerçek bir aygıttan alınmamıştır. S07'nin basit sayfa yazması, tam bir FTL/GC simülatörü değildir.

## Hareket ve erişim

Animasyonlar daha görünürdür; aynı öğeyi açıklama amacı taşır. Hareketi azalt tercihi olan sistemlerde hareket sınırlandırılır. Menüden animasyon durdurulabilir. Sekme gizlenince animasyon kapanır; kullanıcı menüden yeniden başlatır. Sahne değişiminde önceki sahnenin zamanlayıcıları sökülür.

Slider üzerinde ok tuşları sunumu değiştirmez. Menü açıksa sunum kısayolları işlemez. Ana navigasyon sol/sağ ok, Home ve End; isteğe bağlı harf kısayolları M/N/F'dir. Kontrollerde erişilebilir adlar ve görünür odak kullanılır.

S05 parametreleri sahneler arasında aynı oturumda korunur. Diğer sahneler yeniden açılınca örnek başlangıcına döner. Yenileme sonrası aktif sahne URL'den açılır; demo verileri kalıcı kaydedilmez.

## İnternetten bulunan materyaller

- [Resmî içindekiler](https://os-book.com/OS10/toc-dir/toc.pdf): yerel `public/references/osc10-contents.pdf`.
- [Resmî Chapter 11 slaytları](https://os-book.com/OS10/slide-dir/PPTX-dir/ch11.pptx): kaynak menüsünde dış bağlantı.
- [Evan-Amos — Laptop hard drive exposed](https://commons.wikimedia.org/wiki/File:Laptop-hard-drive-exposed.jpg): yerel fotoğraf, CC BY-SA 3.0. İçerik değiştirilmedi; kaynak/lisans menüde belirtilir.
- [German — Defragmenting disk](https://commons.wikimedia.org/wiki/File:Defragmenting_disk.gif): public domain GIF; kaynak menüsünde isteğe bağlı oynatma. Dosya yerleşimi için ek görseldir; HDD zamanlama algoritması veya SSD birleştirme önerisi değildir.

Fontlar dahil uygulama varlıkları yerel pakettedir. Uygulamanın çalışması dış API gerektirmez; kaynak bağlantıları ayrıca internet gerektirebilir.

## Doğrulama sınırı

Kullanıcının açık isteğiyle **bu revizyonda tarayıcı kontrolü, ekran görüntüsü veya tarayıcı otomasyonu kullanılmaz**. TypeScript kontrolü, üretim derlemesi ve dört HDD hesap testi çalıştırılır. Sabit ekran yerleşimi kodla uygulanır; tarayıcıda görsel olarak doğrulandığı iddia edilmez.

Geliştirme sunucusu `http://localhost:5173` adresinde çalışır. Bu yerel bir önizlemedir; haricî yayımlama yapılmadı.

### Geliştirme sunucusunda Tailwind düzeltmesi

Tailwind kurulmadan önce başlatılmış Vite süreci, yeni eklentiyi yüklemeden çalışmaya devam etmişti. Üretim derlemesi doğru olsa da canlı CSS yanıtında işlenmemiş `@apply` ve `@theme` bulunuyordu. Bu süreç durdurulup `./scripts/dev.sh --force` ile yeniden başlatıldı.

Ardından hem doğrudan CSS yanıtı hem tarayıcıya gönderilen CSS JavaScript modülü HTTP üzerinden kontrol edildi: ham Tailwind yönergeleri kalmadığı, ana ekranın `display: grid` ve menünün `position: fixed` stillerinin üretildiği doğrulandı. Tarayıcı otomasyonu kullanılmadı.
