import * as THREE from "three";
import { createRoot } from "react-dom/client";
import React, { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, ThreeElements, useLoader } from "@react-three/fiber";
import "./index.css";

function Box(props: ThreeElements["mesh"]) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);

  // Load texture from the public folder
  const texture = useLoader(THREE.TextureLoader, "/b.png"); // Replace with the actual path to your image

  // Update material on hover
  useEffect(() => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.MeshStandardMaterial;
      if (hovered) {
        material.map = texture;
        material.color.set("#ffffff");
      } else {
        material.map = null;
        material.color.set("#2f74c0"); // Set fallback color
      }
      material.needsUpdate = true; // Notify Three.js to re-render material
    }
  }, [hovered, texture]);

  // Animate rotation
  useFrame((state, delta) => (meshRef.current.rotation.x += delta));

  return (
    <mesh
      {...props}
      ref={meshRef}
      scale={active ? 1.5 : 1}
      onClick={() => setActive(!active)}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      {/* Apply the texture only when hovered */}
      <meshStandardMaterial
        map={hovered ? texture : null}
        color={hovered ? undefined : "#2f74c0"}
      />
    </mesh>
  );
}

createRoot(document.getElementById("root")!).render(
  <Canvas>
    <ambientLight intensity={Math.PI / 2} />
    <spotLight
      position={[10, 10, 10]}
      angle={0.15}
      penumbra={1}
      decay={0}
      intensity={Math.PI}
    />
    <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
    <Box position={[-1.2, 0, 0]} />
    <Box position={[1.2, 0, 0]} />
  </Canvas>
);
