# 15 — Sunum provası ve kaynak kullanım rehberi

**Hazırlık sürümü · 5 Kasım 2026.** Bu rehber [yeni sunum mimarisi](14-kitaba-dayali-yeni-sunum-mimarisi.md) ile birlikte kullanılacak. Sahne ve rota süreleri tamamlanınca kesin döküm aşağıya eklenecek. Bu dosya yapılmış bir sınıf/projeksiyon provasının tutanağı değildir.

## Dört kişinin ortak anlatı cümlesi

**Depolama aygıtının yapısı ve hata özellikleri, işletim sisteminin neyi sıralayacağını, nasıl alan yöneteceğini ve neyi koruyabileceğini belirler.**

Sunucu 1 fiziksel maliyeti tanımlar. Sunucu 2 bu maliyetle istek sırasını ve hareket yokken kalan işleri ilişkilendirir. Sunucu 3 verinin doğruluğu ile aygıt/RAM arka alanının yönetimini ayırır. Sunucu 4 erişim yolu, çoklu disk koruması ve daha üst bütünlük/alan katmanlarını birleştirir.

## Sunuma hazırlanma sırası

1. Önce resmî içindekilerde 11.1–11.8 sırasını gözden geçirin; kendi kapsamınızın başlangıç ve bitişini işaretleyin.
2. Kendi sahnelerinizin kaynak slaytlarını okuyun. Türkçe sahne isimlerinin kitabın birebir alt başlık çevirisi olmak zorunda olmadığını; gösterilen modelin hangi kavramı açıkladığını ayırın.
3. Her sahnenin ilk aşamasında soruyu sorun. Cevabı açmadan dinleyiciye kısa bir tahmin süresi bırakın.
4. Enter ile gerçek nesnenin ne değiştiğini söyleyin. “Sonraki slayt” yerine “kafa 0'a geldi”, “RAM kopyası henüz duruyor” veya “aynada sağlam kopya kaldı” gibi durum cümleleri kullanın.
5. Bir kez Backspace ile geri dönün. Hem anlatımın hem modelin önceki duruma geldiğini kontrol edin; dinleyicinin sorusuna geri dönmek için bu kontrolü kullanın.
6. Son aşamada bir cümle çıkarım söyleyin. Modelin sınırını gerekiyorsa tek cümleyle belirtin; notların tamamını ekrandan okumayın.
7. Sonraki sunucuya geçerken yeni soruyu yöneltin; gelen sunucu önceki sonucun hangi bölümünü kullanacağını açıklasın.

## Ortak klavye kartı

| İhtiyaç | Eylem |
| --- | --- |
| Aynı sahnede ileri | Enter |
| Aynı sahnede geri | Backspace |
| Sahne değiştir | Sol/sağ ok |
| Başlangıç / kapanış | Home / End |
| Doğrudan bir aşama | Sol alttaki aşama listesi |
| Menü / notlar | M / N |
| Hareketi duraklat | Space |
| Tam ekran | F; desteklenmezse normal pencere kullanılır |

Odaktaki düğmede Enter o düğmeyi çalıştırır. Giriş/seçim alanında tuşlar yerel işlevlerini korur. Sahne içi aşama düğmesi kullanıldığında odak başlığa döner ve Enter ile devam edilir. Yerel seçim alanındaysanız sunum kısayollarına dönmek için başlığa veya boş alana odaklanın. Menü açıkken ders hareketi durur ve sunum kısayolları kapalıdır.

## Kavram yanılgıları ve kısa düzeltmeler

| Yanlış genelleme | Sahnedeki doğru karşılık |
| --- | --- |
| Elektronik depolama uçucudur | RAM uçucudur; flash tabanlı SSD kalıcıdır. Hareket ile kalıcılık ayrı özelliklerdir. |
| HDD servis süresi yalnız seek'tir | Seek, dönme ve aktarım ayrı bileşenlerdir; tam sistem gecikmesinde kuyruk/denetleyici de bulunur. |
| NVM ile NVMe aynı şeydir | NVM ortam ailesi; NVMe erişim/komut protokolüdür. |
| Flash sayfası yerinde güncellenir | Yeni boş sayfaya yazılır; alanı yeniden kullanmak daha büyük silme bloğunu ilgilendirir. |
| En kısa kafa yolu her hedefte en iyi politikadır | Toplam hareket, bekleme, adalet ve gecikme farklı ölçütlerdir. |
| C-SCAN dönüşü servis vermediği için ücretsizdir | Servis yapılmaz ama kafa hareket eder; mesafe hesaba katılır. |
| SCAN ile LOOK aynı davranıştır | Bu sunumda SCAN fiziksel uca gider; LOOK son bekleyen istekte dönebilir. |
| Hata kontrolü geçtiyse veri kesin doğrudur | Her kodun saptayabildiği hata sınıfları sınırlıdır; tek parite çift hatayı kaçırabilir. |
| Hata tespiti düzeltme sağlar | Düzeltme ayrıca yeterli kod/sağlam bilgi ister; ECC'nin sınırı kod tasarımına bağlıdır. |
| Bölümlemek dosya sistemi oluşturur | Fiziksel biçim, bölümleme, dosya sistemi ve bağlama ayrı katmanlardır. |
| Swap RAM hızında ek bellektir | Swap depolamadadır; veri taşıma gerektirir ve RAM'den daha yavaştır. |
| Yazma başladıysa RAM frame'i hemen boştur | Bu örnekte güncel içerik korunana kadar RAM kopyası tutulur; aktarımın başlaması ve tamamlanması ayrı aşamalardır. |
| Ağ varsa dosya paylaşımı vardır | Ağ üzerinde dosya, blok veya API erişimi olabilir; arayüzü ve dosya sistemi sorumluluğunu sorun. |
| SAN ile NAS yalnız hız farkıdır | Bu örneklerde host'a sunulan blok hacmi ile sunucunun sunduğu dosya hizmeti farklıdır. |
| Birden çok disk otomatik yedeklidir | RAID 0 dağıtır ama yedeklilik sağlamaz. |
| RAID her bozulmayı fark eder | Disk arızası koruması ile checksum/ECC bütünlük kontrolü farklı katmanlardır. |
| Aynı sayıda RAID 10 arızası aynı sonucu verir | Hangi ayna çiftlerinin kaybolduğu sonucu değiştirir. |
| Hot spare takılınca koruma anında geri gelir | Verinin yedeğe yeniden kurulması gerekir; bu sırada ek iş ve risk vardır. |
| RAID bir yedekleme stratejisidir | Yanlış silme veya dizinin tümünün kaybına karşı bağımsız geri dönüş kopyası gerekir. |
| Ekranda geri gitmek gerçek aygıtta işlemi geri alır | Önceki eğitim durumu yeniden çizilir; fiziksel diskte geri alma garantisi verilmez. |

## Soru-cevap yöntemi

- Önce sorunun hangi katmana ait olduğunu belirleyin: ortam, kuyruk, doğruluk, alan, bağlantı veya koruma.
- Menüden ilgili anlamlı sahneye gidin; aşama listesinden sorunun bağlı olduğu noktayı seçin.
- Öğrenci farklı bir iş yükü soruyorsa, sabit ders örneğinin verdiği sonucun sınırını söyleyin. Gerçek cihaz performansı için sayı uydurmayın.
- Kaynak çelişkisinde nottaki kapsamı gösterin. SCAN hesabı açık fiziksel yol üzerinden yapılır; erişilemeyen kitap metni hakkında kesin hata iddiası kurulmaz.
- Gerekçesini doğrulayamadığınız bir ürün/OS ayrıntısını kitabın söylediği bir gerçek gibi sunmayın.

## Prova oturumları

### 1. Kavram provası

Her kişi kendi sahnelerini hareket kapalıyken anlatır. Amaç görsel tempo değil, tek cümle çıkarımı ve doğru kavram ayrımını sınamaktır. Her bölümün sonunda diğer sunucu bir yanlış genellemeyi sorar.

### 2. Klavye ve geri dönüş provası

Her kişi en az bir sayısal, bir durum ve bir soru sahnesinde son aşamaya gider; Backspace ile önceki kritik aşamaya döner. Özellikle flash eşlemesi, bekleyen swap yazması ve kısmi RAID rebuild'i incelenir. İlk/son aşamada fazladan Enter/Backspace sahne değiştirmemeli.

### 3. Süre provası

Seçilen rotayı baştan sona gerçek saatle ölçün. Önce varsayılan kitap örneklerini kullanın; uzayan tartışmayı ayrı soru-cevap bölümüne ayırın. Belgelerdeki saniyeler hedef olduğundan gerçek süreyi her sunucu için ayrıca not edin.

| Sunucu | Hedef | Gerçek süre | Kısaltılacak açıklama | Bir sonraki kişiye son soru |
| --- | --- | --- | --- | --- |
| 1 | Rota verisinden | Prova sırasında | Prova sırasında | Bu maliyet istek sırasını neden önemli yapar? |
| 2 | Rota verisinden | Prova sırasında | Prova sırasında | İşlem tamamlandıysa verinin doğru olduğunu nasıl anlarız? |
| 3 | Rota verisinden | Prova sırasında | Prova sırasında | Yönettiğimiz depolamaya sistem nasıl erişir? |
| 4 | Rota verisinden | Prova sırasında | Prova sırasında | İş yükü, gecikme ve hata modeli birlikte ne gerektiriyor? |

### 4. Sunum bilgisayarı kontrolü

Yerel sunucu önceden açılır; font ve fotoğraflar yereldir. Bu geliştirmede tarayıcı/projeksiyon denetimi yapılmadığı için sınıftaki okunabilirlik, ekran taşması, odak sırası ve tam ekran davranışı gerçek ortamda ayrıca prova edilir. Bu maddeler tamamlandı olarak işaretlenmemiştir.

## Teknik kurtarma

```sh
cd /home/yigit/Projects/6-kasim-sunum
pnpm dev
```

[http://localhost:5173/](http://localhost:5173/) açılır. 5173 doluysa mevcut geliştirme sunucusunu kullanın; iki sunucuyu aynı portta başlatmayın. Menüden ilgili sahneyi ve aşamayı seçmek, sayfayı rastgele yenilemekten daha az anlatım kaybı yaratır. Yenileme aktif sahneyi URL'den açar fakat aşamayı başa alır.

## Kesinleşen rota ve sunucu hedefleri

| Blok | Ana rota | Ayrıntılı rota | Hazırlık dosyası |
| --- | --- | --- | --- |
| Açılış ve harita | 2:00 | 3:00 | Bu rehber ve sahne notları |
| 1. kişi / 11.1 | 9:30 | 19:30 | [Sunucu 1 provası](sunucu-1-prova.md) |
| 2. kişi / 11.2–11.3 | 10:50 | 16:45 | [Sunucu 2 provası](sunucu-2-prova.md) |
| 3. kişi / 11.4–11.6 | 9:00 | 16:00 | [Sunucu 3 provası](sunucu-3-prova.md) |
| 4. kişi / 11.7–11.8 | 11:00 | 18:55 | [Sunucu 4 provası](sunucu-4-prova.md) |
| Ortak kapanış ve Exercises | 6:00 | 10:00 | Sunucu 4 provası |
| **Toplam hedef** | **48:20** | **84:10** | Soru araları bu hedeflerin içinde |

Ana rota 50 sahne/256 aşama; ayrıntılı rota 56 sahne/280 aşamadır. Menü yaklaşık 49/85 dakika olarak gösterir. Kapanışın 50–55. sahneleri seçilen PDF alıştırmaları, 56. sahne son değerlendirmedir. **90 dakikalık tartışmalı prova** için yaklaşık 6 dakika ek zaman ayrılabilir: ikinci kez model yürütme, tahmin gerekçelerini tartışma ve soru-cevap. Bu ek zaman hedefi algoritma veya model adımlarını değiştirmez.

Ayrıntılı rotaya eklenen altı sahne: tarihsel HDD örneği, performans ölçüleri, flash dayanıklılığı/DWPD, raw erişim, XOR çözüm adımları ve çok boyutlu parite. Ana rotada bütün 11.1–11.8 başlıkları kalır.
