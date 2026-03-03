import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

export default function ParticleBackground({ theme }) {
  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  const particleColor = theme === "neon" ? "#a855f7" : "#22d3ee";

  return (
    <Particles
      className="fixed inset-0 -z-10"
      init={particlesInit}
      options={{
        background: { color: "transparent" },
        fpsLimit: 60,
        particles: {
          number: { value: 60 },
          color: { value: particleColor },
          links: {
            enable: true,
            color: particleColor,
            opacity: 0.3,
          },
          move: { enable: true, speed: 1 },
          size: { value: 3 },
        },
      }}
    />
  );
}