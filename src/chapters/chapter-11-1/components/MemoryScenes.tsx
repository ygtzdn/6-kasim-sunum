import { Power } from "lucide-react";
import type { SceneContext } from "../../../presentation/types";
import { Bits, Lesson } from "./LearningPrimitives";

const devices = [
  {
    name: "HDD",
    src: "/media/hdd-open.png",
    width: 2000,
    height: 1479,
    role: "Kalıcı depolama",
  },
  {
    name: "SSD",
    src: "/media/ssd-case.png",
    width: 2693,
    height: 1887,
    role: "Kalıcı depolama",
  },
  {
    name: "RAM",
    src: "/media/ram-module.png",
    width: 1774,
    height: 407,
    role: "Çalışma alanı",
  },
];

export function StorageDevices() {
  return (
    <Lesson
      title="HDD, SSD ve RAM"
      caption="RAM, kullanılan verilerle çalışır. HDD ve SSD, kaydedilen verileri tutar."
    >
      <div className="device-overview">
        {devices.map((device) => (
          <figure key={device.name}>
            <div className="device-photo">
              <img
                src={device.src}
                width={device.width}
                height={device.height}
                alt={`Gerçek ${device.name} aygıtı`}
              />
            </div>
            <figcaption>
              <strong>{device.name}</strong>
              <span>{device.role}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </Lesson>
  );
}

export function RamMemory({ stage }: SceneContext) {
  const powered = stage !== 1;
  const lost = stage >= 1;
  const captions = [
    "RAM, çalışan programların ve kullanılan verilerin bulunduğu çalışma alanıdır.",
    "Güç kesildiğinde RAM çalışma verisini korumaz.",
    "Güç geri gelir. Eski çalışma verisi kendiliğinden geri gelmez.",
  ];
  return (
    <Lesson title="RAM ve elektrik" caption={captions[stage]}>
      <div className="ram-memory">
        <img
          src="/media/ram-module.png"
          width="1774"
          height="407"
          alt="Gerçek DRAM modülü"
        />
        <div className={`ram-power ${powered ? "" : "power-off"}`}>
          <Power size={28} aria-hidden="true" />
          <strong>{powered ? "Güç var" : "Güç yok"}</strong>
        </div>
        <Bits lost={lost} />
        <p>
          {lost
            ? "Eski çalışma verisi yok"
            : "Çalışan program ve kullanılan veri"}
        </p>
      </div>
    </Lesson>
  );
}

export function MemoryComparison() {
  return (
    <Lesson
      title="Çalışma alanı ve kalıcı depolama"
      caption="Kalıcılık ve hareketli parça, farklı özelliklerdir."
    >
      <div className="memory-comparison">
        <table>
          <caption className="sr-only">
            RAM, HDD ve flash SSD karşılaştırması
          </caption>
          <thead>
            <tr>
              <th scope="col">Özellik</th>
              {[devices[2], devices[0], devices[1]].map((device) => (
                <th scope="col" key={device.name}>
                  <img
                    src={device.src}
                    width={device.width}
                    height={device.height}
                    alt=""
                  />
                  <strong>{device.name}</strong>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Temel görev</th>
              <td>Çalışma alanı</td>
              <td>Kalıcı depolama</td>
              <td>Kalıcı depolama</td>
            </tr>
            <tr>
              <th scope="row">Güç kesilince kayıt</th>
              <td className="text-orange">Korunmaz</td>
              <td>Korunur</td>
              <td>Korunur</td>
            </tr>
            <tr>
              <th scope="row">Hareketli parça</th>
              <td>Yok</td>
              <td>Var</td>
              <td>Yok</td>
            </tr>
          </tbody>
        </table>
      </div>
    </Lesson>
  );
}
