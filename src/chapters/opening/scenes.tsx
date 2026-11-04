import { Cover, Roadmap } from "../../components/VisualScenes";
import type { SceneDefinition } from "../../presentation/types";

export const openingScenes: SceneDefinition[] = [
  {
    id: "storage-opening",
    legacyIds: ["s01"],
    kind: "intro",
    depth: "core",
    seconds: { core: 45, full: 60 },
    title: "Depolama isteğinin arkasındaki kararlar",
    shortTitle: "Başlangıç sorusu",
    chapter: "Bölüm 11 · Açılış",
    presenterId: 1,
    stages: [
      "Bir dosya isteği",
      "İşletim sistemi kararı",
      "Fiziksel depolama maliyeti",
    ],
    render: (context) => (
      <Cover
        start={() => context.goTo("presentation-map")}
        menu={context.openMenu}
        enabled={context.enabled}
        stage={context.stage}
      />
    ),
    notes: {
      represents:
        "Gerçek HDD fotoğrafı, uygulamanın dosya isteğini fiziksel depolamaya bağlar. İlk aşamada dosya isteği, ikinci aşamada işletim sisteminin aracı rolü, üçüncü aşamada fiziksel erişimin maliyeti vurgulanır. Fotoğraf bütün depolamanın mekanik olduğu veya gerçek performans ölçüldüğü anlamına gelmez.",
      learningGoal:
        "Bir depolama isteğinin aygıt yapısı, işletim sistemi politikası, yönetim ve güvenilirlik kararlarıyla birlikte açıklanacağını kavramak.",
      walkthrough: [
        "Bir dosyayı açarken neyi beklediğimizi sorun; ilk aşamada henüz bir hız veya doğru aygıt cevabı vermeyin.",
        "Enter ile işletim sistemi rolünü açın: uygulama tek tek fiziksel sektör seçmez. Üçüncü aşamada fiziksel aygıtın farklı maliyetleri olduğunu söyleyin.",
        "Backspace ile uygulama/OS/aygıt ayrımına geri dönülebilir. Sonraki sahnede dört sunucunun bu kararları nasıl paylaşacağını gösterin.",
      ],
      keyPoints: [
        "Bölümün konusu yalnız disk isimleri değildir; yapı, performans ve güvenilirlik arasındaki ilişkidir.",
        "Açık fotoğraf bir aygıt örneğidir. RAM, NVM ve teyp ilerleyen sahnelerde ayrı özellikleriyle ele alınacaktır.",
      ],
      limits:
        "Açılış çizimi gerçek istek veya süre üretmez. Bölüm hedeflerini kuran özgün Türkçe bir başlangıçtır; tam kitap sayfası veya kitap şekli aktarımı değildir.",
      question: {
        prompt: "Bir dosyayı okumak neden yalnız aktarım hızıyla açıklanamaz?",
        answer:
          "Verinin konumu, kuyruk ve aygıt işlemleri gibi başka işler de erişim maliyeti doğurabilir; bölüm bunları sırayla ayırır.",
      },
      transition:
        "Bu soruyu dört farklı sorumluluk alanı üzerinden ele alacağız.",
    },
  },
  {
    id: "presentation-map",
    legacyIds: ["s02"],
    kind: "intro",
    depth: "core",
    seconds: { core: 75, full: 120 },
    title: "Dört soru, bir depolama sistemi",
    shortTitle: "Dört sunucunun haritası",
    chapter: "Bölüm 11 · Yol haritası",
    presenterId: 1,
    stages: [
      "Aygıt hangi maliyeti doğurur?",
      "İstekleri nasıl sıralarız?",
      "Veriyi ve alanı nasıl yönetiriz?",
      "Nasıl bağlar ve koruruz?",
    ],
    render: (context) => (
      <Roadmap
        goTo={context.goTo}
        stage={context.stage}
        enabled={context.enabled}
      />
    ),
    notes: {
      represents:
        "Dört düğüm kitabın bölüm numaralarına bağlı dört sunucunun sorularını gösterir. Her Enter bir grubu vurgular: 11.1 aygıt ve maliyet; 11.2–11.3 zamanlama; 11.4–11.6 doğruluk ve alan; 11.7–11.8 bağlantı ve çoklu disk koruması. Düğümler zorunlu bir donanım işlem sırası değildir.",
      learningGoal:
        "Birbirini tamamlayan dört anlatımın kapsamını ve kitap sırasındaki geçiş gerekçesini bilmek.",
      walkthrough: [
        "Birinci grupta aygıt yapısından hangi maliyetin çıktığını söyleyin; ikinci gruba geçerken bu maliyetin istek sırasını neden önemli yaptığını sorun.",
        "Üçüncü grupta verinin doğru olup olmadığıyla alanın kullanıma hazır olup olmadığının ayrı sorular olduğunu belirtin.",
        "Dördüncü grupta erişim yolu ile koruma düzenini ayırın. Bir düğmeye tıklamak ilgili sunucunun ilk sahnesini, Enter ise yalnız haritanın sonraki odağını açar.",
        "Kısa rota ana kavramları aynı sırada işler; ayrıntılı rota menüde Ek açıklama etiketi taşıyan altı sahneyi de sıraya alır. Bölüm dağılımı iki rotada da aynıdır.",
      ],
      keyPoints: [
        "Her sunucu kendi kitap bölümünde kalır; sonraki bölümde önceki kavrama yapılan geri referans açıkça kaynaklandırılır.",
        "Ek açıklamalar başka baskı veya yeni müfredat değildir; aynı 10. baskı kapsamının daha ayrıntılı anlatımıdır.",
      ],
      limits:
        "Dört kişilik görev dağılımı ve rota süreleri proje tasarımıdır. Süreler prova hedefidir; otomatik sahne geçişi veya ölçülmüş konuşma süresi değildir.",
      question: {
        prompt:
          "Hızlı erişim elde etmek, doğru ve dayanıklı depolama tasarımını tamamlar mı?",
        answer:
          "Hayır; veri doğruluğu, alan yönetimi, bağlantı sorumluluğu ve hata koruması ayrıca düşünülür.",
      },
      transition:
        "Önce HDD'deki fiziksel hareketi ve erişim maliyetinin nereden çıktığını inceleyelim.",
    },
  },
];
