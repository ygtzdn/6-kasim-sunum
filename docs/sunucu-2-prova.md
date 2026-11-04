# Sunucu 2 — HDD ve NVM zamanlama

5 Kasım 2026. OSC10 V3. Kaynak: **Operating System Concepts, Tenth Edition, Bölüm 11.2–11.3** ve yazarların resmî Chapter11 slaytları. Bu metin sahnedeki görünümü sesli açıklamak içindir; paragraf slayta taşınmaz.

**Süre kartı:** çekirdek **10:50**; tam **16:45**. Açılış/kapanış ortak sunum bütçesindedir. Enter aşama ileri, Backspace aşama geri; son aşamada sahne değişmez. Sahne oklarıyla sonraki sayfaya geçilir. Tuşa basılı tutarak aşama atlanmaz.

## İlk prova — çekirdek rota

Başlangıç: `hdd-request-queue`. Menüde çekirdek rotayı seç. Ek sahneler geçiş sırasına dahil değildir. Aşağıdaki her çekirdek kartın süre bütçesine uy. Her sahnede tek ana soru sor; 3–5 saniye tahmin bekle, gerekçeyi göster. Uzun sayısal dizileri tek tek okumak yerine ilk katkıyı ve karar değiştiren hareketi vurgula.

## İkinci prova — geri kurma ve sınırlar

Her algoritmada sonuca git, iki hareket geri gel: kafa, toplam ve tamamlanan istekler birlikte dönmeli. C-SCAN dönüşünden önce toplam53 ve2/8; sonra252 ve2/8. GC silme öncesinde rezervB2,silme0; sonrasında rezervB0,silme1.

## Üçüncü prova — tam rota

Servis sırası ve tarihsel deadline panelinde daha uzun dur; host kuyruğu ile denetleyici görevlerini ayrı anlat. FTL/GC örneğini yalnız bir kez çalıştır; kişi1in sayfa/blok tanımını uzun uzun yeniden anlatma.

## Sahne kartları

### 1. Aynı kuyruk, aynı başlangıç — `hdd-request-queue`

**Rota / süre:** çekirdek ve tam; çekirdek 1:00 / tam 1:30. **Kaynak:** 11.2; resmî slayt 17, 18, 19.

**Giriş cümlesi:** “İlk sunucu bize hareket maliyetini gösterdi; şimdi hareketi istek sırasıyla değiştireceğiz.”

**Aşama eylemleri ve söylem:**

1. Sahne açıldığında **İsteğin kaynağı ve kuyruk**: Aygıt boşsa tek istek hemen işlenebilir; meşgulse birden çok bekleyen istek sıralama seçimi doğurur.
2. Enter ile **Resmî geliş sırası**: Resmî geliş sırası98,183,37,122,14,124,65,67. Bütün istekler t=0’da hazırdır.
3. Enter ile **Kafa53 ve 0–199 sınırları**: Kafa 53 ve fiziksel0–199 sınırları bütün karşılaştırmalarda aynıdır.
4. Enter ile **Azalan yön ve hareket ölçüsü**: Ortak başlangıç yönü azalan; FCFS yönü kullanmaz. Σ|sonraki−önceki| silindir hareketidir, ms değildir.

**Dinleyici sorusu:** Bekleyen kuyruk yoksa yeniden sıralanacak ne var?
**Beklenen cevap / yanlış cevabı düzeltme:** Tek hazır istekte birden çok talep arasından servis sırası seçimi yoktur.

**Kaçınılacak çıkarım:** Bütün istekler t=0’da hazır. Karşılaştırma sırasında yön/kafa/kuyruk değiştirme. Silindir toplamı ms değildir.

**Geçiş / devir:** “Önce geliş sırasını koruyarak yolu izleyelim.”

**Tam anlatımda genişlet:** Tahmin için daha uzun bekle; yanlış cevabı modelde önceki aşamaya dönerek açıkla. Yeni ürün bilgisi veya yeni kaynak ekleme.

### 2. FCFS: geliş sırasını koru — `fcfs-path`

**Rota / süre:** çekirdek ve tam; çekirdek 1:20 / tam 2:00. **Kaynak:** 11.2; resmî slayt 19, 20.

**Giriş cümlesi:** “En basit sözleşme: hangi istek önce geldiyse onu önce servis et.”

**Aşama eylemleri ve söylem:**

1. Sahne açıldığında **Başlangıç53**: Kafa 53’te, toplam 0 ve tamamlanan0/8. Önce bir sonraki hedefi ve mesafeyi tahmin edin.
2. Enter ile **İstek1:98**: Kafa98’e gelir; istek1 tamamlanır. Bu hareket+45, birikimli toplam45 silindirdir.
3. Enter ile **İstek2:183**: Kafa183’e gelir; istek2 tamamlanır. Bu hareket+85, birikimli toplam130 silindirdir.
4. Enter ile **İstek3:37**: Kafa37’e gelir; istek3 tamamlanır. Bu hareket+146, birikimli toplam276 silindirdir.
5. Enter ile **İstek4:122**: Kafa122’e gelir; istek4 tamamlanır. Bu hareket+85, birikimli toplam361 silindirdir.
6. Enter ile **İstek5:14**: Kafa14’e gelir; istek5 tamamlanır. Bu hareket+108, birikimli toplam469 silindirdir.
7. Enter ile **İstek6:124**: Kafa124’e gelir; istek6 tamamlanır. Bu hareket+110, birikimli toplam579 silindirdir.
8. Enter ile **İstek7:65**: Kafa65’e gelir; istek7 tamamlanır. Bu hareket+59, birikimli toplam638 silindirdir.
9. Enter ile **İstek8:67**: Kafa67’e gelir; istek8 tamamlanır. Bu hareket+2, birikimli toplam640 silindirdir.
10. Enter ile **Sonuç:640**: Geliş sırası korundu:45+85+146+85+108+110+59+2=640. Grafiğin dikey ekseni olay sırası; gerçek zaman değildir.

**Dinleyici sorusu:** Sonradan gelen yakın istek FCFS’de öne geçer mi?
**Beklenen cevap / yanlış cevabı düzeltme:** Hayır; geliş sırasındaki yerini korur.

**Kaçınılacak çıkarım:** Kuyruk kartlarını konumsal sıralama sanma. Servis sayısı ve toplam mesafe farklı sayaçlardır.

**Geçiş / devir:** “Kafayı çok gezdirdik; şimdi aynı yöndeki istekleri toplayalım.”

**Tam anlatımda genişlet:** Tahmin için daha uzun bekle; yanlış cevabı modelde önceki aşamaya dönerek açıkla. Yeni ürün bilgisi veya yeni kaynak ekleme.

### 3. SCAN: fiziksel uca git, dön — `scan-path`

**Rota / süre:** çekirdek ve tam; çekirdek 1:30 / tam 2:15. **Kaynak:** 11.2; resmî slayt 21, 22.

**Giriş cümlesi:** “Asansör gibi aynı yöndeki istekleri toplayalım; fiziksel sınırda yön değiştirelim.”

**Aşama eylemleri ve söylem:**

1. Sahne açıldığında **Başlangıç53**: Kafa 53’te, toplam 0 ve tamamlanan0/8. Önce bir sonraki hedefi ve mesafeyi tahmin edin.
2. Enter ile **İstek:37**: Kafa37’e gelir; istek3 tamamlanır. Bu hareket+16, birikimli toplam16 silindirdir.
3. Enter ile **İstek:14**: Kafa14’e gelir; istek5 tamamlanır. Bu hareket+23, birikimli toplam39 silindirdir.
4. Enter ile **Fiziksel uç:0**: Fiziksel uç0’a gidilir. +14 hareket toplamı53 yapar; istek servis sayısı artmaz.
5. Enter ile **İstek:65**: Kafa65’e gelir; istek7 tamamlanır. Bu hareket+65, birikimli toplam118 silindirdir.
6. Enter ile **İstek:67**: Kafa67’e gelir; istek8 tamamlanır. Bu hareket+2, birikimli toplam120 silindirdir.
7. Enter ile **İstek:98**: Kafa98’e gelir; istek1 tamamlanır. Bu hareket+31, birikimli toplam151 silindirdir.
8. Enter ile **İstek:122**: Kafa122’e gelir; istek4 tamamlanır. Bu hareket+24, birikimli toplam175 silindirdir.
9. Enter ile **İstek:124**: Kafa124’e gelir; istek6 tamamlanır. Bu hareket+2, birikimli toplam177 silindirdir.
10. Enter ile **İstek:183**: Kafa183’e gelir; istek2 tamamlanır. Bu hareket+59, birikimli toplam236 silindirdir.
11. Enter ile **Sonuç236 ve LOOK208 ayrımı**: Fiziksel0’a giden yol53+183=236. 14’te dönen LOOK yolu39+169=208. Kaynak21’deki208 ile bu fiziksel uç kuralı uyuşmaz; tam kitap metninde hata iddia edilmez.

**Dinleyici sorusu:** 14’te dönmek bu SCAN sözleşmesine uyar mı?
**Beklenen cevap / yanlış cevabı düzeltme:** Hayır; burada fiziksel0’a gidilir.14’te dönen LOOK yolu208’dir.

**Kaçınılacak çıkarım:** 0’a giden SCAN236’dır;14’te dönen LOOK208’dir. Resmî21. slayttaki208 uyuşmazlığını notla, tam kitap hatası iddia etme.

**Geçiş / devir:** “Servisi tek yönde tutarsak dönüş yoluna ne olur?”

**Tam anlatımda genişlet:** Tahmin için daha uzun bekle; yanlış cevabı modelde önceki aşamaya dönerek açıkla. Yeni ürün bilgisi veya yeni kaynak ekleme.

### 4. C-SCAN: dönüşte servis yok — `cscan-path`

**Rota / süre:** çekirdek ve tam; çekirdek 1:30 / tam 2:15. **Kaynak:** 11.2; resmî slayt 23, 24.

**Giriş cümlesi:** “Şimdi servis yönünü tek yönde tutacağız; dönüşü ücretsiz saymayacağız.”

**Aşama eylemleri ve söylem:**

1. Sahne açıldığında **Başlangıç53**: Kafa 53’te, toplam 0 ve tamamlanan0/8. Önce bir sonraki hedefi ve mesafeyi tahmin edin.
2. Enter ile **İstek:37**: Kafa37’e gelir; istek3 tamamlanır. Bu hareket+16, birikimli toplam16 silindirdir.
3. Enter ile **İstek:14**: Kafa14’e gelir; istek5 tamamlanır. Bu hareket+23, birikimli toplam39 silindirdir.
4. Enter ile **Fiziksel uç:0**: Fiziksel uç0’a gidilir. +14 hareket toplamı53 yapar; istek servis sayısı artmaz.
5. Enter ile **0→199: servis yok**: servis yok: 0→199 dönüşünde servis yok. +199 hareket toplamı252 yapar; tamamlanan istek2/8 kalır.
6. Enter ile **İstek:183**: Kafa183’e gelir; istek2 tamamlanır. Bu hareket+16, birikimli toplam268 silindirdir.
7. Enter ile **İstek:124**: Kafa124’e gelir; istek6 tamamlanır. Bu hareket+59, birikimli toplam327 silindirdir.
8. Enter ile **İstek:122**: Kafa122’e gelir; istek4 tamamlanır. Bu hareket+2, birikimli toplam329 silindirdir.
9. Enter ile **İstek:98**: Kafa98’e gelir; istek1 tamamlanır. Bu hareket+24, birikimli toplam353 silindirdir.
10. Enter ile **İstek:67**: Kafa67’e gelir; istek8 tamamlanır. Bu hareket+31, birikimli toplam384 silindirdir.
11. Enter ile **İstek:65**: Kafa65’e gelir; istek7 tamamlanır. Bu hareket+2, birikimli toplam386 silindirdir.
12. Enter ile **Sonuç:386**: Sonuç53+199+134=386. Ortak azalan yön korunur; artan alternatif382’dir ve kaynak çizimiyle yön farkı notlanır.

**Dinleyici sorusu:** 0→199 dönüşünde98’in üzerinden geçmek98isteğini tamamlar mı?
**Beklenen cevap / yanlış cevabı düzeltme:** Hayır; dönüşte servis yapılmaz,199 hareket yine sayılır.

**Kaçınılacak çıkarım:** 0→199 dönüşü+199’dur; bu sırada istek tamamlanmaz. Ortak azalan386 ile kaynak çiziminin artan382 sonucunu karıştırma.

**Geçiş / devir:** “Üç toplamı aynı hedefle karşılaştıralım; sonra ölçünün eksiklerini soralım.”

**Tam anlatımda genişlet:** Tahmin için daha uzun bekle; yanlış cevabı modelde önceki aşamaya dönerek açıkla. Yeni ürün bilgisi veya yeni kaynak ekleme.

### 5. Kısa yol tek ölçüt değil — `scheduling-tradeoffs`

**Rota / süre:** çekirdek ve tam; çekirdek 1:15 / tam 2:00. **Kaynak:** 11.2; resmî slayt 17, 18, 19, 20, 21, 22, 23, 24, 25.

**Giriş cümlesi:** “Üç doğru toplam var. En küçük sayı, bütün kararın cevabı mı?”

**Aşama eylemleri ve söylem:**

1. Sahne açıldığında **FCFS640**: FCFS aynı sekiz isteği geliş sırasıyla640 silindirde tamamlar.
2. Enter ile **SCAN236**: SCAN fiziksel0 ucuna gider; aynı kuyrukta236 hareket yapar.
3. Enter ile **C-SCAN386**: C-SCAN servis yapılmayan dönüşü de sayarak386 hareket yapar.
4. Enter ile **Dönüşü ayır:53+199+134**: C-SCAN çubuğunu53,199,134 olarak ayırın. 199 dönüşü servis yapmaz ama hareket toplamında kalır.
5. Enter ile **Hareket ve servis sırası farklı**: Geliş kimlikleriyle servis sırasını karşılaştırın. Tablo gerçek bekleme süresi veya adalet puanı değildir.
6. Enter ile **Politika: eski bekleyen isteği gözet**: eski bekleyen isteği gözet: 25.slayttaki tarihsel deadline fikri: batch sonrasında eski isteği gözet; o isteğin bulunduğu LBA kuyruğunu seç. RHEL7/NOOP/CFQ güncel varsayılan diye sunulmaz.

**Dinleyici sorusu:** En kısa yol her durumda en düşük uygulama gecikmesi midir?
**Beklenen cevap / yanlış cevabı düzeltme:** Hayır; dönme,istek boyutu,kuyruk ve adalet hedefleri de önemlidir.

**Kaçınılacak çıkarım:** En kısa yol adalet puanı değildir. Deadline panelinde eski isteğin bulunduğu LBA kuyruğu sonraki batch için seçilir; eski istek anında ve koşulsuz servis edilir denmez.

**Geçiş / devir:** “NVM’de kafa yolu yok. Politikaların hangi gerekçeleri kalır?”

**Tam anlatımda genişlet:** Tahmin için daha uzun bekle; yanlış cevabı modelde önceki aşamaya dönerek açıkla. Yeni ürün bilgisi veya yeni kaynak ekleme.

### 6. Seek yok, kuyruk işi sürer — `nvm-scheduling`

**Rota / süre:** çekirdek ve tam; çekirdek 1:15 / tam 2:00. **Kaynak:** 11.3, 11.1; resmî slayt 11, 15, 26.

**Giriş cümlesi:** “Mekanik hareket kalkınca silindir yakınlığını azaltmak aynı gerekçeyi taşımaz.”

**Aşama eylemleri ve söylem:**

1. Sahne açıldığında **OS kuyruğu**: Seek yok; host komut hazırlama ve kuyruk işi sürer.
2. Enter ile **Bitişik L10/L11’i birleştir**: OkuL10 ve OkuL11 tek OkuL10–L11 isteğinde birleştirilir. Geriye gidince iki kart geri gelir.
3. Enter ile **Komutları aygıta gönder**: Komutlar aygıta gönderilir. NVMe iletişim arayüzüdür; FTL değildir.
4. Enter ile **Aygıt içi paralellik**: Aygıt içindeki işler paralel ilerleyebilir. Çizilen iç iş sayısı ürün özelliği veya hız çarpanı değildir.
5. Enter ile **Host ve denetleyici görevleri**: Host I/O kararları, FTL eşlemesi, GC ve wear leveling ayrı sorumluluklardır. Ayrıntılı GC hesabı bir sonraki sahnededir.

**Dinleyici sorusu:** Seek yoksa bitişik isteği birleştirmek anlamsız mı?
**Beklenen cevap / yanlış cevabı düzeltme:** Hayır; komut ve yazılım ek yükünü azaltma farklı bir gerekçedir.

**Kaçınılacak çıkarım:** Bütün SSD’lerin daima FCFS/NOOP kullandığını söyleme. Paralel iç iş sayısı gerçek kanal sayısı veya hız çarpanı değildir.

**Geçiş / devir:** “Bir host yazması aygıt içinde kaç fiziksel yazma doğurabilir?”

**Tam anlatımda genişlet:** Tahmin için daha uzun bekle; yanlış cevabı modelde önceki aşamaya dönerek açıkla. Yeni ürün bilgisi veya yeni kaynak ekleme.

### 7. Host yazması neden fiziksel yazma değildir? — `flash-write-amplification`

**Rota / süre:** çekirdek ve tam; çekirdek 2:00 / tam 3:00. **Kaynak:** 11.3, 11.1; resmî slayt 10, 11, 26.

**Giriş cümlesi:** “Host’un istediği yazma sayısını, flash’ın gerçekten yazdığı sayıyla karşılaştıralım.”

**Aşama eylemleri ve söylem:**

1. Sahne açıldığında **Başlangıç eşlemesi**: Başlangıç B0=L0–L3, B1=L4/L5 ve2boş, B2=GCrezervi. İlk yükleme sayaçlara dahil değil; oran host0 iken tanımsızdır.
2. Enter ile **L0’ı güncelle**: L0:v1→B1.P2; eskiL0 geçersiz. Host1,fiziksel1,silme0.
3. Enter ile **L1’i güncelle**: L1:v1→B1.P3; eskiL1 geçersiz. Host2,fiziksel2,silme0.
4. Enter ile **GC: canlı L2/L3’ü taşı**: canlı L2/L3’ü taşı: CanlıL2/L3 B2’ye kopyalanır; FTL güncellenir. Host2 kalır, fiziksel yazma4 olur.
5. Enter ile **B0’ı sil**: B0’da canlı referans kalmadığı için blok birlikte silinir. Silme1 olur; yeni GCrezervi B0’dır.
6. Enter ile **L2’yi güncelle:5/3 oranı**: L2:v1→B2.P2. Sonuç host 3,fiziksel 5,silme 1. Fiziksel/host=5/3≈1,67; bu sabit ürün oranı değildir.

**Dinleyici sorusu:** Host2’de dururken fiziksel yazma4 nasıl oldu?
**Beklenen cevap / yanlış cevabı düzeltme:** GC canlıL2/L3 kopyalarını yazdı; bunlar yeni host yazması değildi.

**Kaçınılacak çıkarım:** GC kopyası host yazması sayılmaz. Başlangıç yükleme sayaç dışı; host 0 iken oran tanımsız. Canlı eşleme kalmadan silme yok.

**Geçiş / devir:** “GC alanı geri kazandırır. Aşınmayı geri alır mı?”

**Tam anlatımda genişlet:** Tahmin için daha uzun bekle; yanlış cevabı modelde önceki aşamaya dönerek açıkla. Yeni ürün bilgisi veya yeni kaynak ekleme.

### 8. Alanı geri kazan, aşınmayı geri alma — `nvm-management-summary`

**Rota / süre:** çekirdek ve tam; çekirdek 1:00 / tam 1:45. **Kaynak:** 11.3, 11.1; resmî slayt 10, 11, 26.

**Giriş cümlesi:** “Alanı geri kazanmak, geçmiş aşınmayı geri almak değildir.”

**Aşama eylemleri ve söylem:**

1. Sahne açıldığında **Host ve denetleyici görevleri**: OS istek gönderme/birleştirmeyi; SSD denetleyicisi FTL,GC ve aşınmayı yönetir.
2. Enter ile **Birikmiş silmeler:[8,2,2,1]**: Birikmiş silmeler[8,2,2,1]. Aşınma sayıları kalan ömür yüzdesi değildir.
3. Enter ile **Yeni19döngü:[8,8,8,8]**: Yeni19silme döngüsü B1+6,B2+6,B3+7 dağıtılır:[8,8,8,8]. Hiçbir sayaç azalmaz.
4. Enter ile **B0’da1silme:[9,8,8,8]**: B0’da bir silme daha:[9,8,8,8]. Alan yeniden kullanılabilir, geçmiş aşınma geri alınmaz.
5. Enter ile **Host’a sunulmayan GC çalışma alanı**: Denetleyicinin GC için ayırdığı alan host’un dosya sistemi boşluğu değildir. FTL/GC/aşınma farklı işlerdir.

**Dinleyici sorusu:** Bloğu silmek geçmiş aşınma sayacını sıfırlar mı?
**Beklenen cevap / yanlış cevabı düzeltme:** Hayır; alanı geri kazanmak geçmiş aşınmayı geri almak değildir.

**Kaçınılacak çıkarım:** İleri yönde sayacı azaltma. +19 döngü B1+6/B2+6/B3+7’dir. Örnek sayılar kalan sağlık veya gerçek ömür tahmini değildir.

**Geçiş / devir:** “İsteklerin sırasını ve aygıtın yaptığı ek işi yönettik. Okuduğumuz bitlerin doğru olduğunu nasıl anlayacağız? Şimdi hata tespiti ve düzeltmeyle devam ediyoruz.”

**Tam anlatımda genişlet:** Tahmin için daha uzun bekle; yanlış cevabı modelde önceki aşamaya dönerek açıkla. Yeni ürün bilgisi veya yeni kaynak ekleme.

## Son devir kartı

“İsteklerin sırasını ve aygıtın yaptığı ek işi yönettik. Bu işlemlerin sonunda okuduğumuz bitlerin doğru olduğunu nasıl anlayacağız? Şimdi hata tespiti ve düzeltmeyle devam ediyoruz.” Üçüncü sunucu kendi parite/ECC açılış sorusunu gösterir.

## Doğrulama sınırı

Kitabın tam metni yerel depoda yoktur. Bölüm/baskı eşlemesi resmî içindekilere, ayrıntılı kavramlar resmî slaytlara dayanır. Örnekler ve Türkçe söylem projeye aittir. Tarayıcı otomasyonu ve ekran görüntüsü kullanılmaz; hesap, SSR, TypeScript ve HTTP kontrolleri görsel doğrulama diye anlatılmaz.
