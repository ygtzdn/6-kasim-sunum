import type { SceneNotes } from "../../presentation/types";

export const introNotes: Record<string, SceneNotes> = {
  "storage-devices": {
    explanation:
      "RAM, çalışan programların ve o anda kullanılan verilerin bulunduğu çalışma alanıdır. HDD ve SSD, kaydedilen verileri güç kapalıyken de tutar. Bu aygıtlar bilgisayarda farklı görevleri birlikte üstlenir.",
  },
  "hdd-anatomy": {
    explanation:
      "HDD, veriyi manyetik kaplamalı plakalar üzerinde saklar. Mil plakaları döndürür, kol ise okuma/yazma kafasını hedef izin üzerine taşır. Normal çalışmada kafa plaka yüzeyine temas etmez. Fotoğraftaki kafa ucu park konumundadır.",
  },
  "hdd-geometry": {
    explanation:
      "İz, disk yüzeyindeki dairesel kayıt yoludur. Sektör, bir izin veri taşıyan parçasıdır. Farklı yüzeylerde aynı yarıçapta bulunan izler bir silindir oluşturur.",
  },
  "hdd-access-cost": {
    explanation:
      "Bir HDD okumasında kafa hedef ize konumlanır ve ilgili sektörün kafa altına gelmesi beklenir. Ardından veri aktarılır. Örnekte 4 KiB veri, 7200 RPM, 5 ms seek, 125 MB/s aktarım ve 0,1 ms denetleyici katkısıyla servis süresi yaklaşık 9,30 ms olur. Kuyruk beklemesi bu hesaba dahil değildir.",
  },
  "hdd-request-size": {
    explanation:
      "Aynı HDD’de daha büyük veri isteği daha uzun aktarım süresi gerektirir. Aktarım hızı artarken kafa konumlandırma ve dönme beklemesi aynı kalabilir. Bu nedenle küçük bir isteğin toplam süresi, aktarım hızıyla aynı oranda azalmaz.",
  },
  "nvm-device": {
    explanation:
      "NVM, güç kesildiğinde verisini koruyan bellektir. Bu SSD’de veriyi NAND flash yongaları saklar, denetleyici ise istekleri ve flash işlemlerini yönetir. Fotoğraftaki SATA bağlantısı aygıtın veri ve güç bağlantısıdır. SSD’de mekanik seek ve dönme beklemesi bulunmaz.",
  },
  "flash-page-block": {
    explanation:
      "NAND flash’ta sayfalar daha büyük silme bloklarının içinde bulunur. Okuma ve yazma sayfa düzeyinde, silme ise blok düzeyinde yapılır. Yazılmış bir sayfanın üzerine doğrudan yeni veri yazılmaz. Blok silme, içindeki bütün sayfaları birlikte temizler.",
  },
  "flash-endurance": {
    explanation:
      "DWPD, garanti süresi ve koşulları içinde aygıt kapasitesinin günde kaç katı veri yazılabileceğini ifade eden dayanıklılık derecelendirmesidir. 1 TB kapasiteli ve 5 DWPD değerli bir aygıt için bu hacim 5 TB/gündür. 3 TB/gün bu değerin altında, 6 TB/gün üzerindedir. DWPD hücre başına silme sayısı veya kesin arıza günü değildir.",
  },
  "ram-memory": {
    explanation:
      "RAM, işlemcinin çalışan programlara ve kullanılan verilere eriştiği çalışma alanıdır. Bu modüldeki DRAM, verisini korumak için güç gerektirir. Güç kesildiğinde içerik korunmaz. Gücün geri gelmesi eski çalışma verilerini geri getirmez.",
  },
  "memory-comparison": {
    explanation:
      "RAM çalışma verisini, HDD ve SSD kaydedilmiş veriyi tutar. Güç kesildiğinde RAM içeriği korunmaz, HDD ve SSD’de önceden kaydedilmiş veriler korunur. HDD veriye mekanik hareketle erişir. Flash SSD ve RAM’de veri erişimi için hareketli parça bulunmaz.",
  },
  "hdd-performance-metrics": {
    explanation:
      "Arayüzün teorik hızı, etkin aktarım hızı ve tek isteğin gecikmesi farklı ölçülerdir. Gb/s aktarım hızını, ms süreyi ifade eder. Disk bandwidth’i toplam aktarılan verinin toplam geçen süreye oranıdır. Ekrandaki 6 Gb/s ve 1 Gb/s değerleri kaynağın tarihsel örnekleridir.",
  },
  "logical-blocks": {
    explanation:
      "İşletim sistemi diski tek boyutlu numaralı mantıksal blok dizisi olarak adresler. LBA 3, fiziksel yüzey koordinatını belirtmez. Aygıt mantıksal adresi fiziksel konuma eşler. Bu eşleme fiziksel ayrıntıları üst katmandan gizler.",
  },
  "storage-data-path": {
    explanation:
      "İşletim sistemi okuma komutunu ve verinin yerleştirileceği RAM alanını belirler. Komut bilgisayar tarafındaki host denetleyicisinden aygıt denetleyicisine iletilir. Aygıtta hazır olan veri DMA ile DRAM’e aktarılır. Komut iletimi ve veri aktarımı farklı işlerdir.",
  },
};
