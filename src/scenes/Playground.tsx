import { Physics } from "@react-three/cannon";
import { Environment } from "@react-three/drei";
import Player from "../prefabs/Player";
import Cube from "../prefabs/Cube";
import Floor from "../prefabs/Floor";

const Scene = () => {
  return (
    <Physics>
      <Environment preset="city" background />
      <Player />
      <Floor />
      <Cube position={[0, 3, -10]} mass={2} />
    </Physics>
  );
};

export default Scene;
