import { useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { useTransform, useScroll, useTime } from 'framer-motion';
import { degreesToRadians } from 'popmotion';
import * as THREE from 'three';

// --- CONFIGURATION ---
const MAIN_COLOR = "#00f3ff"; // Cyan (Inner Core)
const CAGE_COLOR = "#ff00aa"; // Magenta (Outer Cage)

// 1. THE CENTRAL WIREFRAME SHAPE (Original)
const FluxCore = () => (
  <mesh rotation-x={0.35}>
    {/* Icosahedron: 20 faces */}
    <icosahedronGeometry args={[1.5, 1]} />
    <meshBasicMaterial 
      wireframe 
      color={MAIN_COLOR} 
      transparent 
      opacity={0.3} // Slightly more opaque than background
    />
  </mesh>
);

// 2. NEW: SUBTLE OUTER BACKGROUND CAGE (Replaces Stars)
const OuterCage = () => {
  const ref = useRef<THREE.Mesh>(null!);

  // Give it a very slow, independent rotation for life
  useFrame((_state, delta) => {
    ref.current.rotation.y += delta * 0.02;
    ref.current.rotation.z -= delta * 0.01;
  });

  return (
    <mesh ref={ref} scale={4}> {/* Scale 4x larger than the core */}
      {/* Dodecahedron: 12 faces (different geometry adds visual interest) */}
      <dodecahedronGeometry args={[1, 1]} /> 
      <meshBasicMaterial 
        wireframe 
        color={CAGE_COLOR} 
        transparent 
        opacity={0.08} // Very subtle opacity so it doesn't distract
      />
    </mesh>
  );
};

// 3. MAIN SCENE CONTROLLER (Camera movement stays the same)
export default function FluxScene() {
  const { camera } = useThree();
  const { scrollYProgress } = useScroll();
  const time = useTime();

  // Camera orbit logic (unchanged)
  const yAngle = useTransform(
    scrollYProgress,
    [0, 1],
    [degreesToRadians(80), degreesToRadians(180)]
  );
  const distance = useTransform(scrollYProgress, [0, 1], [10, 4]);

  useFrame(() => {
    const t = time.get() * 0.0002;
    camera.position.setFromSphericalCoords(
      distance.get(),
      yAngle.get(),
      t
    );
    camera.updateProjectionMatrix();
    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <FluxCore />
      <OuterCage /> {/* Replaced {particles} with this */}
    </>
  );
}