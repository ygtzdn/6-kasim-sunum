import type { SceneNotes } from "../../presentation/types";

export const schedulingNotes: Record<string, SceneNotes> = {
  "hdd-request-queue": {
    explanation:
      "HDD’de kafa hedef silindire hareket eder, ardından hedef sektörün kafanın altına gelmesini bekler. Kuyrukta birden çok hazır istek olduğunda servis sırasını seçmek toplam seek mesafesini azaltabilir. Küçük örnekte 53→183→37 yolu 276, 53→37→183 yolu 162 silindir hareketidir. Ardından altı algoritma aynı sekiz istekle karşılaştırılır. Geliş sırası 98, 183, 37, 122, 14, 124, 65 ve 67’dir. Kafa 53’te başlar ve fiziksel aralık 0–199’dur. SCAN, LOOK, C-SCAN ve C-LOOK azalan yönde başlar. Grafikler kafa hareketini silindir cinsinden ölçer.",
  },
  "fcfs-path": {
    explanation:
      "FCFS, istekleri geliş sırasıyla karşılar. Kafa 53’ten başlayarak 98, 183, 37, 122, 14, 124, 65 ve 67 konumlarına gider. Ardışık konum farklarının mutlak değerleri toplamı 640 silindir hareketidir. Grafik servis sırasını ve hareketi gösterir, gerçek bekleme süresini ölçmez.",
  },
  "sstf-path": {
    explanation:
      "SSTF (Shortest Seek Time First) her adımda mevcut kafa konumuna en yakın bekleyen isteği seçer. Örnekte kafa 53’ten 65’e gider, sonra 67, 37, 14, 98, 122, 124 ve 183’ü servis eder. Toplam hareket 236 silindirdir. Eşit mesafede önce gelen istek seçilir. Sürekli yeni yakın istekler gelirse uzaktaki bir istek çok uzun süre bekleyebilir.",
  },
  "scan-path": {
    explanation:
      "SCAN seçilen yönde fiziksel uca kadar ilerler, ardından yön değiştirir. Bu azalan yön örneğinde yol 53’ten 0’a, sonra 183’e uzanır ve toplam 236 silindir hareketi oluşur. 14’te dönen LOOK yolu 208 verir. Kaynak slaydındaki 208 değeri, burada kullanılan fiziksel uç kuralından farklıdır.",
  },
  "look-path": {
    explanation:
      "LOOK, ilerlediği yöndeki son bekleyen isteği tamamlayınca yön değiştirir. Kafa 53’ten 37’ye ve 14’e iner, ardından 65, 67, 98, 122, 124 ve 183’e çıkar. Toplam hareket 39 + 169 = 208 silindirdir. SCAN aynı örnekte fiziksel uç 0’a kadar gider ve 236 silindir yol alır.",
  },
  "cscan-path": {
    explanation:
      "C-SCAN istekleri tek yönde karşılar ve geri dönüşte servis vermez. Azalan örnekte 0’a kadar 53, 0’dan 199’a dönüşte 199 ve kalan servislerde 134 silindir hareketi oluşur. Toplam 386’dır. Dönüş istek tamamlamasa da fiziksel hareket toplamına dahildir.",
  },
  "clook-path": {
    explanation:
      "C-LOOK istekleri tek yönde karşılar. 53’ten başlayan kafa 37 ve 14’ü servis eder. Ardından 183’e kadar 169 silindir hareket eder ve bu dönüş sırasında hiçbir isteği tamamlamaz. 183’e varınca servis yeniden başlar ve 124, 122, 98, 67, 65 sırasıyla azalan yönde sürer. Toplam 39 + 169 + 118 = 326 silindirdir.",
  },
  "scheduling-tradeoffs": {
    explanation:
      "Aynı kuyrukta FCFS 640, SSTF 236, SCAN 236, LOOK 208, C-SCAN 386 ve C-LOOK 326 silindir hareketi üretir. LOOK bu örnekte en kısa yolu izler. SSTF ve SCAN farklı servis sıralarına rağmen aynı toplamı verir. Servissiz dönüş C-SCAN’de 199, C-LOOK’ta 169 silindirdir ve iki toplamda da yer alır. Gerçek bekleme süresi ve adalet ayrı ölçütlerdir. Tarihsel deadline örneği, uzun süredir bekleyen istekleri gözeten bir politikayı gösterir.",
  },
  "nvm-scheduling": {
    explanation:
      "SSD’de kafa hareketi ve dönme beklemesi yoktur. Buna rağmen OS komut hazırlama ve kuyruk işini yürütür. Kitap, RHEL 7’de NOOP’un bitişik LBA isteklerini birleştirmesini örnek verir. Animasyonda L10 ve L11 okumaları birleşir: dört host isteği üç komutta taşınır ve dört mantıksal blok korunur. Komutlar OS kuyruğundan NVMe arayüzüne, ardından SSD denetleyicisine ilerler. NVMe iletişim arayüzüdür. FTL mantıksal adresi fiziksel konumla eşler, GC alan geri kazanır, wear leveling aşınmayı dağıtır. GC’nin doğurduğu ek yazmalar, NVM’nin performans avantajını azaltabilir. NOOP örneği güncel sistemlerin varsayılanı olarak sunulmaz.",
  },
  "flash-addressing": {
    explanation:
      "İşletim sistemi veriyi mantıksal adreslerle ister. SSD denetleyicisinin FTL tablosu bu adresleri NAND üzerindeki güncel fiziksel konumlarla eşler. L0’ın yeni sürümü B1.P2’ye yazıldığında mantıksal adres L0 olarak kalır. Eski B0.P0 sayfası geçersizleşir.",
  },
  "flash-write-amplification": {
    explanation:
      "L0 ve L1 güncellemeleri boş sayfalara yazılır, eski kopyalar geçersizleşir. Garbage collection, B0’da kalan geçerli L2 ve L3’ü B2’ye taşır ve eşlemelerini günceller. Ardından B0 silinerek yeniden kullanılabilir alan kazanılır. Son L2 güncellemesiyle örnek üç host yazması, beş fiziksel yazma ve bir silmeyle tamamlanır. Eşit boyutlu yazmalar için yazma büyütmesi 5/3, yaklaşık 1,67’dir.",
  },
  "nvm-management-summary": {
    explanation:
      "Flash blokları sınırlı sayıda yazma ve silme döngüsüne dayanır. Wear leveling, yeni işlemleri bloklara dağıtarak belirli blokların erken aşınmasını azaltır. Örnekte başlangıç [8, 2, 2]’dir. Aynı üç yeni silme tek bloğa yığılırsa [11, 2, 2], dağıtılırsa [8, 4, 3] olur. Bu alternatifler aynı başlangıçtan hesaplanır, önceki aşınma azalmaz.",
  },
};
