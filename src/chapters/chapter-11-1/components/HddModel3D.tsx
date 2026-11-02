import { Component, useEffect, useRef, type ReactNode } from "react";
import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Group, MathUtils } from "three";
import type { HddPartId } from "../parts";

interface Props {
  selected: HddPartId;
  exploded: boolean;
  enabled: boolean;
  onSelect: (id: HddPartId) => void;
}
function Part({
  id,
  selected,
  onSelect,
  position,
  enabled,
  children,
}: {
  id: HddPartId;
  selected: HddPartId;
  onSelect: Props["onSelect"];
  position: [number, number, number];
  enabled: boolean;
  children: ReactNode;
}) {
  const group = useRef<Group>(null);
  const initialPosition = useRef(position);
  useEffect(() => {
    if (!enabled) group.current?.position.set(...position);
  }, [enabled, ...position]);
  useFrame((_, delta) => {
    if (group.current) {
      const a = 1 - Math.exp(-delta * 10);
      group.current.position.x = MathUtils.lerp(
        group.current.position.x,
        position[0],
        a,
      );
      group.current.position.y = MathUtils.lerp(
        group.current.position.y,
        position[1],
        a,
      );
      group.current.position.z = MathUtils.lerp(
        group.current.position.z,
        position[2],
        a,
      );
    }
  });
  return (
    <group
      ref={group}
      position={initialPosition.current}
      onClick={(e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation();
        onSelect(id);
      }}
      scale={selected === id ? 1.015 : 1}
    >
      {children}
    </group>
  );
}
function Drive({ selected, exploded, enabled, onSelect }: Props) {
  const platter = useRef<Group>(null);
  const tracks = useRef<Group>(null);
  const arm = useRef<Group>(null);
  const time = useRef(0);
  const e = exploded ? 1 : 0;
  useFrame((_, delta) => {
    if (!enabled) return;
    time.current += Math.min(delta, 0.05);
    if (platter.current) platter.current.rotation.y += delta * 0.85;
    if (tracks.current) tracks.current.rotation.y += delta * 0.85;
    if (arm.current)
      arm.current.rotation.y = Math.sin(time.current * 0.8) * 0.16;
  });
  const color = (id: HddPartId, base: string) =>
    selected === id ? "#2247eb" : base;
  const common = { selected, onSelect, enabled };
  return (
    <group rotation={[0, -0.12, 0]}>
      <Part id="housing" {...common} position={[0, -0.32, 0]}>
        <mesh>
          <boxGeometry args={[7, 0.38, 5.2]} />
          <meshStandardMaterial
            color={color("housing", "#66717f")}
            metalness={0.7}
            roughness={0.34}
          />
        </mesh>
        {[-3.3, 3.3].flatMap((x) =>
          [-2.35, 2.35].map((z) => (
            <mesh key={`${x}:${z}`} position={[x, 0.21, z]}>
              <cylinderGeometry args={[0.08, 0.08, 0.07, 16]} />
              <meshStandardMaterial color="#111827" />
            </mesh>
          )),
        )}
      </Part>
      <Part id="pcb" {...common} position={[0, -0.65 - e * 0.9, 0]}>
        <mesh>
          <boxGeometry args={[6.3, 0.12, 4.5]} />
          <meshStandardMaterial
            color={color("pcb", "#17765e")}
            roughness={0.65}
          />
        </mesh>
        {[-1.6, 0.1, 1.7].map((x, i) => (
          <mesh key={x} position={[x, -0.13, 0]}>
            <boxGeometry args={[0.8, 0.17, 0.8 + i * 0.2]} />
            <meshStandardMaterial color="#171d28" />
          </mesh>
        ))}
      </Part>
      <Part id="platters" {...common} position={[-0.8, 0.05 + e * 0.35, 0]}>
        <group ref={platter}>
          {[0, 0.28 + e * 0.48].map((y, i) => (
            <group key={y} position={[0, y, 0]}>
              <mesh>
                <cylinderGeometry args={[2.06, 2.06, 0.07, 96]} />
                <meshStandardMaterial
                  color={color("platters", "#d6dee9")}
                  metalness={0.86}
                  roughness={0.24}
                />
              </mesh>
              <mesh position={[0, 0.042, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.42, 2.0, 96]} />
                <meshStandardMaterial
                  color={i ? "#cfd7e7" : "#c3d1e3"}
                  metalness={0.74}
                  roughness={0.4}
                />
              </mesh>
              <mesh position={[1.45, 0.05, 0]}>
                <boxGeometry args={[0.08, 0.015, 0.08]} />
                <meshStandardMaterial color="#2247eb" />
              </mesh>
            </group>
          ))}
        </group>
      </Part>
      <Part id="tracks" {...common} position={[-0.8, 0.445 + e * 0.84, 0]}>
        <group ref={tracks}>
          {[0.65, 0.9, 1.15, 1.4, 1.65, 1.9].map((r) => (
            <mesh key={r} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[r - 0.012, r + 0.012, 96]} />
              <meshBasicMaterial
                color={selected === "tracks" ? "#2247eb" : "#8d9cb6"}
                transparent
                opacity={selected === "tracks" ? 1 : 0.55}
              />
            </mesh>
          ))}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.45, 1.98, 40, 1, 0, 0.48]} />
            <meshBasicMaterial
              color="#f05b28"
              transparent
              opacity={selected === "tracks" ? 0.9 : 0.45}
              side={2}
            />
          </mesh>
        </group>
      </Part>
      <Part id="spindle" {...common} position={[-0.8, 0.15 + e * 0.5, 0]}>
        <mesh>
          <cylinderGeometry args={[0.35, 0.38, 1.05, 40]} />
          <meshStandardMaterial
            color={color("spindle", "#273247")}
            metalness={0.8}
            roughness={0.25}
          />
        </mesh>
        <mesh position={[0, 0.55, 0]}>
          <cylinderGeometry args={[0.23, 0.23, 0.05, 32]} />
          <meshStandardMaterial color="#f8fafc" metalness={0.7} />
        </mesh>
      </Part>
      <Part id="actuator" {...common} position={[2.35, 0.56 + e * 1.1, 1.05]}>
        <group ref={arm}>
          <mesh>
            <cylinderGeometry args={[0.3, 0.3, 0.35, 32]} />
            <meshStandardMaterial
              color={color("actuator", "#7b8ca2")}
              metalness={0.8}
            />
          </mesh>
          {[0, -0.22].map((y) => (
            <group key={y} position={[-1.3, y, -0.38]} rotation={[0, -0.28, 0]}>
              <mesh>
                <boxGeometry args={[2.7, 0.08, 0.22]} />
                <meshStandardMaterial
                  color={color("actuator", "#e4e8f0")}
                  metalness={0.7}
                  roughness={0.3}
                />
              </mesh>
              <mesh
                position={[-1.28, 0.0, 0]}
                onClick={(ev) => {
                  ev.stopPropagation();
                  onSelect("heads");
                }}
              >
                <boxGeometry args={[0.25, 0.09, 0.25]} />
                <meshStandardMaterial color={color("heads", "#f05b28")} />
              </mesh>
            </group>
          ))}
        </group>
      </Part>
      <Part id="coil" {...common} position={[2.45, 0.24 + e * 0.65, -1.35]}>
        <mesh>
          <boxGeometry args={[1.5, 0.17, 1.2]} />
          <meshStandardMaterial
            color={color("coil", "#242f42")}
            metalness={0.5}
          />
        </mesh>
        <mesh position={[0, 0.16, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.43, 0.07, 12, 40]} />
          <meshStandardMaterial
            color={color("coil", "#b87530")}
            metalness={0.7}
          />
        </mesh>
      </Part>
      <Part id="connector" {...common} position={[2.0, -0.28, 2.65]}>
        {[-0.55, 0.65].map((x, i) => (
          <mesh key={x} position={[x, 0, 0]}>
            <boxGeometry args={[i ? 1.15 : 0.75, 0.25, 0.32]} />
            <meshStandardMaterial color={color("connector", "#111827")} />
          </mesh>
        ))}
        {Array.from({ length: 14 }, (_, i) => (
          <mesh key={i} position={[-0.87 + i * 0.13, 0.14, 0.03]}>
            <boxGeometry args={[0.055, 0.025, 0.2]} />
            <meshStandardMaterial color="#c69531" metalness={0.8} />
          </mesh>
        ))}
      </Part>
      {(exploded || selected === "housing") && (
        <Part id="housing" {...common} position={[0, 1.8 + e * 1.5, 0]}>
          <mesh>
            <boxGeometry args={[7, 0.08, 5.2]} />
            <meshStandardMaterial
              color={color("housing", "#b6c2d5")}
              transparent
              opacity={selected === "housing" ? 0.65 : 0.22}
              metalness={0.5}
              roughness={0.3}
              depthWrite={false}
            />
          </mesh>
        </Part>
      )}
    </group>
  );
}
class GraphicsBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
export default function HddModel3D(props: Props) {
  const fallback = (
    <img
      src="/media/hdd-open.jpg"
      className="h-full max-w-full object-contain mix-blend-multiply"
      alt="3D kullanılamıyor; gerçek HDD fotoğrafı"
    />
  );
  return (
    <GraphicsBoundary fallback={fallback}>
      <Canvas
        camera={{ position: [8, 9, 10], fov: 38 }}
        dpr={[1, 1.5]}
        frameloop={props.enabled ? "always" : "demand"}
        fallback={fallback}
        gl={{ antialias: true, alpha: true }}
        style={{ touchAction: "none" }}
        aria-label="HDD’nin seçilebilir parçalarını içeren üç boyutlu model"
      >
        <ambientLight intensity={1.6} />
        <directionalLight position={[5, 10, 6]} intensity={3} />
        <directionalLight position={[-5, 3, -5]} intensity={1.8} />
        <Drive {...props} />
        <OrbitControls
          makeDefault
          target={[0, 0.3, 0]}
          enablePan={false}
          enableDamping={props.enabled}
          minDistance={7}
          maxDistance={20}
          minPolarAngle={0.15}
          maxPolarAngle={2.6}
        />
      </Canvas>
    </GraphicsBoundary>
  );
}
