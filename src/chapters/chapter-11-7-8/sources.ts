/** Primary sources consulted for the original diagrams, model boundaries, and speaker notes. */
export const attachmentRaidSources = [
  {
    title: "Operating System Concepts, 10th edition — resmî bölüm kapsamı",
    url: "https://os-book.com/OS10/toc-dir/toc.pdf",
    purpose:
      "§11.7 bağlantı; §11.8 RAID bölüm kapsamı. Kitap görselleri veya slaytları kopyalanmadı.",
  },
  {
    title: "SNIA — What is Network Attached Storage?",
    url: "https://www.snia.org/education/what-is-nas",
    purpose: "NAS dosya erişimi ve dosya hizmeti sorumluluğu.",
  },
  {
    title: "SNIA — What Is a Storage Area Network?",
    url: "https://www.snia.org/education/storage_networking_primer/san/what_san",
    purpose:
      "Depolama ağı bağlamı; blok erişimi örneğinin sorumluluk sınırları.",
  },
  {
    title: "Linux Kernel — dm-raid",
    url: "https://www.kernel.org/doc/html/latest/admin-guide/device-mapper/dm-raid.html",
    purpose:
      "RAID seviye tanımları, dedicated/rotating parity yerleşimleri ve uygulama varyantlarının sınırı.",
  },
  {
    title: "Linux Kernel — RAID arrays",
    url: "https://www.kernel.org/doc/html/latest/admin-guide/md.html",
    purpose:
      "Rebuild, yedeklilik, dirty/degraded durumları ve parite tutarlılığı sınırlamaları.",
  },
  {
    title: "H. Peter Anvin — The Mathematics of RAID-6",
    url: "https://www.kernel.org/pub/linux/kernel/people/hpa/raid6.pdf",
    purpose:
      "P ve Q’nun bağımsızlığı; Q cebirinin bu eğitim modeli dışında bırakılması.",
  },
  {
    title: "Linux Kernel — Partial Parity Log",
    url: "https://www.kernel.org/doc./html/next/driver-api/md/raid5-ppl.html",
    purpose:
      "Write hole örneği; disk yedekliliğinin bütün tutarlılık sorunlarını çözmediği açıklaması.",
  },
];
