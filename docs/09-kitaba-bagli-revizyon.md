# 09 — Kitaba bağlı ilk sunucu revizyonu

3 Kasım 2026. Uygulamadan önce oluşturulan plan.

## Kaynak ve kapsam

Operating System Concepts, 10. baskı, 11.1. Kaynak: yazarların [Chapter 11 ders slaytları](https://os-book.com/OS10/slide-dir/PPTX-dir/ch11.pptx), özellikle 4–16. Yerel depoda kitabın tam metni bulunmuyor; içindekiler tek başına içerik doğrulaması sayılmıyor. Resmî slaytların metni incelendi.

## Uygulama sırası

1. HDD–RAM karşılaştırmasını kalıcılık, mekanik hareket ve RAM diskin uçuculuğu üzerinden yeniden düzenle.
2. HDD anatomisini gerçek, yüksek çözünürlüklü fotoğrafla ve kitaptaki temel kavramlarla sınırla: plaka, mil, kol, kafa, iz/sektör/silindir. Fotoğrafta görülemeyen iz/sektör/silindiri fiziksel bir işaret gibi gösterme.
3. HDD okuma maliyetini koru; konumlandırma gecikmesi (seek + dönme) ile aktarım dahil örnek servis süresini ayır.
4. HDD'den sonra SSD dış görünüşünü ve gerçek iç kart fotoğrafını göster. Flash bellek ve denetleyiciyi görev düzeyinde tanıt; devre, paket teknolojisi ve ürün performansına girme.
5. Sayfa okuma/yazma, yerinde üzerine yazamama ve daha büyük blokta silme davranışını aşamalandır. FTL/GC ayrıntıları ikinci kişide kalsın.
6. RAM disk, manyetik teyp ve mantıksal blok görünümünü 11.1 kapsamına uygun tamamla. Rastgele fiziksel permütasyonu temel HDD eşlemesi gibi sunma.
7. Enter yalnızca geçerli sahnenin sonraki aşamasına ilerlesin; son aşama sahne değiştirmesin. Space oynatma/duraklatma yapsın. Ok tuşları sahne değiştirsin. Giriş alanları, açık menü ve tuş tekrarı korunsun.
8. 3D model/explorer, söküm ve çalışma videolarını, bunların kaynak kayıtlarını ve kullanılmayan Three.js bağımlılıklarını kaldır. Yapay görsel veya donanım videosu üretme; uygun hazır animasyon bulunamadığında fotoğraf kullan.
9. TypeScript/üretim derlemesi, mevcut model testleri, içerik sözleşmesi ve yeni klavye/aşama davranışını doğrula. Yerel geliştirme sunucusunu 5173 portunda açık bırak.

## Sahne akışı

S01–S02 açılış ve sunucu haritası. S03 HDD fotoğrafı/temel parçalar. S04 HDD–RAM karşılaştırması. S05 HDD okuma maliyeti. S06 SSD fotoğrafları/temel parçalar. S07 flash sayfa ve blok davranışı. S08 RAM disk, teyp ve mantıksal blok görünümü. S09 mekanik bekleme kontrolü. S10 ve sonrası ile dört kişinin sahne dağılımı korunur.

## Kabul ölçütleri

- 36 sahne, aynı kimlikler ve aynı sunucu dağılımı.
- Medya yerel; fotoğrafların kaynak/lisans kayıtları mevcut.
- Enter hiçbir aşamada URL/sahne değiştirmez; Space duraklatınca aşamalar kendiliğinden ilerlemez.
- Kitaptaki konumlandırma süresi ile aktarım dahil servis süresi ayrı adlandırılır.
- Önceki yerel proje yönergesi doğrultusunda tarayıcı otomasyonu ve ekran görüntüsü kullanılmaz; görsel doğrulama yapılmış sayılmaz.

## Uygulama ve doğrulama sonucu

- Plan uygulandı. Son sıralamada HDD anatomisi karşılaştırmadan önceye alındı. İlk kişinin açılış dahil 9 sahnesi toplam 38 elle yönetilen aşama içeriyor. Son aşamada Enter sahneyi değiştirmiyor. Açıkça işaretlenmiş mevcut adım demolarına da Enter desteği eklendi.
- HDD anatomisi 4600 × 3520 gerçek fotoğraf; SSD dış görünüşü 2849 × 2035, iç kartı 3362 × 2172 gerçek fotoğraflarla gösteriliyor. Görsel dosyalarına müdahale edilmedi; arayüz numaraları ayrı katmanlar. Kaynaklar ve lisanslar `public/media/ATTRIBUTION.md` içinde.
- Üretilmiş HDD SVG'si, 3D explorer/model/parça dosyaları, söküm ve spin-up videoları ve ilgisiz defragmentasyon GIF'i kaldırıldı. Three.js, React Three Fiber, Drei ve Three.js tip bağımlılıkları temizlendi.
- TypeScript ve Vite üretim derlemesi başarılı. 42 model/klavye testi geçti. İçerik kontrolü 36 sahneyi, dört sunucuyu ve ilk kişinin 38 aşamasının sunucu tarafında oluşturulan HTML/medya sözleşmesini doğruladı.
- Canlı geliştirme sunucusundaki sayfa, App/navigasyon/ilk kişi modülleri ve üç fotoğraf HTTP 200 döndürüyor. CSS derlenmiş; ham Tailwind yönergesi içermiyor. `git diff --check` temiz.
- Yerel sunucu: http://localhost:5173/ . Tarayıcı otomasyonu veya ekran görüntüsüyle görsel doğrulama yapılmadı. Derleme, bütün bölümün tek JavaScript paketi için 500 kB uyarısı veriyor; derleme hatası yok.

## İkinci revizyon — arka plansız görseller ve kalıcılık grupları

Sol alttaki görünür Enter düğmesi kaldırıldı; Enter kısayolu ve aşama bilgisi korunuyor. S04 artık iki gruptur: **Volatil (RAM)** ve **Non-Volatil (HDD, SSD)**. Güç kesme/geri getirme anlatımı aynı kalıcılık ayrımını gösteriyor.

HDD ve RAM için Wikimedia Commons'taki mevcut şeffaf PNG fotoğrafları kullanıldı. SSD fotoğrafları yalnızca arka plan maskesi ve kırpma ile şeffaf PNG yapıldı; donanım ayrıntısı üretilmedi. Parça işaretleri yeni kırpma koordinatlarına uyarlandı. Dört dosyada da gerçek alfa kanalı ve tamamen şeffaf pikseller doğrulandı. Kaynak/lisans listesi ve konuşmacı notları güncellendi. Bu bölüm, yukarıdaki JPG boyutları ve önceki karşılaştırma başlığının yerini alır.
