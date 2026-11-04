# 19 — Donanım fotoğrafları ve görsel parça rehberi

**5 Kasım 2026.** Kullanıcının görsel ve açıklayıcı belge isteği doğrultusunda HDD/SSD parça anlatımları yeniden ele alındı.

## Fotoğrafta ne değişti?

Önceki görünümde tek büyük “1” işareti parça üstüne taşınıyor, gerçek isim yalnız SVG başlığında bulunuyordu. HDD’nin küçük kafa ucu işaretin altında kalıyor, plaka ile mil tek noktayla gösteriliyor, SSD’de yalnız denetleyici tanıtılıyordu.

Yeni görünüm, gerçek fotoğrafı sabit tutar. Küçük hedef noktaları parçayı kapatmaz; bağlantı çizgileri görünür numara ve isme gider. Aynı numara, yandaki işlev açıklamasında yer alır. Fotoğraf ve işaretler aynı SVG koordinat sisteminde olduğundan ekran boyutu değişirken birlikte ölçeklenir.

| Fotoğraf | Görünür parçalar | Anlatım |
| --- | --- | --- |
| HDD | 1 Plaka, 2 Mil, 3 Kol, 4 Park alanındaki kafa ucu | Önce plaka/mil, sonra kol/kafa grubu açılır. Dönme ile konumlandırma ayrılır. |
| SSD iç kartı | 1 Denetleyici, 2 NAND flash örneği, 3 SATA güç/veri bağlantısı | Yönetim, kalıcı kayıt ve bağlantı farklı görevlerdir. |

HDD fotoğrafındaki kafa park alanındadır. Çok küçük okuma/yazma elemanı bu ölçekte ayrı seçiliyormuş gibi sunulmaz. SSD fotoğrafı belirli bir SATA aygıtıdır; bütün SSD’lere aynı kart veya bağlantı düzeni atfedilmez. Fotoğraf pikselleri değiştirilmedi.

## Görsel belge

[HDD ve SSD görsel parça rehberi](../public/references/donanim-gorsel-rehberi.html), sunumdaki fotoğraf bileşenini, hedef koordinatlarını ve açıklama verisini kullanır. Rehberde her fotoğrafın yanında numaralı parça işlevleri, erişim maliyetleri ve model sınırları bulunur. Kaynaklar menüsünden açılır, yatay sayfa düzeninde yazdırılabilir. Fotoğraflar yerel `public/media` klasöründedir.

Rehber, `pnpm build:notes` ve `pnpm build` sırasında konuşmacı notlarıyla birlikte üretilir. Sunumdaki etiketleri değiştirmek rehberi de günceller; ayrı bir koordinat kopyası tutulmaz.

Bu ek düzenlemede kontrol, değişen donanım bileşenlerinin üretim derlemesi ve statik görsel kompozisyonuyla sınırlıdır. Önceki bütün test dizisini yeniden çalıştırma veya tarayıcı otomasyonu eklenmedi.
