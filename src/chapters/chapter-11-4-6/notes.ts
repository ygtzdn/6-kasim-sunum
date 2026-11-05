import type { SceneNotes } from "../../presentation/types";

export const managementNotes: Record<string, SceneNotes> = {
  "why-error-detection": {
    explanation:
      "Hızlı erişim tek başına verinin doğru kaldığını göstermez. Saklama veya aktarım sırasında bir bit değişebilir. Diyagramda yazılan 1011001 önce aynı okunur, sonra üçüncü bitin değişmesiyle 1001001 okunur. Bu değişikliği fark edebilmek için veriyle birlikte denetim bilgisi saklanır. Hata saptanırsa işlem durdurulabilir. Kitap hata denetiminin bellek, ağ ve depolama için temel bir ihtiyaç olduğunu belirtir. Bit dizileri bu anlatım için oluşturulmuş örneklerdir.",
  },
  "error-detection": {
    explanation:
      "Örnekte 1011001 dört adet 1 içerir ve çift parite için P=0 saklanır. Okumada üçüncü bit değişince 1001001 gelir. Önce hatalı okuma gösterilir, sonraki aşamada kontrol açılır: toplam üç olduğu için hata saptanır. Saklanan P bozuk veriden yeniden hesaplanmaz. Yeni iki bit hatası örneğinde 0111001 yine dört adet 1 içerir ve parite hatayı kaçırır. Turuncu işaretler anlatım için değiştirdiğimiz bitleri gösterir, paritenin bulduğu konumlar değildir. Kitap pariteyi basit bir checksum türü olarak anlatır ve çok bitli hata tespitinde kullanılan CRC’yi de anar. Yöntemlerin hata kapsaması farklıdır.",
  },
  "error-correction": {
    explanation:
      "ECC, veriye eklenen kodlama bilgisiyle bazı hataları hem tespit eder hem düzeltebilir. Özgün örnekte 1011 verisi ve ECC bilgisi saklanır, okumada 1001 elde edilir. ECC denetiminden sonra doğru içerik olan 1011 geri elde edilir. Kitap soft errors ile hard errors ayrımını yapar. Kodun sınırları içindeki geçici bit hatası düzeltilebilirken kalıcı fiziksel arıza ECC ile onarılamaz. Son şema bu kalıcı hata ayrımını gösterir. Düzeltme kapasitesi kullanılan koda bağlıdır. Veri ve ECC bilgisinin sektör içinde tutulması, sonraki aygıt yönetimi konusuna bağlanır.",
  },
  "device-preparation": {
    explanation:
      "Depolama aygıtının fiziksel düzeni, bölümleme ve dosya sistemi oluşturma farklı katmanlardır. Örnekte alan iki bölüme ayrılır ve yalnız ilk bölümde dosya sistemi oluşturulur. Bağlama sırasında dosya sistemi denetlenir ve işletim sisteminin ad alanına katılır. Dosyaya erişim bu hazırlıkların ardından mümkün olur.",
  },
  "storage-access-modes": {
    explanation:
      "Aygıt mantıksal bloklar sunar, dosya sistemi bu bloklar üzerinde dosya ve dizin düzeni kurar. Bloklar dosya sistemi tarafından daha büyük gruplarda yönetilebilir. Raw erişimde uygun uygulama kendi blok düzenini yönetir. İşletim sisteminin I/O katmanı ve sürücüler bu erişimde de bulunur.",
  },
  "boot-sequence": {
    explanation:
      "Bilgisayar açıldığında ilk kod firmware’den çalışır. Firmware ve depolamadaki yükleyici kodu, kernel görüntüsünün RAM’e getirilmesini sağlar. Denetim kernel’e geçtiğinde işletim sistemi çalışmaya başlar. Depolamadaki kalıcı görüntü ile RAM’de çalışan içerik farklı konumlardır.",
  },
  "bad-block-remapping": {
    explanation:
      "Sorunlu bir fiziksel sektör yedek bir konuma eşlenebilir. Üst katman aynı mantıksal blok adresini kullanmaya devam eder. Değişen fiziksel yerleşimdir. Yeniden eşleme, okunamayan eski veriyi tek başına geri getirmez.",
  },
  "swap-space": {
    explanation:
      "Swap, RAM dışına taşınan bellek içeriği için depolamada arka alan sağlar. Bu alan ayrı bölümde veya dosyada bulunabilir. Yerleşim, alan ayırma ve I/O yükünü dağıtma ayrı kararlardır. Swap kullanımı depolamayı RAM ile aynı hızda yapmaz.",
  },
  "swap-journey": {
    explanation:
      "Bir bellek sayfası RAM frame’inden ayrılmış swap konumuna yazılır. Yazma tamamlanınca RAM alanı başka kullanım için bırakılabilir. Sayfa yeniden gerektiğinde RAM’de hedef alan ayrılır ve içerik geri okunur. Sayfanın kimliği, RAM frame’i ve swap konumu farklıdır. Aktarımın başlaması ile tamamlanması aynı durum değildir.",
  },
  "management-decisions": {
    explanation:
      "Veri doğruluğu, aygıtın dosya saklamaya hazırlanması ve swap yönetimi farklı sorumluluklardır. Doğruluk denetimi ek kontrol bilgisi kullanır. Aygıt yönetimi bölüm ve dosya sistemi düzenini kurar. Swap yönetimi ise bellek içeriğinin RAM ile depolama arasındaki yerini ve aktarımını izler.",
  },
};
