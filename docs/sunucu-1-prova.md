# 1. kişi — Sayfa açıklamaları

5 Kasım 2026. Güncel sayfaların konu açıklamaları. Kitap ve model kaynakları sunumdaki Kaynaklar sekmesindedir.

## HDD, SSD ve RAM

11.1

RAM, çalışan programların ve o anda kullanılan verilerin bulunduğu çalışma alanıdır. HDD ve SSD, kaydedilen verileri güç kapalıyken de tutar. Bu aygıtlar bilgisayarda farklı görevleri birlikte üstlenir.

## HDD: hareketin kaynağı

11.1

HDD, veriyi manyetik kaplamalı plakalar üzerinde saklar. Mil plakaları döndürür, kol ise okuma/yazma kafasını hedef izin üzerine taşır. Normal çalışmada kafa plaka yüzeyine temas etmez. Fotoğraftaki kafa ucu park konumundadır.

## İz, sektör ve silindir

11.1

İz, disk yüzeyindeki dairesel kayıt yoludur. Sektör, bir izin veri taşıyan parçasıdır. Farklı yüzeylerde aynı yarıçapta bulunan izler bir silindir oluşturur.

## Bir HDD okumasının maliyeti

11.1

Bir HDD okumasında kafa hedef ize konumlanır ve ilgili sektörün kafa altına gelmesi beklenir. Ardından veri aktarılır. Örnekte 4 KiB veri, 7200 RPM, 5 ms seek, 125 MB/s aktarım ve 0,1 ms denetleyici katkısıyla servis süresi yaklaşık 9,30 ms olur. Kuyruk beklemesi bu hesaba dahil değildir.

## Küçük istek, büyük mekanik pay

11.1

Aynı HDD’de daha büyük veri isteği daha uzun aktarım süresi gerektirir. Aktarım hızı artarken kafa konumlandırma ve dönme beklemesi aynı kalabilir. Bu nedenle küçük bir isteğin toplam süresi, aktarım hızıyla aynı oranda azalmaz.

## NVM ve SSD’nin parçaları

11.1

NVM, güç kesildiğinde verisini koruyan bellektir. Bu SSD’de veriyi NAND flash yongaları saklar, denetleyici ise istekleri ve flash işlemlerini yönetir. Fotoğraftaki SATA bağlantısı aygıtın veri ve güç bağlantısıdır. SSD’de mekanik seek ve dönme beklemesi bulunmaz.

## NAND’da sayfa ve blok

11.1

NAND flash’ta sayfalar daha büyük silme bloklarının içinde bulunur. Okuma ve yazma sayfa düzeyinde, silme ise blok düzeyinde yapılır. Yazılmış bir sayfanın üzerine doğrudan yeni veri yazılmaz. Blok silme, içindeki bütün sayfaları birlikte temizler.

## Sınırlı silme ömrü ve DWPD

11.1

DWPD, garanti süresi ve koşulları içinde aygıt kapasitesinin günde kaç katı veri yazılabileceğini ifade eden dayanıklılık derecelendirmesidir. 1 TB kapasiteli ve 5 DWPD değerli bir aygıt için bu hacim 5 TB/gündür. 3 TB/gün bu değerin altında, 6 TB/gün üzerindedir. DWPD hücre başına silme sayısı veya kesin arıza günü değildir.

## RAM ve elektrik

11.1

RAM, işlemcinin çalışan programlara ve kullanılan verilere eriştiği çalışma alanıdır. Bu modüldeki DRAM, verisini korumak için güç gerektirir. Güç kesildiğinde içerik korunmaz. Gücün geri gelmesi eski çalışma verilerini geri getirmez.

## Çalışma alanı ve kalıcı depolama

11.1

RAM çalışma verisini, HDD ve SSD kaydedilmiş veriyi tutar. Güç kesildiğinde RAM içeriği korunmaz, HDD ve SSD’de önceden kaydedilmiş veriler korunur. HDD veriye mekanik hareketle erişir. Flash SSD ve RAM’de veri erişimi için hareketli parça bulunmaz.
