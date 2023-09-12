import { Physics, usePlane, useBox, useSphere } from "@react-three/cannon";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";

type Position = [number, number, number];

const Plane = () => {
  const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0] })) as any;
  return (
    <mesh ref={ref} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color="lightblue" />
    </mesh>
  );
};

function Cube({ position }: { position: Position }) {
  const [ref] = useBox(() => ({ mass: 1, position })) as any;
  return (
    <mesh ref={ref} castShadow receiveShadow>
      <boxGeometry />
      <meshStandardMaterial color="red" />
    </mesh>
  );
}

function Sphere({ position }: { position: Position }) {
  const [physicsRef] = useSphere(() => ({ mass: 1, position })) as any;
  return (
    <mesh key={10} ref={physicsRef} castShadow receiveShadow>
      <sphereGeometry args={[1, 16, 16]} />
      <meshStandardMaterial color="blue" />
    </mesh>
  );
}

const Scene = () => {
  return (
    <>
      <ambientLight />
      <directionalLight castShadow position={[10, 10, 5]} intensity={1.5} />

      <OrbitControls />
      <PerspectiveCamera makeDefault position={[5, 5, 5]} />

      <Physics>
        <Plane />
        <Sphere position={[0, 5, 0.2]} />
        <Cube position={[0, 7, 0]} />
      </Physics>
    </>
  );
};

export default Scene;
