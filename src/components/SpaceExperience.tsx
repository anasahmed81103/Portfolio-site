import { Canvas } from '@react-three/fiber';
import SpaceScene from './space/SpaceScene';

function SpaceExperience() {
  return (
    <div className="space-experience">
      <Canvas
        // Establishing shot: farther back so Earth fills ~40% of viewport height
        camera={{ position: [0, 0, 12.5], fov: 38, near: 0.1, far: 400 }}
      >
        <color attach="background" args={['#000000']} />
        <SpaceScene />
      </Canvas>
    </div>
  );
}

export default SpaceExperience;
