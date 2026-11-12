import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import * as THREE from "three";

const PALETTE = {
  ink: "#0c0b09",
  bone: "#f2ead8",
  brass: "#c9a227",
};

const Scene: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 30;

  return (
    <>
      <color attach="background" args={[PALETTE.ink]} />
      <ambientLight intensity={0.55} />
      <directionalLight position={[3, 4, 5]} intensity={2.4} color="#fff3dc" />
      <directionalLight position={[-4, -1, 2]} intensity={0.7} color="#6f7fa8" />

      <mesh position={[0, 0, -1.8]} rotation={[0, 0, t * 0.22]}>
        <boxGeometry args={[2.6, 2.6, 0.12]} />
        <meshStandardMaterial color={PALETTE.bone} roughness={0.92} metalness={0} />
      </mesh>

      <mesh rotation={[0.5, t * 1.1, 0.18]}>
        <torusGeometry args={[0.82, 0.18, 48, 140]} />
        <meshStandardMaterial color={PALETTE.brass} roughness={0.26} metalness={0.72} />
      </mesh>

      <mesh position={[1.05, -1.05, 0.9]} rotation={[0.2, -t * 0.6, 0]}>
        <sphereGeometry args={[0.34, 64, 64]} />
        <meshStandardMaterial color={PALETTE.ink} roughness={0.38} metalness={0.35} />
      </mesh>
    </>
  );
};

export const Starter: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: PALETTE.ink }}>
    <ThreeCanvas
      width={1080}
      height={1920}
      shadows
      gl={{ antialias: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 4.6], fov: 38 }}
    >
      <Scene />
    </ThreeCanvas>
  </AbsoluteFill>
);
