"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  PerspectiveCamera,
  Sparkles,
  useTexture,
  MeshReflectorMaterial
} from "@react-three/drei";
import * as THREE from "three";

/* ── Realistic leather-bound album book ── */
function AlbumBook() {
  const coverRef    = useRef<THREE.Group>(null);
  const pageOneRef  = useRef<THREE.Mesh>(null);
  const pageTwoRef  = useRef<THREE.Mesh>(null);
  const spineRef    = useRef<THREE.Mesh>(null);
  const texture     = useTexture("/media/wedding-hero.png");
  const openAngle   = useRef(0);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;

    // Slow gentle book-open oscillation
    const targetOpen = 0.72 + Math.sin(t * 0.38) * 0.08;
    openAngle.current += (targetOpen - openAngle.current) * 0.012;

    if (coverRef.current) {
      coverRef.current.rotation.y = -openAngle.current;
      coverRef.current.position.x = -2.28 + Math.sin(t * 0.25) * 0.05;
    }
    if (pageOneRef.current) {
      pageOneRef.current.rotation.y = -openAngle.current * 0.44;
    }
    if (pageTwoRef.current) {
      pageTwoRef.current.rotation.y = -openAngle.current * 0.14;
    }
    if (spineRef.current) {
      const mat = spineRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.08 + Math.sin(t * 0.6) * 0.04;
    }
  });

  return (
    <group rotation={[-0.18, -0.15, 0.02]} position={[0, -0.5, 0]}>
      {/* Base / back cover */}
      <mesh receiveShadow castShadow>
        <boxGeometry args={[4.8, 0.18, 3.2]} />
        <meshStandardMaterial
          color="#21101d"
          roughness={0.38}
          metalness={0.14}
        />
      </mesh>

      {/* Spine */}
      <mesh ref={spineRef} position={[-0.18, 0.1, 0]}>
        <boxGeometry args={[0.26, 0.12, 3.18]} />
        <meshStandardMaterial
          color="#4b213c"
          roughness={0.25}
          metalness={0.36}
          emissive="#d4a853"
          emissiveIntensity={0.08}
        />
      </mesh>

      {/* Gold foil title strip */}
      <mesh position={[0.8, 0.1, 0]}>
        <planeGeometry args={[2.6, 0.18]} />
        <meshStandardMaterial
          color="#d4a853"
          roughness={0.12}
          metalness={0.92}
          emissive="#f2d38a"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Front cover — animated open */}
      <group ref={coverRef} position={[-2.28, 0.2, 0]}>
        <mesh castShadow>
          <boxGeometry args={[2.28, 0.12, 3.16]} />
          <meshStandardMaterial
            color="#4b213c"
            roughness={0.28}
            metalness={0.22}
          />
        </mesh>
        {/* Embossed gold frame on cover */}
        <mesh position={[0, 0.065, 0]}>
          <planeGeometry args={[1.9, 2.6]} />
          <meshStandardMaterial
            color="#d4a853"
            roughness={0.14}
            metalness={0.9}
            emissive="#f2d38a"
            emissiveIntensity={0.18}
          />
        </mesh>
      </group>

      {/* Inner pages */}
      <mesh ref={pageOneRef} position={[0.05, 0.2, 0.1]}>
        <boxGeometry args={[2.1, 0.04, 2.92]} />
        <meshStandardMaterial color="#fffbf2" roughness={0.75} />
      </mesh>

      {/* Right page with photo */}
      <mesh ref={pageTwoRef} position={[1.15, 0.25, 0.15]}>
        <planeGeometry args={[1.88, 2.42]} />
        <meshStandardMaterial
          map={texture}
          side={THREE.DoubleSide}
          roughness={0.42}
        />
      </mesh>

      {/* Back page */}
      <mesh position={[1.18, 0.18, -0.04]}>
        <boxGeometry args={[2.12, 0.045, 2.88]} />
        <meshStandardMaterial color="#fffaf0" roughness={0.7} />
      </mesh>

      {/* Ground reflection plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
        <planeGeometry args={[12, 12]} />
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={512}
          mixBlur={1}
          mixStrength={0.18}
          color="#190b16"
          metalness={0.3}
          mirror={0}
        />
      </mesh>
    </group>
  );
}

/* ── Floating polaroid memories ── */
function FloatingMemory({
  position,
  scale,
  delay = 0
}: {
  position: [number, number, number];
  scale: number;
  delay?: number;
}) {
  const texture = useTexture("/media/wedding-hero.png");
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.elapsedTime + delay;
    groupRef.current.position.y = position[1] + Math.sin(t * 0.65) * 0.14;
    groupRef.current.rotation.z = Math.sin(t * 0.42) * 0.06;
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Passe-partout */}
      <mesh position={[0, 0, -0.012]}>
        <planeGeometry args={[1.52, 1.0]} />
        <meshStandardMaterial color="#fffaf0" roughness={0.55} />
      </mesh>
      {/* Photo */}
      <mesh>
        <planeGeometry args={[1.38, 0.88]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
    </group>
  );
}

/* ── Floating rose petals ── */
function Petals() {
  const positions = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        x: (Math.random() - 0.5) * 10,
        y: (Math.random() - 0.5) * 6,
        z: (Math.random() - 0.5) * 3 - 1,
        speed: 0.3 + Math.random() * 0.5,
        phase: i * 0.7
      })),
    []
  );

  const petalRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(({ clock }) => {
    if (!petalRef.current) return;
    const t = clock.elapsedTime;
    positions.forEach((p, i) => {
      dummy.position.set(
        p.x + Math.sin(t * p.speed + p.phase) * 0.4,
        p.y + Math.cos(t * p.speed * 0.7 + p.phase) * 0.3,
        p.z
      );
      dummy.rotation.z = t * p.speed + p.phase;
      dummy.scale.setScalar(0.06 + Math.sin(p.phase) * 0.02);
      dummy.updateMatrix();
      petalRef.current!.setMatrixAt(i, dummy.matrix);
    });
    petalRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={petalRef} args={[undefined, undefined, 18]}>
      <planeGeometry args={[1, 0.7]} />
      <meshStandardMaterial
        color="#f0c8cc"
        side={THREE.DoubleSide}
        transparent
        opacity={0.7}
        roughness={0.8}
      />
    </instancedMesh>
  );
}

export default function AlbumStage() {
  return (
    <Canvas
      dpr={[1, 1.8]}
      shadows="soft"
      gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping }}
      className="absolute inset-0 h-full w-full"
    >
      <PerspectiveCamera makeDefault position={[0, 2.4, 7.2]} fov={40} />

      {/* Cinematic warm lighting */}
      <ambientLight intensity={0.6} color="#ffe8c4" />
      <directionalLight
        position={[4, 6, 5]}
        intensity={3.5}
        color="#fff3d0"
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <pointLight position={[-4, 3, 2]} intensity={1.8} color="#f0c8cc" />
      <pointLight position={[ 0, 5, -2]} intensity={1.2} color="#d4a853" />
      <spotLight
        position={[0, 8, 4]}
        angle={0.25}
        penumbra={0.8}
        intensity={4}
        color="#fffaf0"
        castShadow
      />

      {/* Particles */}
      <Sparkles count={180} scale={[9, 5.5, 5]} size={2.4} speed={0.18} color="#f2d38a" opacity={0.65} />
      <Sparkles count={80}  scale={[7, 4, 3]}   size={1.4} speed={0.32} color="#f0c8cc" opacity={0.5}  />

      <AlbumBook />
      <Petals />

      <FloatingMemory position={[-3.2, 1.4, -1.0]} scale={0.78} delay={0}    />
      <FloatingMemory position={[ 3.0, 1.5, -1.3]} scale={0.68} delay={1.6}  />
      <FloatingMemory position={[ 0.6, 2.2, -2.0]} scale={0.58} delay={0.9}  />
      <FloatingMemory position={[-1.6, 2.6, -2.4]} scale={0.48} delay={2.2}  />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        minPolarAngle={1.0}
        maxPolarAngle={1.6}
        minAzimuthAngle={-0.5}
        maxAzimuthAngle={0.5}
        autoRotate
        autoRotateSpeed={0.4}
      />
    </Canvas>
  );
}
