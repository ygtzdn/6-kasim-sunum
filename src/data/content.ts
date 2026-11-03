export const presenters = [
  {
    number: "01",
    title: "Aygıtın iç dünyası",
    person: "1. kişi",
    sections: "11.1",
    detail: "HDD, NVM, erişim süresi ve mantıksal bloklar",
    status: "Hazır",
    color: "#2247eb",
  },
  {
    number: "02",
    title: "İsteklerin doğru sırası",
    person: "2. kişi",
    sections: "11.2 — 11.3",
    detail: "HDD ve NVM üzerinde I/O zamanlaması",
    status: "Hazır",
    color: "#087e8b",
  },
  {
    number: "03",
    title: "Doğru veri, yönetilen alan",
    person: "3. kişi",
    sections: "11.4 — 11.6",
    detail: "Hata düzeltme, aygıt yönetimi ve swap",
    status: "Hazır",
    color: "#a93411",
  },
  {
    number: "04",
    title: "Birlikte çalışan diskler",
    person: "4. kişi",
    sections: "11.7 — 11.8",
    detail: "Depolama bağlantıları ve RAID yapısı",
    status: "Hazır",
    color: "#6d28d9",
  },
] as const;

export const resources = [
  {
    kind: "KİTAP",
    title: "Operating System Concepts · 10. baskı",
    detail: "Silberschatz, Galvin ve Gagne. Bölüm 11 için temel kaynak.",
    href: "https://os-book.com/OS10/index.html",
  },
  {
    kind: "BELGE · PDF",
    title: "Resmî içindekiler",
    detail: "11.1–11.8 başlıkları. Yerel kopya; internet olmadan açılabilir.",
    href: "/references/osc10-contents.pdf",
  },
  {
    kind: "BELGE · PPTX",
    title: "Chapter 11 · Resmî ders slaytları",
    detail: "Yazarların eğitim materyali. Kaynağın sitesinde açılır.",
    href: "https://os-book.com/OS10/slide-dir/PPTX-dir/ch11.pptx",
  },
  {
    kind: "FOTOĞRAF",
    title: "HDD · Şeffaf PNG fotoğraf",
    detail:
      "Evan-Amos / AGreuet · Wikimedia Commons · CC BY-SA 3.0. Arka planı kaldırılmış, kırpılmış gerçek fotoğraf.",
    href: "https://commons.wikimedia.org/wiki/File:Laptop-hard-drive-exposed_remix_transparent.png",
  },
  {
    kind: "SSD FOTOĞRAFLARI",
    title: "SSD dış görünüşü · MatteX",
    detail:
      "Gerçek SSD kasası. MatteX · CC0. Arka plan maskelendi ve şeffaf PNG olarak kırpıldı.",
    href: "https://commons.wikimedia.org/wiki/File:Samsung_SSD_840_120GB_MZ-7TD120--1_TOP.JPG",
  },
  {
    kind: "SSD FOTOĞRAFI",
    title: "SSD iç kartı · MatteX",
    detail:
      "Flash bellek ve denetleyici. MatteX · CC0. Arka plan maskelendi ve şeffaf PNG olarak kırpıldı.",
    href: "https://commons.wikimedia.org/wiki/File:Samsung_SSD_840_120GB_MZ-7TD120--6_BOARD_TOP.JPG",
  },
  {
    kind: "RAM FOTOĞRAFI",
    title: "RAM modülü · Şeffaf PNG",
    detail:
      "An-d / AGreuet · Wikimedia Commons · CC BY-SA 3.0. Arka planı kaldırılmış, kırpılmış gerçek RAM fotoğrafı.",
    href: "https://commons.wikimedia.org/wiki/File:Swissbit_2GB_PC2-5300U-555_remix_crop_transparent.png",
  },
] as const;

export const additionalResources = [
  {
    kind: "TEKNİK KAYNAK",
    title: "Hamming kodu",
    detail: "University of Michigan: denetim bitleri ve hata konumu.",
    href: "https://www.eecs.umich.edu/courses/eecs373.w05/lecture/hamming.html",
  },
  {
    kind: "TEKNİK KAYNAK",
    title: "UEFI Boot Manager",
    detail: "UEFI Forum resmî şartnamesi; UEFI açılış bağlamı.",
    href: "https://uefi.org/specs/UEFI/2.11/03_Boot_Manager.html",
  },
  {
    kind: "TEKNİK KAYNAK",
    title: "Linux swap table",
    detail: "Linux çekirdeği dokümantasyonu; gerçek swap yönetimi.",
    href: "https://docs.kernel.org/mm/swap-table.html",
  },
] as const;
