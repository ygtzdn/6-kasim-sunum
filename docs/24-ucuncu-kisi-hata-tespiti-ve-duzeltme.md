# 3. kişinin hata tespiti ve düzeltme akışı

5 Kasım 2026. Bu revizyonun içerik ölçütü Operating System Concepts, Tenth Edition'a bağlılıktır. Önceki sahne sayısı, süre ve görsel düzen kararları değiştirilebilir.

## İncelemede bulunanlar

Sunum bölüm bazında sahne kayıtları, ortak gezinme, kaynak eşlemeleri ve saf işlem modellerinden oluşuyor. Üçüncü kişi §11.4–11.6'yı anlatıyor. Aygıt hazırlığı, açılış, bozuk blok eşlemesi ve tek sayfalı swap anlatımı birbirinden ayrılmış. Bu revizyon, §11.4'ün başlangıcını ve anlatımını iyileştiriyor.

Önceki açılış doğrudan veri bitleri ve P ile başlıyordu. Bozulmanın neden denetlenmesi gerektiği ayrı bir görsel ile kurulmamıştı. Tek bit değişimi ve tespit sonucu aynı anda görünüyordu. ECC karşılaştırmasında farklı veri uzunlukları ve denetim bitlerinin yerleşimi genel kavramın önüne geçiyordu. Parite/checksum/CRC kartları, paritenin checksum türü olduğu ilişkisini göstermiyordu. Kitabın soft error / hard error ayrımı ana ekranda yer almıyordu.

## Yeni sıra

| Sayfa | Anlatım | Aşama |
| --- | --- | ---: |
| `why-error-detection` | Yazılan ve okunan veri, bir bitin değişmesi, denetim bilgisine ihtiyaç | 3 |
| `error-detection` | Veri ve sabit P, hatalı okuma, kontrol, iki bitlik sınır, checksum/CRC | 5 |
| `error-correction` | Veri ve ECC, hatalı okuma, düzeltme, düzeltilemeyen kalıcı hata | 4 |

Bit değişimleri ve açıklamalar mevcut Motion altyapısıyla canlanır. Aşamalar anlatıcının ilerletmesiyle değişir. Hareket kapalıyken açıklamalar ve sonuçlar görünür kalır. Turuncu çarpılar, anlatımda değiştirilen bitleri işaretler; paritenin hata konumunu bulduğu anlamına gelmez. İki bitlik hatanın kontrolden geçmesi başarı gibi sunulmaz.

ECC örneğinde 1011 verisinin üçüncü biti değişir ve 1001 okunur. Kod çözücünün gerçek çıktısı 1011'i geri verir. Denetim bilgisinin bit yerleşimi ana ekrana taşınmaz. Kalıcı hata son adımda ayrı bir kavramsal şemayla gösterilir. İki bitlik hatayla fiziksel arıza eşitlenmez ve tek bir kodun bit sınırları tüm ECC'lere genellenmez.

Üçüncü kişinin toplamı 10 sayfa ve 48 aşama, ana rotası 9 sayfa ve 44 aşamadır. Eklenen giriş süre hedefini ana rotada 9:45'e, ayrıntılı rotada 17:00'ye taşır. Süreler prova hedefidir. Bölüm bağlantısı yeni girişe yönelir, eski `s18` ve `s19` bağlantıları ilgili parite/ECC sayfalarında kalır.

## Kitap dayanağı

[Yazarların resmî 10. baskı Chapter 11 slaytları](https://os-book.com/OS10/slide-dir/PPTX-dir/ch11.pptx), özellikle slayt 27'nin metni yeniden incelendi. Kaynak bit değişimini, hata durumunda işlemin durdurulabilmesini, parite/checksum ilişkisini, CRC'yi, ECC'nin bazı hataları düzeltebilmesini ve soft error / hard error ayrımını kapsıyor. Sonraki aygıt yönetimi ve swap akışı için slayt 28–31 de kontrol edildi.

Tam kitap metni yerel depoda yoktur. Bu çalışma tam kitap sayfalarıyla satır düzeyinde karşılaştırma iddiası taşımaz. Bit dizileri ve diyagramlar özgün öğretim örnekleridir. Sahne dayanakları `src/presentation/textbook.ts` içinde, güncel sayfa açıklamaları `docs/sunucu-3-prova.md` ve çevrimdışı notlarda tutulur.

## Doğrulama

- 80 test geçti. Yeni test hata enjeksiyonu ile kontrolün ayrılmasını, sabit P'yi, iki bitlik hatanın kaçmasını, ECC sonucunu, bölüm sırasını ve geri dönüşü denetler.
- İçerik kontrolü 57 sayfanın açılışını, bölüm/eski adres bağlantılarını ve yerel görsellerini doğruladı.
- TypeScript ve üretim derlemesi başarılı. Çevrimdışı notlar yeniden üretildi.
- Önceki tarayıcı kullanmama tercihine uyuldu. Tarayıcı/projeksiyon görünümü ayrıca denenmedi.

Genel sahne sayısı 57, ana rota 51; mevcut kayıtlardan hesaplanan aşama sayıları 272 ve 246'dır. Bu sayılar içerik için zorunlu sınırlar değildir. Derleme, önceki kütüphane paketinin büyüklüğü için uyarı verir; bu revizyonda yeni bağımlılık eklenmedi.
