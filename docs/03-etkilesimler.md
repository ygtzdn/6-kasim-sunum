# 03 — Etkileşim ve simülasyon şartnamesi

## 1. Ortak davranış

Sekiz demo eğitim amaçlı deterministik modellerdir. Gerçek aygıta erişmez, performans ölçmez, ağ isteği göndermez ve kişisel veri kullanmaz. Her modelde görünür başlangıç durumu, açıklanan bir eylem, sayısal/metinsel sonuç ve sıfırlama bulunur.

**Standart kontroller:** Adım, uygunsa Oynat/Duraklat, Sıfırla, “Bu model neyi basitleştiriyor?” açıklaması. Parametre değişikliği eski sonuçları temizler ve animasyonu durdurur. Hareketi azalt tercihi açıkken bütün adımlar animasyonsuz kullanılabilir.

Bir sahneden çıkılınca zamanlayıcılar ve animasyonlar durur. Aynı oturumda sahneye dönülürse hesap durumu korunur; kullanıcı sıfırlayabilir. Sayfa yenilenince demo başlangıca döner. Sahne değiştirme hiçbir demo adımını örtülü olarak ilerletmez.

Boş/geçersiz giriş son geçerli modeli bozmaz; hata alanın yanında açıklanır. Hesap tamamlanmadan yeni bir eylem modeli yarış durumuna sokmaz. Durum ilerlemesi önce modelde hesaplanır, SVG ve metin aynı sonuçtan üretilir.

## 2. D01 — HDD anatomisi ve erişim hesabı

**Bölüm/sahne:** 11.1 / S04–S05 · **Süre bütçesi:** toplam 3 dakika.

**Öğretilecek ilişki:** Mekanik beklemeler ve aktarım farklı bileşenlerdir. Modelin etkileşimli anatomi görünümü ile hesap görünümü aynı demo kimliğini kullanır.

### Girdiler

| Parametre | Başlangıç | Aralık / kural |
| --- | --- | --- |
| Dönüş hızı | 7200 RPM | 3600–15000, pozitif tam sayı |
| Ortalama seek | 6 ms | 0–30 ms |
| Aktarım miktarı | 4 KiB | 1–16384 KiB, tam sayı |
| Aktarım hızı | 200 MB/s | 1–2000, pozitif sayı |

MB/s burada ondalık, KiB ikili birimdir: `1 MB = 1.000.000 byte`, `1 KiB = 1024 byte`. Anatomi görünümünde plaka/iz/sektör/kafa etiketleri tıklanabilir ve klavyeyle seçilebilir. Görselin kendi sektör sayısı kapasite hesabına çevrilmez.

### Model

```text
tam_tur_ms = 60000 / RPM
ortalama_donme_ms = tam_tur_ms / 2
aktarim_ms = (miktar_KiB × 1024) / (hiz_MBps × 1000000) × 1000
ornek_servis_ms = seek_ms + ortalama_donme_ms + aktarim_ms
```

İlk örnek: `6 + 4,1666667 + 0,02048 ≈ 10,18715 ms`. Gösterimde `10,19 ms` olabilir; iç hesapta erken yuvarlama yapılmaz. Renkli çubuk yanında sayısal bileşenler ayrı listelenir.

**Sınır:** Kuyruk, denetleyici, önbellek, gerçek konum dağılımı ve dosya sistemi maliyeti modele dahil değildir. Sonuç “toplam uygulama gecikmesi” diye adlandırılmaz. Ortalama dönme gecikmesi, hedef açının eşit olasılıklı olduğu varsayımına dayanır.

**Kabul örneği:** RPM 14400 yapılınca dönme bileşeni yarıya iner; seek ve aktarım sabit kalır. Miktar iki katına çıkınca yalnızca aktarım iki katına çıkar.

## 3. D02 — HDD zamanlama laboratuvarı

**Bölüm/sahne:** 11.2 / S10–S14 · **Ana algoritmalar:** FCFS, SCAN, C-SCAN.

### Girdiler ve başlangıç

| Parametre | Başlangıç | Doğrulama |
| --- | --- | --- |
| İlk silindir | 35 | 0–99 tam sayı |
| İstekler | 42, 12, 76, 24, 60 | 0–99 tam sayılar, en fazla 20 istek |
| Fiziksel sınırlar | 0 ve 99 | İlk sürümde sabit, ekranda görünür |
| Yön | Artan | Artan veya azalan |
| Servis politikası | FCFS | Üç algoritmadan biri |

Başlangıç örneği proje için yazılmıştır. Bütün istekler `t=0` anında bekler. Her isteğe ayrı kimlik atanır; aynı silindire gelen iki istek iki ayrı istek olarak kalır. Giriş alanı virgül veya boşlukla ayrılmış sayıları kabul eder; negatif, ondalık ve sayısal olmayan değerler reddedilir.

### Hesap sözleşmesi

`hareket = Σ |sonrakiKonum − öncekiKonum|`. Birim **silindir hareketi**dir; ms değildir. Kafa başlangıç konumu yolun ilk düğümüdür. Çıktı `servis sırası`, `hareket yolu`, `toplam hareket` ve `bekleyen istekler` olarak ayrılır.

- **FCFS:** Giriş sırasını korur. Başlangıç kafasıyla aynı silindirdeki bir istek de geliş sırasındaki yerinde servis edilir; öne alınmaz.
- **SCAN:** Önce mevcut konumdaki istekleri, ardından seçilen yöndeki istekleri sıralı servis eder. Karşı yönde bekleyen istek varsa o yöndeki fiziksel sınıra kadar gider, döner ve kalanları servis eder. Son istek tamamlanınca durur; boş yere yeni sınıra gitmez.
- **C-SCAN:** Aynı konum ve mevcut yöndeki istekleri servis eder. Diğer tarafta bekleyen istek varsa sınıra gider, diğer sınıra servis yapmadan döner ve aynı servis yönünde devam eder. Dönüş yolunun tamamı hareket toplamına katılır. Son istekte durur.
- Aynı silindirdeki eşit öncelikli istekler giriş kimliği sırasıyla servis edilir; ek kafa hareketi sıfırdır.
- Boş kuyrukta sonuç sıfırdır; animasyon çalışmaz.
- Uç nokta hem istek hem dönüş noktasıysa aynı konumda gereksiz hareket eklenmez. Servis olayı ile yön değişimi olayı ayrı olabilir.
- Tekrarlı “Adım” son durumu aşamaz. Sıfırla aynı girdileri koruyup adım sıfıra döner; “Varsayılan örnek” girdileri de geri yükler.

### Başlangıç örneğinin beklenen sonuçları

| Algoritma | Yol | Servis sırası | Toplam |
| --- | --- | --- | --- |
| FCFS | 35 → 42 → 12 → 76 → 24 → 60 | 42,12,76,24,60 | 189 |
| SCAN, artan | 35 → 42 → 60 → 76 → 99 → 24 → 12 | 42,60,76,24,12 | 151 |
| C-SCAN, artan | 35 → 42 → 60 → 76 → 99 → 0 → 12 → 24 | 42,60,76,12,24 | 187 |

C-SCAN'in dönüşü kesikli çizgi ve “servis yok” etiketi taşır. Her adımda hangi isteğin tamamlandığı ve ne kadar hareket eklendiği görünür. İstenirse üç algoritmanın sonuç tablosu aynı girdilerden birlikte üretilir.

**Sınır:** Çevrimiçi istek gelişleri, önbellek, gerçek seek fonksiyonu ve dönme zamanlaması yoktur. Bu örnekten starvation ölçümü veya ortalama duvar saati bekleme süresi üretilmez. Adalet tartışması kavramsaldır. LOOK/C-LOOK/SSTF ek açıklamaları ana hesap motoruyla karıştırılmaz.

**Anlatım adımı:** FCFS'yi adımla; aynı kuyruğu SCAN'e geçir; C-SCAN dönüşünün neden ücretsiz olmadığını sor; toplamlara bakıp “her iş yükünde en iyi” sonucunun neden çıkarılamayacağını açıkla.

## 4. D03 — NVM yazma ve geri kazanım modeli

**Bölüm/sahne:** 11.3 / S16 · **Amaç:** OS zamanlaması ile aygıt içindeki flash yönetimini ayırarak ek yazma işini görünür kılmak.

### Başlangıç durumu

Üç fiziksel silme bloğu ve her blokta dört sayfa bulunur. L0–L5 mantıksal sayfalardır. Bu boyutlar gerçek aygıt geometrisi değildir. Sayfalar `boş`, `geçerli`, `geçersiz` olarak etiketlenir.

```text
B0: L0:v0 | L1:v0 | L2:v0 | L3:v0
B1: L4:v0 | L5:v0 | boş   | boş
B2: boş   | boş   | boş   | boş   [GC için ayrılmış blok]
```

Başlangıç yüklemesi sayaçlara katılmaz. Üstte “Host istekleri”, altta “SSD denetleyicisi / flash” etiketi vardır. Demo bir GC politikası örneğidir; gerçek FTL veya bütün wear leveling algoritmalarının taklidi değildir.

### Deterministik senaryo

1. **L0'ı güncelle:** L0:v1, B1'in ilk boş sayfasına yazılır. B0'daki eski L0 geçersizleşir. Host yazması 1, fiziksel sayfa yazması 1.
2. **L1'i güncelle:** L1:v1, B1'in kalan boş sayfasına yazılır. Eski L1 geçersizleşir. Sayaçlar 2 ve 2.
3. **GC başlat:** B0'da iki geçersiz sayfa olduğu gösterilir. Geçerli L2:v0 ve L3:v0 B2'ye kopyalanır; iki fiziksel yazma eklenir. Eşleme yeni sayfalara güncellenmeden B0 silinmez.
4. **B0'ı sil:** Blok boş hale gelir, silme sayacı 1 artar. B0 yeni ayrılmış GC bloğu olur; B2'nin kalan boş sayfaları normal yazmaya açılır.
5. **L2'yi güncelle:** L2:v1, B2'nin ilk boş sayfasına yazılır, kopyalanmış L2:v0 geçersizleşir. Host yazması 3, fiziksel yazma 5.

```text
yazma_buyutmesi = fiziksel_sayfa_yazmalari / host_sayfa_yazmalari
```

Son sonuç `5/3 ≈ 1,67`dir. GC kopyaları fiziksel yazmaya katılır; silme işlemi ayrıca sayılır. Sıfır host yazmasında oran `—` gösterilir; sıfıra bölünmez. Adımlar 3 ve 4 geçerli veri korunmadan silmeye izin vermez.

TRIM/discard, wear leveling ve ayrılmış alan açıklama panelleriyle anlatılır. İlk sürümde bağımsız serbest TRIM düğmesi veya sınırsız yazma iş yükü yoktur; senaryonun dışında açıklamasız hata durumlarına girilmez. Son adımdan sonra yeniden başlatma sunulur.

**Sınır:** Zaman, marka performansı, eşzamanlı NAND kanalları, gerçek aşınma ömrü ve OS zamanlayıcı karşılaştırması hesaplanmaz. `1,67` bütün SSD'ler için bir sabit değildir.

## 5. D04 — Parite ve hata sınırı

**Bölüm/sahne:** 11.4 / S18–S19 · **Çekirdek:** Tek bit parite kontrolü.

### Başlangıç ve eylemler

- Veri: `1011001`, çift parite. Başlangıç parite biti: `0`.
- Bitler soldan sağa 1–7 olarak etiketlenir. Her veri biti düğme gibi seçilebilir.
- “Hata ekle” eylemi saklanan veri bitini değiştirir; başlangıç parite bitini değiştirmez.
- Sonuç, **saklanan pariteye göre kontrol** edilerek hesaplanır; her hata sonrası parite yeniden üretilmez.
- Değiştirilen bitler işaretlenir, toplam bir sayısı ve kontrol sonucu yazılır.

### Kabul örnekleri

| Eylem | Okunan veri | Kontrol | Açıklama |
| --- | --- | --- | --- |
| Hata yok | 1011001 | Geçti | Dört adet 1 ve parite 0 |
| 3. biti değiştir | 1001001 | Başarısız | Bir veri biti değişti; tek parite bunu tespit eder |
| Sıfırla, 1. ve 2. bitleri değiştir | 0111001 | Geçti | Veri farklı ama parite korunuyor; çift hata kaçtı |

**Metin kuralı:** Kontrol geçtiğinde “Veri kesin doğru” yazılmaz; “Bu parite kontrolü hata saptamadı” yazılır. Tek pariteyle hatalı bitin konumu tespit edildiği veya düzeltildiği iddia edilmez.

ECC/Hamming açıklaması statik ek panel olabilir. Çalışan Hamming simülatörü zorunlu değildir; sonradan eklenirse tek/çift hata sınırları ayrı modellenmelidir. ECC sözcüğü, sınırsız düzeltme gücü anlamına gelmez.

## 6. D05 — Aygıt hazırlama akışı

**Bölüm/sahne:** 11.5 / S20; S21–S22 açıklama katmanları.

Üstte “Mantıksal model — gerçek diskte işlem yapmaz” etiketi görünür. Girdi olarak gerçek disk listesi veya dosya seçici bulunmaz.

```text
Fiziksel hazırlık [fabrika/donanım bilgisi]
→ Bölüm tablosu ve bölüm oluşturma
→ Seçilen bölümde dosya sistemi oluşturma
→ Kullanıma açma / bağlama
```

İlk durum fiziksel hazırlığı tamamlanmış örnek aygıttır. Sunucu “Bölüm oluştur” ile %60/%40 iki örnek bölge görür; ardından bir bölümü seçip örnek dosya sistemi metaverisini oluşturur. Sonra dosya erişimi için kullanıma açar. Dosya sistemi oluşmadan “dosya kaydet” gösterimi etkin değildir. İşlemler ileri/geri adımlanabilir ve sıfırlanabilir.

**Katman açıklamaları:** Bölümleme her ortamın zorunlu ön koşulu değildir; bu senaryo yaygın bölüm tabanlı kullanımın örneğidir. Raw kullanım ve bölümsüz dosya sistemi ek açıklamada belirtilir. Firmware/bootloader ve bozuk blok yeniden eşleme ana akışa zorunlu bir “biçimlendirme adımı” gibi eklenmez; yan dallar olarak açılır.

**Çıktı:** Her eylemin neyi değiştirdiği ve neyi hazırladığı bir cümleyle görünür. İşlemler terminal komutu çalıştırmaz ve tarayıcı dosya sistemi izinleri istemez.

## 7. D06 — RAM ve swap slot'ları

**Bölüm/sahne:** 11.6 / S23–S24 · **Odak:** Alan tahsisi ve veri hareketi; sayfa değiştirme algoritması yarışı değil.

### Başlangıç

```text
RAM:  F0=A [anonim, kirli] | F1=B [dosya destekli, temiz] | F2=C [anonim, temiz]
Swap: S0=C [geçerli kopya] | S1=D [yalnızca swap'ta] | S2=boş | S3=boş
```

Her sayfanın kimliği, türü, RAM konumu, varsa swap slot'u ve dirty bayrağı modelde ayrı tutulur. Dosya destekli B, gerektiğinde özgün dosyadan tekrar okunabilir. C'nin RAM ve swap'ta aynı sürümü bulunabilir; bu iki ayrı sayfa değildir.

### Ana senaryo

1. A'yı dışarı çıkar: S2 ayrılır, A diske yazılır ve ancak işlem tamamlandıktan sonra F0 boşalır. Swap yazması +1.
2. D'ye eriş: Page fault gösterilir; S1'den okuma ile D, F0'a gelir. Swap okuması +1. Bu model swap kopyasını geçerli ve ayrılmış tutar.
3. A'ya eriş: RAM doludur. Model, temiz dosya sayfası B'yi aday sunar. B tahliye edilir; swap yazması eklenmez. A, S2'den F1'e okunur. Swap okuması toplam 2 olur.

Son durumda RAM `D, A, C`; swap'ta C, D ve A için geçerli kopyalar bulunur. Slot S3 boştur. “Bir sayfa hem RAM'de hem swap'ta görünebilir mi?” açıklaması açılabilir. Bu, bu modelin swap cache tercihidir; bütün OS'lerin tahsis politikasını temsil etmez.

### Kenar senaryosu

“Swap dolu” ön ayarı, boş slot olmayan ve yeni bir kirli anonim sayfanın çıkarılmak istendiği durumu açar. Eylem başarısız olur; frame serbest bırakılmaz ve veri kaybolmaz. Ekran “Bu modelde boş swap slot'u yok; tahliye tamamlanamadı” der. Gerçek sistemin OOM, sıkıştırma veya diğer kararlarını taklit etmez.

**Çıktı:** Yerleşim, slot doluluğu ve swap okuma/yazma sayıları. Gecikme tahmini üretilmez. B'nin temiz tahliyesi swap yazması gibi sayılmaz. Sıfırlama tüm eşleme ve sayaçları geri yükler.

## 8. D07 — Bağlantı topolojisi karşılaştırması

**Bölüm/sahne:** 11.7 / S26–S27.

Üç sekme aynı veri isteğinin farklı bağlantı yollarını gösterir. Kullanıcı sekme seçer ve “İsteği izle” eylemiyle adımları ilerletir. Her adımın metin eşdeğeri vardır.

| Seçim | Görsel yol | İstemciye sunulan soyutlama | Dosya sistemi sorumluluğu |
| --- | --- | --- | --- |
| DAS | Host → yerel I/O bağlantısı → aygıt | Tipik örnekte blok | Host üzerindeki OS |
| NAS | İstemci → ağ → dosya sunucusu → aygıt | Dosya/dizin işlemleri | Dosya sunucusu; istemci dosya protokolü kullanır |
| SAN | Host → depolama ağı → blok hacmi | Blok aygıtı/hacim | Tipik örnekte host; ortak erişim ayrıca koordinasyon gerektirir |

Renkli paketin animasyonu hız ölçümü değildir; üç yol aynı görsel adım temposunu kullanır. Rastgele gecikme, bant genişliği veya kazanan puanı üretilmez. Birden çok host çizildiğinde SAN'ın tek başına eşzamanlı dosya sistemi tutarlılığı sağlamadığı kısa notla belirtilir.

**Kontrol:** “Paylaşılan klasör” seçiminde NAS dosya yolu; “host'a sunulan blok hacim” seçiminde SAN blok yolu vurgulanır. Uygulama gerçek paylaşım veya bağlantı kurmaz.

## 9. D08 — RAID kapasitesi, yerleşim ve arıza

**Bölüm/sahne:** 11.8 / S29–S33 · **En yoğun demo:** Görseller sahneler arasında aynı model durumunu paylaşır.

### Girdiler

- Seviye: RAID 0, RAID 1, RAID 4, RAID 5, RAID 6, RAID 10.
- Disk sayısı: 2–8; seviyeye göre sınırlandırılır.
- Disk başına kapasite: 1–8 TB; bütün diskler eşit boyutludur.
- Arızalı diskler: İsimli disk düğmeleriyle seçilir, seçili arıza geri alınabilir.
- Başlangıç: RAID 5, dört disk, her biri 4 TB, arıza yok.

Seviye değişince disk sayısı uygun değilse geçerli sayıya güncellenir ve değişiklik kullanıcıya bildirilir. Eski arızalar ve rebuild durumu temizlenir. Örneğin iki diskli RAID 1 seçimi, dört diskli genel aynalama modeli iddiası taşımaz.

### Kapasite ve tolerans kuralları

`N`: disk sayısı, `S`: disk başına kapasite. Kapasiteler metaveri, ayrılmış alan ve dosya sistemi maliyetleri düşülmeden hesaplanır. TB ondalık birimdir.

| Seviye | Geçerli N | Kullanılabilir kapasite | Modelin kurtarılabilirlik kuralı |
| --- | --- | --- | --- |
| RAID 0 | N ≥ 2 | N×S | Herhangi bir disk kaybı veri kümesini eksik bırakır |
| RAID 1 | N = 2 | S | En az bir kopya sağlamsa erişim korunur |
| RAID 4 | N ≥ 3 | (N−1)×S | En fazla bir disk kaybı |
| RAID 5 | N ≥ 3 | (N−1)×S | En fazla bir disk kaybı |
| RAID 6 | N ≥ 4 | (N−2)×S | En fazla iki disk kaybı |
| RAID 10 | N ≥ 4 ve çift | (N/2)×S | Her ayna çiftinde en az bir disk sağlam |

### Yerleşim ve veri gösterimi

RAID 0 blok şeritleri dağıtır; RAID 1 kopyaları yan yana gösterir. RAID 4'te son disk pariteye ayrılır. RAID 5'te en az üç stripe satırı gösterilir ve parite diski satıra göre döner; hep aynı diske parite çizilmez. RAID 6'da P ve Q etiketleri ayrı disklerde dönerek gösterilir.

RAID 4/5 XOR örneği dört bitlik temsili veri blokları kullanır:

```text
P = 1100 XOR 1010 XOR 0110 = 0000
Kayıp ikinci veri = 0000 XOR 1100 XOR 0110 = 1010
```

Ekranda kayıp veri/parite konumu ayrılır; sağlam bloklardan birinin sayısal XOR çözümü açılır. RAID 6'da gerçek P/Q cebiri hesaplanmaz; kapasite ve iki disk hata toleransı kurallarla gösterilir. Arayüz “Q hesabı gösterilmiyor” bilgisini açıklama panelinde taşır.

RAID 10 çiftleri `(D0,D1), (D2,D3), ...` olarak görünür. D0+D2 kaybı dört diskli dizide kurtarılabilir; D0+D1 kaybı değildir. Arıza sayısını tek başına karar veren ortak bir fonksiyon RAID 10 için kullanılmaz.

### Durumlar

```text
Sağlıklı → Arızalı ama kurtarılabilir → Rebuild → Sağlıklı
                         ↓ ek arıza
                  Modelde kurtarılamaz
```

Rebuild yalnızca modelde kurtarılabilir durumda başlatılır; arızalı disk yerine boş bir yedek takıldığı gösterilir. Rebuild adımları mevcut bütün veriden üretilebilme kuralına uyar; kurtarılamayan durumda sihirli düzeltme yoktur. Animasyon sırasında yeni arıza ekleme ilk sürümde kapalıdır. Rebuild tamamlanınca değiştirilmiş diskler sağlam olur; veri yerleşimi öncekiyle tutarlı kalır.

Başlangıç örneğinde fiziksel kapasite 16 TB, kullanılabilir kapasite 12 TB'dir. Bir disk arızasında mantıksal kullanılabilir kapasite etiketi 8 TB'ye düşürülmez; kapasite düzeni aynı, çalışma durumu “degraded / koruma azaldı” olur. Kurtarılamaz durumda kapasite ile erişilebilirlik ayrı alanlarda gösterilir.

### Sınırlar ve ana mesaj

Denetleyici arızası, latent sektör hataları, URE olasılığı, güç kesintisi, write hole, ağ ve gerçek rebuild süresi hesaplanmaz; ilgili riskler kısa notlarda belirtilir. Performans yüzdeleri veya gerçek disk güvenilirliği sayıları uydurulmaz. Çalışan model tam disk arızası varsayımını kullanır. RAID 2/3 ve 0+1, açıklama paneli kapsamındadır.

**Kabul örnekleri:** RAID 5 / 4×4 TB → 12 TB; tek kayıp kurtarılabilir, iki kayıp kurtarılamaz. RAID 6 / 4×4 TB → 8 TB; iki kayıp kurtarılabilir. RAID 10 / 4×4 TB → 8 TB; çiftlerin dağılımına göre sonuç değişir.

## 10. Soru kartları

Q01–Q09, [içerik dokümanındaki](02-icerik-ve-sunum-akisi.md) soru ve gerekçeleri kullanır. Seçim/cevabı aç eylemi yereldir. Sonuçlar sınıf çapında toplanmaz; kullanıcıya puan tablosu veya giriş hesabı sunulmaz. “Cevabı gizle” ve “Temizle” eylemleri bulunur. Soru atlanınca sunum ilerleyebilir.

## 11. Hata ve erişilebilirlik davranışı

Her grafik metinsel tablo/özetle anlaşılabilir. Hareket durdurulabilir, odak görünür, bit/disk düğmelerinin erişilebilir adları bulunur. Yeniden çizim klavye odağını kaybetmez. Canlı bildirim yalnızca adım sonucu değiştiğinde kısa bir özet verir; animasyonun her karesi ekran okuyucuya gönderilmez.

Model hatası oluşursa demo durur ve kayıtlı örneğe sıfırlama eylemi sunar; bölüm metni ile sonraki sahne kullanılabilir kalır. Kullanıcıya sahte bir başarılı hesap gösterilmez.
