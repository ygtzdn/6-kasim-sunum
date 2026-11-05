# 23 — Yeni açılış, 11.1 akışı ve sayfa açıklamaları

5 Kasım 2026. 22 numaralı plan, kullanıcının son kapsam düzeltmeleriyle uygulandı.

## Uygulanan değişiklikler

- Açılışta 11.1–11.8 başlıkları birlikte görünür. Her başlık ilgili bölümün ilk sayfasını açar.
- Menü bölüm başlıklarına göre gruplanır. Varsayılan rota Ana akış'tır. Ek içerikler menüden veya Tüm içerik rotasından erişilebilir.
- 11.1, gerçek HDD, SSD ve RAM fotoğraflarının birlikte bulunduğu sayfayla başlar.
- HDD parça, geometri ve erişim anlatımı korunur. HDD tarihçesi ve teyp çıkarılır.
- SSD'nin NAND, denetleyici ve SATA bağlantısı gerçek kart üzerinde açıklanır.
- İlk bölümde NAND sayfa/blok yapısı ve temel yazma/silme kuralları gösterilir. DWPD ana akışta kalır.
- RAM disk akışı yerine RAM'in çalışma alanı ve güç bağımlılığı anlatılır. Güç geri geldiğinde eski çalışma verisi geri görünmez.
- 11.1, RAM/HDD/SSD karşılaştırmasıyla tamamlanır. Ana akışta on sayfa vardır.
- Ayrıntılı adresleme, güncelleme, GC ve wear leveling 2. kişinin bölümündedir. Adresleme ve GC aynı üç bloklu modeli kullanır.
- Wear leveling, aynı başlangıç ve aynı üç yeni silme için iki alternatif dağılımla açıklanır. Bir karşılaştırmanın sayaçları diğerinin devamı olarak gösterilmez.

## Notlar ve kaldırılan denetimler

Bütün sayfaların notları konu açıklamasına dönüştürüldü. Not paneli tek açıklama metni gösterir. Soru, geçiş konuşması, öğrenme hedefi ve aşama başına konuşma metni alanları kaldırıldı. Kaynaklar ayrı sekmededir. Ekran altyazıları not dosyasından ayrıldı.

Not biçimi, uzunluğu, cümle sayısı, soru zorunluluğu ve aşamayla birebir eşleşme denetimleri kaldırıldı. En az iki aşama, aşama adı biçimi, her aşamada farklı çıktı, ileri/geri tam çıktı eşitliği ve hareket açık/kapalı bütün aşama taramaları kaldırıldı. Genel aşama taramaları görsel senaryo testlerinden de çıkarıldı. İşlem modellerinin doğruluğunu kontrol eden testler korunur.

İçerik kontrolü artık sayfanın ilk görünümünü oluşturur, bölüm bağlantılarını, eski adresleri ve yerel görselleri kontrol eder. Eski JSON sözleşmesi üretimi engellemez. Dosya güncel içerik dökümü olarak tutulur.

Çevrimdışı HTML ve dört kişinin Markdown açıklamaları güncellendi. HTML'de aşama sırası veya sunum yönergeleri bulunmaz. Kitap ve model dayanakları ayrı kaynak bölümündedir.

## Doğrulama

- Üretim derlemesi tamamlandı. TypeScript ve not üretimi geçti.
- Son test çalışmasında 80 test geçti.
- Sayfa açılışları, bölüm bağlantıları ve yerel görseller için temel içerik kontrolü geçti.
- Eski not başlıkları ve çıkarılan konu başlıkları çevrimdışı açıklamalarda bulunmuyor.
- Yerel sunum HTTP 200 döndürüyor.
- Değişikliklerde boşluk hatası bulunmadı.

Kullanıcının mevcut tarayıcı kullanmama tercihi korundu. Bu kontroller gerçek ekran/projeksiyon okunurluğu doğrulaması değildir. Derlemedeki 500 kB üzeri JavaScript parçası uyarısı sürer. Haricî dağıtım yapılmadı.
