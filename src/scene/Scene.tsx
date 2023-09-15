import {
  Physics,
  usePlane,
  useBox,
  PlaneProps,
  BoxProps,
} from "@react-three/cannon";
import { Environment, Stats } from "@react-three/drei";
import Player from "../prefabs/Player";

const Floor = (props: PlaneProps) => {
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    material: {
      friction: 0.5,
    },
    ...props,
  })) as any;
  return (
    <mesh ref={ref} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color="lightblue" metalness={0.1} roughness={0.5} />
    </mesh>
  );
};

const Cube = (props: BoxProps) => {
  const [ref] = useBox(() => ({ mass: 1, ...props })) as any;
  return (
    <mesh ref={ref} castShadow receiveShadow>
      <boxGeometry />
      <meshStandardMaterial color="red"></meshStandardMaterial>
    </mesh>
  );
};

const Scene = () => {
  return (
    <>
      <Environment preset="city" background />
      <Stats />
      <Physics>
        <Player />
        <Floor />
        <Cube position={[0, 3, -10]} />
      </Physics>
    </>
  );
};

export default Scene;
