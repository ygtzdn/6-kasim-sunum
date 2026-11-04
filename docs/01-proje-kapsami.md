# 01 — Proje kapsamı ve deneyim tasarımı

> **Tarihsel belge:** Bu dosya önceki planı/uygulamayı kaydeder. Güncel kaynak, akış, örnek ve kabul kararları için [14 — Yeni sunum mimarisi](14-kitaba-dayali-yeni-sunum-mimarisi.md), mevcut mimari için [08 — Modüler tam sunum](08-moduler-tam-sunum.md) esas alınır. Aşağıdaki eski örnek toplamları, yapılacaklar ve kaldırılan özellikler güncel uygulama taahhüdü değildir.

> Güncel yönlendirme: Açık tema, az metin, Tailwind ve kaydırmasız sahneler için [07 — Güncel uygulama](07-guncel-uygulama.md) esas alınır. Aşağıdaki ilk tasarım kararlarından çelişenler geçersizdir; bölüm ve sunucu kapsamı korunur.

**Tarih:** 2 Kasım 2026 · **Aşama:** Uygulama öncesi · **Doküman sürümü:** 1.0

## 1. Amaç

Operating System Concepts kitabının 10. baskısındaki 11. bölümün 11.1–11.8 aralığını dört sunucunun kullanabileceği etkileşimli bir sunum websitesine dönüştürmek. Dinleyici, depolama donanımının özelliklerinin işletim sisteminin kararlarını neden değiştirdiğini örnekler üzerinden kavramalı.

Ana anlatı şu soruyu izler: **Bir veri isteği aygıta nasıl ulaşır, hangi maliyetlerle işlenir ve hata olduğunda nasıl korunur?**

Ürün hem sınıfta projeksiyona yansıtılarak kullanılacak bir sunum, hem de sonrasında aynı içeriğin incelenebildiği bir öğrenme aracı olacak. Sunum modu temel deneyimdir; okuma modu aynı sahne verisini ayrıntılı açıklamalarla gösterir.

## 2. Kullanıcının kesin gereksinimleri

| Kimlik | Gereksinim | Ürüne etkisi |
| --- | --- | --- |
| G-01 | Kaynak Operating System Concepts, tenth edition | Bölüm numaraları başka baskılardan aktarılmayacak |
| G-02 | Chapter 11: Mass-Storage Structure | 11.1–11.8 kapsamı korunacak |
| G-03 | Dört farklı kişi sunum yapacak | Sunucuya doğrudan geçiş ve bölüm sınırları bulunacak |
| G-04 | 1. kişi 11.1 | Kapsam başka sunucuya taşınmayacak |
| G-05 | 2. kişi 11.2 ve 11.3 | HDD ve NVM zamanlaması aynı anlatı bloğunda |
| G-06 | 3. kişi 11.4, 11.5 ve 11.6 | Hata, yönetim, swap aynı anlatı bloğunda |
| G-07 | 4. kişi 11.7 ve 11.8 | Bağlantı biçimleri ve RAID aynı anlatı bloğunda |
| G-08 | Etkileşimli website | Hesap, seçim ve durum değişimi öğreten demolar |
| G-09 | Yalnızca istemci tarafı | Bütün eğitim hesapları tarayıcıda; backend yok |
| G-10 | Önce ayrıntılı dokümantasyon | Mevcut teslim dokümanlar; uygulama sonraki aşama |

## 3. Planlama varsayımları

Bu kararlar kullanıcı tarafından belirtilmemiştir; uygulanabilir başlangıç planıdır.

| Konu | Varsayım | Değiştiğinde yapılacak iş |
| --- | --- | --- |
| Anlatım dili | Türkçe | Metinler tek içerik katmanından değiştirilir |
| Dinleyici | Temel işletim sistemi bilgisi olan üniversite öğrencileri | RAM, blok, süreç ön bilgisi için ek açıklamalar genişletilir |
| Süre | 45 dakika + 5 dakika soru-cevap | Sahne süreleri ve demo derinliği ayarlanır |
| Kullanım | Bir bilgisayardan ortak projeksiyon | Kişiler kendi bloklarına URL veya menüyle erişebilir |
| İsimler | Kişi 1–4 yer tutucuları | Sunucu verisinden değiştirilir |
| Tarih | Belirlenmedi | Klasör isminden kesin sunum tarihi çıkarılmaz |
| Cihaz | Masaüstü ana kullanım, mobil tekrar | Küçük ekranda sahne içi dikey akış kullanılır |
| Tasarım | Koyu zemin, açık metin, belirgin şemalar | Projeksiyon provasına göre açık tema da seçilebilir |
| Ağ | Sunum sırasında dış internete ihtiyaç olmaması | Tüm uygulama varlıkları yerelde paketlenir |

## 4. Kitapla eşleme

Resmî 10. baskı içindekilerinde doğrulanan ana başlıklar aşağıdadır. İngilizce başlıklar kitapla izlenebilirlik içindir. Türkçe başlıklar bu projenin çevirileridir. Sayfa yerine bölüm numarası temel alınır; Global Edition ve farklı dağıtımlarda sayfalama değişebilir. [Kaynak: resmî içindekiler](https://os-book.com/OS10/toc-dir/toc.pdf).

| Bölüm | Kitap başlığı | Sunum başlığı | Sunucu |
| --- | --- | --- | --- |
| 11.1 | Overview of Mass-Storage Structure | Kütlesel depolamaya genel bakış | 1 |
| 11.2 | HDD Scheduling | HDD isteklerinin zamanlanması | 2 |
| 11.3 | NVM Scheduling | Kalıcı bellek aygıtlarında zamanlama | 2 |
| 11.4 | Error Detection and Correction | Hata tespiti ve düzeltme | 3 |
| 11.5 | Storage Device Management | Depolama aygıtı yönetimi | 3 |
| 11.6 | Swap-Space Management | Takas alanı yönetimi | 3 |
| 11.7 | Storage Attachment | Depolamanın sisteme bağlanması | 4 |
| 11.8 | RAID Structure | RAID yapısı | 4 |

11.9, kitapta özet bölümüdür. Sunumun ortak kapanışı yeni konu eklemeden anlatılanları birleştirir. Buradaki sahne ve alt konu isimleri proje tasarımıdır; kitabın birebir alt başlık dizini olduğu iddia edilmez.

## 5. Süre ve sorumluluk dağılımı

| Blok | Sahne | Süre | Sorumlu | Ana demo |
| --- | --- | --- | --- | --- |
| Açılış ve yol haritası | S01–S02 | 2 dk | Kişi 1 | Başlangıç sorusu |
| 11.1 | S03–S09 | 9 dk | Kişi 1 | HDD erişim hesabı |
| 11.2 ve 11.3 | S10–S17 | 11 dk | Kişi 2 | HDD zamanlama; NVM yazma modeli |
| 11.4, 11.5 ve 11.6 | S18–S25 | 10 dk | Kişi 3 | Parite, aygıt hazırlığı, swap |
| 11.7 ve 11.8 | S26–S34 | 11 dk | Kişi 4 | Bağlantı karşılaştırması, RAID arızası |
| Ortak kapanış | S35–S36 | 2 dk | Kişi 4, ekip desteği | Bütünleştirme sorusu |
| Soru-cevap | Ana akış sonrasında | 5 dk | Dört kişi | İlgili sahneye dönüş |

Süreler demo kullanımı ve geçişler dahil hedeflerdir. Bölüm sayıları farklı olsa da anlatım yükü zamanla dengelenir. Açılışla birlikte Kişi 1 yaklaşık 11, Kişi 2 11, Kişi 3 10, kapanışla Kişi 4 13 dakika kullanır. Eşit süre zorunluluğu yoktur.

**Kısaltma planı:** 30 dakikalık bir süre verilirse 2 + 6 + 7 + 6 + 7 + 2 dakikalık akış kullanılır. Hiçbir 11.x bölümü kaldırılmaz; demoların serbest girdi kısmı ve ek paneller atlanır. Soru-cevap ayrıca planlanır.

## 6. Kullanıcı deneyimi

### 6.1 Ana giriş

Başlık, kitap/baskı bilgisi, dört sunucu bloğu ve “Sunumu başlat” eylemi bulunur. Sunucu kartlarında ad yerine başlangıçta “1. kişi” gibi yer tutucular görünür. Kitap kapağı veya dekoratif depolama stok görselleri zorunlu değildir; odak özgün teknik diyagramlardır.

### 6.2 Sunum modu

- Ortada tek aktif sahne; üstte bölüm, sunucu ve sahne sayacı.
- Altta önceki/sonraki, bölüm haritası, demo sıfırlama ve tam ekran kontrolleri.
- Her sahnede tek ana fikir, kısa metin ve konuyu açıklayan bir görsel/etkileşim.
- İleri gitmek için soruları doğru cevaplama zorunluluğu yoktur.
- Demolar otomatik başlamaz. “Adım”, “Oynat”, “Duraklat”, “Sıfırla” görünürdür.
- Her sunucu bloğunun ilk sahnesine bir tıklamayla geçilir.
- Tarayıcı geri/ileri düğmeleri sahne geçmişini takip eder.

### 6.3 Okuma modu

Aynı içerik bütün sahneler halinde dikey sıralanır. Açıklamalar açılabilir; kaynak bağlantıları ve sözlük görünürdür. Sunum modundaki demo ile aynı model kullanılır. Bu mod sunum sırasında arka planda çalışan ikinci uygulama değildir.

### 6.4 Konuşmacı notları

Notlar varsayılan olarak gizlidir ve yalnızca bilinçli eylemle açılır. İlk sürümde ayrı ekranla senkronize “presenter view” yoktur. Aynı yansıtılan tarayıcıda notları açmak onları izleyiciye de gösterir; arayüzde kısa açıklama yer alır. Prova için notların yazdırılabilir görünümü bulunur.

### 6.5 Cihaz başına etkileşim

İzleyici kendi cihazında bağlantıyı açarsa yerel olarak soruları çözer ve demoları dener. Ortak sonuç toplama, sınıf çapında oylama, giriş hesabı veya cihazlar arası eşzamanlı sunum yoktur. Sınıf katılımı sunucunun soruyu yöneltmesi ve sonucu kendi ekranında açmasıyla sağlanır.

## 7. Görsel sistem

**Yön:** Teknik bir laboratuvar anlatımı; geniş boşluk, büyük diyagramlar ve belirgin veri akışları. Her sahneyi aynı kart ızgarasına dönüştürmek yerine kavrama göre şema, zaman çizgisi, karşılaştırma ve hesap yüzeyi kullanılır.

| Öğe | Tasarım kararı |
| --- | --- |
| Zemin | Koyu lacivert; metin için kırık beyaz; açık tema alternatifi |
| Kişi 1 | Mavi vurgu + “1 / Donanım” etiketi |
| Kişi 2 | Turkuaz vurgu + “2 / Zamanlama” etiketi |
| Kişi 3 | Amber vurgu + “3 / Yönetim” etiketi |
| Kişi 4 | Mor vurgu + “4 / Bağlantı ve RAID” etiketi |
| Yazı | Sistem sans-serif; sayılar/bitler için sistem monospace |
| Boyut | 1280×720 referansında başlık 40–56, gövde 26–30, yardımcı bilgi en az 18 CSS px hedefi |
| Grafik | SVG; disk, kuyruk, sayfa ve parite için aynı çizgi/etiket dili |
| Hareket | Kısa geçiş; yalnızca olay veya durum açıklamak için |
| Vurgu | Arıza için ikon + metin + desen; yalnızca renge bağlı anlam yok |

Sunum alanı geniş ekranda 16:9 oranını hedefler; metin kesmek için sabit yükseklik zorlanmaz. Uzun içerik yeniden düzenlenir. Mobilde diyagram ile açıklama alt alta gelir.

## 8. Kapsama dahil işler

36 sahnenin özgün Türkçe içeriği, sekiz demo, bölüm menüsü, klavye kontrolü, URL ile sahne açma, tam ekran, yerel süre göstergesi, notlar, okuma modu, sözlük, kaynak paneli ve yazdırma stilleri ilk sürümün kapsamındadır. Ayrıntılı içerik ve demo sözleşmeleri diğer dokümanlardadır.

## 9. Kapsam dışı işler

Backend, hesap açma, veritabanı, analitik, gerçek donanım erişimi, dosya/disk biçimlendirme, gerçek benchmark, sunucu tarafı AI, uzaktan kumanda, canlı ortak düzenleme, otomatik konuşma metni üretimi ve PPTX dışa aktarma planlanmaz. Yazdırma görünümünden tarayıcının PDF kaydı kullanılabilir; bu, etkileşimli PDF üretimi anlamına gelmez.

Service worker tabanlı PWA kurulumu ilk sürümde gerekli değildir. Yerel statik dosya sunucusu internet olmadan çalışabilir. Uzaktaki bir URL'nin ilk kez internet olmadan açılabileceği sözü verilmez.

## 10. Başarı ölçütleri

1. Dört kişi kendi kapsamını değiştirmeden sunum yapabilir ve birbirine kesintisiz geçebilir.
2. Her 11.x bölümü için görünür en az bir açıklama ve bir öğrenme kontrolü vardır.
3. Demolar aynı girdide aynı sonucu üretir; hesap ve görsel birlikte ilerler.
4. İnternet kesildiğinde yerel statik sunumdaki bütün içerik çalışır.
5. Projeksiyonda kuyruk, bitler ve disk etiketleri okunur; klavye ile bütün temel eylemler yapılır.
6. İstek sıralama ve RAID gösterimleri fiziksel aygıt ölçümü olarak sunulmaz.
7. Hiçbir sunum eylemi kullanıcının gerçek diskinde işlem yapmaz.

Uygulama sonrası bu ölçütler [kabul planı](05-uygulama-ve-kabul.md) ile kontrol edilir; şu anda geçmiş oldukları iddia edilmez.
