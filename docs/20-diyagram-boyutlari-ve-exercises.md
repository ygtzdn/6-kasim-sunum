# 20 — Diyagram boyutları ve kapanış alıştırmaları

**5 Kasım 2026.** Kullanıcının belirttiği 11, 29, 36, 37 ve 49. sahneler düzeltildi. Numaralar bu düzenleme öncesindeki tam sunum dizisine aittir; bu beş sahne yerlerini korur.

| Sahne | Düzenleme |
| --- | --- |
| 11 · Flash dayanıklılığı | DWPD hesabı ve günlük yazma grafiği iki geniş alana ayrıldı. Sayılar ve yazılar büyüdü, grafik yüksekliği ekran yüksekliğine bağlandı. |
| 29 · Bozuk sektör eşleme | Adres dizileri kısa şeritler oldu; LBA 5, bozuk P45 ve yedek P90 arasındaki diyagram kalan alanı kullanıyor. |
| 36 · Depolama dizisi | Host/port, denetleyici ve disk grubu kompakt iki sıralı yerleşime geçti. Porttan denetleyiciye bağlantı aşağı yönlüdür. |
| 37 · SAN | Hostlar, fabric, diziler ve LUN'lar iki sıra üzerinden hizalanır. Son aşamada iletişim ağı ayrı düğümdür; LUN bilgisi dizi kartlarında korunur. |
| 49 · I/O yolculuğu | Altı küçük kartlık tek sıra yerine üçer kartlık iki sıra kullanılır. Akış üst sırada sağa, alt sırada sola gider. |

React Flow yeniden sığdırması artık yeni props henüz kütüphane deposuna ulaşmadan çalışmaz. Düğüm geometrisi depoya işlendiğinde veya kapsayıcı ölçüsü değiştiğinde çalışır. Geniş diyagramlar mevcut sahne yüksekliğini kullanır. Yerleşim verisi düğüm konumlarını tanımlar; bağlantılar, oklar ve viewport React Flow tarafından çizilir.

## PDF'den seçilen sorular

Kaynak: kullanıcının sağladığı [Exercises PDF'i](../public/references/ch11-exercises.pdf). Bölüm içindeki kavram soruları aynı yerde kalır. Kapanışa yalnız PDF'deki aşağıdaki seçim eklendi.

| Yeni sahne | Alıştırma | Görsel çözüm |
| --- | --- | --- |
| 50 | 11.13 | NVM'de mekanik gecikmenin olmaması ve FCFS |
| 51 | 11.14 | 5000 silindirlik kuyruk ve üç hareket toplamı |
| 52 | 11.16(a) | Bir tur ve ortalama yarım tur hesabı |
| 53 | 11.17 | HDD/NVM maliyet ve iş yükü karşılaştırması |
| 54 | 11.21(a) | RAID 5 read-modify-write için iki okuma, iki yazma |
| 55 | 11.25(a,c) | Disk-saat/arızadan çiftlik aralığı; garanti ayrımı |

Her alıştırma iki manuel aşamadır: soru ve çözüm. Enter çözümü açar, Backspace soruya döner. Sorunun üstünde PDF'nin ilgili sayfasına bağlantı vardır. Türkçe sorular uyarlanmıştır; çözümler sunum için hazırlanmıştır, resmî cevap anahtarı iddiası yoktur.

11.14'te önceki 1805 konumundan 2150'ye gelindiği için yön artandır. FCFS 13011, SCAN 7492, C-SCAN 9917 silindir hareketidir. Fiziksel uç 4999'dur ve C-SCAN dönüşü sayılır. Aynı zamanlama modeli farklı disk üst sınırını destekler; bölüm içindeki 0–199 örneği değişmez.

11.21(a), önbelleksiz read-modify-write yoluna açıkça bağlıdır: dört blok I/O, iki benzersiz blok konumu. 11.25(a), bağımsız ve sabit arıza hızını varsayar; 750 saat yaklaşık 31,25 gündür. MTBF, tek bir diskin ömrü veya garanti süresi değildir.

## Güncel dizi

Toplam 56 sahne ve 280 aşama. Ana rota 50 sahne / 256 aşama / 48:20; ayrıntılı rota 56 sahne / 280 aşama / 84:10 hedefidir. Son tasarım değerlendirmesi 56. sahnedir. Eski anlamlı kimlikler ve `s01`–`s36` bağlantıları korunur. Sunum sözleşmesi, kaynaklar ve yazdırılabilir notlar bu diziye göre güncellenir.

Kontrol kapsamı değişen beş sahne, altı yeni alıştırma, zamanlama hesabı ve üretim derlemesidir. Tarayıcı otomasyonu veya bütün testlerin tekrar tekrar çalıştırılması eklenmez.
