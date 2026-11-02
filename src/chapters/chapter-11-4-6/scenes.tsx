import type { SceneDefinition } from "../../presentation/types";
import { DeviceLab, BootLab, RemapLab } from "./DeviceLab";
import { ParityLab, EccLab } from "./ParityLab";
import { ManagementRecap } from "./Recap";
import { SwapConcept, SwapJourney } from "./SwapLab";
import { managementNotes } from "./notes";

export const managementScenes: SceneDefinition[] = [
  {
    id: "s18",
    title: "Veri bozulduğunu nasıl anlarız?",
    shortTitle: "Parite",
    chapter: "11.4",
    presenterId: 3,
    notes: managementNotes.s18,
    render: ({ enabled }) => <ParityLab enabled={enabled} />,
  },
  {
    id: "s19",
    title: "Tespit etmek ile düzeltmek farklıdır",
    shortTitle: "Tespit & ECC",
    chapter: "11.4",
    presenterId: 3,
    notes: managementNotes.s19,
    render: ({ enabled }) => <EccLab enabled={enabled} />,
  },
  {
    id: "s20",
    title: "Fabrikadan dosyaya aygıt hazırlığı",
    shortTitle: "Aygıt hazırlığı",
    chapter: "11.5",
    presenterId: 3,
    notes: managementNotes.s20,
    render: ({ enabled }) => <DeviceLab enabled={enabled} />,
  },
  {
    id: "s21",
    title: "Başlatma kodu veriyi nasıl bulur?",
    shortTitle: "Açılış zinciri",
    chapter: "11.5",
    presenterId: 3,
    notes: managementNotes.s21,
    render: ({ enabled }) => <BootLab enabled={enabled} />,
  },
  {
    id: "s22",
    title: "Bozuk sektör ve yedek alan",
    shortTitle: "Yeniden eşleme",
    chapter: "11.5",
    presenterId: 3,
    notes: managementNotes.s22,
    render: ({ enabled }) => <RemapLab enabled={enabled} />,
  },
  {
    id: "s23",
    title: "Swap ne sağlar, neye mal olur?",
    shortTitle: "RAM & swap",
    chapter: "11.6",
    presenterId: 3,
    notes: managementNotes.s23,
    render: ({ enabled }) => <SwapConcept enabled={enabled} />,
  },
  {
    id: "s24",
    title: "Bir sayfanın dışarı ve geri yolculuğu",
    shortTitle: "Sayfa yolculuğu",
    chapter: "11.6",
    presenterId: 3,
    notes: managementNotes.s24,
    render: ({ enabled }) => <SwapJourney enabled={enabled} />,
  },
  {
    id: "s25",
    title: "Doğru veri, hazır aygıt, yönetilen alan",
    shortTitle: "Üç karar",
    chapter: "11.4–11.6",
    presenterId: 3,
    notes: managementNotes.s25,
    render: ({ enabled, goTo }) => (
      <ManagementRecap enabled={enabled} goTo={goTo} />
    ),
  },
];
