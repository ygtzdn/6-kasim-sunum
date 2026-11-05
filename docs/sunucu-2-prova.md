# 2. kişi — Sayfa açıklamaları

5 Kasım 2026. Güncel sayfaların konu açıklamaları. Kitap ve model kaynakları sunumdaki Kaynaklar sekmesindedir.

## HDD’de neden zamanlama gerekir?

11.2

HDD’de kafa hedef silindire hareket eder, ardından hedef sektörün kafanın altına gelmesini bekler. Kuyrukta birden çok hazır istek olduğunda servis sırasını seçmek toplam seek mesafesini azaltabilir. Küçük örnekte 53→183→37 yolu 276, 53→37→183 yolu 162 silindir hareketidir. Sonra kitabın sekiz isteği karşılaştırılır: 98, 183, 37, 122, 14, 124, 65, 67. Kafa 53, aralık 0–199, SCAN ve C-SCAN başlangıç yönü azalandır. Grafiklerin birimi silindir hareketidir, gerçek gecikme süresi değildir.

## FCFS: geliş sırasını koru

11.2

FCFS, istekleri geliş sırasıyla karşılar. Kafa 53’ten başlayarak 98, 183, 37, 122, 14, 124, 65 ve 67 konumlarına gider. Ardışık konum farklarının mutlak değerleri toplamı 640 silindir hareketidir. Grafik servis sırasını ve hareketi gösterir, gerçek bekleme süresini ölçmez.

## SCAN: fiziksel uca git, dön

11.2

SCAN seçilen yönde fiziksel uca kadar ilerler, ardından yön değiştirir. Bu azalan yön örneğinde yol 53’ten 0’a, sonra 183’e uzanır ve toplam 236 silindir hareketi oluşur. 14’te dönen LOOK yolu 208 verir. Kaynak slaydındaki 208 değeri, burada kullanılan fiziksel uç kuralından farklıdır.

## C-SCAN: dönüşte servis yok

11.2

C-SCAN istekleri tek yönde karşılar ve geri dönüşte servis vermez. Azalan örnekte 0’a kadar 53, 0’dan 199’a dönüşte 199 ve kalan servislerde 134 silindir hareketi oluşur. Toplam 386’dır. Dönüş istek tamamlamasa da fiziksel hareket toplamına dahildir.

## Kısa yol tek ölçüt değil

11.2

Aynı kuyrukta FCFS 640, SCAN 236, C-SCAN 386 silindir hareketi üretir. Servis sırası ve toplam kafa yolu farklı ölçülerdir. Daha kısa yol tek başına adalet veya uygulama gecikmesi sonucu vermez. Son politika örneği uzun bekleyen istekleri gözeten tarihsel deadline yaklaşımını açıklar.

## SSD’de neden hâlâ optimizasyon var?

11.3

SSD’de kafa hareketi ve dönme beklemesi yoktur. Buna rağmen OS komut hazırlama ve kuyruk işini yürütür. Kitap, RHEL 7’de NOOP’un bitişik LBA isteklerini birleştirmesini örnek verir. Animasyonda L10 ve L11 okumaları birleşir: dört host isteği üç komutta taşınır ve dört mantıksal blok korunur. Komutlar OS kuyruğundan NVMe arayüzüne, ardından SSD denetleyicisine ilerler. NVMe iletişim arayüzüdür. FTL mantıksal adresi fiziksel konumla eşler, GC alan geri kazanır, wear leveling aşınmayı dağıtır. GC’nin doğurduğu ek yazmalar, NVM’nin performans avantajını azaltabilir. NOOP örneği güncel sistemlerin varsayılanı olarak sunulmaz.

## Mantıksal ve fiziksel adres

11.3

İşletim sistemi veriyi mantıksal adreslerle ister. SSD denetleyicisinin FTL tablosu bu adresleri NAND üzerindeki güncel fiziksel konumlarla eşler. L0’ın yeni sürümü B1.P2’ye yazıldığında mantıksal adres L0 olarak kalır. Eski B0.P0 sayfası geçersizleşir.

## Host yazması neden fiziksel yazma değildir?

11.3

L0 ve L1 güncellemeleri boş sayfalara yazılır, eski kopyalar geçersizleşir. Garbage collection, B0’da kalan geçerli L2 ve L3’ü B2’ye taşır ve eşlemelerini günceller. Ardından B0 silinerek yeniden kullanılabilir alan kazanılır. Son L2 güncellemesiyle örnek üç host yazması, beş fiziksel yazma ve bir silmeyle tamamlanır. Eşit boyutlu yazmalar için yazma büyütmesi 5/3, yaklaşık 1,67’dir.

## Wear leveling

11.3

Flash blokları sınırlı sayıda yazma ve silme döngüsüne dayanır. Wear leveling, yeni işlemleri bloklara dağıtarak belirli blokların erken aşınmasını azaltır. Örnekte başlangıç [8, 2, 2]’dir. Aynı üç yeni silme tek bloğa yığılırsa [11, 2, 2], dağıtılırsa [8, 4, 3] olur. Bu alternatifler aynı başlangıçtan hesaplanır, önceki aşınma azalmaz.
