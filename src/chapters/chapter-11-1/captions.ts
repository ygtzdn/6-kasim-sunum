export const hardwareCaptions: Record<string, string[]> = {
  "hdd-anatomy": [
    "HDD, manyetik yüzeydeki veriye mekanik hareketle ulaşır.",
    "Plaka veriyi tutar; mil plakayı döndürür.",
    "Kol, okuma/yazma kafasını hedef ize taşır.",
    "Seek hedef ize, dönme beklemesi hedef sektöre ulaştırır.",
    "Normal okumada kafa yüzeye temas etmez.",
  ],
  "hdd-geometry": [
    "Tek bir disk yüzeyi.",
    "İz: dairesel kayıt yolu.",
    "Sektör: bir izin parçası.",
    "Silindir: yüzeylerde aynı yarıçaptaki izler.",
  ],
  "hdd-access-cost": [
    "4 KiB = 4096 B · 1 Gb/s = 125 MB/s.",
    "Seek: hedef ize ulaşmak için 5 ms.",
    "7200 RPM: ortalama dönme beklemesi 4,1667 ms.",
    "Konumlandırma: 5 + 4,1667 = 9,1667 ms.",
    "Aktarım: 4 KiB / 125 MB/s = 0,032768 ms.",
    "Servis: konumlandırma + aktarım + 0,1 ms denetleyici ≈ 9,30 ms.",
  ],
  "hdd-request-size": [
    "Küçük istekte mekanik bekleme baskındır.",
    "İstek büyürken mekanik bekleme aynı kalır.",
    "Aktarım hızı iki katına çıkınca yalnız aktarım süresi yarıya iner.",
    "Küçük I/O’nun toplam süresi aynı oranda azalmaz.",
  ],
  "hdd-performance-metrics": [
    "6 Gb/s: kaynaktaki tarihsel arayüz tavanı.",
    "1 Gb/s: kaynaktaki tarihsel etkin aktarım örneği.",
    "Gb/s aktarım hızını, ms tek isteğin süresini ölçer.",
    "Disk bandwidth’i = toplam byte / toplam geçen süre.",
  ],
  "nvm-device": [
    "Flash SSD, güç kesildiğinde verisini koruyan bir NVM aygıtıdır.",
    "NAND flash yongaları, verinin tutulduğu bellektir.",
    "Denetleyici işlemleri yönetir. Bu aygıt SATA bağlantısı kullanır.",
  ],
  "flash-page-block": [
    "Küçük birimler sayfa, onları kapsayan çerçeve silme bloğudur.",
    "NAND flash'ta okuma ve yazma sayfa düzeyindedir.",
    "Silme, bloğun bütün sayfalarını birlikte temizler. Yazılmış sayfanın üzerine doğrudan yazılmaz.",
  ],
  "flash-endurance": [
    "Flash bloklarının yazma ve silme dayanıklılığı sınırlıdır.",
    "Kaynak örneği: 1 TB aygıt · 5 DWPD.",
    "Tanımlı garanti koşullarında: 1 × 5 = 5 TB/gün.",
    "3 TB/gün bütçenin altında; 6 TB/gün üzerinde.",
  ],
  "logical-blocks": [
    "OS, tek boyutlu numaralı mantıksal blok dizisini görür.",
    "LBA 3 mantıksal adrestir.",
    "Temel model, mantıksal blokları sektörlere sıralı eşler.",
    "Fiziksel eşleme değişse de LBA isteği korunur.",
  ],
  "storage-data-path": [
    "OS, LBA okuma isteğini ve hedef DRAM alanını belirler.",
    "Komut host denetleyicisine iletilir.",
    "Host denetleyicisi aygıt denetleyicisine mesaj gönderir.",
    "Veri aygıtta hazırdır; henüz DRAM’e aktarılmamıştır.",
    "DMA, veriyi aygıttan DRAM’e taşır.",
  ],
};
