# 3. kişi — Sayfa açıklamaları

5 Kasım 2026. Güncel sayfaların konu açıklamaları. Kitap ve model kaynakları sunumdaki Kaynaklar sekmesindedir.

## Hata tespitine neden ihtiyaç var?

11.4

Hızlı erişim tek başına verinin doğru kaldığını göstermez. Saklama veya aktarım sırasında bir bit değişebilir. Diyagramda yazılan 1011001 önce aynı okunur, sonra üçüncü bitin değişmesiyle 1001001 okunur. Bu değişikliği fark edebilmek için veriyle birlikte denetim bilgisi saklanır. Hata saptanırsa işlem durdurulabilir. Kitap hata denetiminin bellek, ağ ve depolama için temel bir ihtiyaç olduğunu belirtir. Bit dizileri bu anlatım için oluşturulmuş örneklerdir.

## Parite ile hata tespiti

11.4

Örnekte 1011001 dört adet 1 içerir ve çift parite için P=0 saklanır. Okumada üçüncü bit değişince 1001001 gelir. Önce hatalı okuma gösterilir, sonraki aşamada kontrol açılır: toplam üç olduğu için hata saptanır. Saklanan P bozuk veriden yeniden hesaplanmaz. Yeni iki bit hatası örneğinde 0111001 yine dört adet 1 içerir ve parite hatayı kaçırır. Turuncu işaretler anlatım için değiştirdiğimiz bitleri gösterir, paritenin bulduğu konumlar değildir. Kitap pariteyi basit bir checksum türü olarak anlatır ve çok bitli hata tespitinde kullanılan CRC’yi de anar. Yöntemlerin hata kapsaması farklıdır.

## ECC ile hata düzeltme

11.4

ECC, veriye eklenen kodlama bilgisiyle bazı hataları hem tespit eder hem düzeltebilir. Özgün örnekte 1011 verisi ve ECC bilgisi saklanır, okumada 1001 elde edilir. ECC denetiminden sonra doğru içerik olan 1011 geri elde edilir. Kitap soft errors ile hard errors ayrımını yapar. Kodun sınırları içindeki geçici bit hatası düzeltilebilirken kalıcı fiziksel arıza ECC ile onarılamaz. Son şema bu kalıcı hata ayrımını gösterir. Düzeltme kapasitesi kullanılan koda bağlıdır. Veri ve ECC bilgisinin sektör içinde tutulması, sonraki aygıt yönetimi konusuna bağlanır.

## Ham ortamdan dosyaya

11.5

Depolama aygıtının fiziksel düzeni, bölümleme ve dosya sistemi oluşturma farklı katmanlardır. Örnekte alan iki bölüme ayrılır ve yalnız ilk bölümde dosya sistemi oluşturulur. Bağlama sırasında dosya sistemi denetlenir ve işletim sisteminin ad alanına katılır. Dosyaya erişim bu hazırlıkların ardından mümkün olur.

## Kernel'den önce hangi kod çalışır?

11.5

Bilgisayar açıldığında ilk kod firmware’den çalışır. Firmware ve depolamadaki yükleyici kodu, kernel görüntüsünün RAM’e getirilmesini sağlar. Denetim kernel’e geçtiğinde işletim sistemi çalışmaya başlar. Depolamadaki kalıcı görüntü ile RAM’de çalışan içerik farklı konumlardır.

## Adres aynı kalırken yer değişebilir

11.5

Sorunlu bir fiziksel sektör yedek bir konuma eşlenebilir. Üst katman aynı mantıksal blok adresini kullanmaya devam eder. Değişen fiziksel yerleşimdir. Yeniden eşleme, okunamayan eski veriyi tek başına geri getirmez.

## RAM yetmezse neyi, nereye taşırız?

11.6

Swap, RAM dışına taşınan bellek içeriği için depolamada arka alan sağlar. Bu alan ayrı bölümde veya dosyada bulunabilir. Yerleşim, alan ayırma ve I/O yükünü dağıtma ayrı kararlardır. Swap kullanımı depolamayı RAM ile aynı hızda yapmaz.

## Bir sayfanın dışarı ve geri yolculuğu

11.6

Bir bellek sayfası RAM frame’inden ayrılmış swap konumuna yazılır. Yazma tamamlanınca RAM alanı başka kullanım için bırakılabilir. Sayfa yeniden gerektiğinde RAM’de hedef alan ayrılır ve içerik geri okunur. Sayfanın kimliği, RAM frame’i ve swap konumu farklıdır. Aktarımın başlaması ile tamamlanması aynı durum değildir.

## Üç sorumluluğu ayır

11.4–11.6

Veri doğruluğu, aygıtın dosya saklamaya hazırlanması ve swap yönetimi farklı sorumluluklardır. Doğruluk denetimi ek kontrol bilgisi kullanır. Aygıt yönetimi bölüm ve dosya sistemi düzenini kurar. Swap yönetimi ise bellek içeriğinin RAM ile depolama arasındaki yerini ve aktarımını izler.
