"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, PerspectiveCamera, Sparkles, useTexture } from "@react-three/drei";
import * as THREE from "three";

/* ── Photo frame with soft passe-partout border ── */
function PhotoPlane({
  position,
  rotation,
  scale
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
}) {
  const texture = useTexture("/media/wedding-hero.png");
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.elapsedTime;
    meshRef.current.rotation.z =
      rotation[2] + Math.sin(t * 0.7 + position[0]) * 0.018;
  });

  return (
    <Float speed={1.4} rotationIntensity={0.22} floatIntensity={0.38}>
      <group position={position} rotation={rotation} scale={scale}>
        {/* Passe-partout */}
        <mesh position={[0, 0, -0.018]}>
          <planeGeometry args={[2.42, 1.56]} />
          <meshStandardMaterial
            color="#fffaf0"
            roughness={0.48}
            metalness={0.06}
          />
        </mesh>
        {/* Photo */}
        <mesh ref={meshRef}>
          <planeGeometry args={[2.16, 1.32]} />
          <meshBasicMaterial map={texture} toneMapped={false} />
        </mesh>
        {/* Glass shine */}
        <mesh position={[0, 0, 0.004]}>
          <planeGeometry args={[2.16, 1.32]} />
          <meshStandardMaterial
            color="#ffffff"
            transparent
            opacity={0.07}
            roughness={0}
            metalness={0.5}
          />
        </mesh>
      </group>
    </Float>
  );
}

/* ── Gold ribbon connecting photos ── */
function GoldRibbon() {
  const points = useMemo(
    () => [
      new THREE.Vector3(-3.4, -1.1, -0.4),
      new THREE.Vector3(-2.0,  0.8, -0.7),
      new THREE.Vector3(-0.2, -0.3, -0.2),
      new THREE.Vector3( 1.4,  1.2, -0.9),
      new THREE.Vector3( 3.2, -0.1, -0.3)
    ],
    []
  );

  const curve = useMemo(() => new THREE.CatmullRomCurve3(points), [points]);
  const ribbonRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ribbonRef.current) return;
    const mat = ribbonRef.current.material as THREE.MeshStandardMaterial;
    mat.emissiveIntensity = 0.12 + Math.sin(clock.elapsedTime * 0.8) * 0.06;
  });

  return (
    <mesh ref={ribbonRef}>
      <tubeGeometry args={[curve, 120, 0.009, 6, false]} />
      <meshStandardMaterial
        color="#f2d38a"
        emissive="#d4a853"
        emissiveIntensity={0.14}
        roughness={0.2}
        metalness={0.8}
      />
    </mesh>
  );
}

/* ── Soft ambient orb ── */
function AmbientOrb({ position, color }: { position: [number, number, number]; color: string }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime;
    ref.current.position.y = position[1] + Math.sin(t * 0.5) * 0.3;
    ref.current.position.x = position[0] + Math.cos(t * 0.35) * 0.2;
    const mat = ref.current.material as THREE.MeshBasicMaterial;
    mat.opacity = 0.08 + Math.sin(t * 0.9) * 0.04;
  });

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.9, 16, 16]} />
      <meshBasicMaterial color={color} transparent opacity={0.1} />
    </mesh>
  );
}

export default function MemoryConstellation() {
  return (
    <Canvas
      dpr={[1, 1.8]}
      gl={{ antialias: true, alpha: true }}
      className="h-full w-full"
    >
      <PerspectiveCamera makeDefault position={[0, 0.2, 6.5]} fov={40} />
      <ambientLight intensity={0.8} />
      <pointLight position={[2, 4, 5]}  intensity={4}   color="#fff0c4" />
      <pointLight position={[-4, -2, 2]} intensity={2}  color="#f0c8cc" />
      <pointLight position={[0,  3, 1]}  intensity={1.5} color="#fffaf0" />

      <Sparkles
        count={140}
        scale={[9, 5, 3.5]}
        size={2.2}
        speed={0.22}
        color="#f2d38a"
        opacity={0.72}
      />
      <Sparkles
        count={60}
        scale={[7, 3.5, 2]}
        size={1.4}
        speed={0.35}
        color="#e8a4ab"
        opacity={0.5}
      />

      <GoldRibbon />
      <AmbientOrb position={[-2.2, 0.8, -1.2]} color="#f2d38a" />
      <AmbientOrb position={[ 2.0, -0.6, -0.8]} color="#b96c74" />

      <PhotoPlane position={[-2.2, 0.9, 0]}   rotation={[0.05, 0.22, -0.10]} scale={0.80} />
      <PhotoPlane position={[ 0.3, 0.1, -0.3]} rotation={[0.02,-0.08,  0.05]} scale={1.08} />
      <PhotoPlane position={[ 2.2,-0.5, -0.1]} rotation={[-0.07,-0.2,  0.12]} scale={0.76} />
    </Canvas>
  );
}
