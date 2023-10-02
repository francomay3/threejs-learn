import { Physics } from "@react-three/cannon";
import { Environment } from "@react-three/drei";
import Player from "../prefabs/Player";
import Cube from "../prefabs/Cube";
import Floor from "../prefabs/Floor";

const Scene = () => {
  return (
    <Physics>
      <Environment preset="city" background />
      <Player position={[0, 2, 0]} />
      <Floor />
      <Cube
        position={[0, 3, -10]}
        mass={200}
        args={[1, 2, 1]}
        material={{ friction: 0.01 }}
      />
    </Physics>
  );
};

export default Scene;
