# 08 — Modüler tam sunum
> 3 Kasım 2026: İlk kişinin sahneleri ve klavye kontrolleri için [09 — Kitaba bağlı revizyon](09-kitaba-bagli-revizyon.md) bu belgenin ilgili kısımlarının yerini alır. Aşağıdaki 3D/söküm/çalışma modülü önceki sürümü anlatır; ilgili kod, videolar ve bağımlılıklar kaldırılmıştır. Diğer kişilerin kapsamı korunur.
+
+## Güncel kapsam
+
+Chapter 11'in 11.1–11.8 aralığı, açılış ve kapanış dahil **36 sahne** olarak uygulandı. Dört sunucunun dağılımı korunur. Önceki belgelerdeki “ilk dokuz sahne hazır” veya “diğer bölümler hazırlanacak” durumlarının yerine bu belge geçer. Beğenilen açık tema, Tailwind tasarımı, az metinli sahne ve küçük yan menü korunur.
+
+| Sunucu | Sahne | İçerik |
+| --- | --- | --- |
+| Açılış / 1 | S01–S02 | Ana ekran ve dört sunucunun haritası |
+| 1 | S03–S09 | 11.1: ortamlar, HDD parçaları, erişim hesabı, bloklar ve NVM |
+| 2 | S10–S17 | 11.2–11.3: FCFS/SCAN/C-SCAN, OS/denetleyici, flash/GC |
+| 3 | S18–S25 | 11.4–11.6: parite/ECC, aygıt, açılış, remapping, swap |
+| 4 | S26–S34 | 11.7–11.8: DAS/NAS/SAN, bulut, RAID, XOR ve rebuild |
+| Kapanış / 4 | S35–S36 | İsteğin yolculuğu ve ortak değerlendirme |
+
+## Modül sınırları
+
+```text
+src/
+├── App.tsx                          # İnce sunum kabuğu
+├── presentation/
+│   ├── types.ts                     # SceneDefinition / SceneNotes / SceneContext
+│   ├── registry.ts                  # 36 sahnenin sırası ve sunucu grupları
+│   ├── usePresentation.ts           # URL, klavye, hareket, menü, fullscreen
+│   ├── SideMenu.tsx                 # Küçük yan menü ve serbest gezinme
+│   └── NotesPanel.tsx               # Ayrıntılı notların tek görünümü
+├── components/presentation/
+│   └── ScenePrimitives.tsx          # Ortak Stage ve Choice
+├── chapters/
+│   ├── chapter-11-1/                # Giriş, ayrıntılı notlar ve HDD explorer
+│   │   └── components/
+│   │       ├── HddExplorer.tsx      # 3D / söküm / çalışma / fotoğraf seçimi
+│   │       └── HddModel3D.tsx       # Three.js + React Three Fiber + Drei
+│   ├── chapter-11-2-3/              # Kuyruk, zamanlama, NVM ve saf motor
+│   ├── chapter-11-4-6/              # Parite, ECC, aygıt, swap ve saf motor
+│   ├── chapter-11-7-8/              # Bağlantı, RAID, kaynaklar ve saf motor
+│   └── closing/                     # İki ortak kapanış sahnesi
+└── data/content.ts                  # Sunucular ve kaynak metaverisi
+```
+
+Her sahne `SceneDefinition` dışa aktarır. Yeni bölüm eklemek için sahnenin `id`, `title`, `shortTitle`, `chapter`, `presenterId`, `notes` ve `render(context)` alanları tanımlanır; bölüm dizisi registry'ye eklenir. Menü sayısı ve ileri/geri hareketler registry'den türetilir; dokuz sahneye sabitlenmiş gezinme kalmaz.
+
+Hesap/durum modelleri çizimden ayrıdır. Kuyruk, NVM/GC ve RAID gibi birden çok sahnede kullanılan örnekler modül içinde oturum durumunu paylaşır. Sayfa yenilemek örnekleri başa alır. Intro erişim hesabı da aynı oturumda korunur. Diğer küçük örnekler sahne yeniden açılınca başlangıca dönebilir; kalıcı kullanıcı kaydı yoktur.
+
+## HDD: kütüphane ve hazır içerik
+
+Ana anatomi sahnesi **Three.js + React Three Fiber + Drei** kullanır. Sürükleme ve yakınlaştırma, parça seçimi ve katman ayırma vardır. Model kavramsal geometriyle projede oluşturulmuştur; hazır üretici CAD dosyası olduğu iddia edilmez. Eski hafif SVG, açılış ve genel ortam önizlemelerinde kalır.
+
+Seçilebilir parça grupları: plaka, iz/sektör, mil/motor, kafalar, aktüatör, bobin/mıknatıs, PCB, veri/güç bağlantısı, gövde/kapak. Kafalar aktüatör grubuyla hareket eder; sektör vurgusu plakayla döner. Hareket kapatılınca kamera ataleti de kapanır. WebGL başlatılamazsa gerçek HDD fotoğrafı yedek olarak sunulur.
+
+İnternetten bulunan hazır içerikler çalışma sırasında dış servise ihtiyaç bırakmadan yerel paketlenmiştir:
+
+- `hdd-disassembly.webm`: Diego Alifano'nun SCSI HDD söküm stop-motion'u. [Kaynak](https://commons.wikimedia.org/wiki/File:Hardware_Bug_-_Stop_motion_test_N%C2%BA1.webm), [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/).
+- `hdd-spinup.webm`: Wolfgang Ellsässer'in açık HDD spin-up kaydı. [Kaynak](https://commons.wikimedia.org/wiki/File:Hddspinup.webm), [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) seçildi.
+- `hdd-open.jpg`: Evan-Amos'un fotoğrafı. [Kaynak](https://commons.wikimedia.org/wiki/File:Laptop-hard-drive-exposed.jpg), [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/).
+
+Videolar kullanıcı kontrolüyle oynatılır; otomatik ses/oynatma yoktur. Söküm videosu eski SCSI aygıtıdır; 3D modeldeki SATA temsiliyle bağlantı düzeni aynı değildir. Model boyutları ve hareket temposu temsilidir; bir HDD'yi fiziksel olarak açma talimatı değildir.
+
+3D kodu ayrı ve tembel yüklenen bir derleme parçasıdır. Büyük videolar yalnızca ilgili seçimde yüklenir; açılışın çalışması için indirilmez. Fontlar yereldir, hesaplar tarayıcıda yapılır.
+
+## Ayrıntılı not yapısı
+
+Her sayfanın notları ortak `SceneNotes` biçimindedir:
+
+- **Bu sayfa neyi temsil ediyor?** Ekrandaki nesneler, renkler, bağlantılar ve sonuçların anlamı.
+- **Öğrenme hedefi:** Dinleyicinin ayırt etmesi gereken ilişki.
+- **Nasıl anlatılır?** Etkileşimin hangi sırayla kullanılacağı.
+- **Ana kavramlar:** Doğru tanımlar ve yaygın yanlış genellemelerin karşılıkları.
+- **Modelin sınırları:** Gerçek donanıma göre eksik bırakılanlar ve yorum sınırı.
+- **Dinleyiciye soru / geçiş:** Uygun sahnelerde gerekçeli cevap ve sunucu geçişi.
+
+Uzun açıklamalar sunum yüzeyine taşınmaz. Notlar küçük menüde kaydırılabilir; sahneler kaydırmasız kalır.
+
+## Doğrulama
+
+Kullanıcının önceki talimatı korunur: **tarayıcı doğrulaması, ekran görüntüsü ve tarayıcı otomasyonu yapılmaz.**
+
+- TypeScript ve Vite üretim derlemesi geçti.
+- 37 hesap/durum testi geçti: erişim, bütün zamanlama servisleri, GC/eşleme, parite/SECDED, aygıt hazırlığı, swap, RAID ve topoloji.
+- SECDED testleri 16 veri örneğindeki tek bit düzeltmelerini ve çift bit tespitlerini; RAID10 testleri 4/6/8 diskte bütün arıza kombinasyonlarını kapsar.
+- `pnpm check:content`: 36 benzersiz/sıralı kimlik, doğru sunucu dağılımı, 11.1–11.8 kapsamı, menü grupları ve her sahnenin ayrıntılı not alanlarını Node üzerinden kontrol eder.
+- Canlı geliştirme sunucusunun CSS yanıtı HTTP ile kontrol edilir; ham `@apply` / `@theme` gönderilmemesi doğrulanır.
+
+Tarayıcıda görsel kontrol yapılmadığı için 3D görünümün veya bütün ekran boyutlarının görsel olarak doğrulandığı iddia edilmez. Model testleri gerçek aygıt davranışının eksiksiz simüle edildiği anlamına gelmez. RAID 6 Q cebiri sembolik; rebuild adımları gerçek süre değildir.
+
+## Çalıştırma
+
+```sh
+pnpm install --frozen-lockfile
+pnpm dev
+pnpm build
+pnpm test
+pnpm check:content
+```
+
+Bu çalışma ortamında `./scripts/dev.sh` Node yolunu da düzenler. Yerel adres `http://localhost:5173` olarak korunur. Haricî yayımlama yapılmadı.
+EOF
