'use client';

import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { ModuleConfig } from "@/lib/types";

const mmToMeters = (value: number) => value / 1000;

const ModuleMesh = ({ module, index }: { module: ModuleConfig; index: number }) => {
  const width = mmToMeters(module.width);
  const height = mmToMeters(module.height);
  const depth = mmToMeters(module.depth);
  const offset = index * (width + 0.1);
  const color = module.material.materialType === "mdf" ? "#9ca3af" : "#cbd5f5";

  return (
    <mesh position={[offset, height / 2, 0]}>
      <boxGeometry args={[width, height, depth]} />
      <meshStandardMaterial color={color} metalness={0.1} roughness={0.6} />
    </mesh>
  );
};

export const RenderViewer = ({ modules }: { modules: ModuleConfig[] }) => {
  if (!modules.length) return null;

  return (
    <div className="h-96 overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60">
      <Canvas>
        <color attach="background" args={["#020617"]} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.9} />
        <PerspectiveCamera makeDefault position={[3, 2, 3]} />
        {modules.map((module, index) => (
          <ModuleMesh key={module.id} module={module} index={index} />
        ))}
        <OrbitControls enablePan={false} maxPolarAngle={Math.PI / 2.2} />
      </Canvas>
    </div>
  );
};
