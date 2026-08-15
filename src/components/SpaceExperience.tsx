import { Canvas } from '@react-three/fiber';
import SpaceScene from './space/SpaceScene';

function SpaceExperience() {
  return (
    <div className="space-experience">
      <Canvas
        // Centered framing: future Earth sits as the hero in the middle of the frame
        camera={{ position: [0, 0, 6], fov: 38, near: 0.1, far: 400 }}
      >
        <color attach="background" args={['#000000']} />
        <SpaceScene />
      </Canvas>
    </div>
  );
}

export default SpaceExperience;
