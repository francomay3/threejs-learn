import { Physics } from "@react-three/cannon";
import { Environment, Sky } from "@react-three/drei";
import Player from "../prefabs/Player";
import Cube from "../prefabs/Cube";
import Floor from "../prefabs/Floor";

const Scene = () => {
  return (
    <Physics>
      <Environment background={false} preset="forest" />
      <Sky inclination={1} azimuth={0.5} />
      <spotLight position={[10, 15, 10]} angle={0.3} />
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
